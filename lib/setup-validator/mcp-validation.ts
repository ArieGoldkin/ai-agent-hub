/**
 * MCP Configuration Validation
 * 
 * Validates MCP server configuration and expected servers
 */

import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { ValidationResult } from "./types.js";

/**
 * Validate MCP server configuration
 */
export async function validateMCPConfiguration(): Promise<ValidationResult> {
  const mcpPath = ".mcp.json";
  
  if (!existsSync(mcpPath)) {
    return {
      component: "MCP Configuration",
      status: 'error',
      message: "MCP configuration file missing",
      details: ["Run: ai-agent-hub --both to create .mcp.json"]
    };
  }
  
  try {
    const mcpContent = await readFile(mcpPath, 'utf-8');
    const mcpConfig = JSON.parse(mcpContent);
    
    if (!mcpConfig.mcpServers) {
      return {
        component: "MCP Configuration",
        status: 'error',
        message: "Invalid MCP configuration format"
      };
    }
    
    const serverCount = Object.keys(mcpConfig.mcpServers).length;
    const expectedServers = ['memory', 'sequential-thinking', 'context7', 'playwright', 'supabase'];
    const hasRequiredServers = expectedServers.every(server => 
      mcpConfig.mcpServers.hasOwnProperty(server)
    );
    
    if (hasRequiredServers) {
      return {
        component: "MCP Configuration",
        status: 'success',
        message: `${serverCount} MCP servers configured`,
        details: [`Servers: ${Object.keys(mcpConfig.mcpServers).join(', ')}`]
      };
    } else {
      const missing = expectedServers.filter(server => !mcpConfig.mcpServers.hasOwnProperty(server));
      return {
        component: "MCP Configuration",
        status: 'warning',
        message: "Some expected servers missing",
        details: [`Missing: ${missing.join(', ')}`]
      };
    }
  } catch (error) {
    return {
      component: "MCP Configuration",
      status: 'error',
      message: "Invalid JSON in .mcp.json",
      details: [error instanceof Error ? error.message : 'Unknown parsing error']
    };
  }
}

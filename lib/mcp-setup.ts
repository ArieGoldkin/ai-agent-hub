/**
 * Simplified MCP Setup
 * 
 * Sets up basic MCP servers for Claude Code
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { safeHandleEnvFile } from "./env-handler.js";
import { saveConfig } from "./file-ops.js";

/**
 * Setup project MCP servers
 */
export async function setupProjectMCP(__dirname?: string): Promise<void> {
  console.log("⚙️  Configuring MCP servers...");
  
  // Basic MCP configuration for Claude Code
  const mcpConfig = {
    mcpServers: {
      memory: {
        command: "npx",
        args: ["@modelcontextprotocol/server-memory"]
      },
      "sequential-thinking": {
        command: "npx",
        args: ["@modelcontextprotocol/server-sequential-thinking"]
      },
      context7: {
        command: "npx",
        args: ["@context-labs/context7"]
      },
      playwright: {
        command: "npx",
        args: ["@modelcontextprotocol/server-playwright"]
      }
    }
  };
  
  await saveConfig(".mcp.json", mcpConfig);
  console.log("✅ Configured MCP servers in .mcp.json");
  
  // Handle .env file creation/update
  console.log();
  console.log("🔐 Checking environment configuration...");
  
  // If __dirname not provided, try to determine it
  if (!__dirname) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      __dirname = dirname(__filename);
    } catch {
      __dirname = process.cwd();
    }
  }
  
  await safeHandleEnvFile(__dirname);
}
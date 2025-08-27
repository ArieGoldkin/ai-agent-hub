/**
 * Add server command - Adds a specific MCP server
 */

import { existsSync } from "fs";
import { join } from "path";
import { createServerConfig } from "../../lib/server-config.js";
import { addToClaudeDesktop, createMCPJson } from "../../lib/claude-ops.js";
import { safeHandleEnvFile } from "../../lib/env-handler.js";
import { MCP_TEMPLATES } from "../../lib/mcp-templates.js";
import { isInProject, hasClaudeDesktop } from "../utils/detectors.js";

export async function addServer(
  serverName: string, 
  __dirname: string
): Promise<void> {
  const template = MCP_TEMPLATES[serverName];
  if (!template) {
    console.error(`❌ Unknown server: ${serverName}`);
    console.log("   Run 'ai-agent-hub --help' to see available servers");
    return;
  }

  console.log(`➕ Adding ${serverName}...`);
  
  const config = createServerConfig(template);
  const servers = { [serverName]: config };
  
  // Add to appropriate targets
  const inProject = isInProject();
  const hasDesktop = hasClaudeDesktop();
  
  if (inProject) {
    await createMCPJson(servers);
    console.log(`✅ Added ${serverName} to .mcp.json`);
    
    // Check if server needs environment variables
    if (template.env) {
      console.log("\n🔐 Checking environment configuration...");
      const envExamplePath = join(__dirname, "../../.env.example");
      if (existsSync(envExamplePath)) {
        await safeHandleEnvFile(envExamplePath);
      }
    }
  }
  
  if (hasDesktop) {
    await addToClaudeDesktop(servers);
    console.log(`✅ Added ${serverName} to Claude Desktop`);
  }
  
  if (!inProject && !hasDesktop) {
    console.log("⚠️  No Claude configuration found");
    console.log("   Please install Claude Desktop or run in a project directory");
  }
}
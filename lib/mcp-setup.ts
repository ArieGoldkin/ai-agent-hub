/**
 * Simplified MCP Setup
 *
 * Sets up basic MCP servers for Claude Code
 */

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { safeHandleEnvFile } from "./env-handler.js";
import { saveConfig } from "./file-ops.js";
import { getMCPConfig, getActiveMCPServers } from "./mcp-config.js";

/**
 * Project information interface
 */
export interface ProjectInfo {
  isProject: boolean;
  hasPackageJson: boolean;
  hasGitRepo: boolean;
}

/**
 * Detect project information
 */
export function detectProjectInfo(): ProjectInfo {
  const cwd = process.cwd();
  return {
    isProject:
      existsSync(join(cwd, "package.json")) || existsSync(join(cwd, ".git")),
    hasPackageJson: existsSync(join(cwd, "package.json")),
    hasGitRepo: existsSync(join(cwd, ".git"))
  };
}

/**
 * Setup project MCP servers
 */
export async function setupProjectMCP(__dirname?: string): Promise<void> {
  console.log("⚙️  Configuring MCP servers...");

  // Get MCP configuration from centralized module
  const mcpConfig = getMCPConfig();

  await saveConfig(".mcp.json", mcpConfig);

  // Log active servers
  const activeServers = getActiveMCPServers();
  console.log("✅ Configured MCP servers in .mcp.json:");
  activeServers.forEach(server => {
    if (server.requiresEnv) {
      console.log(`   - ${server.name} (activated via ${server.requiresEnv})`);
    } else if (server.name === 'browsermcp') {
      console.log(`   - ${server.name} (requires extension: https://docs.browsermcp.io/setup-extension)`);
    } else {
      console.log(`   - ${server.name}`);
    }
  });

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

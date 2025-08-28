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

  // Basic MCP configuration for Claude Code
  const mcpConfig = {
    mcpServers: {
      memory: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"]
      },
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"]
      },
      context7: {
        command: "npx",
        args: ["-y", "@upstash/context7-mcp@latest"]
      },
      playwright: {
        command: "npx",
        args: ["-y", "@playwright/mcp@latest"]
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

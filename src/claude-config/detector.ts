/**
 * Configuration Detection and Reading Module
 * 
 * Handles detecting Claude Desktop config location and reading the config file
 */

import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";
import type { DetectedConfig, ClaudeConfig } from "./types.js";

/**
 * Detects Claude Desktop configuration file location based on OS
 * (From original claude-config.ts lines 32-62)
 */
export function detectClaudeConfig(): string {
  const platform = process.platform;
  const homeDir = os.homedir();

  switch (platform) {
    case "darwin": // macOS
      return path.join(
        homeDir,
        "Library",
        "Application Support",
        "Claude",
        "claude_desktop_config.json"
      );

    case "win32": {
      // Windows
      const appData =
        process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
      return path.join(appData, "Claude", "claude_desktop_config.json");
    }

    case "linux": // Linux
    default:
      return path.join(
        homeDir,
        ".config",
        "Claude",
        "claude_desktop_config.json"
      );
  }
}

/**
 * Reads and parses existing Claude configuration
 * (From original claude-config.ts lines 67-89)
 */
export async function readClaudeConfig(
  configPath?: string
): Promise<DetectedConfig> {
  const filePath = configPath || detectClaudeConfig();

  try {
    await fs.access(filePath);
    const content = await fs.readFile(filePath, "utf-8");
    const config = JSON.parse(content) as ClaudeConfig;

    return {
      path: filePath,
      exists: true,
      config
    };
  } catch {
    // File doesn't exist or can't be read
    return {
      path: filePath,
      exists: false
    };
  }
}

/**
 * Lists currently configured MCP servers
 * (From original claude-config.ts lines 226-236)
 */
export async function listConfiguredServers(
  configPath?: string
): Promise<string[]> {
  const detected = await readClaudeConfig(configPath);

  if (!detected.exists || !detected.config?.mcpServers) {
    return [];
  }

  return Object.keys(detected.config.mcpServers);
}
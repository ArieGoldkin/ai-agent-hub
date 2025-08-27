/**
 * Path Utilities
 * 
 * Handles all path-related operations for Claude configurations.
 */

import { join } from "path";
import { homedir } from "os";

/**
 * Get Claude Desktop config path based on OS
 */
export function getClaudeDesktopConfigPath(): string {
  const platform = process.platform;
  
  if (platform === "darwin") {
    return join(homedir(), "Library/Application Support/Claude/claude_desktop_config.json");
  } else if (platform === "win32") {
    return join(process.env.APPDATA || homedir(), "Claude/claude_desktop_config.json");
  } else {
    return join(homedir(), ".config/Claude/claude_desktop_config.json");
  }
}

/**
 * Get project .mcp.json path
 */
export function getMCPConfigPath(): string {
  return join(process.cwd(), ".mcp.json");
}

/**
 * Get .env path in current directory
 */
export function getEnvPath(): string {
  return join(process.cwd(), ".env");
}

/**
 * Get settings path for Claude
 */
export function getClaudeSettingsPath(): string {
  return join(process.cwd(), ".claude/settings.local.json");
}
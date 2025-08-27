/**
 * Path Utilities
 * 
 * Handles all path-related operations for Claude configurations.
 */

import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync } from "fs";

/**
 * Get Claude Desktop config path based on OS
 */
export function getClaudeDesktopConfigPath(): string {
  const platform = process.platform;
  const home = homedir();
  
  switch (platform) {
    case "darwin":
      // macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
      return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    
    case "win32":
      // Windows: %APPDATA%\Claude\claude_desktop_config.json
      const appdata = process.env.APPDATA;
      if (appdata) {
        return join(appdata, "Claude", "claude_desktop_config.json");
      } else {
        // Fallback for Windows if APPDATA is not set
        return join(home, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
      }
    
    default:
      // Linux and other Unix-like systems: ~/.config/Claude/claude_desktop_config.json
      return join(home, ".config", "Claude", "claude_desktop_config.json");
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

/**
 * Get human-readable description of Claude Desktop config path
 */
export function getClaudeDesktopConfigDescription(): string {
  const platform = process.platform;
  
  switch (platform) {
    case "darwin":
      return "~/Library/Application Support/Claude/claude_desktop_config.json";
    case "win32":
      return "%APPDATA%\\Claude\\claude_desktop_config.json";
    default:
      return "~/.config/Claude/claude_desktop_config.json";
  }
}

/**
 * Check if the Claude Desktop config directory exists
 */
export function claudeDesktopConfigDirectoryExists(): boolean {
  const configPath = getClaudeDesktopConfigPath();
  const configDir = dirname(configPath);
  return existsSync(configDir);
}

/**
 * Get the Claude Desktop config directory path
 */
export function getClaudeDesktopConfigDirectory(): string {
  return dirname(getClaudeDesktopConfigPath());
}
/**
 * Platform-specific paths for Claude Desktop configuration
 * 
 * Handles cross-platform path detection for macOS, Windows, and Linux
 */

import { homedir, platform } from "os";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Get the Claude Desktop configuration directory based on OS
 */
export function getClaudeDesktopPath(): string | null {
  const os = platform();
  const home = homedir();
  
  switch (os) {
    case 'darwin': // macOS
      return join(home, 'Library', 'Application Support', 'Claude');
      
    case 'win32': // Windows
      const appData = process.env.APPDATA || join(home, 'AppData', 'Roaming');
      return join(appData, 'Claude');
      
    case 'linux':
      // Try XDG config first, then fallback to .claude
      const xdgConfig = process.env.XDG_CONFIG_HOME || join(home, '.config');
      const linuxPath = join(xdgConfig, 'claude');
      const fallbackPath = join(home, '.claude-desktop');
      
      // Return the one that exists, or the XDG path if neither exists
      if (existsSync(linuxPath)) {
        return linuxPath;
      } else if (existsSync(fallbackPath)) {
        return fallbackPath;
      }
      return linuxPath; // Default to XDG standard
      
    default:
      console.warn(`Unsupported platform: ${os}`);
      return null;
  }
}

/**
 * Get platform-specific MCP server configuration path
 */
export function getClaudeMCPConfigPath(): string | null {
  const claudePath = getClaudeDesktopPath();
  if (!claudePath) return null;
  
  // Claude Desktop uses claude_desktop_config.json for MCP servers
  return join(claudePath, 'claude_desktop_config.json');
}

/**
 * Get platform name for display
 */
export function getPlatformName(): string {
  const os = platform();
  
  switch (os) {
    case 'darwin':
      return 'macOS';
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
    default:
      return os;
  }
}

/**
 * Check if Claude Desktop is installed
 */
export function isClaudeDesktopInstalled(): boolean {
  const claudePath = getClaudeDesktopPath();
  if (!claudePath) return false;
  
  return existsSync(claudePath);
}

/**
 * Get Claude Code project configuration paths
 * These are always in the project directory regardless of OS
 */
export function getProjectPaths() {
  return {
    claudeDir: '.claude',
    agentsDir: join('.claude', 'agents'),
    sessionContext: join('.claude', 'session-context.json'),
    sessionArchive: join('.claude', 'session-archive.json'),
    sessionTemplates: join('.claude', 'session-templates'),
    settingsLocal: join('.claude', 'settings.local.json'),
    mcpConfig: '.mcp.json'
  };
}
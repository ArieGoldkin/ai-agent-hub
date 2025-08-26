/**
 * Claude Desktop Configuration Management
 *
 * Handles detection, reading, and updating of claude_desktop_config.json
 * across different operating systems with backup functionality.
 */

import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";

export interface ClaudeConfig {
  mcpServers?: Record<string, MCPServerConfig>;
  [key: string]: unknown;
}

export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface DetectedConfig {
  path: string;
  exists: boolean;
  config?: ClaudeConfig;
}

/**
 * Detects Claude Desktop configuration file location based on OS
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
 * Creates backup of existing configuration
 */
export async function backupConfig(configPath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${configPath}.backup-${timestamp}`;

  try {
    await fs.copyFile(configPath, backupPath);
    return backupPath;
  } catch (error) {
    throw new Error(
      `Failed to create backup: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Ensures the Claude config directory exists
 */
async function ensureConfigDirectory(configPath: string): Promise<void> {
  const configDir = path.dirname(configPath);

  try {
    await fs.access(configDir);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(configDir, { recursive: true });
  }
}

/**
 * Merges new MCP servers into existing Claude configuration
 */
export async function updateClaudeConfig(
  servers: Record<string, MCPServerConfig>,
  configPath?: string,
  createBackup = true
): Promise<{ path: string; backupPath?: string; updated: boolean }> {
  const filePath = configPath || detectClaudeConfig();
  const detected = await readClaudeConfig(filePath);

  // Ensure config directory exists
  await ensureConfigDirectory(filePath);

  // Create backup if file exists and backup is requested
  let backupPath: string | undefined;
  if (detected.exists && createBackup) {
    backupPath = await backupConfig(filePath);
  }

  // Prepare the configuration
  const config: ClaudeConfig = detected.config || {};
  const existingServers = config.mcpServers || {};

  // Merge servers, preserving existing ones
  const mergedServers = { ...existingServers };
  let hasUpdates = false;

  for (const [serverName, serverConfig] of Object.entries(servers)) {
    if (
      !mergedServers[serverName] ||
      JSON.stringify(mergedServers[serverName]) !== JSON.stringify(serverConfig)
    ) {
      mergedServers[serverName] = serverConfig;
      hasUpdates = true;
    }
  }

  // Update config only if there are changes
  if (hasUpdates) {
    config.mcpServers = mergedServers;

    // Write the updated configuration
    const configContent = JSON.stringify(config, null, 2);
    await fs.writeFile(filePath, configContent, "utf-8");
  }

  return {
    path: filePath,
    backupPath,
    updated: hasUpdates
  };
}

/**
 * Removes specific MCP servers from Claude configuration
 */
export async function removeServersFromConfig(
  serverNames: string[],
  configPath?: string,
  createBackup = true
): Promise<{ path: string; backupPath?: string; removed: string[] }> {
  const filePath = configPath || detectClaudeConfig();
  const detected = await readClaudeConfig(filePath);

  if (!detected.exists || !detected.config?.mcpServers) {
    return { path: filePath, removed: [] };
  }

  // Create backup if requested
  let backupPath: string | undefined;
  if (createBackup) {
    backupPath = await backupConfig(filePath);
  }

  const config = detected.config;
  const servers = { ...config.mcpServers };
  const removed: string[] = [];

  // Remove specified servers
  for (const serverName of serverNames) {
    if (servers[serverName]) {
      delete servers[serverName];
      removed.push(serverName);
    }
  }

  // Update config if any servers were removed
  if (removed.length > 0) {
    config.mcpServers = servers;
    const configContent = JSON.stringify(config, null, 2);
    await fs.writeFile(filePath, configContent, "utf-8");
  }

  return {
    path: filePath,
    backupPath,
    removed
  };
}

/**
 * Lists currently configured MCP servers
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

/**
 * Validates Claude configuration format
 */
export function validateClaudeConfig(config: unknown): config is ClaudeConfig {
  if (typeof config !== "object" || config === null) {
    return false;
  }

  const obj = config as Record<string, unknown>;

  // Check mcpServers if it exists
  if (obj.mcpServers !== undefined) {
    if (typeof obj.mcpServers !== "object" || obj.mcpServers === null) {
      return false;
    }

    const servers = obj.mcpServers as Record<string, unknown>;
    for (const [, serverConfig] of Object.entries(servers)) {
      if (typeof serverConfig !== "object" || serverConfig === null) {
        return false;
      }

      const config = serverConfig as Record<string, unknown>;
      if (typeof config.command !== "string") {
        return false;
      }

      if (config.args !== undefined && !Array.isArray(config.args)) {
        return false;
      }

      if (
        config.env !== undefined &&
        (typeof config.env !== "object" ||
          config.env === null ||
          Array.isArray(config.env))
      ) {
        return false;
      }
    }
  }

  return true;
}

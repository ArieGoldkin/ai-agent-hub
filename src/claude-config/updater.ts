/**
 * Configuration Update Module
 *
 * Handles updating and removing servers from Claude Desktop configuration
 */

import { promises as fs } from "fs";
import * as path from "path";
import { detectClaudeConfig, readClaudeConfig } from "./detector.js";
import { backupConfig } from "./utils.js";
import type { MCPServerConfig, ClaudeConfig } from "./types.js";

/**
 * Ensures the Claude config directory exists
 * (From original claude-config.ts lines 111-120)
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
 * (From original claude-config.ts lines 125-174)
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
 * (From original claude-config.ts lines 179-221)
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

/**
 * Claude Operations
 * 
 * Functions to interact with Claude Desktop and Claude Code configurations.
 */

import { MCPServerConfig } from "./server-config.js";
import { getClaudeDesktopConfigPath, getMCPConfigPath } from "./paths.js";
import { loadConfig, saveConfig } from "./file-ops.js";

/**
 * Add servers to Claude Desktop configuration
 */
export async function addToClaudeDesktop(
  servers: Record<string, MCPServerConfig>
): Promise<void> {
  const configPath = getClaudeDesktopConfigPath();
  const config = (await loadConfig(configPath)) || {};
  
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  Object.assign(config.mcpServers, servers);
  await saveConfig(configPath, config);
}

/**
 * Create .mcp.json for Claude Code
 */
export async function createMCPJson(
  servers: Record<string, MCPServerConfig>
): Promise<void> {
  const configPath = getMCPConfigPath();
  const config = {
    mcpServers: servers
  };
  await saveConfig(configPath, config);
}

/**
 * Remove server from configuration
 */
export async function removeServer(
  serverName: string,
  target: "desktop" | "code" | "both" = "both"
): Promise<void> {
  if (target === "desktop" || target === "both") {
    const desktopPath = getClaudeDesktopConfigPath();
    const desktopConfig = await loadConfig(desktopPath);
    if (desktopConfig?.mcpServers?.[serverName]) {
      delete desktopConfig.mcpServers[serverName];
      await saveConfig(desktopPath, desktopConfig);
    }
  }
  
  if (target === "code" || target === "both") {
    const codePath = getMCPConfigPath();
    const codeConfig = await loadConfig(codePath);
    if (codeConfig?.mcpServers?.[serverName]) {
      delete codeConfig.mcpServers[serverName];
      await saveConfig(codePath, codeConfig);
    }
  }
}

/**
 * List configured servers
 */
export async function listServers(): Promise<{
  desktop: string[];
  code: string[];
}> {
  const desktopPath = getClaudeDesktopConfigPath();
  const codePath = getMCPConfigPath();
  
  const desktopConfig = await loadConfig(desktopPath);
  const codeConfig = await loadConfig(codePath);
  
  return {
    desktop: desktopConfig?.mcpServers ? Object.keys(desktopConfig.mcpServers) : [],
    code: codeConfig?.mcpServers ? Object.keys(codeConfig.mcpServers) : []
  };
}
/**
 * Server Manager Module
 * 
 * Handles adding, removing, and managing servers in .mcp.json
 */

import { loadMCPConfig, saveMCPConfig } from "./config-manager.js";
import { generateServerConfig } from "../mcp-installer/index.js";
import { SERVER_REGISTRY } from "../server-registry/index.js";
import type { MCPCodeConfig } from "./types.js";

/**
 * Adds a server to the .mcp.json configuration
 * (From original claude-code-config.ts lines 123-152)
 */
export async function addServerToMCPConfig(
  serverId: string,
  environment: Record<string, string> = {},
  cwd: string = process.cwd()
): Promise<void> {
  const server = SERVER_REGISTRY[serverId];
  if (!server) {
    throw new Error(`Unknown server: ${serverId}`);
  }

  // Load existing config or create new one
  let config = await loadMCPConfig(cwd);
  if (!config) {
    config = { mcpServers: {} };
  }

  // Generate server configuration
  const serverConfig = generateServerConfig(
    server.package,
    "latest",
    environment,
    server.defaultArgs
  );

  // Add server to config
  config.mcpServers[serverId] = serverConfig;

  // Save updated config
  await saveMCPConfig(config, cwd);
}

/**
 * Removes a server from the .mcp.json configuration
 * (From original claude-code-config.ts lines 157-168)
 */
export async function removeServerFromMCPConfig(
  serverId: string,
  cwd: string = process.cwd()
): Promise<void> {
  const config = await loadMCPConfig(cwd);
  if (!config || !config.mcpServers[serverId]) {
    return; // Server not configured, nothing to do
  }

  delete config.mcpServers[serverId];
  await saveMCPConfig(config, cwd);
}

/**
 * Creates a complete .mcp.json configuration from selected servers
 * (From original claude-code-config.ts lines 245-272)
 */
export async function createMCPConfigFromServers(
  serverIds: string[],
  environment: Record<string, string> = {},
  cwd: string = process.cwd()
): Promise<void> {
  const config: MCPCodeConfig = {
    mcpServers: {}
  };

  for (const serverId of serverIds) {
    const server = SERVER_REGISTRY[serverId];
    if (!server) {
      throw new Error(`Unknown server: ${serverId}`);
    }

    // Generate server configuration
    const serverConfig = generateServerConfig(
      server.package,
      "latest",
      environment,
      server.defaultArgs
    );

    config.mcpServers[serverId] = serverConfig;
  }

  await saveMCPConfig(config, cwd);
}
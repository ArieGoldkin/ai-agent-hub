/**
 * Claude Code Configuration Management
 *
 * Handles project-level .mcp.json configuration files for Claude Code integration.
 * Unlike Claude Desktop which uses a global config, Claude Code uses project-specific
 * .mcp.json files in the current working directory.
 */

import { readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import { generateServerConfig } from "./mcp-installer.js";
import { SERVER_REGISTRY } from "./server-registry.js";

export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface MCPCodeConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export interface ProjectInfo {
  isProject: boolean;
  hasPackageJson: boolean;
  hasGitRepo: boolean;
  projectRoot: string;
}

/**
 * Detects if the current directory is a project and gathers project information
 */
export async function detectProjectInfo(
  cwd: string = process.cwd()
): Promise<ProjectInfo> {
  const info: ProjectInfo = {
    isProject: false,
    hasPackageJson: false,
    hasGitRepo: false,
    projectRoot: cwd
  };

  try {
    // Check for package.json
    await access(join(cwd, "package.json"));
    info.hasPackageJson = true;
    info.isProject = true;
  } catch {
    // package.json not found
  }

  try {
    // Check for .git directory
    await access(join(cwd, ".git"));
    info.hasGitRepo = true;
    info.isProject = true;
  } catch {
    // .git not found
  }

  return info;
}

/**
 * Gets the path to the .mcp.json file for the current project
 */
export function getMCPJsonPath(cwd: string = process.cwd()): string {
  return join(cwd, ".mcp.json");
}

/**
 * Checks if .mcp.json exists in the current project
 */
export async function hasMCPConfig(
  cwd: string = process.cwd()
): Promise<boolean> {
  try {
    await access(getMCPJsonPath(cwd));
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads the current .mcp.json configuration
 */
export async function loadMCPConfig(
  cwd: string = process.cwd()
): Promise<MCPCodeConfig | null> {
  try {
    const configPath = getMCPJsonPath(cwd);
    const content = await readFile(configPath, "utf8");
    const config = JSON.parse(content);

    // Validate basic structure
    if (typeof config === "object" && config.mcpServers) {
      return config as MCPCodeConfig;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Saves the .mcp.json configuration
 */
export async function saveMCPConfig(
  config: MCPCodeConfig,
  cwd: string = process.cwd()
): Promise<void> {
  const configPath = getMCPJsonPath(cwd);
  const content = JSON.stringify(config, null, 2);
  await writeFile(configPath, content, "utf8");
}

/**
 * Adds a server to the .mcp.json configuration
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
 * Lists configured servers in .mcp.json
 */
export async function listMCPConfiguredServers(
  cwd: string = process.cwd()
): Promise<string[]> {
  const config = await loadMCPConfig(cwd);
  if (!config) {
    return [];
  }

  return Object.keys(config.mcpServers);
}

/**
 * Validates .mcp.json configuration
 */
export async function validateMCPConfig(cwd: string = process.cwd()): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const result = {
    valid: true,
    errors: [] as string[],
    warnings: [] as string[]
  };

  try {
    const config = await loadMCPConfig(cwd);
    if (!config) {
      result.errors.push("No .mcp.json configuration found");
      result.valid = false;
      return result;
    }

    if (!config.mcpServers || typeof config.mcpServers !== "object") {
      result.errors.push("Invalid mcpServers configuration");
      result.valid = false;
      return result;
    }

    // Validate each server configuration
    for (const [serverId, serverConfig] of Object.entries(config.mcpServers)) {
      if (!serverConfig.command) {
        result.errors.push(`Server ${serverId}: missing command`);
        result.valid = false;
      }

      if (serverConfig.args && !Array.isArray(serverConfig.args)) {
        result.errors.push(
          `Server ${serverId}: args must be an array if provided`
        );
        result.valid = false;
      }

      // Check if server exists in registry
      if (!SERVER_REGISTRY[serverId]) {
        result.warnings.push(`Server ${serverId}: not found in registry`);
      }
    }

    return result;
  } catch (error) {
    result.errors.push(
      `Failed to validate config: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    result.valid = false;
    return result;
  }
}

/**
 * Creates a complete .mcp.json configuration from selected servers
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

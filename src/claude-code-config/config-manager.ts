/**
 * Configuration Manager Module
 * 
 * Handles loading, saving, and validating .mcp.json configurations
 */

import { readFile, writeFile } from "node:fs/promises";
import { getMCPJsonPath } from "./project-detector.js";
import { SERVER_REGISTRY } from "../server-registry/index.js";
import type { MCPCodeConfig, ValidationResult } from "./types.js";

/**
 * Loads the current .mcp.json configuration
 * (From original claude-code-config.ts lines 89-106)
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
 * (From original claude-code-config.ts lines 111-118)
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
 * Lists configured servers in .mcp.json
 * (From original claude-code-config.ts lines 173-182)
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
 * (From original claude-code-config.ts lines 187-240)
 */
export async function validateMCPConfig(cwd: string = process.cwd()): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
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
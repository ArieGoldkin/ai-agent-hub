/**
 * Utility Functions Module
 *
 * Backup and validation utilities for Claude Desktop configuration
 */

import { promises as fs } from "fs";
import type { ClaudeConfig } from "./types.js";

/**
 * Creates backup of existing configuration
 * (From original claude-config.ts lines 94-106)
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
 * Validates Claude configuration format
 * (From original claude-config.ts lines 241-281)
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

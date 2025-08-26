/**
 * Server Operations Module
 *
 * Handles server listing, removal, and location tracking
 */

import {
  detectClaudeConfig,
  removeServersFromConfig as removeFromDesktop
} from "../claude-config/index.js";

import { removeServerFromMCPConfig as removeFromCode } from "../claude-code-config/index.js";

import { detectConfigTargets } from "./detector.js";
import type { ServerLocation, RemovalResult, ConfigType } from "./types.js";

/**
 * Gets all configured servers with their locations
 * (From original config-manager.ts lines 156-160)
 */
export async function getAllServersWithLocations(): Promise<ServerLocation[]> {
  const state = await detectConfigTargets();
  return state.servers.all;
}

/**
 * Removes a server from specified configuration targets
 * (From original config-manager.ts lines 165-211)
 */
export async function removeServerFromConfigs(
  serverId: string,
  targets?: ConfigType[]
): Promise<RemovalResult> {
  const result: RemovalResult = {};
  const state = await detectConfigTargets();

  // If no targets specified, remove from all where it exists
  if (!targets) {
    targets = state.servers.all
      .filter(s => s.serverId === serverId)
      .map(s => s.configType);
  }

  // Remove from Desktop if requested
  if (targets.includes("desktop")) {
    try {
      const desktopPath = detectClaudeConfig();
      const removed = await removeFromDesktop([serverId], desktopPath);
      result.desktop = {
        removed: removed.removed
      };
    } catch (error) {
      result.desktop = {
        removed: [],
        errors: [error instanceof Error ? error.message : "Unknown error"]
      };
    }
  }

  // Remove from Code if requested
  if (targets.includes("code")) {
    try {
      await removeFromCode(serverId);
      result.code = {
        removed: [serverId]
      };
    } catch (error) {
      result.code = {
        removed: [],
        errors: [error instanceof Error ? error.message : "Unknown error"]
      };
    }
  }

  return result;
}

/**
 * Gets a formatted string showing where a server is configured
 * (From original config-manager.ts lines 216-229)
 */
export function getServerLocationString(
  serverId: string,
  locations: ServerLocation[]
): string {
  const serverLocations = locations
    .filter(l => l.serverId === serverId)
    .map(l => l.configType);

  if (serverLocations.length === 0) {
    return "";
  }

  return `[${serverLocations.join(", ")}]`;
}

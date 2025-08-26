/**
 * Unified Configuration Manager
 *
 * Provides a unified interface for managing both Claude Desktop (global)
 * and Claude Code (project-level) configurations.
 */

import {
  detectClaudeConfig,
  readClaudeConfig,
  listConfiguredServers as listDesktopServers,
  removeServersFromConfig as removeFromDesktop
} from "./claude-config.js";

import {
  detectProjectInfo,
  hasMCPConfig,
  loadMCPConfig,
  listMCPConfiguredServers as listCodeServers,
  removeServerFromMCPConfig as removeFromCode,
  type ProjectInfo
} from "./claude-code-config.js";

export type ConfigType = "desktop" | "code";

export interface ConfigTarget {
  type: ConfigType;
  name: string;
  path: string;
  exists: boolean;
  available: boolean;
}

export interface ServerLocation {
  serverId: string;
  configType: ConfigType;
  configPath: string;
}

export interface UnifiedConfigState {
  targets: ConfigTarget[];
  servers: {
    desktop: string[];
    code: string[];
    all: ServerLocation[];
  };
  projectInfo: ProjectInfo;
}

export interface RemovalResult {
  desktop?: {
    removed: string[];
    errors?: string[];
  };
  code?: {
    removed: string[];
    errors?: string[];
  };
}

/**
 * Detects all available configuration targets (Desktop and/or Code)
 */
export async function detectConfigTargets(): Promise<UnifiedConfigState> {
  const projectInfo = await detectProjectInfo();
  const targets: ConfigTarget[] = [];
  const servers: UnifiedConfigState["servers"] = {
    desktop: [],
    code: [],
    all: []
  };

  // Check Claude Desktop
  try {
    const desktopPath = detectClaudeConfig();
    const desktopConfig = await readClaudeConfig(desktopPath);

    targets.push({
      type: "desktop",
      name: "Claude Desktop",
      path: desktopPath,
      exists: desktopConfig.exists,
      available: true
    });

    if (desktopConfig.exists) {
      const desktopServers = await listDesktopServers(desktopPath);
      servers.desktop = desktopServers;
      desktopServers.forEach(serverId => {
        servers.all.push({
          serverId,
          configType: "desktop",
          configPath: desktopPath
        });
      });
    }
  } catch {
    // Desktop config not available
    targets.push({
      type: "desktop",
      name: "Claude Desktop",
      path: "unknown",
      exists: false,
      available: false
    });
  }

  // Check Claude Code (only if in project)
  if (projectInfo.isProject) {
    try {
      const hasCodeConfig = await hasMCPConfig();
      const codePath = `${projectInfo.projectRoot}/.mcp.json`;

      targets.push({
        type: "code",
        name: "Claude Code",
        path: codePath,
        exists: hasCodeConfig,
        available: true
      });

      if (hasCodeConfig) {
        const codeServers = await listCodeServers();
        servers.code = codeServers;
        codeServers.forEach(serverId => {
          servers.all.push({
            serverId,
            configType: "code",
            configPath: codePath
          });
        });
      }
    } catch {
      // Code config not available
      if (projectInfo.isProject) {
        targets.push({
          type: "code",
          name: "Claude Code",
          path: `${projectInfo.projectRoot}/.mcp.json`,
          exists: false,
          available: true
        });
      }
    }
  }

  return {
    targets,
    servers,
    projectInfo
  };
}

/**
 * Gets all configured servers with their locations
 */
export async function getAllServersWithLocations(): Promise<ServerLocation[]> {
  const state = await detectConfigTargets();
  return state.servers.all;
}

/**
 * Removes a server from specified configuration targets
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

/**
 * Selects default configuration targets based on context
 */
export function selectDefaultTargets(projectInfo: ProjectInfo): ConfigType[] {
  if (projectInfo.isProject) {
    // In a project, default to both Desktop and Code
    return ["desktop", "code"];
  } else {
    // Not in a project, only Desktop
    return ["desktop"];
  }
}

/**
 * Validates both configuration formats
 */
export async function validateAllConfigs(): Promise<{
  desktop?: { valid: boolean; errors?: string[] };
  code?: { valid: boolean; errors?: string[] };
}> {
  const result: {
    desktop?: { valid: boolean; errors?: string[] };
    code?: { valid: boolean; errors?: string[] };
  } = {};

  // Validate Desktop config
  try {
    const desktopPath = detectClaudeConfig();
    const desktopConfig = await readClaudeConfig(desktopPath);
    if (desktopConfig.exists && desktopConfig.config) {
      // Basic validation
      const isValid = desktopConfig.config.mcpServers !== undefined;
      result.desktop = {
        valid: isValid,
        errors: isValid ? undefined : ["Invalid mcpServers configuration"]
      };
    }
  } catch (error) {
    result.desktop = {
      valid: false,
      errors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }

  // Validate Code config if in project
  const projectInfo = await detectProjectInfo();
  if (projectInfo.isProject) {
    try {
      const hasCodeConfig = await hasMCPConfig();
      if (hasCodeConfig) {
        const codeConfig = await loadMCPConfig();
        if (codeConfig) {
          const isValid = codeConfig.mcpServers !== undefined;
          result.code = {
            valid: isValid,
            errors: isValid ? undefined : ["Invalid mcpServers configuration"]
          };
        }
      }
    } catch (error) {
      result.code = {
        valid: false,
        errors: [error instanceof Error ? error.message : "Unknown error"]
      };
    }
  }

  return result;
}

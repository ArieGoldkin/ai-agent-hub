/**
 * Configuration Detection Module
 *
 * Detects and analyzes available configuration targets (Desktop and Code)
 */

import {
  detectClaudeConfig,
  readClaudeConfig,
  listConfiguredServers as listDesktopServers
} from "../claude-config/index.js";

import {
  detectProjectInfo,
  hasMCPConfig,
  listMCPConfiguredServers as listCodeServers
} from "../claude-code-config/index.js";

import type { UnifiedConfigState, ConfigTarget, ConfigType } from "./types.js";

/**
 * Detects all available configuration targets (Desktop and/or Code)
 * (From original config-manager.ts lines 64-152)
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
 * Selects default configuration targets based on context
 * (From original config-manager.ts lines 234-242)
 */
export function selectDefaultTargets(projectInfo: {
  isProject: boolean;
}): ConfigType[] {
  if (projectInfo.isProject) {
    // In a project, default to both Desktop and Code
    return ["desktop", "code"];
  } else {
    // Not in a project, only Desktop
    return ["desktop"];
  }
}

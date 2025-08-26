/**
 * Validation Module
 * 
 * Validates both Desktop and Code configurations
 */

import {
  detectClaudeConfig,
  readClaudeConfig
} from "../claude-config/index.js";

import {
  detectProjectInfo,
  hasMCPConfig,
  loadMCPConfig
} from "../claude-code-config/index.js";

/**
 * Validates both configuration formats
 * (From original config-manager.ts lines 247-299)
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
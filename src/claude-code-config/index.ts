/**
 * Claude Code Configuration Management - Main Entry Point
 *
 * Handles project-level .mcp.json configuration files for Claude Code integration.
 * Unlike Claude Desktop which uses a global config, Claude Code uses project-specific
 * .mcp.json files in the current working directory.
 *
 * This is a refactored version of the original claude-code-config.ts,
 * split into smaller, focused modules for better maintainability.
 */

// Re-export all types
export type {
  MCPServerConfig,
  MCPCodeConfig,
  ProjectInfo,
  ValidationResult
} from "./types.js";

// Re-export project detection functions
export {
  detectProjectInfo,
  getMCPJsonPath,
  hasMCPConfig
} from "./project-detector.js";

// Re-export config management functions
export {
  loadMCPConfig,
  saveMCPConfig,
  listMCPConfiguredServers,
  validateMCPConfig
} from "./config-manager.js";

// Re-export server management functions
export {
  addServerToMCPConfig,
  removeServerFromMCPConfig,
  createMCPConfigFromServers
} from "./server-manager.js";

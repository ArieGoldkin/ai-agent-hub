/**
 * Claude Desktop Configuration Management - Main Entry Point
 *
 * Handles detection, reading, and updating of claude_desktop_config.json
 * across different operating systems with backup functionality.
 * 
 * This is a refactored version of the original claude-config.ts,
 * split into smaller, focused modules for better maintainability.
 */

// Re-export all types
export type { 
  ClaudeConfig, 
  MCPServerConfig, 
  DetectedConfig 
} from "./types.js";

// Re-export detection and reading functions
export { 
  detectClaudeConfig, 
  readClaudeConfig, 
  listConfiguredServers 
} from "./detector.js";

// Re-export update functions
export { 
  updateClaudeConfig, 
  removeServersFromConfig 
} from "./updater.js";

// Re-export utility functions
export { 
  backupConfig, 
  validateClaudeConfig 
} from "./utils.js";
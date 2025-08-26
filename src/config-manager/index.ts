/**
 * Unified Configuration Manager - Main Entry Point
 *
 * Provides a unified interface for managing both Claude Desktop (global)
 * and Claude Code (project-level) configurations.
 * 
 * This is a refactored version of the original config-manager.ts,
 * split into smaller, focused modules for better maintainability.
 */

// Re-export all types
export type {
  ConfigType,
  ConfigTarget,
  ServerLocation,
  UnifiedConfigState,
  RemovalResult
} from "./types.js";

// Re-export detection functions
export { 
  detectConfigTargets, 
  selectDefaultTargets 
} from "./detector.js";

// Re-export server operations
export {
  getAllServersWithLocations,
  removeServerFromConfigs,
  getServerLocationString
} from "./server-operations.js";

// Re-export validation functions
export { validateAllConfigs } from "./validators.js";
/**
 * MCP Server Registry - Main Entry Point
 *
 * Simplified registry of available MCP servers with metadata
 * for installation and configuration.
 */

// Re-export types
export type {
  ServerDefinition,
  ServerCategory,
  ServerCombination
} from "./types.js";

// Re-export server definitions and constants
export { SERVER_REGISTRY, DEFAULT_SERVERS } from "./definitions.js";

// Re-export categories and combinations
export { SERVER_CATEGORIES, SERVER_COMBINATIONS } from "./categories.js";

// Re-export utility functions
export {
  getServerDefinition,
  getServersByCategory,
  getAllServerNames,
  getServersRequiringEnv,
  isValidServerName,
  getServerCombination,
  getAllCombinations
} from "./utils.js";
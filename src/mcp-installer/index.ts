/**
 * MCP Server Installation and Management - Main Entry Point
 *
 * Handles NPX-based installation of MCP servers and generates
 * the appropriate configuration for Claude Desktop.
 *
 * This is a refactored version of the original mcp-installer.ts,
 * split into smaller, focused modules for better maintainability.
 */

// Re-export all types
export type { ServerInstallResult, EnvironmentConfig } from "./types.js";

// Re-export installer functions
export {
  installMCPServer,
  validateInstallation,
  batchInstallServers,
  uninstallMCPServer
} from "./installer.js";

// Re-export configuration functions
export {
  getServerCommand,
  generateServerConfig,
  configureEnvironment
} from "./config-generator.js";

// Re-export system check functions
export { checkNPXAvailable, getSystemInfo } from "./system-checker.js";

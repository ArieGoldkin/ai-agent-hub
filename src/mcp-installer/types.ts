/**
 * Type definitions for MCP Server Installation
 */

export interface ServerInstallResult {
  success: boolean;
  packageName: string;
  command: string;
  error?: string;
  version?: string;
}

export interface EnvironmentConfig {
  required: string[];
  optional: string[];
  defaults: Record<string, string>;
}
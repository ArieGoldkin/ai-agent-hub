/**
 * Type definitions for Claude Desktop Configuration
 */

export interface ClaudeConfig {
  mcpServers?: Record<string, MCPServerConfig>;
  [key: string]: unknown;
}

export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface DetectedConfig {
  path: string;
  exists: boolean;
  config?: ClaudeConfig;
}
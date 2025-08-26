/**
 * Type definitions for Claude Code Configuration
 */

export interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface MCPCodeConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export interface ProjectInfo {
  isProject: boolean;
  hasPackageJson: boolean;
  hasGitRepo: boolean;
  projectRoot: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

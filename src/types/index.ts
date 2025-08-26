/**
 * Core type definitions for AI Agent Hub NPX Installer
 */

// MCP Server types
export interface MCPServer {
  id: string;
  name: string;
  package: string;
  description: string;
  requiredEnv?: string[];
  optionalEnv?: string[];
  capabilities?: string[];
}

// Agent template types
export interface AgentTemplate {
  name: string;
  description: string;
  prompt: string;
  recommendedServers: string[];
  capabilities: string[];
  tools?: string[];
}

// Re-export Claude config types from claude-config module
export { ClaudeConfig, MCPServerConfig } from "../claude-config/index.js";

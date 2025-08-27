/**
 * Server Configuration
 * 
 * Functions to create and manage MCP server configurations.
 */

import { 
  MCP_TEMPLATES, 
  DEFAULT_SERVERS,
  CLAUDE_CODE_DEFAULTS,
  CLAUDE_DESKTOP_DEFAULTS,
  MCPTemplate 
} from "./mcp-templates.js";

/**
 * MCP Server Configuration structure
 */
export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/**
 * Create MCP server configuration from template
 */
export function createServerConfig(
  template: MCPTemplate
): MCPServerConfig {
  // Determine command (uvx for Python packages, npx for Node)
  const command = template.package.includes("mcp-server-git") ? "uvx" : "npx";
  
  // Build args array
  let args: string[];
  if (command === "uvx") {
    args = [template.package];
  } else {
    args = ["-y", template.package];
  }
  
  // Add additional args if provided
  if (template.args && template.args.length > 0) {
    args.push(...template.args);
  }
  
  const config: MCPServerConfig = {
    command,
    args
  };
  
  if (template.env && Object.keys(template.env).length > 0) {
    config.env = template.env;
  }
  
  return config;
}

/**
 * Get default server configurations (legacy - uses Desktop defaults)
 */
export function getDefaultServers(): Record<string, MCPServerConfig> {
  return getDefaultServersForContext(false); // Default to Desktop for backward compatibility
}

/**
 * Get context-aware default server configurations
 */
export function getDefaultServersForContext(isClaudeCode: boolean): Record<string, MCPServerConfig> {
  const servers: Record<string, MCPServerConfig> = {};
  const serverList = isClaudeCode ? CLAUDE_CODE_DEFAULTS : CLAUDE_DESKTOP_DEFAULTS;
  
  for (const serverName of serverList) {
    const template = MCP_TEMPLATES[serverName];
    if (template) {
      servers[serverName] = createServerConfig(template);
    }
  }
  
  return servers;
}

/**
 * Get server configuration by name
 */
export function getServerByName(name: string): MCPServerConfig | null {
  const template = MCP_TEMPLATES[name];
  if (!template) {
    return null;
  }
  return createServerConfig(template);
}
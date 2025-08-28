/**
 * MCP Configuration Module
 *
 * Centralized configuration for all MCP (Model Context Protocol) servers.
 * This module provides both base servers (always included) and conditional
 * servers (activated based on environment variables).
 */

/**
 * MCP server configuration interface
 */
export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/**
 * Complete MCP configuration interface
 */
export interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

/**
 * Get base MCP servers that are always included
 */
export function getBaseMCPServers(): Record<string, MCPServerConfig> {
  return {
    memory: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    context7: {
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"]
    },
    playwright: {
      command: "npx",
      args: ["-y", "@playwright/mcp@latest"]
    }
  };
}

/**
 * Get conditional MCP servers based on environment variables
 */
function getConditionalMCPServers(): Record<string, MCPServerConfig> {
  const servers: Record<string, MCPServerConfig> = {};

  // GitHub MCP - activates when GITHUB_TOKEN is set
  if (process.env.GITHUB_TOKEN) {
    servers.github = {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN
      }
    };
  }

  // Supabase MCP - activates when SUPABASE_ACCESS_TOKEN is set
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    servers.supabase = {
      command: "npx",
      args: [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        `--project-ref=${process.env.YOUR_PROJECT_REF_HERE}`
      ],
      env: {
        SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN
      }
    };
  }

  // Postgres MCP - activates when POSTGRES_CONNECTION_STRING is set
  if (process.env.POSTGRES_CONNECTION_STRING) {
    servers.postgres = {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-postgres"],
      env: {
        POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING
      }
    };
  }

  return servers;
}

/**
 * Get desktop-specific MCP servers
 * These are additional servers that are only added to Claude Desktop configuration
 */
export function getDesktopMCPServers(): Record<string, MCPServerConfig> {
  return {
    filesystem: {
      command: "npx",
      args: ["@modelcontextprotocol/server-filesystem", "--read-only"]
    },
    // GitHub is always included for desktop
    github: {
      command: "npx",
      args: ["@modelcontextprotocol/server-github"]
    }
  };
}

/**
 * Get the complete MCP configuration
 * Combines base servers with conditional servers based on environment
 */
export function getMCPConfig(): MCPConfig {
  const baseServers = getBaseMCPServers();
  const conditionalServers = getConditionalMCPServers();

  return {
    mcpServers: {
      ...baseServers,
      ...conditionalServers
    }
  };
}

/**
 * Get a list of active MCP servers
 * Useful for logging and documentation
 */
export function getActiveMCPServers(): {
  name: string;
  requiresEnv?: string;
}[] {
  const servers: { name: string; requiresEnv?: string }[] = [];

  // Add base servers
  const baseServers = getBaseMCPServers();
  for (const name of Object.keys(baseServers)) {
    servers.push({ name });
  }

  // Add conditional servers with their requirements
  if (process.env.GITHUB_TOKEN) {
    servers.push({ name: "github", requiresEnv: "GITHUB_TOKEN" });
  }
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    servers.push({ name: "supabase", requiresEnv: "SUPABASE_ACCESS_TOKEN" });
  }
  if (process.env.POSTGRES_CONNECTION_STRING) {
    servers.push({
      name: "postgres",
      requiresEnv: "POSTGRES_CONNECTION_STRING"
    });
  }

  return servers;
}

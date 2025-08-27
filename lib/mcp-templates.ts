/**
 * MCP Server Templates
 * 
 * Single source of truth for all MCP server definitions.
 * To add a new server, simply add it to MCP_TEMPLATES.
 */

export interface MCPTemplate {
  package: string;
  args?: string[];
  env?: Record<string, string>;
}

/**
 * All available MCP server templates
 */
export const MCP_TEMPLATES: Record<string, MCPTemplate> = {
  // Core servers
  memory: {
    package: "@modelcontextprotocol/server-memory"
  },
  "sequential-thinking": {
    package: "@modelcontextprotocol/server-sequential-thinking"
  },
  filesystem: {
    package: "@modelcontextprotocol/server-filesystem"
  },
  
  // Integration servers
  github: {
    package: "@modelcontextprotocol/server-github",
    env: { GITHUB_TOKEN: "${GITHUB_TOKEN}" }
  },
  context7: {
    package: "@upstash/context7-mcp@latest"
  },
  playwright: {
    package: "@playwright/mcp@latest"
  },
  supabase: {
    package: "@supabase/mcp-server-supabase@latest",
    args: ["--read-only", "--project-ref=YOUR_PROJECT_REF_HERE"],
    env: { SUPABASE_ACCESS_TOKEN: "${SUPABASE_ACCESS_TOKEN}" }
  },
  docker: {
    package: "@modelcontextprotocol/server-docker"
  },
  postgres: {
    package: "@modelcontextprotocol/server-postgres",
    env: { POSTGRES_CONNECTION_STRING: "${POSTGRES_CONNECTION_STRING}" }
  },
  "brave-search": {
    package: "@modelcontextprotocol/server-brave-search",
    env: { BRAVE_API_KEY: "${BRAVE_API_KEY}" }
  }
};

/**
 * Default servers for Claude Code (excludes redundant servers)
 * Filesystem and GitHub omitted - Claude Code has native support
 */
export const CLAUDE_CODE_DEFAULTS = [
  "memory",
  "sequential-thinking",
  "context7",
  "playwright",
  "supabase"
];

/**
 * Default servers for Claude Desktop (includes all servers)
 * Needs filesystem and GitHub as Desktop lacks native support
 */
export const CLAUDE_DESKTOP_DEFAULTS = [
  "memory",
  "sequential-thinking",
  "context7",
  "playwright",
  "supabase",
  "filesystem",
  "github"
];

/**
 * Legacy default - kept for backward compatibility
 */
export const DEFAULT_SERVERS = CLAUDE_DESKTOP_DEFAULTS;
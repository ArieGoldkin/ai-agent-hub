/**
 * MCP Server Definitions
 *
 * Registry of all available MCP servers with their configurations
 */

import type { ServerDefinition } from "./types.js";

/**
 * Registry of available MCP servers
 */
export const SERVER_REGISTRY: Record<string, ServerDefinition> = {
  // Core Servers
  filesystem: {
    name: "Filesystem Operations",
    package: "@modelcontextprotocol/server-filesystem",
    description:
      "Secure filesystem operations with sandboxing for reading, writing, and searching files",
    category: "core",
    requiredEnv: [],
    optionalEnv: ["PROJECT_ROOT"],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["filesystem", "read", "write", "search"],
    runner: "npx"
  },

  github: {
    name: "GitHub Integration",
    package: "@modelcontextprotocol/server-github",
    description:
      "GitHub API integration for managing repositories, issues, and pull requests",
    category: "core",
    requiredEnv: ["GITHUB_TOKEN"],
    optionalEnv: ["GITHUB_AUTH_MODE"],
    defaultArgs: [],
    defaultEnv: {
      GITHUB_AUTH_MODE: "pat"
    },
    capabilities: ["github", "api", "git"],
    runner: "npx"
  },

  git: {
    name: "Git Version Control",
    package: "@modelcontextprotocol/server-git",
    description: "Git operations including commits, branches, diffs, and logs",
    category: "core",
    requiredEnv: [],
    optionalEnv: ["PROJECT_ROOT"],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["git", "version-control"],
    runner: "npx"
  },

  // Development Tools
  playwright: {
    name: "Browser Automation",
    package: "@modelcontextprotocol/server-playwright",
    description:
      "Playwright-powered browser automation for testing and web scraping",
    category: "dev-tools",
    requiredEnv: [],
    optionalEnv: [],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["browser", "testing", "automation"],
    runner: "npx"
  },

  docker: {
    name: "Docker Operations",
    package: "@modelcontextprotocol/server-docker",
    description: "Docker container management and operations",
    category: "dev-tools",
    requiredEnv: [],
    optionalEnv: ["DOCKER_HOST"],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["docker", "containers", "deployment"],
    runner: "npx"
  },

  postgres: {
    name: "PostgreSQL Database",
    package: "@modelcontextprotocol/server-postgres",
    description: "PostgreSQL database operations and queries",
    category: "dev-tools",
    requiredEnv: ["DATABASE_URL"],
    optionalEnv: ["POSTGRES_SSL"],
    defaultArgs: [],
    defaultEnv: {
      POSTGRES_SSL: "false"
    },
    capabilities: ["database", "sql", "postgres"],
    runner: "npx"
  },

  sqlite: {
    name: "SQLite Database",
    package: "@modelcontextprotocol/server-sqlite",
    description: "SQLite database operations and queries",
    category: "dev-tools",
    requiredEnv: ["SQLITE_DB_PATH"],
    optionalEnv: [],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["database", "sql", "sqlite"],
    runner: "npx"
  },

  // AI and Enhancement Tools
  "sequential-thinking": {
    name: "Sequential Thinking",
    package: "@modelcontextprotocol/server-sequential-thinking",
    description:
      "Advanced reasoning capabilities with planning, reflection, and optimization",
    category: "ai",
    requiredEnv: [],
    optionalEnv: [],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["reasoning", "planning", "analysis"],
    runner: "npx"
  },

  context7: {
    name: "Documentation Search",
    package: "@upstash/context7-mcp",
    description:
      "Context7 powered documentation search and code snippet retrieval",
    category: "ai",
    requiredEnv: [],
    optionalEnv: ["CONTEXT7_API_KEY"],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["documentation", "search", "context"],
    runner: "npx"
  },

  memory: {
    name: "Memory and Context",
    package: "@modelcontextprotocol/server-memory",
    description:
      "Persistent memory and context management across conversations",
    category: "ai",
    requiredEnv: [],
    optionalEnv: ["MEMORY_BACKEND"],
    defaultArgs: [],
    defaultEnv: {
      MEMORY_BACKEND: "sqlite"
    },
    capabilities: ["memory", "context", "persistence"],
    runner: "npx"
  },

  // Optional/Utility Servers
  fetch: {
    name: "Web Fetch",
    package: "@modelcontextprotocol/server-fetch",
    description: "HTTP client for fetching web content and APIs",
    category: "optional",
    requiredEnv: [],
    optionalEnv: [],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["http", "fetch", "web"],
    runner: "npx"
  },

  slack: {
    name: "Slack Integration",
    package: "@modelcontextprotocol/server-slack",
    description: "Slack API integration for messaging and workspace management",
    category: "optional",
    requiredEnv: ["SLACK_BOT_TOKEN"],
    optionalEnv: ["SLACK_SIGNING_SECRET"],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["slack", "messaging", "collaboration"],
    runner: "npx"
  },

  puppeteer: {
    name: "Puppeteer Automation",
    package: "@modelcontextprotocol/server-puppeteer",
    description: "Puppeteer-based browser automation and web scraping",
    category: "optional",
    requiredEnv: [],
    optionalEnv: [],
    defaultArgs: [],
    defaultEnv: {},
    capabilities: ["browser", "automation", "scraping"],
    runner: "npx"
  }
};

/**
 * Default servers installed by init command
 */
export const DEFAULT_SERVERS = [
  "filesystem",
  "github",
  "sequential-thinking",
  "memory",
  "context7"
];

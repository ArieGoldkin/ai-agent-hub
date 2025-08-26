/**
 * MCP Server Registry
 *
 * Simplified registry of available MCP servers with metadata
 * for installation and configuration.
 */

export interface ServerDefinition {
  name: string;
  package: string;
  description: string;
  category: "core" | "dev-tools" | "ai" | "optional";
  requiredEnv: string[];
  optionalEnv: string[];
  defaultArgs: string[];
  defaultEnv: Record<string, string>;
  capabilities: string[];
  version?: string;
  runner?: "npx" | "uvx";
}

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
 * Server categories with descriptions
 */
export const SERVER_CATEGORIES = {
  core: {
    name: "Core Servers",
    description: "Essential servers for basic development workflow",
    servers: ["filesystem", "github", "git"]
  },
  "dev-tools": {
    name: "Development Tools",
    description: "Servers for testing, databases, and deployment",
    servers: ["playwright", "docker", "postgres", "sqlite"]
  },
  ai: {
    name: "AI Enhancement",
    description:
      "Servers that enhance AI capabilities with reasoning and context",
    servers: ["sequential-thinking", "context7", "memory"]
  },
  optional: {
    name: "Optional Utilities",
    description: "Additional servers for specific use cases",
    servers: ["fetch", "slack", "puppeteer"]
  }
};

/**
 * Get server definition by name
 */
export function getServerDefinition(
  serverName: string
): ServerDefinition | undefined {
  return SERVER_REGISTRY[serverName];
}

/**
 * Get all servers in a category
 */
export function getServersByCategory(
  category: keyof typeof SERVER_CATEGORIES
): ServerDefinition[] {
  return SERVER_CATEGORIES[category].servers
    .map(serverName => SERVER_REGISTRY[serverName])
    .filter(Boolean);
}

/**
 * Get all available server names
 */
export function getAllServerNames(): string[] {
  return Object.keys(SERVER_REGISTRY);
}

/**
 * Get servers that require specific environment variables
 */
export function getServersRequiringEnv(envVar: string): ServerDefinition[] {
  return Object.values(SERVER_REGISTRY).filter(
    server =>
      server.requiredEnv.includes(envVar) || server.optionalEnv.includes(envVar)
  );
}

/**
 * Validate server name exists in registry
 */
export function isValidServerName(serverName: string): boolean {
  return serverName in SERVER_REGISTRY;
}

/**
 * Get recommended server combinations for common workflows
 */
export const SERVER_COMBINATIONS = {
  "basic-dev": {
    name: "Basic Development",
    description: "Essential servers for code development",
    servers: ["filesystem", "git", "github"],
    requiredEnv: ["GITHUB_TOKEN"]
  },
  "full-stack": {
    name: "Full Stack Development",
    description: "Complete development stack with database and testing",
    servers: ["filesystem", "git", "github", "postgres", "playwright"],
    requiredEnv: ["GITHUB_TOKEN", "DATABASE_URL"]
  },
  "ai-enhanced": {
    name: "AI Enhanced Workflow",
    description: "Development with advanced AI reasoning and context",
    servers: ["filesystem", "git", "github", "sequential-thinking", "memory"],
    requiredEnv: ["GITHUB_TOKEN"]
  },
  research: {
    name: "Research and Documentation",
    description: "Servers optimized for research and documentation work",
    servers: ["filesystem", "fetch", "context7", "sequential-thinking"],
    requiredEnv: ["CONTEXT7_API_KEY"]
  }
};

/**
 * Get server combination by name
 */
export function getServerCombination(
  combinationName: string
): (typeof SERVER_COMBINATIONS)[keyof typeof SERVER_COMBINATIONS] | undefined {
  return SERVER_COMBINATIONS[
    combinationName as keyof typeof SERVER_COMBINATIONS
  ];
}

/**
 * Get all available combinations
 */
export function getAllCombinations(): Array<{
  name: string;
  combination: (typeof SERVER_COMBINATIONS)[keyof typeof SERVER_COMBINATIONS];
}> {
  return Object.entries(SERVER_COMBINATIONS).map(([name, combination]) => ({
    name,
    combination
  }));
}

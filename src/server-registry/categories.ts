/**
 * Server Categories and Combinations
 *
 * Grouping and preset configurations for MCP servers
 */

import type { ServerCategory, ServerCombination } from "./types.js";

/**
 * Server categories with descriptions
 */
export const SERVER_CATEGORIES: Record<string, ServerCategory> = {
  core: {
    name: "Core Servers",
    description: "Essential servers for basic development workflow",
    servers: ["filesystem", "github"]
  },
  "dev-tools": {
    name: "Development Tools",
    description: "Servers for databases and deployment",
    servers: ["docker", "postgres", "sqlite"]
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
 * Get recommended server combinations for common workflows
 */
export const SERVER_COMBINATIONS: Record<string, ServerCombination> = {
  "basic-dev": {
    name: "Basic Development",
    description: "Essential servers for code development",
    servers: ["filesystem", "github"],
    requiredEnv: ["GITHUB_TOKEN"]
  },
  "full-stack": {
    name: "Full Stack Development",
    description: "Complete development stack with database",
    servers: ["filesystem", "github", "postgres"],
    requiredEnv: ["GITHUB_TOKEN", "DATABASE_URL"]
  },
  "ai-enhanced": {
    name: "AI Enhanced Workflow",
    description: "Development with advanced AI reasoning and context",
    servers: ["filesystem", "github", "sequential-thinking", "memory"],
    requiredEnv: ["GITHUB_TOKEN"]
  },
  research: {
    name: "Research and Documentation",
    description: "Servers optimized for research and documentation work",
    servers: ["filesystem", "fetch", "context7", "sequential-thinking"],
    requiredEnv: ["CONTEXT7_API_KEY"]
  }
};

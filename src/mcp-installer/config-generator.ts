/**
 * Configuration Generator Module
 * 
 * Generates configuration for MCP servers
 */

import type { MCPServerConfig } from "../claude-config/index.js";
import type { EnvironmentConfig } from "./types.js";

/**
 * Generates the command configuration for Claude Desktop
 * (From original mcp-installer.ts lines 122-134)
 */
export function getServerCommand(packageName: string): string {
  // Special handling for known packages
  switch (packageName) {
    case "mcp-server-git":
      return "uvx";
    case "@modelcontextprotocol/server-filesystem":
    case "@modelcontextprotocol/server-github":
    case "@modelcontextprotocol/server-sequential-thinking":
      return "npx";
    default:
      return "npx";
  }
}

/**
 * Generates MCP server configuration for Claude Desktop
 * (From original mcp-installer.ts lines 139-159)
 */
export function generateServerConfig(
  packageName: string,
  version = "latest",
  environment?: Record<string, string>,
  args?: string[]
): MCPServerConfig {
  const command = getServerCommand(packageName);
  const packageRef =
    version === "latest" ? packageName : `${packageName}@${version}`;

  const config: MCPServerConfig = {
    command,
    args: command === "uvx" ? [packageRef] : [packageRef, ...(args || [])]
  };

  if (environment && Object.keys(environment).length > 0) {
    config.env = environment;
  }

  return config;
}

/**
 * Configures environment variables for MCP servers
 * (From original mcp-installer.ts lines 164-192)
 */
export function configureEnvironment(
  envConfig: EnvironmentConfig,
  userEnv: Record<string, string> = {}
): { env: Record<string, string>; missing: string[] } {
  const env: Record<string, string> = { ...envConfig.defaults };
  const missing: string[] = [];

  // Add user-provided environment variables
  Object.assign(env, userEnv);

  // Check for required environment variables
  for (const requiredVar of envConfig.required) {
    if (!env[requiredVar] && !process.env[requiredVar]) {
      missing.push(requiredVar);
    } else if (!env[requiredVar]) {
      // Use from process.env if not explicitly provided
      env[requiredVar] = process.env[requiredVar]!;
    }
  }

  // Add optional environment variables from process.env
  for (const optionalVar of envConfig.optional) {
    if (process.env[optionalVar] && !env[optionalVar]) {
      env[optionalVar] = process.env[optionalVar]!;
    }
  }

  return { env, missing };
}
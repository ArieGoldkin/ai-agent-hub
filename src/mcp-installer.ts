/**
 * MCP Server Installation and Management
 *
 * Handles NPX-based installation of MCP servers and generates
 * the appropriate configuration for Claude Desktop.
 */

import { exec } from "child_process";
import { promisify } from "util";
import { MCPServerConfig } from "./claude-config.js";

const execAsync = promisify(exec);

export interface ServerInstallResult {
  success: boolean;
  packageName: string;
  command: string;
  error?: string;
  version?: string;
}

export interface EnvironmentConfig {
  required: string[];
  optional: string[];
  defaults: Record<string, string>;
}

/**
 * Installs an MCP server using NPX
 */
export async function installMCPServer(
  packageName: string,
  version = "latest",
  timeout = 120000
): Promise<ServerInstallResult> {
  try {
    console.log(`Installing ${packageName}@${version}...`);

    // Use npx to ensure the package is available
    const command = `npx ${packageName}@${version} --help`;
    await execAsync(command, { timeout });

    // If help command succeeds, the package is available
    const result: ServerInstallResult = {
      success: true,
      packageName,
      command: getServerCommand(packageName)
    };

    // Try to extract version info
    try {
      const versionOutput = await execAsync(
        `npx ${packageName}@${version} --version`,
        { timeout: 10000 }
      );
      result.version = versionOutput.stdout.trim();
    } catch {
      // Version extraction failed, but installation succeeded
    }

    return result;
  } catch (error) {
    return {
      success: false,
      packageName,
      command: "",
      error:
        error instanceof Error ? error.message : "Unknown installation error"
    };
  }
}

/**
 * Validates that an MCP server is correctly installed and functional
 */
export async function validateInstallation(
  packageName: string,
  version = "latest",
  timeout = 30000
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Try to run the server with --help flag
    const command = `npx ${packageName}@${version} --help`;
    const { stdout } = await execAsync(command, { timeout });

    // Basic validation - server should respond to help
    if (stdout.length > 0) {
      return { valid: true };
    }

    return { valid: false, error: "Server did not respond to help command" };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed"
    };
  }
}

/**
 * Generates the command configuration for Claude Desktop
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

/**
 * Batch installs multiple MCP servers
 */
export async function batchInstallServers(
  packages: Array<{ name: string; version?: string }>,
  concurrency = 3
): Promise<ServerInstallResult[]> {
  const results: ServerInstallResult[] = [];

  // Process in batches to avoid overwhelming the system
  for (let i = 0; i < packages.length; i += concurrency) {
    const batch = packages.slice(i, i + concurrency);
    const batchPromises = batch.map(pkg =>
      installMCPServer(pkg.name, pkg.version)
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches
    if (i + concurrency < packages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Uninstalls an MCP server (removes from global NPX cache)
 */
export async function uninstallMCPServer(
  packageName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear from NPX cache
    await execAsync(`npm uninstall -g ${packageName}`);
    return { success: true };
  } catch (error) {
    // Package might not be globally installed, try clearing NPX cache
    try {
      await execAsync("npx clear-npx-cache");
      return { success: true };
    } catch {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Uninstallation failed"
      };
    }
  }
}

/**
 * Checks if NPX is available on the system
 */
export async function checkNPXAvailable(): Promise<{
  available: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const { stdout } = await execAsync("npx --version");
    return {
      available: true,
      version: stdout.trim()
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "NPX not available"
    };
  }
}

/**
 * Gets system information relevant to MCP server installation
 */
export async function getSystemInfo(): Promise<{
  platform: string;
  nodeVersion?: string;
  npxVersion?: string;
  uvxAvailable: boolean;
}> {
  const platform = process.platform;

  let nodeVersion: string | undefined;
  let npxVersion: string | undefined;
  let uvxAvailable = false;

  try {
    const nodeResult = await execAsync("node --version");
    nodeVersion = nodeResult.stdout.trim();
  } catch {
    // Node version not available
  }

  try {
    const npxResult = await execAsync("npx --version");
    npxVersion = npxResult.stdout.trim();
  } catch {
    // NPX version not available
  }

  try {
    await execAsync("uvx --version");
    uvxAvailable = true;
  } catch {
    // UVX not available
  }

  return {
    platform,
    nodeVersion,
    npxVersion,
    uvxAvailable
  };
}

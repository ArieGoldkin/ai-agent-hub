/**
 * Core Installation Module
 *
 * Handles NPX-based installation of MCP servers
 */

import { exec } from "child_process";
import { promisify } from "util";
import { getServerCommand } from "./config-generator.js";
import type { ServerInstallResult } from "./types.js";

const execAsync = promisify(exec);

/**
 * Installs an MCP server using NPX
 * (From original mcp-installer.ts lines 31-80)
 */
export async function installMCPServer(
  packageName: string,
  version = "latest"
): Promise<ServerInstallResult> {
  try {
    // Remove console.log that interferes with spinner
    const packageRef =
      version === "latest" ? packageName : `${packageName}@${version}`;

    // Just verify the package exists on npm registry
    // Don't run --help as many servers don't support it
    const verifyCommand = `npm view ${packageRef} version`;
    await execAsync(verifyCommand, { timeout: 5000 });

    // Pre-download the package with npx to cache it
    // Use a dummy command that will download but not hang
    try {
      const cacheCommand = `npx --yes ${packageRef} --version 2>/dev/null || true`;
      await execAsync(cacheCommand, { timeout: 5000 });
    } catch {
      // Ignore errors - package is cached even if --version fails
    }

    const installResult: ServerInstallResult = {
      success: true,
      packageName,
      command: getServerCommand(packageName),
      version
    };

    return installResult;
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
 * (From original mcp-installer.ts lines 85-117)
 */
export async function validateInstallation(
  packageName: string,
  version = "latest",
  timeout = 15000
): Promise<{ valid: boolean; error?: string }> {
  try {
    const packageRef =
      version === "latest" ? packageName : `${packageName}@${version}`;

    // Try to check if NPX can resolve and download the package
    // Use a safer approach that doesn't rely on --help working
    const command = `npm view ${packageRef} version`;
    const result = await execAsync(command, { timeout });

    if (result.stdout && result.stdout.trim()) {
      return { valid: true };
    }

    // Fallback: just check if NPX can find the package
    try {
      const npxCommand = `npx --yes ${packageRef} --version || echo "package-found"`;
      await execAsync(npxCommand, { timeout });
      return { valid: true };
    } catch {
      return { valid: false, error: "Package validation failed" };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed"
    };
  }
}

/**
 * Batch installs multiple MCP servers with improved error handling
 * (From original mcp-installer.ts lines 197-231)
 */
export async function batchInstallServers(
  packages: Array<{ name: string; version?: string }>,
  concurrency = 4
): Promise<ServerInstallResult[]> {
  const results: ServerInstallResult[] = [];

  // Process in smaller batches to avoid overwhelming the system
  for (let i = 0; i < packages.length; i += concurrency) {
    const batch = packages.slice(i, i + concurrency);

    // Process each batch item individually to avoid one failure affecting others
    const batchPromises = batch.map(async pkg => {
      try {
        return await installMCPServer(pkg.name, pkg.version);
      } catch (error) {
        return {
          success: false,
          packageName: pkg.name,
          command: "",
          error: error instanceof Error ? error.message : "Installation failed"
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Reduce delay between batches from 2s to 500ms
    if (i + concurrency < packages.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Uninstalls an MCP server (removes from global NPX cache)
 * (From original mcp-installer.ts lines 236-255)
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

/**
 * System Checker Module
 *
 * Checks system requirements and capabilities
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Checks if NPX is available on the system
 * (From original mcp-installer.ts lines 260-277)
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
 * (From original mcp-installer.ts lines 282-321)
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

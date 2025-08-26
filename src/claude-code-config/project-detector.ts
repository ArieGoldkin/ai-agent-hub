/**
 * Project Detection Module
 * 
 * Detects if the current directory is a project and gathers project information
 */

import { access } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectInfo } from "./types.js";

/**
 * Detects if the current directory is a project and gathers project information
 * (From original claude-code-config.ts lines 34-63)
 */
export async function detectProjectInfo(
  cwd: string = process.cwd()
): Promise<ProjectInfo> {
  const info: ProjectInfo = {
    isProject: false,
    hasPackageJson: false,
    hasGitRepo: false,
    projectRoot: cwd
  };

  try {
    // Check for package.json
    await access(join(cwd, "package.json"));
    info.hasPackageJson = true;
    info.isProject = true;
  } catch {
    // package.json not found
  }

  try {
    // Check for .git directory
    await access(join(cwd, ".git"));
    info.hasGitRepo = true;
    info.isProject = true;
  } catch {
    // .git not found
  }

  return info;
}

/**
 * Gets the path to the .mcp.json file for the current project
 * (From original claude-code-config.ts lines 68-70)
 */
export function getMCPJsonPath(cwd: string = process.cwd()): string {
  return join(cwd, ".mcp.json");
}

/**
 * Checks if .mcp.json exists in the current project
 * (From original claude-code-config.ts lines 75-84)
 */
export async function hasMCPConfig(
  cwd: string = process.cwd()
): Promise<boolean> {
  try {
    await access(getMCPJsonPath(cwd));
    return true;
  } catch {
    return false;
  }
}
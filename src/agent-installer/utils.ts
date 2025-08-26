/**
 * Utilities - Path resolution and helper functions from the original file
 */

import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { AGENT_TEMPLATES } from "./templates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AgentInstallOptions {
  targetDir?: string;
  agents?: string[];
  overwrite?: boolean;
}

export interface AgentInstallResult {
  installed: string[];
  skipped: string[];
  errors: string[];
}

/**
 * Get the path to the agents directory in the package (from original file)
 */
export function getPackageAgentsPath(): string {
  // When running via NPX, we need to find the package root
  // The __dirname will be in node_modules/ai-agent-hub/dist/src/agent-installer

  // Try multiple potential locations
  const possiblePaths = [
    // NPM package location (when installed via NPX)
    path.resolve(__dirname, "..", "..", "..", "agents"),
    // Development location
    path.resolve(__dirname, "..", "..", "agents"),
    // Alternative NPM package location
    path.resolve(__dirname, "..", "..", "..", "..", "ai-agent-hub", "agents"),
    // Current directory fallback (if package is in current dir)
    path.resolve(process.cwd(), "node_modules", "ai-agent-hub", "agents")
  ];

  // Try each path until we find one that exists
  for (const agentsPath of possiblePaths) {
    try {
      fsSync.accessSync(agentsPath);
      // Verify it actually contains agent files
      const files = fsSync.readdirSync(agentsPath);
      if (files.some(f => f.endsWith(".md"))) {
        return agentsPath;
      }
    } catch {
      // Path doesn't exist or isn't readable, try next one
    }
  }

  // If no existing path found, return the most likely one for NPM
  return path.resolve(__dirname, "..", "..", "..", "agents");
}

/**
 * Get list of available agent files (from original file)
 */
export async function getAvailableAgents(): Promise<string[]> {
  try {
    const agentsPath = getPackageAgentsPath();
    const files = await fs.readdir(agentsPath);
    const agents = files
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""));

    // If no agents found, return the expected default agents from templates
    if (agents.length === 0) {
      console.warn(`No agent files found at ${agentsPath}`);
      return Object.keys(AGENT_TEMPLATES);
    }

    return agents;
  } catch (error) {
    console.error("Error reading agents directory:", error);
    // Return hardcoded list as fallback
    return Object.keys(AGENT_TEMPLATES);
  }
}

/**
 * Get the global Claude agents directory (from original file)
 */
export function getGlobalClaudeAgentsPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return path.join(homeDir, ".claude", "agents");
}

/**
 * Check if agent files are already installed (from original file)
 */
export async function areAgentsInstalled(targetDir?: string): Promise<boolean> {
  try {
    const { detectProjectInfo } = await import("../claude-code-config/index.js");
    const projectInfo = await detectProjectInfo();
    const checkDir =
      targetDir ||
      (projectInfo.isProject
        ? path.join(projectInfo.projectRoot, ".claude", "agents")
        : path.join(process.cwd(), ".claude", "agents"));

    await fs.access(checkDir);
    const files = await fs.readdir(checkDir);
    return files.some(f => f.endsWith(".md"));
  } catch {
    return false;
  }
}

/**
 * Get list of installed agents (from original file)
 */
export async function getInstalledAgents(targetDir?: string): Promise<string[]> {
  try {
    const { detectProjectInfo } = await import("../claude-code-config/index.js");
    const projectInfo = await detectProjectInfo();
    const checkDir =
      targetDir ||
      (projectInfo.isProject
        ? path.join(projectInfo.projectRoot, ".claude", "agents")
        : path.join(process.cwd(), ".claude", "agents"));

    const files = await fs.readdir(checkDir);
    return files.filter(f => f.endsWith(".md")).map(f => f.replace(".md", ""));
  } catch {
    return [];
  }
}
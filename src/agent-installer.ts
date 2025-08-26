/**
 * Agent Personality Installer
 *
 * Handles copying agent personality files to the user's project
 * to enhance Claude's capabilities with specialized personas.
 */

import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { detectProjectInfo } from "./claude-code-config.js";

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
 * Get the path to the agents directory in the package
 */
function getPackageAgentsPath(): string {
  // When running from NPX/production, __dirname will be in dist/src
  // Go up two levels from dist/src to package root, then to agents
  const distPath = path.resolve(__dirname, "..", "..", "agents");

  // Check if we're in production (dist directory exists)
  try {
    fsSync.accessSync(distPath);
    return distPath;
  } catch {
    // Fallback to development path
    return path.resolve(__dirname, "..", "agents");
  }
}

/**
 * Get list of available agent files
 */
export async function getAvailableAgents(): Promise<string[]> {
  try {
    const agentsPath = getPackageAgentsPath();
    const files = await fs.readdir(agentsPath);
    return files.filter(f => f.endsWith(".md")).map(f => f.replace(".md", ""));
  } catch (error) {
    console.error("Error reading agents directory:", error);
    return [];
  }
}

/**
 * Get the global Claude agents directory (in user's home)
 */
function getGlobalClaudeAgentsPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return path.join(homeDir, ".claude", "agents");
}

/**
 * Install agent personality files to the project
 */
export async function installAgentFiles(
  options: AgentInstallOptions = {}
): Promise<AgentInstallResult> {
  const result: AgentInstallResult = {
    installed: [],
    skipped: [],
    errors: []
  };

  try {
    // Detect project info
    const projectInfo = await detectProjectInfo();

    // Determine target directory
    const targetDir =
      options.targetDir ||
      (projectInfo.isProject
        ? path.join(projectInfo.projectRoot, ".claude", "agents")
        : path.join(process.cwd(), ".claude", "agents"));

    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });

    // Get available agents
    const availableAgents = await getAvailableAgents();
    const agentsToInstall = options.agents || availableAgents;

    // Copy agent files
    const sourceDir = getPackageAgentsPath();

    for (const agent of agentsToInstall) {
      if (!availableAgents.includes(agent)) {
        result.errors.push(`Agent '${agent}' not found`);
        continue;
      }

      const sourceFile = path.join(sourceDir, `${agent}.md`);
      const targetFile = path.join(targetDir, `${agent}.md`);

      try {
        // Check if file already exists
        const exists = await fs
          .access(targetFile)
          .then(() => true)
          .catch(() => false);

        if (exists && !options.overwrite) {
          result.skipped.push(agent);
          continue;
        }

        // Copy the file
        await fs.copyFile(sourceFile, targetFile);
        result.installed.push(agent);
      } catch (error) {
        result.errors.push(`Failed to install ${agent}: ${error}`);
      }
    }

    // Also copy the agent templates JSON for reference
    const templatesSource = path.join(__dirname, "agent-templates.json");
    const templatesTarget = path.join(targetDir, "..", "agent-templates.json");

    try {
      await fs.copyFile(templatesSource, templatesTarget);
    } catch (error) {
      // Non-critical error, just log it
      console.debug("Could not copy agent templates:", error);
    }

    return result;
  } catch (error) {
    result.errors.push(`Installation failed: ${error}`);
    return result;
  }
}

/**
 * Install agent personality files globally (to user's home ~/.claude/agents)
 */
export async function installAgentFilesGlobally(
  options: AgentInstallOptions = {}
): Promise<AgentInstallResult> {
  const globalPath = getGlobalClaudeAgentsPath();
  return installAgentFiles({
    ...options,
    targetDir: globalPath
  });
}

/**
 * Check if agent files are already installed
 */
export async function areAgentsInstalled(targetDir?: string): Promise<boolean> {
  try {
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
 * Get list of installed agents
 */
export async function getInstalledAgents(
  targetDir?: string
): Promise<string[]> {
  try {
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

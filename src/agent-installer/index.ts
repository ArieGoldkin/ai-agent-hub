/**
 * Main Agent Installer - Simplified version of the original agent-installer.ts
 * Just splits the original functionality into smaller files
 */

import * as fs from "fs/promises";
import * as path from "path";
import { detectProjectInfo } from "../claude-code-config/index.js";
import { AGENT_TEMPLATES } from "./templates.js";
import {
  getPackageAgentsPath,
  getGlobalClaudeAgentsPath,
  getAvailableAgents,
  areAgentsInstalled,
  getInstalledAgents,
  type AgentInstallOptions,
  type AgentInstallResult
} from "./utils.js";

// Re-export types and utilities
export type { AgentInstallOptions, AgentInstallResult };
export { getAvailableAgents, areAgentsInstalled, getInstalledAgents };

/**
 * Install agent personality files to the project (original function, just moved here)
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

        // Try to copy from source directory first
        try {
          await fs.copyFile(sourceFile, targetFile);
          result.installed.push(agent);
        } catch {
          // If source file doesn't exist, create from embedded template
          const template = AGENT_TEMPLATES[agent];
          if (template) {
            await fs.writeFile(targetFile, template, "utf-8");
            result.installed.push(agent);
          } else {
            result.errors.push(`No template found for agent: ${agent}`);
          }
        }
      } catch (error) {
        result.errors.push(`Failed to install ${agent}: ${error}`);
      }
    }

    // Create settings.local.json for Claude Code configuration reference
    const settingsFile = path.join(targetDir, "..", "settings.local.json");
    try {
      const settingsExists = await fs
        .access(settingsFile)
        .then(() => true)
        .catch(() => false);
      if (!settingsExists) {
        const defaultSettings = {
          agentPersonalities: {
            enabled: true,
            directory: "./agents"
          },
          mcpServers: {
            configFile: "./.mcp.json"
          }
        };
        await fs.writeFile(
          settingsFile,
          JSON.stringify(defaultSettings, null, 2),
          "utf-8"
        );
      }
    } catch (error) {
      console.debug("Could not create settings file:", error);
    }

    // Also copy the agent templates JSON for reference
    const templatesSource = path.join(__dirname, "agent-templates.json");
    const templatesTarget = path.join(targetDir, "..", "agent-templates.json");

    try {
      await fs.copyFile(templatesSource, templatesTarget);
    } catch {
      // If source doesn't exist, create a minimal template file
      try {
        const minimalTemplates = {
          version: "1.0",
          agents: Object.keys(AGENT_TEMPLATES),
          description: "AI Agent Hub - Agent personalities for Claude Code"
        };
        await fs.writeFile(
          templatesTarget,
          JSON.stringify(minimalTemplates, null, 2),
          "utf-8"
        );
      } catch {
        // Even this failed, but it's non-critical
        console.debug("Could not create agent templates file");
      }
    }

    return result;
  } catch (error) {
    result.errors.push(`Installation failed: ${error}`);
    return result;
  }
}

/**
 * Install agent personality files globally (original function, just moved here)
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

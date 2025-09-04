/**
 * Install agents - Simplified agent installer
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { installSquadInfrastructure } from "./components/squad-installer.js";
import { copyMissingAgents, reportCustomAgents, getMissingAgents } from "./components/agent-copier.js";

/**
 * Find the package root directory containing agents
 */
async function findPackageRoot(currentDir: string): Promise<string> {
  const possiblePaths = [
    currentDir,
    join(currentDir, "../.."),
    join(currentDir, "../../.."),
  ];
  
  for (const path of possiblePaths) {
    const agentsPath = join(path, "agents");
    if (existsSync(agentsPath)) {
      const files = readdirSync(agentsPath);
      if (files.some(f => f.endsWith('.md'))) {
        return path;
      }
    }
  }
  
  throw new Error("Cannot locate ai-agent-hub package with agents");
}

/**
 * Determine agent source based on mode
 */
function getAgentSource(packageRoot: string, mode: string): { agentsPath: string; sourceDescription: string } {
  if (mode === 'squad') {
    const squadTemplatesPath = join(packageRoot, ".squad", "templates");
    if (existsSync(squadTemplatesPath)) {
      return {
        agentsPath: squadTemplatesPath,
        sourceDescription: "slim squad templates (97% token reduction)"
      };
    }
    console.log("⚠️  Squad templates not found, falling back to classic agents");
  }
  
  return {
    agentsPath: join(packageRoot, "agents"),
    sourceDescription: mode === 'squad' ? "classic agents" : "classic full agents"
  };
}

/**
 * Create Claude Code settings file
 */
async function createClaudeSettings(): Promise<void> {
  const settingsPath = ".claude/settings.local.json";
  if (!existsSync(settingsPath)) {
    const settings = {
      "enableAllProjectMcpServers": true
    };
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
    console.log("✅ Created Claude Code settings in .claude/settings.local.json");
  }
}

/**
 * Install agents based on mode
 */
export async function installAgents(__dirname: string, mode: string = 'classic'): Promise<boolean> {
  console.log(`🤖 Installing AI Agent Personalities (${mode} mode)...`);

  try {
    // Create directories
    if (!existsSync(".claude")) {
      await mkdir(".claude", { recursive: true });
    }
    if (!existsSync(".claude/agents")) {
      await mkdir(".claude/agents", { recursive: true });
    }

    // Find package and agent source
    const packageRoot = await findPackageRoot(__dirname);
    const { agentsPath, sourceDescription } = getAgentSource(packageRoot, mode);
    
    console.log(`📁 Found package at: ${packageRoot}`);
    console.log(`📦 Using ${sourceDescription}`);
    
    // Check for missing agents
    const missingAgents = getMissingAgents();
    const existingAgents = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
    
    if (missingAgents.length === 0) {
      console.log("✅ All 9 AI Agent Hub personalities already installed");
      if (existingAgents.length > 9) {
        const customCount = existingAgents.length - 9;
        console.log(`   📌 Plus ${customCount} custom agent(s) preserved`);
      }
    } else {
      await copyMissingAgents(agentsPath, missingAgents);
      reportCustomAgents(existingAgents);
    }
    
    // Create settings
    await createClaudeSettings();
    
    // Install Squad infrastructure if needed
    if (mode === 'squad') {
      await installSquadInfrastructure(packageRoot);
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Failed to install agents:", error instanceof Error ? error.message : error);
    return false;
  }
}
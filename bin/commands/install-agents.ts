/**
 * Install agents - Simplified agent installer
 */

import { existsSync, readdirSync } from "fs";
import { mkdir } from "fs/promises";
import { installSquadInfrastructure } from "./components/squad-installer.js";
import { copyMissingAgents, reportCustomAgents, getMissingAgents } from "./components/agent-copier.js";
import {
  initializeContextSystem,
  copyContextTriggers,
  createClaudeSettings,
  findPackageRoot,
  getAgentSource,
  appendContextInstructions,
  installOrchestrationInstructions,
  installSkills
} from "./install-agents/index.js";

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
    
    // Copy context triggers file (works for both Classic and Squad modes)
    await copyContextTriggers(packageRoot);

    // Initialize structured context system
    await initializeContextSystem(mode);

    // Install orchestration instructions for intelligent routing
    await installOrchestrationInstructions(packageRoot);

    // Install comprehensive Claude Code skills
    await installSkills(packageRoot);

    // Append context instructions to all agents
    await appendContextInstructions(packageRoot);

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
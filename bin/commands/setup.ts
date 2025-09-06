/**
 * Setup command - Simple agent deployment
 */

import { installAgents } from "./install-agents.js";
import { setupProjectMCP } from "../../lib/mcp-setup.js";
import { setupClaudeDesktopMCP, isClaudeDesktopInstalled, getPlatformName } from "../../lib/claude-desktop-setup.js";
import { createClaudeMd } from "../../lib/templates/claude-md.js";
import chalk from "chalk";
import type { InstallationTarget } from "../utils/prompt.js";

/**
 * Run simple setup
 */
export async function runSetup(__dirname: string, installTargets: InstallationTarget, mode: string = 'classic'): Promise<void> {
  try {
    console.log("🚀 AI Agent Hub - Setup");
    console.log(`📋 Mode: ${mode.toUpperCase()}`);
    console.log("═".repeat(50));
    console.log();
    
    // Step 1: Install agents (based on mode)
    console.log(`Step 1: Installing AI agents (${mode} mode)...`);
    const agentsInstalled = await installAgents(__dirname, mode);
    if (!agentsInstalled) {
      throw new Error("Failed to install agents");
    }
    
    // Step 2: Setup MCP servers based on targets
    console.log();
    console.log("Step 2: Configuring MCP servers...");
    
    if (installTargets.project) {
      await setupProjectMCP(__dirname);
    }
    
    // Step 3: Optionally configure Claude Desktop
    if (installTargets.desktop && isClaudeDesktopInstalled()) {
      console.log();
      console.log(`Step 3: Configuring Claude Desktop (${getPlatformName()})...`);
      await setupClaudeDesktopMCP();
    } else if (installTargets.desktop && !isClaudeDesktopInstalled()) {
      console.log();
      console.log(chalk.yellow(`⚠️  Claude Desktop not found on ${getPlatformName()}. Skipping desktop configuration.`));
    }
    
    // Step 4: Create CLAUDE.md
    console.log();
    console.log("Step 4: Creating CLAUDE.md instructions...");
    await createClaudeMd(mode);
    
    // Final summary
    console.log();
    console.log("═".repeat(50));
    console.log(chalk.green("✅ Setup complete!"));
    console.log();
    
    if (installTargets.project) {
      console.log("📁 Project setup:");
      console.log("   • 9 AI agents installed in .claude/agents/");
      console.log("   • MCP servers configured in .mcp.json");
      console.log("   • Instructions available in CLAUDE.md");
    }
    
    if (installTargets.desktop && isClaudeDesktopInstalled()) {
      console.log();
      console.log("🖥️  Claude Desktop configured with agents and MCP servers");
    }
    
    console.log();
    console.log(chalk.cyan("🎯 Quick Start:"));
    console.log(`   Open Claude and say: "Use Studio Coach to help me build..."`);
    console.log();
    console.log("📚 Your 9 specialized agents:");
    console.log("   • Studio Coach - Master orchestrator");
    console.log("   • Sprint Prioritizer - Agile planning");
    console.log("   • UX Researcher - User research");
    console.log("   • Rapid UI Designer - Design systems");
    console.log("   • Backend System Architect - API design");
    console.log("   • Frontend UI Developer - UI implementation");
    console.log("   • AI/ML Engineer - ML features");
    console.log("   • Whimsy Injector - Delight features");
    console.log("   • Code Quality Reviewer - Quality assurance");
    console.log();
    console.log(chalk.yellow("🌐 Browser MCP Setup:"));
    console.log("   To activate Browser MCP, install the extension:");
    console.log("   https://docs.browsermcp.io/setup-extension");
    console.log("   Then use /mcp in Claude to connect");
    console.log();
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
    throw error;
  }
}
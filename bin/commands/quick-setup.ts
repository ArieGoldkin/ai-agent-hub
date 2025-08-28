/**
 * Quick setup command - One-command installation and configuration
 */

import { installAgents } from "./install-agents.js";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { setupProjectMCP } from "../../lib/mcp-setup.js";
import { claudeMdTemplate } from "../../lib/templates/claude-md-template.js";
import { sessionTriggerTemplate } from "../../lib/templates/session-trigger-template.js";
import { setupClaudeDesktopMCP, isClaudeDesktopInstalled, getPlatformName } from "../../lib/claude-desktop-setup.js";

/**
 * Create session trigger file
 */
async function createSessionTrigger(): Promise<void> {
  console.log("📝 Creating session trigger system...");
  await writeFile("START_SESSION.md", sessionTriggerTemplate);
  console.log("✅ Created START_SESSION.md trigger file");
}

/**
 * Create comprehensive CLAUDE.md with orchestration instructions
 */
async function createOrchestrationClaudeMd(): Promise<void> {
  console.log("📚 Creating orchestration instructions...");
  await writeFile("CLAUDE.md", claudeMdTemplate);
  console.log("✅ Created comprehensive CLAUDE.md with orchestration instructions");
}

/**
 * Run quick setup for test project
 */
export async function runQuickSetup(__dirname: string, targetDir?: string): Promise<void> {
  const originalDir = process.cwd();
  
  try {
    // Change to target directory if specified
    if (targetDir && targetDir !== '.') {
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
        console.log(`📁 Created directory: ${targetDir}`);
      }
      process.chdir(targetDir);
      console.log(`📍 Working in: ${targetDir}`);
    } else {
      console.log(`📍 Working in: ${process.cwd()}`);
    }
    
    console.log("🚀 AI Agent Hub - Quick Setup");
    console.log("═".repeat(50));
    console.log();
    
    // Step 1: Install agents and session infrastructure
    console.log("Step 1: Installing AI agents and session system...");
    const agentsInstalled = await installAgents(__dirname);
    if (!agentsInstalled) {
      throw new Error("Failed to install agents");
    }
    
    // Step 2: Setup MCP servers
    console.log();
    console.log("Step 2: Configuring MCP servers...");
    await setupProjectMCP(__dirname);
    
    // Step 2b: Optionally configure Claude Desktop
    if (isClaudeDesktopInstalled()) {
      console.log();
      console.log(`Step 2b: Configuring Claude Desktop (${getPlatformName()})...`);
      await setupClaudeDesktopMCP();
    }
    
    // Step 3: Create orchestration CLAUDE.md
    console.log();
    console.log("Step 3: Creating orchestration instructions...");
    await createOrchestrationClaudeMd();
    
    // Step 4: Create session trigger file
    console.log();
    console.log("Step 4: Setting up session trigger system...");
    await createSessionTrigger();
    
    // Final summary
    console.log();
    console.log("═".repeat(50));
    console.log("✨ Quick Setup Complete!");
    console.log();
    console.log("📋 What was installed:");
    console.log("   ✅ 9 AI agent personalities in .claude/agents/");
    console.log("   ✅ Session management system");
    console.log("   ✅ MCP servers in .mcp.json (Claude Code)");
    if (isClaudeDesktopInstalled()) {
      console.log(`   ✅ MCP servers for Claude Desktop (${getPlatformName()})`);
    }
    console.log("   ✅ Orchestration instructions in CLAUDE.md");
    console.log("   ✅ Session trigger file START_SESSION.md");
    console.log();
    console.log("🎯 How to use:");
    console.log("   1. Open this project in Claude Code");
    console.log("   2. Edit START_SESSION.md with your request");
    console.log("   3. Claude will read it and start orchestration");
    console.log("   4. Agents will collaborate to implement your request");
    console.log();
    console.log("📝 Alternative: Command-line session");
    console.log("   Run: ai-agent-hub session");
    console.log("   Enter your request when prompted");
    console.log("   Claude will see the session and begin orchestration");
    console.log();
    console.log("💡 Tip: Run 'ai-agent-hub doctor' to verify installation");
    
  } catch (error) {
    console.error("❌ Quick setup failed:", error);
    throw error;
  } finally {
    // Return to original directory
    if (targetDir && targetDir !== '.') {
      process.chdir(originalDir);
    }
  }
}
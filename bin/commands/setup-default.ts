/**
 * Default setup command - Installs agents and configures MCP servers
 */

import { existsSync } from "fs";
import { join } from "path";
import { getClaudeDesktopConfigPath } from "../../lib/paths.js";
import { loadConfig, saveConfig } from "../../lib/file-ops.js";
import { getDefaultServersForContext } from "../../lib/server-config.js";
import { addToClaudeDesktop, createMCPJson } from "../../lib/claude-ops.js";
import { safeHandleEnvFile, displayEnvironmentGuidance } from "../../lib/env-handler.js";
import { isInProject, hasClaudeDesktop } from "../utils/detectors.js";
import { installAgents } from "./install-agents.js";
import { promptInstallationTarget, showInstallationPlan, confirmInstallation, InstallationChoice } from "../utils/prompt.js";

export async function setupDefault(__dirname: string, presetChoice?: InstallationChoice): Promise<void> {
  console.log("🤖 AI Agent Hub - Installing AI Agents & MCP Servers\n");
  
  const inProject = isInProject();
  const hasDesktop = hasClaudeDesktop();
  
  if (!inProject && !hasDesktop) {
    console.error("❌ No Claude installation or project detected");
    console.log("   Please install Claude Desktop or run in a project directory");
    return;
  }
  
  // Get installation choice (interactive or preset)
  let choice: InstallationChoice;
  if (presetChoice) {
    choice = presetChoice;
    console.log(`🚀 Non-interactive mode: ${choice.target}\n`);
  } else {
    // Interactive mode - ask user what they want
    choice = await promptInstallationTarget(inProject, hasDesktop);
    
    // Show what will be installed
    showInstallationPlan(choice, inProject, hasDesktop);
    
    // Confirm installation
    const confirmed = await confirmInstallation();
    if (!confirmed) {
      console.log("❌ Installation cancelled");
      return;
    }
    
    console.log();
  }
  
  // Validate choice is possible
  if (choice.installAgents && !inProject) {
    console.error("❌ Cannot install agents: not in a project directory");
    return;
  }
  
  if (choice.installProjectMCP && !inProject) {
    console.error("❌ Cannot install project MCP servers: not in a project directory");
    return;
  }
  
  if (choice.installDesktopMCP && !hasDesktop) {
    console.error("❌ Cannot install desktop MCP servers: Claude Desktop not found");
    return;
  }
  
  // Get default servers for each target
  const claudeCodeServers = getDefaultServersForContext(true);   // Exclude filesystem/github
  const claudeDesktopServers = getDefaultServersForContext(false); // Include all servers
  
  // Execute installation based on choice
  let agentsInstalled = false;
  
  // Install agents if requested
  if (choice.installAgents) {
    console.log("📁 Installing AI Agents...");
    agentsInstalled = await installAgents(__dirname);
    
    if (agentsInstalled) {
      console.log("✅ AI Agents installed successfully");
    } else {
      console.log("❌ AI Agents installation failed");
    }
  }
  
  // Install project MCP servers if requested
  if (choice.installProjectMCP) {
    console.log("\n⚙️  Configuring Project MCP Servers...");
    await createMCPJson(claudeCodeServers);
    console.log(`✅ Configured ${Object.keys(claudeCodeServers).length} MCP servers in .mcp.json`);
    
    // Safe handling of .env file
    console.log("\n🔐 Checking environment configuration...");
    const envExamplePath = join(__dirname, "../../.env.example");
    if (existsSync(envExamplePath)) {
      await safeHandleEnvFile(envExamplePath);
    } else {
      console.log("⚠️  .env.example not found in package");
    }
  }
  
  // Install desktop MCP servers if requested
  if (choice.installDesktopMCP) {
    // Backup existing config
    const configPath = getClaudeDesktopConfigPath();
    const backupPath = `${configPath}.backup.${Date.now()}`;
    const existingConfig = await loadConfig(configPath);
    if (existingConfig) {
      await saveConfig(backupPath, existingConfig);
      console.log(`📋 Backed up existing config to ${backupPath}`);
    }
    
    console.log("🖥️  Configuring Claude Desktop...");
    await addToClaudeDesktop(claudeDesktopServers);
    console.log("✅ Updated Claude Desktop configuration");
  }
  
  // Show completion summary based on what was actually installed
  console.log("\n✨ Installation Complete!\n");
  
  // Show agents status if requested
  if (choice.installAgents) {
    if (agentsInstalled) {
      console.log("🤖 AI Agents Installed:");
      console.log("  ✅ 9 specialized agent personalities in .claude/agents/");
      console.log("  ✅ Agent configuration in .claude/settings.local.json");
      console.log("  Run 'ai-agent-hub --list-agents' to see all agents\n");
    } else {
      console.log("❌ AI Agents Installation Failed:");
      console.log("  Could not install agent personalities");
      console.log("  Please check permissions and try again\n");
    }
  }
  
  // Show MCP server status
  if (choice.installProjectMCP || choice.installDesktopMCP) {
    console.log("⚙️  MCP Servers Configured:");
    console.log("  • memory - Persistent conversation memory");
    console.log("  • sequential-thinking - Step-by-step reasoning");
    console.log("  • context7 - Context management");
    console.log("  • playwright - Browser automation");
    console.log("  • supabase - Database integration (needs API key)");
    
    if (choice.installDesktopMCP) {
      console.log("  • filesystem - Local file operations");
      console.log("  • github - Repository access (needs API key)");
    }
    
    if (choice.installProjectMCP && choice.installDesktopMCP) {
      console.log("  Note: filesystem & github omitted from .mcp.json (Claude Code has native support)");
      console.log("        but added to Claude Desktop config for global use");
    }
    console.log("");
  }
  
  // Show environment configuration guidance if applicable
  if (choice.installProjectMCP) {
    await displayEnvironmentGuidance();
  }
  
  // Show restart instructions based on what was installed
  const needsRestartClaude = choice.installAgents || choice.installProjectMCP;
  const needsRestartDesktop = choice.installDesktopMCP;
  
  if (needsRestartClaude && needsRestartDesktop) {
    console.log("🔄 Next steps:");
    console.log("  • Restart Claude Code to activate project agents and servers");
    console.log("  • Restart Claude Desktop to activate desktop MCP servers");
  } else if (needsRestartClaude) {
    console.log("🔄 Restart Claude Code to activate agents and servers");
  } else if (needsRestartDesktop) {
    console.log("🔄 Restart Claude Desktop to activate MCP servers");
  }
}
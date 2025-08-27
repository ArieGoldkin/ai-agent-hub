/**
 * Default setup command - Installs agents and configures MCP servers
 */

import { existsSync } from "fs";
import { join } from "path";
import { getClaudeDesktopConfigPath } from "../../lib/paths.js";
import { loadConfig, saveConfig } from "../../lib/file-ops.js";
import { getDefaultServersForContext } from "../../lib/server-config.js";
import { addToClaudeDesktop, createMCPJson } from "../../lib/claude-ops.js";
import { safeHandleEnvFile } from "../../lib/env-handler.js";
import { isInProject, hasClaudeDesktop } from "../utils/detectors.js";
import { installAgents } from "./install-agents.js";

export async function setupDefault(__dirname: string): Promise<void> {
  console.log("🤖 AI Agent Hub - Installing AI Agents & MCP Servers\n");
  
  const inProject = isInProject();
  const hasDesktop = hasClaudeDesktop();
  
  if (!inProject && !hasDesktop) {
    console.error("❌ No Claude installation or project detected");
    console.log("   Please install Claude Desktop or run in a project directory");
    return;
  }
  
  // Get default servers for each target
  const claudeCodeServers = getDefaultServersForContext(true);   // Exclude filesystem/github
  const claudeDesktopServers = getDefaultServersForContext(false); // Include all servers
  
  // Configure based on context
  if (inProject) {
    console.log("📁 Project detected\n");
    
    // Install agents
    await installAgents(__dirname);
    
    // Configure MCP servers
    console.log("\n⚙️  Configuring MCP Servers...");
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
  
  if (hasDesktop) {
    // Backup existing config
    const configPath = getClaudeDesktopConfigPath();
    const backupPath = `${configPath}.backup.${Date.now()}`;
    const existingConfig = await loadConfig(configPath);
    if (existingConfig) {
      await saveConfig(backupPath, existingConfig);
      console.log(`📋 Backed up existing config to ${backupPath}`);
    }
    
    console.log("🖥️  Configuring Claude Desktop");
    await addToClaudeDesktop(claudeDesktopServers);
    console.log("✅ Updated Claude Desktop configuration");
  }
  
  // Show next steps
  console.log("\n✨ Setup complete!\n");
  
  // Highlight agents first
  console.log("🤖 AI Agents Installed:");
  console.log("  9 specialized agent personalities in .claude/agents/");
  console.log("  Run 'ai-agent-hub --list-agents' to see all agents\n");
  
  console.log("⚙️  MCP Servers Configured:");
  console.log("  • memory - Persistent conversation memory");
  console.log("  • sequential-thinking - Step-by-step reasoning");
  console.log("  • context7 - Context management");
  console.log("  • playwright - Browser automation");
  console.log("  • supabase - Database integration (needs API key)");
  if (!inProject) {
    console.log("  • filesystem - Local file operations");
    console.log("  • github - Repository access (needs API key)");
  } else if (inProject && hasDesktop) {
    console.log("  Note: filesystem & github omitted from .mcp.json (Claude Code has native support)");
    console.log("        but added to Claude Desktop config for global use");
  }
  console.log("");
  
  if (inProject && existsSync(".env")) {
    console.log("⚠️  Important: Add your API keys to .env:");
    console.log("   - GITHUB_TOKEN for GitHub access");
    console.log("   - SUPABASE_ACCESS_TOKEN for Supabase");
    console.log("   - Update YOUR_PROJECT_REF_HERE in .mcp.json for Supabase\n");
  }
  
  if (hasDesktop) {
    console.log("🔄 Restart Claude Desktop to activate agents and servers");
  } else {
    console.log("🔄 Restart Claude Code to activate agents and servers");
  }
}
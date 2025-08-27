#!/usr/bin/env node

/**
 * Simplified AI Agent Hub CLI
 * 
 * Single command interface for configuring MCP servers
 */

import { existsSync } from "fs";
import { mkdir, cp } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Import from modular files
import { getClaudeDesktopConfigPath } from "../lib/paths.js";
import { fileExists, loadConfig, saveConfig } from "../lib/file-ops.js";
import { getDefaultServersForContext, getServerByName, createServerConfig } from "../lib/server-config.js";
import { addToClaudeDesktop, createMCPJson, removeServer, listServers } from "../lib/claude-ops.js";
import { safeHandleEnvFile } from "../lib/env-handler.js";
import { MCP_TEMPLATES } from "../lib/mcp-templates.js";

// Simple argument parsing
const args = process.argv.slice(2);
const command = args[0];

// Helper to detect if we're in a project
function isInProject(): boolean {
  return existsSync("package.json") || existsSync(".git");
}

// Helper to detect Claude Desktop
function hasClaudeDesktop(): boolean {
  return existsSync(getClaudeDesktopConfigPath());
}

// Main CLI logic
async function main() {
  try {
    // Handle help
    if (command === "--help" || command === "-h") {
      console.log(`
🤖 AI Agent Hub - AI Agents & MCP Server Configuration

Highlights:
  • 9 specialized AI agent personalities for Claude
  • 7+ MCP servers for enhanced capabilities
  • Zero dependencies, instant setup

Usage:
  ai-agent-hub              Install agents & configure servers
  ai-agent-hub --list-agents  Show available AI agents
  ai-agent-hub --list       List configured servers
  ai-agent-hub <server>     Add a specific server
  ai-agent-hub --remove <server>  Remove a server
  ai-agent-hub --help       Show this help

AI Agents (Installed to .claude/agents/):
  • ai-ml-engineer     - AI/ML implementation expert
  • backend-architect  - System design specialist
  • quality-reviewer   - Code review automation
  • frontend-developer - UI/UX implementation
  • ui-designer        - Quick prototyping
  • sprint-prioritizer - Agile planning
  • And 3 more specialized agents!

MCP Servers (Auto-configured based on context):
  memory              Persistent conversation memory
  sequential-thinking Step-by-step reasoning
  context7            Context management (Upstash)
  playwright          Browser automation
  supabase            Database integration
  filesystem          Local file operations (Desktop only*)
  github              Repository access (Desktop only*)
  docker              Container management
  postgres            PostgreSQL access
  brave-search        Web search
  
  * Claude Code has native filesystem and GitHub support

Examples:
  ai-agent-hub              # Full setup with agents
  ai-agent-hub --list-agents  # See all agents
  ai-agent-hub supabase     # Add Supabase server
`);
      return;
    }

    // Handle list agents
    if (command === "--list-agents") {
      console.log("\n🤖 Available AI Agent Personalities:\n");
      console.log("1. ai-ml-engineer");
      console.log("   Expert in AI/ML implementation, LLMs, computer vision");
      console.log("");
      console.log("2. backend-system-architect");
      console.log("   System design, API architecture, scaling strategies");
      console.log("");
      console.log("3. code-quality-reviewer");
      console.log("   Automated code review, best practices enforcement");
      console.log("");
      console.log("4. frontend-ui-developer");
      console.log("   React/Vue/Angular, responsive design, accessibility");
      console.log("");
      console.log("5. rapid-ui-designer");
      console.log("   Quick prototyping, design systems, UI/UX");
      console.log("");
      console.log("6. sprint-prioritizer");
      console.log("   Agile planning, feature prioritization, roadmaps");
      console.log("");
      console.log("7. studio-coach");
      console.log("   Team coordination, motivation, peak performance");
      console.log("");
      console.log("8. ux-researcher");
      console.log("   User research, testing, journey mapping");
      console.log("");
      console.log("9. whimsy-injector");
      console.log("   Creative enhancement, delightful experiences");
      console.log("");
      console.log("These agents will be installed to .claude/agents/ when you run:");
      console.log("  npx ai-agent-hub\n");
      return;
    }

    // Handle list
    if (command === "--list") {
      const servers = await listServers();
      
      if (servers.desktop.length > 0) {
        console.log("\n📱 Claude Desktop servers:");
        servers.desktop.forEach(s => console.log(`  • ${s}`));
      }
      
      if (servers.code.length > 0) {
        console.log("\n💻 Claude Code servers (.mcp.json):");
        servers.code.forEach(s => console.log(`  • ${s}`));
      }
      
      if (servers.desktop.length === 0 && servers.code.length === 0) {
        console.log("\n❌ No servers configured yet");
        console.log("   Run 'ai-agent-hub' to set up default servers");
      }
      
      return;
    }

    // Handle remove
    if (command === "--remove" && args[1]) {
      const serverName = args[1];
      console.log(`🗑️  Removing ${serverName}...`);
      
      await removeServer(serverName);
      console.log(`✅ Removed ${serverName} from configurations`);
      return;
    }


    // Handle add specific server
    if (command && !command.startsWith("--")) {
      const template = MCP_TEMPLATES[command];
      if (!template) {
        console.error(`❌ Unknown server: ${command}`);
        console.log("   Run 'ai-agent-hub --help' to see available servers");
        return;
      }

      console.log(`➕ Adding ${command}...`);
      
      const config = createServerConfig(template);
      const servers = { [command]: config };
      
      // Add to appropriate targets
      const inProject = isInProject();
      const hasDesktop = hasClaudeDesktop();
      
      if (inProject) {
        await createMCPJson(servers);
        console.log(`✅ Added ${command} to .mcp.json`);
        
        // Check if server needs environment variables
        if (template.env) {
          console.log("\n🔐 Checking environment configuration...");
          const envExamplePath = join(__dirname, "../../.env.example");
          if (existsSync(envExamplePath)) {
            await safeHandleEnvFile(envExamplePath);
          }
        }
      }
      
      if (hasDesktop) {
        await addToClaudeDesktop(servers);
        console.log(`✅ Added ${command} to Claude Desktop`);
      }
      
      if (!inProject && !hasDesktop) {
        console.log("⚠️  No Claude configuration found");
        console.log("   Please install Claude Desktop or run in a project directory");
      }
      
      return;
    }

    // Default: Setup with agents and servers
    console.log("🤖 AI Agent Hub - Installing AI Agents & MCP Servers\n");
    
    const inProject = isInProject();
    const hasDesktop = hasClaudeDesktop();
    
    if (!inProject && !hasDesktop) {
      console.error("❌ No Claude installation or project detected");
      console.log("   Please install Claude Desktop or run in a project directory");
      return;
    }
    
    // Get default servers for each target
    // Claude Code (in project) doesn't need filesystem/github as it has native support
    // Claude Desktop always gets all servers for global use
    const claudeCodeServers = getDefaultServersForContext(true);   // Exclude filesystem/github
    const claudeDesktopServers = getDefaultServersForContext(false); // Include all servers
    
    // Configure based on context
    if (inProject) {
      console.log("📁 Project detected\n");
      
      // PRIORITY 1: Install agent personalities
      console.log("🤖 Installing AI Agent Personalities...");
      
      // Create .claude directory if it doesn't exist
      if (!existsSync(".claude")) {
        await mkdir(".claude", { recursive: true });
      }
      
      // Check and install agents
      if (!existsSync(".claude/agents")) {
        await mkdir(".claude/agents", { recursive: true });
        
        if (existsSync(join(__dirname, "../../agents"))) {
          await cp(join(__dirname, "../../agents"), ".claude/agents", { recursive: true });
          console.log("✅ Installed 9 AI agent personalities:");
          console.log("   • ai-ml-engineer - AI/ML implementation expert");
          console.log("   • backend-system-architect - System design specialist");
          console.log("   • code-quality-reviewer - Code review automation");
          console.log("   • frontend-ui-developer - UI/UX implementation");
          console.log("   • rapid-ui-designer - Quick UI prototyping");
          console.log("   • sprint-prioritizer - Agile planning assistant");
          console.log("   • studio-coach - Team coordination");
          console.log("   • ux-researcher - User research & testing");
          console.log("   • whimsy-injector - Creative enhancement");
        }
      } else {
        console.log("✅ Agents already installed in .claude/agents/");
      }
      
      // Create settings.local.json
      const settingsPath = ".claude/settings.local.json";
      if (!existsSync(settingsPath)) {
        const settings = {
          agentPersonalities: {
            enabled: true,
            directory: "./agents"
          }
        };
        await saveConfig(settingsPath, settings);
        console.log("✅ Created agent configuration file");
      }
      
      // PRIORITY 2: Configure MCP servers
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
      // Only show these for Claude Desktop (when not in a project)
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
    
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
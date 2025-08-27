/**
 * Install agents - Installs AI agent personalities to .claude/agents/
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, cp } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { saveConfig } from "../../lib/file-ops.js";
import { getClaudeSettingsPath } from "../../lib/paths.js";

// Get the actual package root directory
async function findPackageRoot(currentDir: string): Promise<string> {
  // Multiple potential paths when run via NPX vs local
  const possiblePaths = [
    join(currentDir, "../../agents"),      // Local development
    join(currentDir, "../../../agents"),   // Some NPX scenarios
    join(currentDir, "../../../../agents"), // Deep NPX cache
  ];
  
  // Also try finding from node_modules structure
  let checkDir = currentDir;
  while (checkDir !== dirname(checkDir)) {
    const agentsPath = join(checkDir, "agents");
    const packageJsonPath = join(checkDir, "package.json");
    
    if (existsSync(agentsPath) && existsSync(packageJsonPath)) {
      try {
        // Use fs.readFileSync instead of require for ESM compatibility
        const { readFileSync } = await import('fs');
        const packageContent = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        if (packageContent.name === "ai-agent-hub") {
          return agentsPath;
        }
      } catch (error) {
        // Ignore JSON parse errors and continue searching
      }
    }
    checkDir = dirname(checkDir);
  }
  
  // Fallback to the original paths
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  throw new Error(`Cannot locate agents directory from ${currentDir}`);
}

export async function installAgents(__dirname: string): Promise<boolean> {
  console.log("🤖 Installing AI Agent Personalities...");

  try {
    // Create .claude directory if it doesn't exist
    if (!existsSync(".claude")) {
      await mkdir(".claude", { recursive: true });
    }

    // Check and install agents
    if (!existsSync(".claude/agents")) {
      await mkdir(".claude/agents", { recursive: true });

      // Find the agents directory
      const agentsPath = await findPackageRoot(__dirname);
      console.log(`📁 Found agents at: ${agentsPath}`);
      
      // Verify agents exist
      const agentFiles = readdirSync(agentsPath).filter(f => f.endsWith('.md'));
      if (agentFiles.length === 0) {
        throw new Error(`No agent files found in ${agentsPath}`);
      }
      
      // Copy agents
      await cp(agentsPath, ".claude/agents", {
        recursive: true
      });
      
      // Verify files were actually copied
      const copiedFiles = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
      if (copiedFiles.length !== agentFiles.length) {
        throw new Error(`File copy failed: expected ${agentFiles.length} files, got ${copiedFiles.length}`);
      }
      
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
      
      // Create settings.local.json with proper Claude Code settings
      // enableAllProjectMcpServers: automatically enables all MCP servers in .mcp.json
      const settingsConfig = {
        "enableAllProjectMcpServers": true
      };
      
      const settingsPath = getClaudeSettingsPath();
      await saveConfig(settingsPath, settingsConfig);
      console.log("📝 Created Claude Code settings in .claude/settings.local.json");
      
      return true;
    } else {
      // Verify existing installation
      const existingFiles = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
      if (existingFiles.length >= 9) {
        console.log("✅ Agents already installed in .claude/agents/");
        return true;
      } else {
        console.log(`⚠️  Only ${existingFiles.length} agents found, expected 9. Reinstalling...`);
        // Remove partial installation and retry
        const { rm } = await import('fs/promises');
        await rm(".claude/agents", { recursive: true, force: true });
        return await installAgents(__dirname); // Recursive call to reinstall
      }
    }
  } catch (error) {
    console.error("❌ Failed to install agents:", error instanceof Error ? error.message : error);
    return false;
  }
}

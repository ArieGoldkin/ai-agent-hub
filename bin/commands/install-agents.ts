/**
 * Install agents - Installs AI agent personalities and session infrastructure
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, cp, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { saveConfig } from "../../lib/file-ops.js";
import { getClaudeSettingsPath } from "../../lib/paths.js";

// Get the actual package root directory
async function findPackageRoot(currentDir: string): Promise<string> {
  // Multiple potential paths when run via NPX vs local
  const possiblePaths = [
    join(currentDir, "../.."),      // Local development
    join(currentDir, "../../.."),   // Some NPX scenarios
    join(currentDir, "../../../.."), // Deep NPX cache
  ];
  
  // Also try finding from node_modules structure
  let checkDir = currentDir;
  while (checkDir !== dirname(checkDir)) {
    const packageJsonPath = join(checkDir, "package.json");
    
    if (existsSync(packageJsonPath)) {
      try {
        // Use fs.readFileSync instead of require for ESM compatibility
        const { readFileSync } = await import('fs');
        const packageContent = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        if (packageContent.name === "ai-agent-hub") {
          return checkDir;
        }
      } catch (error) {
        // Ignore JSON parse errors and continue searching
      }
    }
    checkDir = dirname(checkDir);
  }
  
  // Fallback to the original paths
  for (const path of possiblePaths) {
    if (existsSync(join(path, "package.json"))) {
      try {
        const { readFileSync } = await import('fs');
        const packageContent = JSON.parse(readFileSync(join(path, "package.json"), 'utf-8'));
        if (packageContent.name === "ai-agent-hub") {
          return path;
        }
      } catch (error) {
        // Continue searching
      }
    }
  }
  
  throw new Error(`Cannot locate ai-agent-hub package root from ${currentDir}`);
}

/**
 * Install session templates from package to project
 */
async function installSessionTemplates(packageRoot: string): Promise<void> {
  const templatesSource = join(packageRoot, ".claude", "session-templates");
  const templatesTarget = ".claude/session-templates";
  
  if (!existsSync(templatesSource)) {
    console.log("⚠️  Session templates not found in package, skipping");
    return;
  }
  
  if (!existsSync(templatesTarget)) {
    await mkdir(templatesTarget, { recursive: true });
    
    // Copy all template files
    await cp(templatesSource, templatesTarget, {
      recursive: true
    });
    
    // Verify templates were copied
    const templateFiles = readdirSync(templatesTarget).filter(f => f.endsWith('.json'));
    console.log(`📋 Installed ${templateFiles.length} session templates:`);
    templateFiles.forEach(file => {
      const name = file.replace('.json', '').replace('-', ' ');
      console.log(`   • ${name} workflow template`);
    });
  } else {
    console.log("✅ Session templates already installed");
  }
}

/**
 * Initialize session infrastructure files
 */
async function initializeSessionInfrastructure(): Promise<void> {
  console.log("🔧 Initializing session infrastructure...");
  
  // Create session-archive.json if it doesn't exist
  const archivePath = ".claude/session-archive.json";
  if (!existsSync(archivePath)) {
    await writeFile(archivePath, JSON.stringify([], null, 2));
    console.log("📊 Created session archive: .claude/session-archive.json");
  }
  
  // Create placeholder session-context.json
  const contextPath = ".claude/session-context.json";
  if (!existsSync(contextPath)) {
    await writeFile(contextPath, "null");
    console.log("📝 Initialized session context: .claude/session-context.json");
  }
  
  console.log("✅ Session infrastructure ready");
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

      // Find the package root directory
      const packageRoot = await findPackageRoot(__dirname);
      const agentsPath = join(packageRoot, "agents");
      console.log(`📁 Found package at: ${packageRoot}`);
      
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
      
      // Install session templates
      await installSessionTemplates(packageRoot);
      
      // Initialize session infrastructure
      await initializeSessionInfrastructure();
      
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

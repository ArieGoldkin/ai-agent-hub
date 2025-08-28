/**
 * Install agents - Simplified agent installer
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, cp, writeFile } from "fs/promises";
import { join, dirname } from "path";

/**
 * Find the package root directory containing agents
 */
async function findPackageRoot(currentDir: string): Promise<string> {
  // Check common paths for agents directory
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
 * Install agents and session infrastructure
 */
export async function installAgents(__dirname: string): Promise<boolean> {
  console.log("🤖 Installing AI Agent Personalities...");

  try {
    // Create .claude directory
    if (!existsSync(".claude")) {
      await mkdir(".claude", { recursive: true });
    }

    // Install agents if not present
    if (!existsSync(".claude/agents")) {
      await mkdir(".claude/agents", { recursive: true });

      // Find package root
      const packageRoot = await findPackageRoot(__dirname);
      const agentsPath = join(packageRoot, "agents");
      console.log(`📁 Found package at: ${packageRoot}`);
      
      // Copy agents
      await cp(agentsPath, ".claude/agents", {
        recursive: true
      });
      
      // Verify installation
      const copiedFiles = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
      if (copiedFiles.length < 9) {
        throw new Error(`Only ${copiedFiles.length} agents copied, expected 9`);
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
    } else {
      console.log("✅ Agents already installed");
    }
    
    // Install session templates
    const templatesDir = ".claude/session-templates";
    if (!existsSync(templatesDir)) {
      await mkdir(templatesDir, { recursive: true });
      
      // Create basic workflow templates
      const templates = [
        { name: "feature-development", description: "New feature workflow" },
        { name: "bug-fix", description: "Bug resolution workflow" },
        { name: "refactoring", description: "Code improvement workflow" },
        { name: "performance-optimization", description: "Performance tuning workflow" }
      ];
      
      for (const template of templates) {
        const content = {
          name: template.name,
          description: template.description,
          phases: ["analyze", "design", "implement", "review"]
        };
        await writeFile(
          join(templatesDir, `${template.name}.json`),
          JSON.stringify(content, null, 2)
        );
      }
      
      console.log(`📋 Installed ${templates.length} session templates`);
    }
    
    // Initialize session infrastructure
    console.log("🔧 Initializing session infrastructure...");
    
    const archivePath = ".claude/session-archive.json";
    if (!existsSync(archivePath)) {
      await writeFile(archivePath, JSON.stringify([], null, 2));
      console.log("📊 Created session archive: .claude/session-archive.json");
    }
    
    const contextPath = ".claude/session-context.json";
    if (!existsSync(contextPath)) {
      await writeFile(contextPath, "null");
      console.log("📝 Initialized session context: .claude/session-context.json");
    }
    
    // Create Claude Code settings
    const settingsPath = ".claude/settings.local.json";
    if (!existsSync(settingsPath)) {
      const settings = {
        "enableAllProjectMcpServers": true
      };
      await writeFile(settingsPath, JSON.stringify(settings, null, 2));
      console.log("📝 Created Claude Code settings in .claude/settings.local.json");
    }
    
    console.log("✅ Session infrastructure ready");
    return true;
    
  } catch (error) {
    console.error("❌ Failed to install agents:", error instanceof Error ? error.message : error);
    return false;
  }
}
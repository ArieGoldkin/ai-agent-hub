/**
 * Install agents - Simplified agent installer
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, writeFile, readFile } from "fs/promises";
import { join } from "path";

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

    // Create agents directory if not present
    if (!existsSync(".claude/agents")) {
      await mkdir(".claude/agents", { recursive: true });
    }

    // Find package root
    const packageRoot = await findPackageRoot(__dirname);
    const agentsPath = join(packageRoot, "agents");
    console.log(`📁 Found package at: ${packageRoot}`);
    
    // Define the required AI Agent Hub agents
    const requiredAgents = [
      'ai-ml-engineer.md',
      'backend-system-architect.md',
      'code-quality-reviewer.md',
      'frontend-ui-developer.md',
      'rapid-ui-designer.md',
      'sprint-prioritizer.md',
      'studio-coach.md',
      'ux-researcher.md',
      'whimsy-injector.md'
    ];
    
    // Check existing agents
    const existingAgents = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
    const existingAgentNames = new Set(existingAgents);
    
    // Find missing required agents
    const missingAgents = requiredAgents.filter(agent => !existingAgentNames.has(agent));
    
    if (missingAgents.length === 0) {
      console.log("✅ All 9 AI Agent Hub personalities already installed");
      if (existingAgents.length > 9) {
        const customCount = existingAgents.length - 9;
        console.log(`   📌 Plus ${customCount} custom agent(s) preserved`);
      }
    } else {
      // Copy only missing agents
      console.log(`📦 Installing ${missingAgents.length} missing AI Agent Hub personalities...`);
      
      for (const agentFile of missingAgents) {
        const sourcePath = join(agentsPath, agentFile);
        const destPath = join(".claude/agents", agentFile);
        
        if (existsSync(sourcePath)) {
          const content = await readFile(sourcePath);
          await writeFile(destPath, content);
        }
      }
      
      console.log(`✅ Installed ${missingAgents.length} AI agent personalities:`);
      
      // Show what was added
      const agentDescriptions: Record<string, string> = {
        'ai-ml-engineer.md': 'AI/ML implementation expert',
        'backend-system-architect.md': 'System design specialist',
        'code-quality-reviewer.md': 'Code review automation',
        'frontend-ui-developer.md': 'UI/UX implementation',
        'rapid-ui-designer.md': 'Quick UI prototyping',
        'sprint-prioritizer.md': 'Agile planning assistant',
        'studio-coach.md': 'Team coordination',
        'ux-researcher.md': 'User research & testing',
        'whimsy-injector.md': 'Creative enhancement'
      };
      
      for (const agent of missingAgents) {
        console.log(`   • ${agent.replace('.md', '')} - ${agentDescriptions[agent] || 'Specialized agent'}`);
      }
      
      // Report on preserved custom agents
      const customAgents = existingAgents.filter(a => !requiredAgents.includes(a));
      if (customAgents.length > 0) {
        console.log(`📌 Preserved ${customAgents.length} existing custom agent(s):`);
        for (const agent of customAgents) {
          console.log(`   • ${agent.replace('.md', '')}`);
        }
      }
    }
    
    // Create Claude Code settings
    const settingsPath = ".claude/settings.local.json";
    if (!existsSync(settingsPath)) {
      const settings = {
        "enableAllProjectMcpServers": true
      };
      await writeFile(settingsPath, JSON.stringify(settings, null, 2));
      console.log("✅ Created Claude Code settings in .claude/settings.local.json");
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Failed to install agents:", error instanceof Error ? error.message : error);
    return false;
  }
}
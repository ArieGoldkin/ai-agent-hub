/**
 * Install agents - Installs AI agent personalities to .claude/agents/
 */

import { existsSync } from "fs";
import { mkdir, cp } from "fs/promises";
import { join } from "path";
import { saveConfig } from "../../lib/file-ops.js";

export async function installAgents(__dirname: string): Promise<void> {
  console.log("🤖 Installing AI Agent Personalities...");

  // Create .claude directory if it doesn't exist
  if (!existsSync(".claude")) {
    await mkdir(".claude", { recursive: true });
  }

  // Check and install agents
  if (!existsSync(".claude/agents")) {
    await mkdir(".claude/agents", { recursive: true });

    if (existsSync(join(__dirname, "../../agents"))) {
      await cp(join(__dirname, "../../agents"), ".claude/agents", {
        recursive: true
      });
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
}

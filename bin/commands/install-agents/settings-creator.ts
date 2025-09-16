/**
 * Claude settings creator
 */

import { existsSync } from "fs";
import { writeFile } from "fs/promises";

/**
 * Create Claude Code settings file
 */
export async function createClaudeSettings(): Promise<void> {
  const settingsPath = ".claude/settings.local.json";
  if (!existsSync(settingsPath)) {
    const settings = {
      "enableAllProjectMcpServers": true
    };
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
    console.log("✅ Created Claude Code settings in .claude/settings.local.json");
  }
}
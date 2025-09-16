/**
 * Context instruction appender for agents
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Append context instructions to all installed agents
 */
export async function appendContextInstructions(packageRoot: string): Promise<void> {
  const contextInstructionsPath = join(packageRoot, "assets", "context-instructions.md");
  const agentsDir = ".claude/agents";

  try {
    // Check if context instructions exist
    if (!existsSync(contextInstructionsPath)) {
      console.log("   Context instructions not found (building inline)");
      return;
    }

    // Read context instructions
    const contextInstructions = readFileSync(contextInstructionsPath, 'utf-8');

    // Get all agent files
    const fs = await import('fs');
    const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));

    let updatedCount = 0;

    for (const agentFile of agentFiles) {
      const agentPath = join(agentsDir, agentFile);
      let content = readFileSync(agentPath, 'utf-8');

      // Check if context instructions are already present
      if (content.includes('## MANDATORY CONTEXT AWARENESS')) {
        continue; // Already has context instructions
      }

      // Append context instructions at the end
      content += '\n\n' + contextInstructions;

      // Write back
      writeFileSync(agentPath, content);
      updatedCount++;
    }

    if (updatedCount > 0) {
      console.log(`✅ Added context awareness to ${updatedCount} agents`);
    }

  } catch {
    // Silent fail - context instructions are enhancement
    console.log("   Context instruction enhancement skipped");
  }
}

/**
 * Ensure agents have context-aware metadata in frontmatter
 */
export function ensureContextAwareFrontmatter(agentPath: string): void {
  try {
    let content = readFileSync(agentPath, 'utf-8');

    // Check if already has context_aware in frontmatter
    if (content.includes('context_aware:')) {
      return;
    }

    // Add context_aware: true to frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd > 0) {
      const beforeEnd = content.substring(0, frontmatterEnd);
      const afterEnd = content.substring(frontmatterEnd);

      // Insert context_aware before the closing ---
      content = beforeEnd + 'context_aware: true\n' + afterEnd;
      writeFileSync(agentPath, content);
    }
  } catch {
    // Silent fail for individual files
  }
}
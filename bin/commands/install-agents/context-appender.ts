/**
 * Context instruction appender for agents
 */

import { readFileSync, writeFileSync } from "fs";

/**
 * Append context instructions to all installed agents
 * Note: Context awareness is now embedded via intelligent agent templates
 * This function is kept for backward compatibility but mostly no-ops
 */
export async function appendContextInstructions(_packageRoot: string): Promise<void> {
  // Context awareness is now handled by intelligent agent templates
  // during generation, not by appending a separate file.
  // The modular system puts context instructions in .claude/instructions/context.md
  // This function is kept for backward compatibility.
  return;
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
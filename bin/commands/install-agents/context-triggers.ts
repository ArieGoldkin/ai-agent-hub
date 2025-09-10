/**
 * Context triggers installer
 */

import { existsSync } from "fs";
import { copyFile } from "fs/promises";
import { join } from "path";

/**
 * Copy context triggers file for automatic agent invocation
 * Works for both Classic and Squad modes
 */
export async function copyContextTriggers(packageRoot: string): Promise<void> {
  const sourceFile = join(packageRoot, "assets", "context-triggers.md");
  const targetFile = ".claude/context-triggers.md";
  
  try {
    if (existsSync(sourceFile)) {
      await copyFile(sourceFile, targetFile);
      console.log("✅ Installed context triggers for automatic agent invocation");
    }
  } catch {
    // Silent fail - context triggers are optional enhancement
    console.log("   Context triggers not found (optional feature)");
  }
}
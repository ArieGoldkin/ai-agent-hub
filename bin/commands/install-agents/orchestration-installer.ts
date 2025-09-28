/**
 * Orchestration system installer
 * Installs the intelligent routing and orchestration instructions
 */

import { existsSync } from "fs";
import { mkdir, copyFile } from "fs/promises";
import { join } from "path";

/**
 * Install orchestration instruction files
 */
export async function installOrchestrationInstructions(packageRoot: string): Promise<void> {
  const instructionsDir = '.claude/instructions';

  try {
    // Ensure instructions directory exists
    if (!existsSync(instructionsDir)) {
      await mkdir(instructionsDir, { recursive: true });
    }

    // Define instruction files to copy
    const instructionFiles = [
      'orchestration.md',
      'agents.md',
      'context.md',
      'workflows.md',
      'cli-integration.md'
    ];

    // Copy each instruction file from assets
    for (const file of instructionFiles) {
      const sourcePath = join(packageRoot, 'assets', 'instructions', file);
      const targetPath = join(instructionsDir, file);

      if (existsSync(sourcePath) && !existsSync(targetPath)) {
        await copyFile(sourcePath, targetPath);
        console.log(`   ✅ Installed ${file}`);
      }
    }

    console.log('📚 Orchestration instructions installed');

  } catch {
    // Instructions are optional - don't fail installation
    console.log('   Orchestration instructions setup skipped (optional feature)');
  }
}
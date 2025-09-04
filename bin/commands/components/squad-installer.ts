/**
 * Squad infrastructure installer
 */

import { existsSync, readdirSync } from "fs";
import { mkdir, writeFile, readFile, cp } from "fs/promises";
import { join } from "path";

/**
 * Install Squad mode infrastructure files
 */
export async function installSquadInfrastructure(packageRoot: string): Promise<void> {
  console.log("📦 Installing Squad mode infrastructure...");
  
  try {
    await installSquadCommands(packageRoot);
    await installSquadRules(packageRoot);
    await installSquadExamples(packageRoot);
    await installSquadInfraFiles(packageRoot);
    
    console.log("✅ Squad mode infrastructure installed");
    console.log("   • Parallel execution commands");
    console.log("   • Conflict prevention rules");
    console.log("   • Communication protocols");
    console.log("   • Test scenarios and examples");
    
  } catch (error) {
    console.error("⚠️  Failed to install Squad infrastructure:", error);
    // Non-fatal - Squad mode can still work without these extras
  }
}

/**
 * Install Squad command files
 */
async function installSquadCommands(packageRoot: string): Promise<void> {
  const commandsDir = ".claude/commands";
  if (!existsSync(commandsDir)) {
    await mkdir(commandsDir, { recursive: true });
  }
  
  const squadCommandsPath = join(packageRoot, ".squad", "commands");
  if (existsSync(squadCommandsPath)) {
    const commandFiles = readdirSync(squadCommandsPath).filter(f => f.endsWith('.md'));
    console.log(`   📋 Installing ${commandFiles.length} parallel execution commands...`);
    
    for (const cmdFile of commandFiles) {
      const sourcePath = join(squadCommandsPath, cmdFile);
      const destPath = join(commandsDir, cmdFile);
      const content = await readFile(sourcePath);
      await writeFile(destPath, content);
    }
  }
}

/**
 * Install Squad rules
 */
async function installSquadRules(packageRoot: string): Promise<void> {
  const squadRulesPath = join(packageRoot, ".squad", "parallel-execution-rules.md");
  if (existsSync(squadRulesPath)) {
    const destPath = ".claude/parallel-execution-rules.md";
    const content = await readFile(squadRulesPath);
    await writeFile(destPath, content);
    console.log("   📋 Installed parallel execution rules");
  }
}

/**
 * Install Squad examples
 */
async function installSquadExamples(packageRoot: string): Promise<void> {
  const squadExamplesPath = join(packageRoot, ".squad", "examples");
  if (existsSync(squadExamplesPath)) {
    const examplesDir = ".claude/examples";
    if (!existsSync(examplesDir)) {
      await mkdir(examplesDir, { recursive: true });
    }
    await cp(squadExamplesPath, examplesDir, { recursive: true });
    console.log("   📋 Installed parallel execution examples");
  }
}

/**
 * Install Squad infrastructure files
 */
async function installSquadInfraFiles(packageRoot: string): Promise<void> {
  const squadInfraFiles = [
    'supervisor-rules.md',
    'squad-roster.md', 
    'communication-protocol.md',
    'architecture-decisions.md'
  ];
  
  for (const file of squadInfraFiles) {
    const sourcePath = join(packageRoot, ".squad", file);
    if (existsSync(sourcePath)) {
      const destPath = join(".claude", file);
      const content = await readFile(sourcePath);
      await writeFile(destPath, content);
    }
  }
}
/**
 * Mode migration utilities for switching between Classic and Squad modes
 */

import fs from "fs";
import path from "path";
import chalk from "chalk";
import { validateSquadPrerequisites, backupCurrentMode } from "../utils/migration-helpers.js";

// Re-export utility functions
export { convertToSquadTasks, estimateTokenCost } from "../utils/mode-helpers.js";
export { validateSquadPrerequisites, backupCurrentMode, rollbackMode } from "../utils/migration-helpers.js";

interface ModeConfig {
  mode: string;
  timestamp: string;
  version: string;
}

interface MigrationResult {
  success: boolean;
  fromMode: string;
  toMode: string;
  backupPath?: string;
  errors?: string[];
}

/**
 * Migrate from Classic to Squad mode
 */
export async function migrateToSquad(): Promise<MigrationResult> {
  const errors: string[] = [];
  
  try {
    // Validate prerequisites
    const validation = validateSquadPrerequisites();
    if (!validation.valid) {
      return {
        success: false,
        fromMode: 'classic',
        toMode: 'squad',
        errors: [`Missing Squad prerequisites: ${validation.missing.join(', ')}`]
      };
    }
    
    // Backup current configuration
    const backupPath = await backupCurrentMode();
    console.log(chalk.green(`✅ Backed up current configuration to: ${backupPath}`));
    
    // Update mode configuration
    const modeConfig: ModeConfig = {
      mode: 'squad',
      timestamp: new Date().toISOString(),
      version: "3.0.6"
    };
    
    const modeFile = path.join(process.cwd(), '.ai-hub', 'current-mode.json');
    fs.writeFileSync(modeFile, JSON.stringify(modeConfig, null, 2));
    
    // Create Squad session directories
    const sessionDirs = [
      '.squad/sessions',
      '.squad/sessions/active',
      '.squad/sessions/archived'
    ];
    
    for (const dir of sessionDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }
    
    // Initialize session status file
    const sessionStatusPath = path.join(process.cwd(), '.squad/sessions/session-status.md');
    if (!fs.existsSync(sessionStatusPath)) {
      const initialStatus = `# Squad Session Status

## Active Sessions
None

## Configuration
- Mode: Squad
- Token Limit: 100,000 per session
- Max Concurrent Agents: 4
- Initialized: ${new Date().toISOString()}
`;
      fs.writeFileSync(sessionStatusPath, initialStatus);
    }
    
    console.log(chalk.green("✅ Successfully migrated to Squad mode"));
    console.log(chalk.cyan("   - Slim templates enabled (97% token reduction)"));
    console.log(chalk.cyan("   - Parallel execution enabled"));
    console.log(chalk.cyan("   - Supervisor pattern active"));
    
    return {
      success: true,
      fromMode: 'classic',
      toMode: 'squad',
      backupPath
    };
    
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      success: false,
      fromMode: 'classic',
      toMode: 'squad',
      errors
    };
  }
}

/**
 * Migrate from Squad to Classic mode
 */
export async function migrateToClassic(): Promise<MigrationResult> {
  const errors: string[] = [];
  
  try {
    // Backup current configuration
    const backupPath = await backupCurrentMode();
    console.log(chalk.green(`✅ Backed up current configuration to: ${backupPath}`));
    
    // Update mode configuration
    const modeConfig: ModeConfig = {
      mode: 'classic',
      timestamp: new Date().toISOString(),
      version: "3.0.6"
    };
    
    const modeFile = path.join(process.cwd(), '.ai-hub', 'current-mode.json');
    fs.writeFileSync(modeFile, JSON.stringify(modeConfig, null, 2));
    
    // Archive any active squad sessions
    const activeSessionsPath = path.join(process.cwd(), '.squad/sessions/active');
    const archivedSessionsPath = path.join(process.cwd(), '.squad/sessions/archived');
    
    if (fs.existsSync(activeSessionsPath)) {
      const sessions = fs.readdirSync(activeSessionsPath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      for (const session of sessions) {
        const sourcePath = path.join(activeSessionsPath, session);
        const destPath = path.join(archivedSessionsPath, `${timestamp}-${session}`);
        
        if (fs.statSync(sourcePath).isFile()) {
          fs.renameSync(sourcePath, destPath);
        }
      }
      
      if (sessions.length > 0) {
        console.log(chalk.yellow(`⚠️  Archived ${sessions.length} active Squad sessions`));
      }
    }
    
    console.log(chalk.green("✅ Successfully migrated to Classic mode"));
    console.log(chalk.cyan("   - Full agent prompts restored"));
    console.log(chalk.cyan("   - Sequential execution enabled"));
    console.log(chalk.cyan("   - Simple workflow active"));
    
    return {
      success: true,
      fromMode: 'squad',
      toMode: 'classic',
      backupPath
    };
    
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      success: false,
      fromMode: 'squad',
      toMode: 'classic',
      errors
    };
  }
}
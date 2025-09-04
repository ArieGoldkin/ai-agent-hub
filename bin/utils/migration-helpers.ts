/**
 * Migration helper functions
 */

import fs from "fs";
import path from "path";
import chalk from "chalk";
import { copyDirectory } from "./mode-helpers.js";

/**
 * Validate Squad mode prerequisites
 */
export function validateSquadPrerequisites(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  const requiredPaths = [
    '.squad/templates',
    '.squad/analysis',
    '.squad/supervisor-rules.md',
    '.squad/communication-protocol.md',
    '.squad/squad-roster.md'
  ];
  
  for (const reqPath of requiredPaths) {
    if (!fs.existsSync(path.join(process.cwd(), reqPath))) {
      missing.push(reqPath);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Backup current mode configuration
 */
export async function backupCurrentMode(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), '.ai-hub', 'backups');
  const backupPath = path.join(backupDir, `mode-backup-${timestamp}`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Copy current mode files
  const filesToBackup = [
    '.ai-hub/current-mode.json',
    '.claude/agents',
    '.claude/settings.local.json'
  ];
  
  for (const file of filesToBackup) {
    const sourcePath = path.join(process.cwd(), file);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(backupPath, file);
      const destDir = path.dirname(destPath);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Copy file or directory
      const stat = fs.statSync(sourcePath);
      if (stat.isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }
  
  return backupPath;
}

/**
 * Rollback to previous mode using backup
 */
export async function rollbackMode(backupPath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(backupPath)) {
      console.error(chalk.red(`❌ Backup path not found: ${backupPath}`));
      return false;
    }
    
    // Restore files from backup
    const filesToRestore = [
      '.ai-hub/current-mode.json',
      '.claude/agents',
      '.claude/settings.local.json'
    ];
    
    for (const file of filesToRestore) {
      const sourcePath = path.join(backupPath, file);
      const destPath = path.join(process.cwd(), file);
      
      if (fs.existsSync(sourcePath)) {
        // Remove existing
        if (fs.existsSync(destPath)) {
          const stat = fs.statSync(destPath);
          if (stat.isDirectory()) {
            fs.rmSync(destPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(destPath);
          }
        }
        
        // Restore from backup
        const stat = fs.statSync(sourcePath);
        if (stat.isDirectory()) {
          copyDirectory(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }
    
    console.log(chalk.green(`✅ Successfully rolled back from backup: ${backupPath}`));
    return true;
    
  } catch (error) {
    console.error(chalk.red(`❌ Rollback failed: ${error instanceof Error ? error.message : error}`));
    return false;
  }
}
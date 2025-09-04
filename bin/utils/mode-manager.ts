/**
 * Mode management utilities
 */

import fs from "fs";
import path from "path";

interface ModeConfig {
  mode: string;
  timestamp: string;
  version: string;
}

/**
 * Load current mode from file
 */
export function loadCurrentMode(modeFile: string): string {
  if (fs.existsSync(modeFile)) {
    try {
      const modeData = JSON.parse(fs.readFileSync(modeFile, 'utf-8'));
      return modeData.mode || 'classic';
    } catch {
      return 'classic';
    }
  }
  return 'classic';
}

/**
 * Save mode selection to file
 */
export function saveMode(mode: string, version: string): void {
  const modeDir = path.join(process.cwd(), '.ai-hub');
  const modeFile = path.join(modeDir, 'current-mode.json');
  
  if (!fs.existsSync(modeDir)) {
    fs.mkdirSync(modeDir, { recursive: true });
  }
  
  const modeConfig: ModeConfig = {
    mode,
    timestamp: new Date().toISOString(),
    version
  };
  
  fs.writeFileSync(modeFile, JSON.stringify(modeConfig, null, 2));
}
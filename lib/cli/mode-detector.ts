import fs from 'fs';
import path from 'path';
import { loadCurrentMode, saveMode } from '../../bin/utils/mode-manager.js';

export async function handleModeSelection(
  requestedMode: string | null,
  validModes: string[],
  currentModeFile: string
): Promise<string> {
  let selectedMode = 'classic'; // Default mode
  
  // Load existing mode if available
  if (!requestedMode) {
    selectedMode = loadCurrentMode(currentModeFile);
  }
  
  // Override with requested mode if valid
  if (requestedMode) {
    if (!validModes.includes(requestedMode)) {
      console.error(`❌ Invalid mode: ${requestedMode}. Valid modes are: ${validModes.join(', ')}`);
      process.exit(1);
    }
    selectedMode = requestedMode;
    saveMode(selectedMode, "3.0.6");
    console.log(`\n📋 Mode set to: ${selectedMode.toUpperCase()}`);
  }
  
  // Auto mode detection
  if (selectedMode === 'auto') {
    selectedMode = await detectOptimalMode();
    console.log(`🔍 Auto-detected optimal mode: ${selectedMode.toUpperCase()}`);
  }
  
  return selectedMode;
}

export async function detectOptimalMode(): Promise<string> {
  try {
    // Check if squad prerequisites exist in the package (not the current directory)
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const packageRoot = path.join(currentDir, '..', '..');
    const squadTemplatesExist = fs.existsSync(path.join(packageRoot, '.squad', 'templates'));
    const squadAnalysisExist = fs.existsSync(path.join(packageRoot, '.squad', 'analysis'));
    
    const projectFileCount = countProjectFiles(process.cwd());
    
    // Detection rules
    if (!squadTemplatesExist || !squadAnalysisExist) {
      return 'classic';
    }
    
    if (projectFileCount < 10) {
      return 'classic';
    }
    
    if (projectFileCount > 50) {
      return 'squad';
    }
    
    return 'classic';
    
  } catch {
    return 'classic';
  }
}

function countProjectFiles(dir: string, count = 0): number {
  if (!fs.existsSync(dir)) return count;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    // Skip common non-project directories
    if (stat.isDirectory() && ['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
      continue;
    }
    
    if (stat.isFile() && ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go'].some(ext => item.endsWith(ext))) {
      count++;
    } else if (stat.isDirectory()) {
      count = countProjectFiles(fullPath, count);
    }
  }
  return count;
}
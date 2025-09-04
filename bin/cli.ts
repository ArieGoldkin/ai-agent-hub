#!/usr/bin/env node

/**
 * AI Agent Hub CLI - Lean Agent Deployment Tool
 * 
 * Simple tool to deploy 9 AI agents with MCP configuration
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import commands
import { showHelp } from "./commands/help.js";
import { runSetup } from "./commands/setup.js";
import { promptForInstallationTargets } from "./utils/prompt.js";
import { loadCurrentMode, saveMode } from "./utils/mode-manager.js";
import fs from "fs";
import path from "path";

// Parse arguments
const args = process.argv.slice(2);

// Check for installation target flags
const hasProjectOnly = args.includes('--project-only');
const hasDesktopOnly = args.includes('--desktop-only');
const hasBoth = args.includes('--both');

// Check for mode flags
const modeIndex = args.indexOf('--mode');
const requestedMode = modeIndex !== -1 && args[modeIndex + 1] ? args[modeIndex + 1] : null;
const validModes = ['classic', 'squad', 'auto'];

// Extract command (first non-flag argument)
const command = args.find(arg => !arg.startsWith('--'));

// Handle mode selection logic
async function handleModeSelection(requestedMode: string | null, validModes: string[]): Promise<string> {
  let selectedMode = 'classic'; // Default mode
  const currentModeFile = path.join(process.cwd(), '.ai-hub', 'current-mode.json');
  
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

// Auto-detect optimal mode based on project complexity
async function detectOptimalMode(): Promise<string> {
  try {
    // Check if squad prerequisites exist in the package (not the current directory)
    // We'll check for them in the package root relative to this CLI
    const packageRoot = path.join(__dirname, '..', '..');
    const squadTemplatesExist = fs.existsSync(path.join(packageRoot, '.squad', 'templates'));
    const squadAnalysisExist = fs.existsSync(path.join(packageRoot, '.squad', 'analysis'));
    
    // Count project files (excluding node_modules, .git, etc)
    const countProjectFiles = (dir: string, count = 0): number => {
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
    };
    
    const projectFileCount = countProjectFiles(process.cwd());
    
    // Detection rules
    if (!squadTemplatesExist || !squadAnalysisExist) {
      // Squad prerequisites missing
      return 'classic';
    }
    
    if (projectFileCount < 10) {
      // Small project - use classic
      return 'classic';
    }
    
    if (projectFileCount > 50) {
      // Large project - recommend squad for efficiency
      return 'squad';
    }
    
    // Medium project - use classic by default
    return 'classic';
    
  } catch {
    // On any error, default to classic
    return 'classic';
  }
}

// Main CLI router
async function main() {
  try {
    // Help
    if (command === "--help" || command === "-h" || command === "help") {
      showHelp();
      return;
    }

    // Version
    if (command === "--version" || command === "-v") {
      console.log("ai-agent-hub v3.0.6");
      return;
    }

    // Handle mode selection
    let selectedMode = await handleModeSelection(requestedMode, validModes);
    
    // Default setup or explicit flags
    let installTargets;
    
    // Check for non-interactive flags
    if (hasProjectOnly) {
      installTargets = { desktop: false, project: true };
    } else if (hasDesktopOnly) {
      installTargets = { desktop: true, project: false };
    } else if (hasBoth) {
      installTargets = { desktop: true, project: true };
    } else {
      // Interactive mode - prompt user for installation targets
      installTargets = await promptForInstallationTargets();
    }
    
    // Pass mode to setup
    await runSetup(__dirname, installTargets, selectedMode);
    
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
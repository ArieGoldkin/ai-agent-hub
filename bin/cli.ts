#!/usr/bin/env node

/**
 * AI Agent Hub CLI - Lean Agent Deployment Tool
 * 
 * Simple tool to deploy 9 AI agents with MCP configuration
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import commands and utilities
import { showHelp } from "./commands/help.js";
import { runSetup } from "./commands/setup.js";
import { promptForInstallationTargets, promptForExecutionMode } from "./utils/prompt.js";
import { loadCurrentMode, saveMode } from "./utils/mode-manager.js";
import { parseArguments, getInstallTargets } from "../lib/cli/arg-parser.js";
import { handleModeSelection } from "../lib/cli/mode-detector.js";
import { handleDebugMode } from "../lib/cli/debug-handler.js";

const CURRENT_VERSION = "3.0.6";
const VALID_MODES = ['classic', 'squad', 'auto'];

// Main CLI router
async function main() {
  try {
    const args = process.argv.slice(2);
    const parsedArgs = parseArguments(args);
    
    // Handle help command
    if (parsedArgs.command === "--help" || parsedArgs.command === "-h" || parsedArgs.command === "help") {
      showHelp();
      return;
    }

    // Handle version command
    if (parsedArgs.command === "--version" || parsedArgs.command === "-v") {
      console.log(`ai-agent-hub v${CURRENT_VERSION}`);
      return;
    }

    // Handle debug mode
    const debugResult = await handleDebugMode(
      parsedArgs.hasSquadDebug,
      parsedArgs.hasSquadDebugParallel,
      parsedArgs.debugReplaySession
    );
    
    if (parsedArgs.debugReplaySession) {
      return; // Exit after replay
    }

    // Determine installation targets
    let installTargets = getInstallTargets(parsedArgs);
    if (!installTargets) {
      installTargets = await promptForInstallationTargets();
    }
    
    // Determine execution mode
    let selectedMode: string;
    const currentModeFile = path.join(process.cwd(), '.ai-hub', 'current-mode.json');
    
    if (debugResult.debugEnabled) {
      selectedMode = debugResult.selectedMode;
    } else if (parsedArgs.requestedMode) {
      selectedMode = await handleModeSelection(parsedArgs.requestedMode, VALID_MODES, currentModeFile);
    } else {
      // Check for existing mode or prompt for new one
      const hasSavedMode = fs.existsSync(currentModeFile);
      
      if (hasSavedMode) {
        selectedMode = loadCurrentMode(currentModeFile);
        console.log(`\n📋 Using saved mode: ${selectedMode.toUpperCase()}`);
      } else {
        selectedMode = await promptForExecutionMode();
        saveMode(selectedMode, CURRENT_VERSION);
        console.log(`\n✅ Mode selected: ${selectedMode.toUpperCase()}`);
      }
    }
    
    // Run setup with selected mode
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
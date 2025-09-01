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
import { detectProjectInfo } from "../lib/mcp-setup.js";

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Check for installation target flags
const hasProjectOnly = args.includes('--project-only');
const hasDesktopOnly = args.includes('--desktop-only');
const hasBoth = args.includes('--both');

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
      console.log("ai-agent-hub v3.0.0");
      return;
    }

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
      const projectInfo = detectProjectInfo();
      installTargets = await promptForInstallationTargets(projectInfo.isProject);
    }
    
    await runSetup(__dirname, installTargets);
    
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
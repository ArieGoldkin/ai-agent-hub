#!/usr/bin/env node

/**
 * AI Agent Hub CLI - Simplified Main Entry Point
 * 
 * Minimal orchestrator for agent setup and session management
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import simplified commands
import { showHelp } from "./commands/help.js";
import { runDoctorCommand } from "./commands/doctor.js";
import { runQuickSetup } from "./commands/quick-setup.js";
import { startSession } from "./commands/session-start.js";

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Main CLI router
async function main() {
  try {
    // Help
    if (command === "--help" || command === "-h" || command === "help") {
      showHelp();
      return;
    }

    // Doctor command (health check)
    if (command === "doctor") {
      await runDoctorCommand();
      return;
    }

    // Session command - start orchestration
    if (command === "session") {
      const sessionName = args[1];
      await startSession(sessionName);
      return;
    }

    // Default or explicit quick-setup
    if (!command || command === "setup" || command === "quick-setup") {
      const targetDir = args[1] || process.cwd();
      await runQuickSetup(__dirname, targetDir);
      return;
    }

    // Unknown command
    console.error(`❌ Unknown command: ${command}`);
    console.log("Use 'ai-agent-hub --help' for available commands");
    
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
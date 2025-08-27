#!/usr/bin/env node

/**
 * AI Agent Hub CLI - Main entry point
 * 
 * Simple orchestrator that delegates to command modules
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import commands
import { showHelp } from "./commands/help.js";
import { listAgents } from "./commands/list-agents.js";
import { listConfiguredServers } from "./commands/list-servers.js";
import { addServer } from "./commands/add-server.js";
import { removeServerCommand } from "./commands/remove-server.js";
import { setupDefault } from "./commands/setup-default.js";
import { handleSessionCommand } from "./commands/session/index.js";
import { InstallationChoice } from "./utils/prompt.js";

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Main CLI router
async function main() {
  try {
    // Version
    if (command === "--version" || command === "-v") {
      console.log("2.0.0");
      return;
    }

    // Help
    if (command === "--help" || command === "-h") {
      showHelp();
      return;
    }

    // List agents
    if (command === "--list-agents") {
      listAgents();
      return;
    }

    // List servers
    if (command === "--list") {
      await listConfiguredServers();
      return;
    }

    // Remove server
    if (command === "--remove" && args[1]) {
      await removeServerCommand(args[1]);
      return;
    }

    // Session commands
    if (command === "--session" || command === "session") {
      const subcommand = args[1];
      await handleSessionCommand(subcommand, args.slice(2));
      return;
    }

    // Non-interactive installation modes
    if (command === "--project-only") {
      await setupDefault(__dirname, { 
        target: 'project',
        installAgents: true,
        installProjectMCP: true,
        installDesktopMCP: false
      });
      return;
    }

    if (command === "--desktop-only") {
      await setupDefault(__dirname, {
        target: 'desktop',
        installAgents: false,
        installProjectMCP: false,
        installDesktopMCP: true
      });
      return;
    }

    if (command === "--both") {
      await setupDefault(__dirname, {
        target: 'both',
        installAgents: true,
        installProjectMCP: true,
        installDesktopMCP: true
      });
      return;
    }

    // Add specific server
    if (command && !command.startsWith("--")) {
      await addServer(command, __dirname);
      return;
    }

    // Default: Interactive setup
    await setupDefault(__dirname);
    
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
#!/usr/bin/env node

/**
 * AI Agent Hub CLI Entry Point
 */

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Import commands
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { listCommand } from "./commands/list.js";
import { doctorCommand } from "./commands/doctor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json (works in both src and dist)
const packageJsonPath = __dirname.includes("dist")
  ? join(__dirname, "..", "..", "package.json")
  : join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const program = new Command();

program
  .name("ai-agent-hub")
  .description("NPX installer for MCP servers and Claude Desktop configuration")
  .version(packageJson.version, "-v, --version", "Display version number");

// Add global options
program
  .option("-d, --debug", "Enable debug logging")
  .option("-q, --quiet", "Suppress non-essential output")
  .option("--no-color", "Disable colored output");

// Add commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);

// Handle global options
program.hook("preAction", thisCommand => {
  const options = thisCommand.opts() as {
    debug?: boolean;
    quiet?: boolean;
    noColor?: boolean;
  };

  if (options.debug) {
    process.env["LOG_LEVEL"] = "debug";
  } else if (options.quiet) {
    process.env["LOG_LEVEL"] = "warn";
  }

  if (options.noColor) {
    process.env["NO_COLOR"] = "1";
  }
});

// Handle unknown commands
program.on("command:*", () => {
  console.error(`Invalid command: ${program.args.join(" ")}`);
  console.error("See --help for a list of available commands.");
  process.exitCode = 1;
});

// Parse arguments
program.parse();

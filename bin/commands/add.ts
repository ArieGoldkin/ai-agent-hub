/**
 * Add command - Add a single MCP server to Claude Desktop configuration
 */

import { Command } from "commander";
import chalk from "chalk";

// Dynamic import for enquirer since it's a CommonJS module
async function getEnquirer() {
  const enquirer = await import("enquirer");
  return enquirer.default as typeof import("enquirer");
}

import { createLogger } from "../utils/logger.js";
import { createSpinner } from "../utils/spinner.js";

// Import new modules
import {
  detectClaudeConfig,
  readClaudeConfig,
  updateClaudeConfig
} from "../../src/claude-config.js";
import {
  installMCPServer,
  generateServerConfig,
  checkNPXAvailable
} from "../../src/mcp-installer.js";
import {
  SERVER_REGISTRY,
  isValidServerName
} from "../../src/server-registry.js";

const logger = createLogger("add");

interface AddOptions {
  force?: boolean;
  version?: string;
}

export const addCommand = new Command("add")
  .description("Add a single MCP server to Claude Desktop configuration")
  .argument("<server-name>", "Name of the MCP server to add")
  .option(
    "--version <version>",
    "Specific version to install (default: latest)"
  )
  .option("-f, --force", "Force reinstallation if already installed")
  .action(async (serverName: string, options: AddOptions) => {
    try {
      console.log(
        chalk.blue(`🔧 Adding MCP server: ${chalk.bold(serverName)}\n`)
      );

      // Check prerequisites
      const spinner = createSpinner("Checking prerequisites");
      spinner.start();

      const npxCheck = await checkNPXAvailable();
      if (!npxCheck.available) {
        spinner.fail("NPX is not available");
        console.error(chalk.red("❌ NPX is required but not found."));
        console.error("Please install Node.js and npm first.");
        process.exit(1);
      }

      // Validate server name
      if (!isValidServerName(serverName)) {
        spinner.fail(`Unknown server: ${serverName}`);
        console.error(chalk.red(`❌ Server "${serverName}" is not available.`));
        console.error(
          chalk.dim("Run `ai-agent-hub list` to see available servers.")
        );
        process.exit(1);
      }

      const serverDef = SERVER_REGISTRY[serverName];
      spinner.succeed("Prerequisites validated");

      // Detect Claude configuration
      const claudeConfigPath = detectClaudeConfig();
      const existingConfig = await readClaudeConfig(claudeConfigPath);

      console.log(`📂 Claude config: ${chalk.cyan(claudeConfigPath)}`);

      // Check if server is already installed
      const alreadyInstalled =
        existingConfig.exists &&
        existingConfig.config?.mcpServers?.[serverName];

      if (alreadyInstalled && !options.force) {
        console.log(
          chalk.yellow(`⚠️  Server "${serverName}" is already configured.`)
        );
        console.log(
          chalk.dim(
            "Use --force to reinstall or `ai-agent-hub remove` to remove it first."
          )
        );
        process.exit(0);
      }

      // Check environment variables
      const missingRequiredEnv = serverDef.requiredEnv.filter(
        envVar => !process.env[envVar]
      );

      if (missingRequiredEnv.length > 0) {
        console.log(
          chalk.yellow(
            `⚠️  Server "${serverDef.name}" requires environment variables:`
          )
        );
        missingRequiredEnv.forEach(envVar => {
          console.log(`   ${chalk.red("✗")} ${envVar}`);
        });

        const enquirer = await getEnquirer();
        const { proceed } = (await enquirer.prompt({
          type: "confirm",
          name: "proceed",
          message:
            "Continue without these environment variables? (Server may not work properly)"
        })) as { proceed: boolean };

        if (!proceed) {
          console.log(chalk.yellow("Installation cancelled."));
          console.log("\nTo set environment variables:");
          missingRequiredEnv.forEach(envVar => {
            console.log(chalk.cyan(`export ${envVar}=your_value_here`));
          });
          process.exit(0);
        }
      }

      // Show server info
      console.log(chalk.blue(`\n📦 ${serverDef.name}`));
      console.log(chalk.dim(serverDef.description));
      console.log(`Package: ${chalk.cyan(serverDef.package)}`);
      console.log(`Category: ${chalk.magenta(serverDef.category)}`);
      console.log(`Runner: ${chalk.green(serverDef.runner || "npx")}`);

      if (serverDef.capabilities.length > 0) {
        console.log(
          `Capabilities: ${chalk.dim(serverDef.capabilities.join(", "))}`
        );
      }

      // Install the server
      const installSpinner = createSpinner(`Installing ${serverDef.package}`);
      installSpinner.start();

      const version = options.version || serverDef.version || "latest";
      const result = await installMCPServer(serverDef.package, version);

      if (!result.success) {
        installSpinner.fail("Installation failed");
        console.error(chalk.red(`❌ Failed to install ${serverDef.package}:`));
        console.error(chalk.dim(result.error));
        process.exit(1);
      }

      installSpinner.succeed(
        `Installed ${serverDef.package}${result.version ? ` (${result.version})` : ""}`
      );

      // Generate Claude configuration
      const configSpinner = createSpinner(
        "Updating Claude Desktop configuration"
      );
      configSpinner.start();

      // Collect environment variables
      const env: Record<string, string> = { ...serverDef.defaultEnv };

      // Add required environment variables from process.env
      serverDef.requiredEnv.forEach(envVar => {
        if (process.env[envVar]) {
          env[envVar] = process.env[envVar]!;
        }
      });

      // Add optional environment variables from process.env
      serverDef.optionalEnv.forEach(envVar => {
        if (process.env[envVar]) {
          env[envVar] = process.env[envVar]!;
        }
      });

      const serverConfig = generateServerConfig(
        serverDef.package,
        version,
        Object.keys(env).length > 0 ? env : undefined,
        serverDef.defaultArgs
      );

      // Update Claude configuration
      const updateResult = await updateClaudeConfig(
        { [serverName]: serverConfig },
        undefined,
        !options.force
      );

      if (updateResult.updated) {
        configSpinner.succeed("Claude Desktop configuration updated");
        if (updateResult.backupPath) {
          console.log(chalk.dim(`💾 Backup saved: ${updateResult.backupPath}`));
        }
      } else {
        configSpinner.succeed(
          "Claude Desktop configuration unchanged (no updates needed)"
        );
      }

      // Show completion message
      console.log(
        chalk.green(`\n✅ Server "${serverName}" added successfully!`)
      );

      console.log(chalk.bold("\n📋 Next steps:"));
      console.log(
        `   1. ${chalk.cyan("Restart Claude Desktop")} to load the new server`
      );
      console.log(
        `   2. Run ${chalk.cyan("ai-agent-hub list")} to verify the installation`
      );

      // Show environment variable reminders
      if (missingRequiredEnv.length > 0) {
        console.log(chalk.yellow("\n⚠️  Environment variables still needed:"));
        missingRequiredEnv.forEach(envVar => {
          console.log(`   export ${envVar}=your_value_here`);
        });
        console.log(
          chalk.dim("\nAdd these to your shell profile (.bashrc, .zshrc, etc.)")
        );
      }

      // Show optional environment variables
      const availableOptionalEnv = serverDef.optionalEnv.filter(
        envVar => !process.env[envVar]
      );
      if (availableOptionalEnv.length > 0) {
        console.log(
          chalk.dim(
            "\n💡 Optional environment variables for enhanced functionality:"
          )
        );
        availableOptionalEnv.forEach(envVar => {
          console.log(chalk.dim(`   export ${envVar}=your_value_here`));
        });
      }
    } catch (error) {
      logger.error("Add command failed:", error);
      console.error(
        chalk.red("\n❌ Add failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

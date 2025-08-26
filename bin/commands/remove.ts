/**
 * Remove command - Remove MCP servers from Claude Desktop configuration
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
  removeServersFromConfig,
  listConfiguredServers
} from "../../src/claude-config.js";
import { SERVER_REGISTRY } from "../../src/server-registry.js";

const logger = createLogger("remove");

interface RemoveOptions {
  force?: boolean;
  all?: boolean;
}

export const removeCommand = new Command("remove")
  .description("Remove MCP servers from Claude Desktop configuration")
  .argument("[server-names...]", "Names of MCP servers to remove")
  .option("--all", "Remove all MCP servers")
  .option("-f, --force", "Skip confirmation prompts")
  .action(async (serverNames: string[], options: RemoveOptions) => {
    try {
      console.log(chalk.blue("🗑️  Removing MCP servers from Claude Desktop\n"));

      // Detect Claude configuration
      const claudeConfigPath = detectClaudeConfig();
      const existingConfig = await readClaudeConfig(claudeConfigPath);

      console.log(`📂 Claude config: ${chalk.cyan(claudeConfigPath)}`);

      if (!existingConfig.exists) {
        console.log(chalk.yellow("⚠️  No Claude Desktop configuration found."));
        console.log(chalk.dim("Nothing to remove."));
        process.exit(0);
      }

      const configuredServers = await listConfiguredServers(claudeConfigPath);

      if (configuredServers.length === 0) {
        console.log(
          chalk.yellow("⚠️  No MCP servers are currently configured.")
        );
        console.log(chalk.dim("Nothing to remove."));
        process.exit(0);
      }

      console.log(
        chalk.green(`✅ Found ${configuredServers.length} configured server(s)`)
      );

      let serversToRemove: string[] = [];

      // Handle --all flag
      if (options.all) {
        serversToRemove = configuredServers;
      } else if (serverNames.length === 0) {
        // Interactive selection
        const enquirer = await getEnquirer();

        const { selectedServers } = (await enquirer.prompt({
          type: "multiselect",
          name: "selectedServers",
          message: "Select servers to remove:",
          choices: configuredServers.map(name => {
            const server = SERVER_REGISTRY[name];
            return {
              name: server ? `${server.name} (${name})` : name,
              value: name
            };
          })
        })) as { selectedServers: string[] };

        serversToRemove = selectedServers;
      } else {
        // Use provided server names
        serversToRemove = serverNames;

        // Validate that all provided servers exist
        const notConfigured = serversToRemove.filter(
          name => !configuredServers.includes(name)
        );

        if (notConfigured.length > 0) {
          console.log(
            chalk.yellow("⚠️  The following servers are not configured:")
          );
          notConfigured.forEach(name => {
            console.log(`   • ${name}`);
          });

          // Filter to only configured servers
          serversToRemove = serversToRemove.filter(name =>
            configuredServers.includes(name)
          );

          if (serversToRemove.length === 0) {
            console.log(chalk.yellow("No configured servers to remove."));
            process.exit(0);
          }
        }
      }

      if (serversToRemove.length === 0) {
        console.log(chalk.yellow("No servers selected for removal."));
        process.exit(0);
      }

      // Show what will be removed
      console.log(chalk.blue("\n🗑️  Servers to remove:"));
      serversToRemove.forEach(name => {
        const server = SERVER_REGISTRY[name];
        console.log(
          `   • ${chalk.red(name)}${server ? ` (${server.name})` : ""}`
        );
      });

      // Confirmation
      if (!options.force) {
        const enquirer = await getEnquirer();
        const { confirmed } = (await enquirer.prompt({
          type: "confirm",
          name: "confirmed",
          message: `Remove ${serversToRemove.length} server(s) from Claude Desktop configuration?`
        })) as { confirmed: boolean };

        if (!confirmed) {
          console.log(chalk.yellow("Removal cancelled."));
          process.exit(0);
        }
      }

      // Remove servers
      const spinner = createSpinner("Updating Claude Desktop configuration");
      spinner.start();

      const result = await removeServersFromConfig(
        serversToRemove,
        claudeConfigPath,
        true // create backup
      );

      if (result.removed.length > 0) {
        spinner.succeed(
          `Removed ${result.removed.length} server(s) from configuration`
        );
        if (result.backupPath) {
          console.log(chalk.dim(`💾 Backup saved: ${result.backupPath}`));
        }
      } else {
        spinner.succeed("No servers were removed (already not configured)");
      }

      // Show results
      if (result.removed.length > 0) {
        console.log(chalk.green("\n✅ Successfully removed:"));
        result.removed.forEach(name => {
          const server = SERVER_REGISTRY[name];
          console.log(
            `   • ${chalk.red(name)}${server ? ` (${server.name})` : ""}`
          );
        });
      }

      const notRemoved = serversToRemove.filter(
        name => !result.removed.includes(name)
      );
      if (notRemoved.length > 0) {
        console.log(chalk.yellow("\n⚠️  Could not remove:"));
        notRemoved.forEach(name => {
          console.log(`   • ${name} (not found in configuration)`);
        });
      }

      // Show next steps
      console.log(chalk.bold("\n📋 Next steps:"));
      console.log(
        `   1. ${chalk.cyan("Restart Claude Desktop")} to apply changes`
      );
      console.log(
        `   2. Run ${chalk.cyan("ai-agent-hub list")} to verify removal`
      );

      // Show recovery info
      if (result.backupPath) {
        console.log(
          chalk.dim(
            `\n💡 To restore: copy ${result.backupPath} back to ${result.path}`
          )
        );
      }
    } catch (error) {
      logger.error("Remove command failed:", error);
      console.error(
        chalk.red("\n❌ Remove failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

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
  detectConfigTargets,
  removeServerFromConfigs,
  getAllServersWithLocations
} from "../../src/config-manager.js";
import { SERVER_REGISTRY } from "../../src/server-registry.js";

const logger = createLogger("remove");

interface RemoveOptions {
  force?: boolean;
  all?: boolean;
}

export const removeCommand = new Command("remove")
  .description(
    "Remove MCP servers from Claude Desktop and/or Claude Code configuration"
  )
  .argument("[server-names...]", "Names of MCP servers to remove")
  .option("--all", "Remove all MCP servers")
  .option("-f, --force", "Skip confirmation prompts")
  .action(async (serverNames: string[], options: RemoveOptions) => {
    try {
      console.log(chalk.blue("🗑️  Removing MCP servers\n"));

      // Detect all configurations using unified manager
      const configState = await detectConfigTargets();

      console.log(chalk.blue("🔍 Environment Detection:"));
      configState.targets.forEach(target => {
        const status = target.exists ? chalk.green("Exists") : chalk.dim("Not found");
        console.log(`${target.type === 'desktop' ? '📂' : '📄'} ${target.name}: ${status}`);
      });

      // Check if any configurations exist
      const hasAnyConfig = configState.targets.some(t => t.exists);
      if (!hasAnyConfig) {
        console.log(chalk.yellow("\n⚠️  No Claude configurations found."));
        console.log(chalk.dim("Nothing to remove."));
        process.exit(0);
      }

      // Get all configured servers with their locations
      const allServerLocations = await getAllServersWithLocations();
      const configuredServers = [...new Set(allServerLocations.map(s => s.serverId))];

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

      // Show what will be removed with locations
      console.log(chalk.blue("\n🗑️  Servers to remove:"));
      serversToRemove.forEach(name => {
        const server = SERVER_REGISTRY[name];
        const locations = allServerLocations.filter(s => s.serverId === name);
        const locationStr = locations.map(l => l.configType).join(', ');
        console.log(
          `   • ${chalk.red(name)}${server ? ` (${server.name})` : ""} ${chalk.dim(`[${locationStr}]`)}`
        );
      });

      // Confirmation
      if (!options.force) {
        const enquirer = await getEnquirer();
        const { confirmed } = (await enquirer.prompt({
          type: "confirm",
          name: "confirmed",
          message: `Remove ${serversToRemove.length} server(s) from configurations?`
        })) as { confirmed: boolean };

        if (!confirmed) {
          console.log(chalk.yellow("Removal cancelled."));
          process.exit(0);
        }
      }

      // Remove servers from all applicable configs
      const spinner = createSpinner("Updating configurations");
      spinner.start();

      const results = { desktop: { removed: [] as string[] }, code: { removed: [] as string[] } };
      let totalRemoved = 0;

      for (const serverName of serversToRemove) {
        const serverLocations = allServerLocations.filter(s => s.serverId === serverName);
        const targets = serverLocations.map(s => s.configType);
        
        if (targets.length > 0) {
          const result = await removeServerFromConfigs(serverName, targets);
          if (result.desktop?.removed && result.desktop.removed.length > 0) {
            results.desktop.removed.push(...result.desktop.removed);
            totalRemoved += result.desktop.removed.length;
          }
          if (result.code?.removed && result.code.removed.length > 0) {
            results.code.removed.push(...result.code.removed);
            totalRemoved += result.code.removed.length;
          }
        }
      }

      if (totalRemoved > 0) {
        spinner.succeed(`Removed ${totalRemoved} server(s) from configurations`);
      } else {
        spinner.succeed("No servers were removed (already not configured)");
      }

      // Show results by configuration type
      if (totalRemoved > 0) {
        console.log(chalk.green("\n✅ Successfully removed:"));
        
        if (results.desktop.removed.length > 0) {
          console.log(chalk.dim("   From Claude Desktop:"));
          results.desktop.removed.forEach(name => {
            const server = SERVER_REGISTRY[name];
            console.log(
              `     • ${chalk.red(name)}${server ? ` (${server.name})` : ""}`
            );
          });
        }
        
        if (results.code.removed.length > 0) {
          console.log(chalk.dim("   From Claude Code:"));
          results.code.removed.forEach(name => {
            const server = SERVER_REGISTRY[name];
            console.log(
              `     • ${chalk.red(name)}${server ? ` (${server.name})` : ""}`
            );
          });
        }
      }

      const allRemoved = [...results.desktop.removed, ...results.code.removed];
      const notRemoved = serversToRemove.filter(
        name => !allRemoved.includes(name)
      );
      if (notRemoved.length > 0) {
        console.log(chalk.yellow("\n⚠️  Could not remove:"));
        notRemoved.forEach(name => {
          console.log(`   • ${name} (not found in any configuration)`);
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
      console.log(
        chalk.dim(
          "\n💡 To restore: Use git to revert changes or manually restore from backup"
        )
      );
    } catch (error) {
      logger.error("Remove command failed:", error);
      console.error(
        chalk.red("\n❌ Remove failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

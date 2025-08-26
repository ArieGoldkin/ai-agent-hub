/**
 * List command - List installed and available MCP servers
 */

import { Command } from "commander";
import chalk from "chalk";

import { createLogger } from "../utils/logger.js";

// Import new modules
import {
  detectClaudeConfig,
  readClaudeConfig,
  listConfiguredServers
} from "../../src/claude-config.js";
import {
  SERVER_REGISTRY,
  SERVER_CATEGORIES
} from "../../src/server-registry.js";

const logger = createLogger("list");

interface ListOptions {
  configured?: boolean;
  available?: boolean;
  category?: string;
  format?: "table" | "json";
}

export const listCommand = new Command("list")
  .description("List installed and available MCP servers")
  .option(
    "--configured",
    "Show only servers currently configured in Claude Desktop"
  )
  .option("--available", "Show only servers available for installation")
  .option(
    "--category <category>",
    "Filter by category (core, dev-tools, ai, optional)"
  )
  .option("--format <format>", "Output format (table, json)", "table")
  .action(async (options: ListOptions) => {
    try {
      console.log(chalk.blue("📋 MCP Servers\n"));

      // Get Claude configuration
      const claudeConfigPath = detectClaudeConfig();
      const existingConfig = await readClaudeConfig(claudeConfigPath);

      console.log(`📂 Claude config: ${chalk.cyan(claudeConfigPath)}`);

      const configuredServers = existingConfig.exists
        ? await listConfiguredServers(claudeConfigPath)
        : [];

      if (existingConfig.exists) {
        console.log(
          chalk.green(
            `✅ ${configuredServers.length} server(s) currently configured\n`
          )
        );
      } else {
        console.log(chalk.dim("⚠️  No Claude Desktop configuration found\n"));
      }

      // Handle JSON output
      if (options.format === "json") {
        const output = {
          claudeConfigPath,
          configExists: existingConfig.exists,
          configuredServers,
          availableServers: Object.keys(SERVER_REGISTRY),
          registry: SERVER_REGISTRY,
          categories: SERVER_CATEGORIES
        };
        console.log(JSON.stringify(output, null, 2));
        return;
      }

      // Handle configured-only view
      if (options.configured) {
        if (configuredServers.length === 0) {
          console.log(chalk.yellow("No servers currently configured."));
          console.log(
            chalk.dim(`Run ${chalk.cyan("ai-agent-hub init")} to get started.`)
          );
          return;
        }

        console.log(chalk.bold("🟢 Configured Servers:"));
        configuredServers.forEach(name => {
          const server = SERVER_REGISTRY[name];
          if (server) {
            console.log(
              `   ${chalk.green("●")} ${chalk.bold(name)} - ${server.name}`
            );
            console.log(`     ${chalk.dim(server.description)}`);
            console.log(`     Package: ${chalk.cyan(server.package)}`);
            console.log(`     Category: ${chalk.magenta(server.category)}`);
            if (server.requiredEnv.length > 0) {
              const missingEnv = server.requiredEnv.filter(
                env => !process.env[env]
              );
              if (missingEnv.length > 0) {
                console.log(
                  `     ${chalk.yellow("⚠️  Missing env:")} ${chalk.red(missingEnv.join(", "))}`
                );
              } else {
                console.log(
                  `     ${chalk.green("✅ Environment:")} ${server.requiredEnv.join(", ")}`
                );
              }
            }
            console.log();
          } else {
            console.log(
              `   ${chalk.yellow("●")} ${chalk.bold(name)} ${chalk.dim("(unknown server)")}`
            );
            console.log();
          }
        });
        return;
      }

      // Handle available-only view
      if (options.available) {
        showAvailableServers(configuredServers, options.category);
        return;
      }

      // Default: Show both configured and available

      // Show configured servers
      if (configuredServers.length > 0) {
        console.log(chalk.bold("🟢 Configured Servers:"));
        configuredServers.forEach(name => {
          const server = SERVER_REGISTRY[name];
          if (server) {
            console.log(
              `   ${chalk.green("●")} ${chalk.bold(name)} - ${server.name}`
            );
            console.log(`     ${chalk.dim(server.description)}`);

            // Check environment status
            if (server.requiredEnv.length > 0) {
              const missingEnv = server.requiredEnv.filter(
                env => !process.env[env]
              );
              if (missingEnv.length > 0) {
                console.log(
                  `     ${chalk.yellow("⚠️  Missing env:")} ${chalk.red(missingEnv.join(", "))}`
                );
              } else {
                console.log(`     ${chalk.green("✅ Environment OK")}`);
              }
            }
          } else {
            console.log(
              `   ${chalk.yellow("●")} ${chalk.bold(name)} ${chalk.dim("(unknown server)")}`
            );
          }
        });
        console.log();
      }

      // Show available servers by category
      showAvailableServers(configuredServers, options.category);

      // Show usage hints
      console.log(chalk.bold("💡 Usage:"));
      console.log(
        `   • Add server: ${chalk.cyan("ai-agent-hub add <server-name>")}`
      );
      console.log(
        `   • Remove server: ${chalk.cyan("ai-agent-hub remove <server-name>")}`
      );
      console.log(
        `   • Quick setup: ${chalk.cyan("ai-agent-hub init --preset basic-dev")}`
      );
    } catch (error) {
      logger.error("List command failed:", error);
      console.error(
        chalk.red("\n❌ List failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

function showAvailableServers(
  configuredServers: string[],
  categoryFilter?: string
): void {
  const categories = Object.entries(SERVER_CATEGORIES);

  for (const [categoryKey, category] of categories) {
    // Apply category filter
    if (categoryFilter && categoryKey !== categoryFilter) {
      continue;
    }

    console.log(chalk.bold(`📦 ${category.name}:`));
    console.log(chalk.dim(`   ${category.description}`));

    category.servers.forEach(serverName => {
      const server = SERVER_REGISTRY[serverName];
      if (!server) return;

      const isConfigured = configuredServers.includes(serverName);
      const status = isConfigured
        ? chalk.green("● configured")
        : chalk.dim("○ available");

      console.log(`   ${status} ${chalk.bold(serverName)} - ${server.name}`);
      console.log(`     ${chalk.dim(server.description)}`);

      // Show package info
      console.log(`     Package: ${chalk.cyan(server.package)}`);

      // Show environment requirements
      if (server.requiredEnv.length > 0) {
        const hasAllEnv = server.requiredEnv.every(env => !!process.env[env]);
        const envStatus = hasAllEnv ? chalk.green("✅") : chalk.yellow("⚠️ ");
        console.log(
          `     ${envStatus} Requires: ${server.requiredEnv.join(", ")}`
        );
      }

      // Show capabilities
      if (server.capabilities.length > 0) {
        console.log(
          `     Capabilities: ${chalk.dim(server.capabilities.join(", "))}`
        );
      }

      console.log();
    });
  }

  // Show filtered results info
  if (categoryFilter) {
    const validCategories = Object.keys(SERVER_CATEGORIES);
    console.log(chalk.dim(`Filtered by category: ${categoryFilter}`));
    console.log(chalk.dim(`All categories: ${validCategories.join(", ")}`));
  }
}

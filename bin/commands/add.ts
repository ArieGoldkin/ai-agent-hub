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
  detectProjectInfo,
  addServerToMCPConfig,
  hasMCPConfig,
  listMCPConfiguredServers
} from "../../src/claude-code-config.js";
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

interface ConfigurationTargets {
  desktop: boolean;
  code: boolean;
}

export const addCommand = new Command("add")
  .description(
    "Add a single MCP server to Claude Desktop and/or Claude Code configuration"
  )
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

      // Detect environments
      const projectInfo = await detectProjectInfo();
      const claudeConfigPath = detectClaudeConfig();
      const existingDesktopConfig = await readClaudeConfig(claudeConfigPath);
      const hasCodeConfig = await hasMCPConfig();

      // Display environment detection results
      console.log(chalk.blue("\n🔍 Environment Detection:"));
      console.log(`📂 Claude Desktop: ${chalk.cyan(claudeConfigPath)}`);

      if (projectInfo.isProject) {
        console.log(`📁 Project Directory: ${chalk.green("Yes")}`);
        console.log(
          `📄 Claude Code (.mcp.json): ${hasCodeConfig ? chalk.green("Exists") : chalk.dim("Not found")}`
        );
      } else {
        console.log(`📁 Project Directory: ${chalk.dim("No")}`);
      }

      // Determine configuration targets
      const configTargets = await selectConfigurationTargets(projectInfo);

      // Check if server is already installed in selected configurations
      const alreadyInDesktop =
        configTargets.desktop &&
        existingDesktopConfig.exists &&
        existingDesktopConfig.config?.mcpServers?.[serverName];

      const existingCodeServers = configTargets.code
        ? await listMCPConfiguredServers()
        : [];
      const alreadyInCode =
        configTargets.code && existingCodeServers.includes(serverName);

      if ((alreadyInDesktop || alreadyInCode) && !options.force) {
        const locations = [
          alreadyInDesktop && "Claude Desktop",
          alreadyInCode && "Claude Code"
        ]
          .filter(Boolean)
          .join(" and ");

        console.log(
          chalk.yellow(
            `⚠️  Server "${serverName}" is already configured in ${locations}.`
          )
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

      // Update configurations based on targets
      if (configTargets.desktop) {
        const desktopSpinner = createSpinner(
          "Updating Claude Desktop configuration"
        );
        desktopSpinner.start();

        const updateResult = await updateClaudeConfig(
          { [serverName]: serverConfig },
          undefined,
          !options.force
        );

        if (updateResult.updated) {
          desktopSpinner.succeed("Claude Desktop configuration updated");
          if (updateResult.backupPath) {
            console.log(
              chalk.dim(`💾 Desktop backup saved: ${updateResult.backupPath}`)
            );
          }
        } else {
          desktopSpinner.succeed(
            "Claude Desktop configuration unchanged (no updates needed)"
          );
        }
      }

      if (configTargets.code) {
        const codeSpinner = createSpinner(
          "Updating Claude Code .mcp.json configuration"
        );
        codeSpinner.start();

        try {
          await addServerToMCPConfig(serverName, env);
          codeSpinner.succeed("Claude Code .mcp.json configuration updated");
        } catch (error) {
          codeSpinner.fail("Failed to update Claude Code configuration");
          console.error(
            chalk.red("Error:"),
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }

      // Show completion message
      console.log(
        chalk.green(`\n✅ Server "${serverName}" added successfully!`)
      );

      console.log(chalk.bold("\n📋 Next steps:"));
      let stepCounter = 1;

      if (configTargets.desktop) {
        console.log(
          `   ${stepCounter++}. ${chalk.cyan("Restart Claude Desktop")} to load the new server`
        );
      }

      if (configTargets.code) {
        console.log(
          `   ${stepCounter++}. ${chalk.cyan("Restart Claude Code")} or reload your project to use the updated .mcp.json`
        );
      }

      console.log(
        `   ${stepCounter++}. Run ${chalk.cyan("ai-agent-hub list")} to verify the installation`
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

async function selectConfigurationTargets(projectInfo: {
  isProject: boolean;
}): Promise<ConfigurationTargets> {
  const enquirer = await getEnquirer();

  if (!projectInfo.isProject) {
    // Not in a project directory, only offer Desktop configuration
    console.log(
      chalk.dim(
        "\n💡 Not in a project directory - Claude Code (.mcp.json) configuration not available"
      )
    );
    return { desktop: true, code: false };
  }

  // In project directory, offer choices
  const { configChoice } = (await enquirer.prompt({
    type: "select",
    name: "configChoice",
    message: "Which Claude environment(s) would you like to add the server to?",
    choices: [
      {
        name: "Both Claude Desktop and Claude Code",
        value: "both",
        hint: "Global Desktop config + project .mcp.json file"
      },
      {
        name: "Claude Desktop only",
        value: "desktop",
        hint: "Global configuration for Claude Desktop app"
      },
      {
        name: "Claude Code only",
        value: "code",
        hint: "Project-specific .mcp.json file for Claude Code"
      }
    ]
  })) as { configChoice: string };

  switch (configChoice) {
    case "both":
      return { desktop: true, code: true };
    case "desktop":
      return { desktop: true, code: false };
    case "code":
      return { desktop: false, code: true };
    default:
      return { desktop: true, code: false };
  }
}

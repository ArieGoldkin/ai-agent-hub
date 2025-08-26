/**
 * Init command - Simple setup that configures MCP servers for Claude Desktop
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

import {
  updateClaudeConfig,
  type MCPServerConfig
} from "../../src/claude-config/index.js";
import {
  detectProjectInfo,
  createMCPConfigFromServers
} from "../../src/claude-code-config/index.js";
import {
  generateServerConfig,
  batchInstallServers,
  checkNPXAvailable
} from "../../src/mcp-installer/index.js";
import {
  SERVER_REGISTRY,
  DEFAULT_SERVERS
} from "../../src/server-registry/index.js";
import {
  installAgentFiles,
  installAgentFilesGlobally
} from "../../src/agent-installer/index.js";

const logger = createLogger("init");

interface ConfigurationTargets {
  desktop: boolean;
  code: boolean;
}

export const initCommand = new Command("init")
  .description("Set up Claude Desktop with essential MCP servers")
  .option("--dry-run", "Preview what would be installed without making changes")
  .action(async options => {
    try {
      // Welcome message
      console.log(chalk.blue("🚀 AI Agent Hub - MCP Server Installer"));
      if (options.dryRun) {
        console.log(chalk.yellow("[DRY RUN MODE] - No changes will be made"));
      }
      console.log(
        chalk.dim("Setting up Claude Desktop with essential MCP servers\n")
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

      spinner.succeed(`Prerequisites met (NPX ${npxCheck.version})`);

      // Detect environments
      const projectInfo = await detectProjectInfo();

      // Ask the ONE question: Where to configure
      const configTargets = await selectConfigurationTargets(projectInfo);

      // Check for GITHUB_TOKEN (optional but recommended)
      await checkGitHubToken();

      // Show what will be installed
      console.log(chalk.blue("\n📦 Installing default MCP servers:"));
      DEFAULT_SERVERS.forEach(serverName => {
        const server = SERVER_REGISTRY[serverName];
        console.log(`   • ${server?.name || serverName}`);
      });

      // Install the servers
      await installServers(DEFAULT_SERVERS, configTargets, options.dryRun);

      // Install agent personalities
      await installAgentPersonalities(configTargets, options.dryRun);

      // Show success message
      console.log(chalk.green("\n✅ Setup completed successfully!"));
      console.log(chalk.bold("\n📋 Next steps:"));

      let stepCounter = 1;
      if (configTargets.desktop) {
        console.log(
          `   ${stepCounter++}. ${chalk.cyan("Restart Claude Desktop")} to load the new servers`
        );
      }
      if (configTargets.code) {
        console.log(
          `   ${stepCounter++}. ${chalk.cyan("Restart Claude Code")} or reload your project to use .mcp.json`
        );
      }

      console.log(
        `   ${stepCounter++}. Run ${chalk.cyan("ai-agent-hub list")} to verify installed servers`
      );
      console.log(
        `   ${stepCounter++}. Run ${chalk.cyan("ai-agent-hub doctor")} to validate your setup`
      );

      // Show GITHUB_TOKEN reminder if not set
      if (!process.env.GITHUB_TOKEN) {
        console.log(
          chalk.yellow(
            "\n💡 Tip: Set GITHUB_TOKEN environment variable to enable GitHub integration"
          )
        );
      }
    } catch (error) {
      logger.error("Init command failed:", error);
      console.error(
        chalk.red("\n❌ Setup failed:"),
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
      chalk.dim("Not in a project directory - configuring Claude Desktop only")
    );
    return { desktop: true, code: false };
  }

  // In project directory, ask where to configure
  const { configChoice } = (await enquirer.prompt({
    type: "select",
    name: "configChoice",
    message: "Where would you like to configure MCP servers?",
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

async function checkGitHubToken(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) {
    const enquirer = await getEnquirer();

    console.log(
      chalk.yellow("\n⚠️  GITHUB_TOKEN not found in environment variables")
    );
    console.log(
      chalk.dim("This is optional but recommended for GitHub integration")
    );

    const { setToken } = (await enquirer.prompt({
      type: "confirm",
      name: "setToken",
      message: "Would you like to set up GitHub integration now?",
      initial: false
    })) as { setToken: boolean };

    if (setToken) {
      const { token } = (await enquirer.prompt({
        type: "password",
        name: "token",
        message: "Enter your GitHub Personal Access Token:"
      })) as { token: string };

      if (token.trim()) {
        process.env.GITHUB_TOKEN = token.trim();
        console.log(chalk.green("✅ GitHub token set for this session"));
        console.log(
          chalk.dim(
            "Add 'export GITHUB_TOKEN=your_token' to your shell profile to make it permanent"
          )
        );
      }
    }
  } else {
    console.log(
      chalk.green("✅ GITHUB_TOKEN found - GitHub integration will be enabled")
    );
  }
}

async function installServers(
  serverNames: string[],
  configTargets: ConfigurationTargets,
  dryRun = false
): Promise<void> {
  const spinner = createSpinner("Installing MCP servers");
  spinner.start();

  try {
    // Prepare installation packages
    const packages = serverNames.map(name => {
      const server = SERVER_REGISTRY[name];
      return {
        name: server?.package || name,
        version: server?.version || "latest"
      };
    });

    // Batch install servers
    if (dryRun) {
      spinner.succeed(`[DRY RUN] Would install ${packages.length} servers`);
      console.log(chalk.dim("Packages that would be installed:"));
      packages.forEach(pkg => {
        console.log(`   • ${pkg.name}@${pkg.version}`);
      });
      return;
    }

    const results = await batchInstallServers(packages, 2);

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (failed.length > 0) {
      spinner.fail(`Installation completed with ${failed.length} failure(s)`);
      console.log(chalk.red("\n❌ Failed installations:"));
      failed.forEach(result => {
        console.log(`   • ${result.packageName}: ${result.error}`);
      });

      if (successful.length === 0) {
        console.error(chalk.red("No servers were installed successfully."));
        process.exit(1);
      }
    } else {
      spinner.succeed("All servers installed successfully");
    }

    // Generate configuration for successful installations
    const successfulServerNames = successful
      .map(result => {
        return serverNames.find(name => {
          const server = SERVER_REGISTRY[name];
          return server?.package === result.packageName;
        });
      })
      .filter(name => name !== undefined) as string[];

    // Collect environment variables
    const env: Record<string, string> = {};
    successfulServerNames.forEach(serverName => {
      const server = SERVER_REGISTRY[serverName];
      if (server) {
        // Add default environment variables
        Object.assign(env, server.defaultEnv);

        // Add required environment variables from process.env
        server.requiredEnv.forEach(envVar => {
          if (process.env[envVar]) {
            env[envVar] = process.env[envVar]!;
          }
        });

        // Add optional environment variables from process.env
        server.optionalEnv.forEach(envVar => {
          if (process.env[envVar]) {
            env[envVar] = process.env[envVar]!;
          }
        });
      }
    });

    // Update Claude Desktop configuration if selected
    if (configTargets.desktop) {
      const desktopSpinner = createSpinner(
        "Updating Claude Desktop configuration"
      );
      desktopSpinner.start();

      const serverConfigs: Record<string, MCPServerConfig> = {};

      for (const serverName of successfulServerNames) {
        const server = SERVER_REGISTRY[serverName];
        if (server) {
          serverConfigs[serverName] = generateServerConfig(
            server.package,
            server.version,
            Object.keys(env).length > 0 ? env : undefined,
            server.defaultArgs
          );
        }
      }

      if (dryRun) {
        desktopSpinner.succeed(
          "[DRY RUN] Would update Claude Desktop configuration"
        );
        console.log(chalk.dim("Servers that would be configured:"));
        Object.keys(serverConfigs).forEach(name => {
          console.log(`   • ${name}`);
        });
      } else {
        const updateResult = await updateClaudeConfig(
          serverConfigs,
          undefined,
          true // always create backup
        );

        if (updateResult.updated) {
          desktopSpinner.succeed("Claude Desktop configuration updated");
          if (updateResult.backupPath) {
            console.log(
              chalk.dim(`💾 Backup saved: ${updateResult.backupPath}`)
            );
          }
        } else {
          desktopSpinner.succeed("Claude Desktop configuration unchanged");
        }
      }
    }

    // Update Claude Code configuration if selected
    if (configTargets.code) {
      const codeSpinner = createSpinner(
        "Creating Claude Code .mcp.json configuration"
      );
      codeSpinner.start();

      if (dryRun) {
        codeSpinner.succeed(
          "[DRY RUN] Would create Claude Code .mcp.json configuration"
        );
        console.log(chalk.dim("Servers that would be configured:"));
        successfulServerNames.forEach(name => {
          console.log(`   • ${name}`);
        });
      } else {
        try {
          await createMCPConfigFromServers(successfulServerNames, env);
          codeSpinner.succeed("Claude Code .mcp.json configuration created");
        } catch (error) {
          codeSpinner.fail("Failed to create Claude Code configuration");
          console.error(
            chalk.red("Error:"),
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
    }
  } catch (error) {
    spinner.fail("Installation failed");
    throw error;
  }
}

async function installAgentPersonalities(
  configTargets: ConfigurationTargets,
  dryRun = false
): Promise<void> {
  const spinner = createSpinner("Installing agent personalities");
  spinner.start();

  try {
    if (dryRun) {
      spinner.succeed("[DRY RUN] Would install agent personalities");
      console.log(chalk.dim("Locations that would be used:"));
      if (configTargets.desktop) {
        console.log("   • ~/.claude/agents/ (global)");
      }
      if (configTargets.code) {
        console.log("   • .claude/agents/ (project)");
      }
      return;
    }

    let totalInstalled = 0;
    let totalSkipped = 0;
    const allErrors: string[] = [];
    const locations: string[] = [];

    // Install to global directory if configuring Desktop
    if (configTargets.desktop) {
      const globalResult = await installAgentFilesGlobally({
        overwrite: false
      });
      totalInstalled += globalResult.installed.length;
      totalSkipped += globalResult.skipped.length;
      allErrors.push(...globalResult.errors);
      if (
        globalResult.installed.length > 0 ||
        globalResult.skipped.length > 0
      ) {
        locations.push("~/.claude/agents/ (global)");
      }
    }

    // Install to project directory if configuring Code
    if (configTargets.code) {
      const projectResult = await installAgentFiles({
        overwrite: false
      });
      totalInstalled += projectResult.installed.length;
      totalSkipped += projectResult.skipped.length;
      allErrors.push(...projectResult.errors);
      if (
        projectResult.installed.length > 0 ||
        projectResult.skipped.length > 0
      ) {
        locations.push(".claude/agents/ (project)");
      }
    }

    if (totalInstalled > 0) {
      spinner.succeed(`Installed ${totalInstalled} agent personalities`);
      if (locations.length > 0) {
        console.log(chalk.dim(`   Locations: ${locations.join(", ")}`));
      }
    } else if (totalSkipped > 0) {
      spinner.succeed(
        `Agent personalities already installed (${totalSkipped} found)`
      );
    } else {
      spinner.fail("No agents were installed");
    }

    if (allErrors.length > 0) {
      console.log(chalk.yellow("\n⚠️  Some agents failed to install:"));
      allErrors.forEach(error => {
        console.log(`     • ${error}`);
      });
    }
  } catch (error) {
    spinner.fail("Failed to install agent personalities");
    console.error(
      chalk.red("Error:"),
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

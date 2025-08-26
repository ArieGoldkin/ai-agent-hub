/**
 * Init command - Interactive setup that configures MCP servers for Claude Desktop
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
  updateClaudeConfig,
  type MCPServerConfig
} from "../../src/claude-config.js";
import {
  generateServerConfig,
  batchInstallServers,
  checkNPXAvailable
} from "../../src/mcp-installer.js";
import {
  SERVER_REGISTRY,
  SERVER_CATEGORIES,
  SERVER_COMBINATIONS
} from "../../src/server-registry.js";

const logger = createLogger("init");

interface InitOptions {
  preset?: string;
  yes?: boolean;
  force?: boolean;
  dryRun?: boolean;
}

export const initCommand = new Command("init")
  .description(
    "Interactive setup wizard for MCP servers and Claude Desktop configuration"
  )
  .option(
    "--preset <preset>",
    "Use preset configuration (basic-dev/full-stack/ai-enhanced/research)",
    /^(basic-dev|full-stack|ai-enhanced|research)$/
  )
  .option("--yes", "Accept defaults for non-interactive setup")
  .option(
    "-f, --force",
    "Force overwrite existing configuration without backup"
  )
  .option(
    "--dry-run",
    "Show what would be installed and configured without making changes"
  )
  .action(async (options: InitOptions) => {
    try {
      if (options.dryRun) {
        console.log(chalk.blue("🚀 AI Agent Hub - MCP Server Installer"));
        console.log(
          chalk.yellow("🔍 DRY RUN MODE - No changes will be made\n")
        );
      } else {
        console.log(chalk.blue("🚀 AI Agent Hub - MCP Server Installer\n"));
      }

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

      // Detect Claude configuration
      const claudeConfigPath = detectClaudeConfig();
      const existingConfig = await readClaudeConfig(claudeConfigPath);

      console.log(`📂 Claude config: ${chalk.cyan(claudeConfigPath)}`);

      if (existingConfig.exists) {
        const serverCount = Object.keys(
          existingConfig.config?.mcpServers || {}
        ).length;
        console.log(
          chalk.green(
            `✅ Found existing configuration with ${serverCount} MCP server(s)`
          )
        );

        if (
          serverCount > 0 &&
          !options.force &&
          !options.yes &&
          !options.dryRun
        ) {
          const enquirer = await getEnquirer();
          const { proceed } = (await enquirer.prompt({
            type: "confirm",
            name: "proceed",
            message:
              "Continue with existing configuration? This will merge new servers with existing ones."
          })) as { proceed: boolean };
          if (!proceed) {
            console.log(chalk.yellow("Setup cancelled."));
            process.exit(0);
          }
        } else if (options.dryRun && serverCount > 0) {
          console.log(
            chalk.dim("   (Dry run mode - would merge with existing servers)")
          );
        }
      } else {
        console.log(
          chalk.dim(
            "⚠️  No existing Claude configuration found - will create new one"
          )
        );
      }

      // Handle preset mode
      if (options.preset) {
        await handlePresetSetup(options.preset, options);
        return;
      }

      // Handle non-interactive mode
      if (options.yes) {
        await handleDefaultSetup(options);
        return;
      }

      // Interactive setup
      await handleInteractiveSetup(options);
    } catch (error) {
      logger.error("Init command failed:", error);
      console.error(
        chalk.red("\n❌ Setup failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

async function handlePresetSetup(
  preset: string,
  options: InitOptions
): Promise<void> {
  const combination =
    SERVER_COMBINATIONS[preset as keyof typeof SERVER_COMBINATIONS];
  if (!combination) {
    throw new Error(`Unknown preset: ${preset}`);
  }

  console.log(chalk.blue(`\n📦 Setting up "${combination.name}" preset`));
  console.log(chalk.dim(combination.description));

  const servers = combination.servers;
  const requiredEnv = combination.requiredEnv;

  // Check for required environment variables
  const missingEnv: string[] = [];
  for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
      missingEnv.push(envVar);
    }
  }

  if (missingEnv.length > 0 && !options.dryRun) {
    console.log(chalk.yellow("\n⚠️  Required environment variables:"));
    missingEnv.forEach(envVar => {
      console.log(`   ${chalk.red("✗")} ${envVar}`);
    });
    console.log(
      "\nPlease set these environment variables and run the command again."
    );
    console.log(
      `Example: ${chalk.cyan(`export ${missingEnv[0]}=your_value_here`)}`
    );
    process.exit(1);
  } else if (missingEnv.length > 0 && options.dryRun) {
    console.log(
      chalk.yellow("\n⚠️  Required environment variables (missing):")
    );
    missingEnv.forEach(envVar => {
      console.log(`   ${chalk.red("✗")} ${envVar}`);
    });
    console.log(chalk.dim("   (In actual run, these would need to be set)"));
  }

  await installServers(servers, options);
}

async function handleDefaultSetup(options: InitOptions): Promise<void> {
  console.log(
    chalk.blue("\n📦 Setting up with default configuration (Core Servers)")
  );

  const servers = SERVER_CATEGORIES.core.servers;
  await installServers(servers, options);
}

async function handleInteractiveSetup(options: InitOptions): Promise<void> {
  const enquirer = await getEnquirer();

  // Ask about setup type
  const { setupType } = (await enquirer.prompt({
    type: "select",
    name: "setupType",
    message: "What type of setup would you like?",
    choices: [
      { name: "Quick setup with preset", value: "preset" },
      { name: "Custom server selection", value: "custom" },
      { name: "Just core servers (minimal)", value: "minimal" }
    ]
  })) as { setupType: string };

  let selectedServers: string[] = [];

  if (setupType === "preset") {
    const { preset } = (await enquirer.prompt({
      type: "select",
      name: "preset",
      message: "Choose a preset configuration:",
      choices: Object.entries(SERVER_COMBINATIONS).map(([key, combo]) => ({
        name: `${combo.name} - ${combo.description}`,
        value: key
      }))
    })) as { preset: string };

    selectedServers =
      SERVER_COMBINATIONS[preset as keyof typeof SERVER_COMBINATIONS].servers;
  } else if (setupType === "custom") {
    // Show servers by category
    const { categories } = (await enquirer.prompt({
      type: "multiselect",
      name: "categories",
      message: "Select server categories to install:",
      choices: Object.entries(SERVER_CATEGORIES).map(([key, category]) => ({
        name: `${category.name} - ${category.description}`,
        value: key
      }))
    })) as { categories: string[] };

    // Collect servers from selected categories
    for (const categoryKey of categories) {
      const category =
        SERVER_CATEGORIES[categoryKey as keyof typeof SERVER_CATEGORIES];
      selectedServers.push(...category.servers);
    }

    // Allow individual server selection
    const availableServers = Object.keys(SERVER_REGISTRY).filter(
      name => !selectedServers.includes(name)
    );

    if (availableServers.length > 0) {
      const { additionalServers } = (await enquirer.prompt({
        type: "multiselect",
        name: "additionalServers",
        message: "Select additional individual servers (optional):",
        choices: availableServers.map(name => ({
          name: `${SERVER_REGISTRY[name].name} - ${SERVER_REGISTRY[name].description}`,
          value: name
        }))
      })) as { additionalServers: string[] };

      selectedServers.push(...additionalServers);
    }
  } else {
    selectedServers = SERVER_CATEGORIES.core.servers;
  }

  // Remove duplicates
  selectedServers = [...new Set(selectedServers)];

  // Check environment variables
  const allRequiredEnv = new Set<string>();
  selectedServers.forEach(serverName => {
    const server = SERVER_REGISTRY[serverName];
    if (server) {
      server.requiredEnv.forEach(envVar => allRequiredEnv.add(envVar));
    }
  });

  const missingEnv = Array.from(allRequiredEnv).filter(
    envVar => !process.env[envVar]
  );

  if (missingEnv.length > 0 && !options.dryRun) {
    console.log(
      chalk.yellow("\n⚠️  Some servers require environment variables:")
    );
    missingEnv.forEach(envVar => {
      const servers = selectedServers.filter(name =>
        SERVER_REGISTRY[name]?.requiredEnv.includes(envVar)
      );
      console.log(
        `   ${chalk.red("✗")} ${envVar} (required by: ${servers.join(", ")})`
      );
    });

    const { proceed } = (await enquirer.prompt({
      type: "confirm",
      name: "proceed",
      message:
        "Continue without these environment variables? (Affected servers may not work properly)"
    })) as { proceed: boolean };

    if (!proceed) {
      console.log(
        chalk.yellow(
          "Setup cancelled. Please set the required environment variables."
        )
      );
      process.exit(0);
    }
  } else if (missingEnv.length > 0 && options.dryRun) {
    console.log(
      chalk.yellow("\n⚠️  Some servers require environment variables:")
    );
    missingEnv.forEach(envVar => {
      const servers = selectedServers.filter(name =>
        SERVER_REGISTRY[name]?.requiredEnv.includes(envVar)
      );
      console.log(
        `   ${chalk.red("✗")} ${envVar} (required by: ${servers.join(", ")})`
      );
    });
    console.log(
      chalk.dim("   (In actual run, would prompt to continue or cancel)")
    );
  }

  await installServers(selectedServers, options);
}

async function showDryRunDetails(
  serverNames: string[],
  options: InitOptions
): Promise<void> {
  console.log(chalk.yellow("\n📋 DRY RUN DETAILS:\n"));

  // Show server installation details
  console.log(chalk.blue("📦 Servers to install:"));
  serverNames.forEach(name => {
    const server = SERVER_REGISTRY[name];
    if (server) {
      console.log(`   • ${chalk.bold(server.name)}`);
      console.log(`     Package: ${chalk.cyan(server.package)}`);
      console.log(`     Command: ${chalk.dim(`npx ${server.package}`)}`);
      if (server.requiredEnv.length > 0) {
        console.log(
          `     Required env vars: ${chalk.yellow(server.requiredEnv.join(", "))}`
        );
      }
      if (server.optionalEnv.length > 0) {
        console.log(
          `     Optional env vars: ${chalk.dim(server.optionalEnv.join(", "))}`
        );
      }
      console.log("");
    }
  });

  // Show configuration changes
  console.log(chalk.blue("⚙️  Configuration changes:"));
  const claudeConfigPath = detectClaudeConfig();
  const existingConfig = await readClaudeConfig(claudeConfigPath);

  console.log(`   Config file: ${chalk.cyan(claudeConfigPath)}`);

  if (existingConfig.exists) {
    const existingServerCount = Object.keys(
      existingConfig.config?.mcpServers || {}
    ).length;
    console.log(`   Current servers: ${chalk.green(existingServerCount)}`);
    console.log(
      `   After changes: ${chalk.green(existingServerCount + serverNames.length)} (+${serverNames.length})`
    );
  } else {
    console.log(
      `   ${chalk.yellow("Config file does not exist - would create new one")}`
    );
    console.log(`   New servers: ${chalk.green(serverNames.length)}`);
  }

  // Generate preview of server configurations
  console.log(chalk.blue("\n🔧 Server configurations to add:"));

  for (const serverName of serverNames) {
    const server = SERVER_REGISTRY[serverName];
    if (server) {
      // Collect environment variables that would be used
      const env: Record<string, string> = { ...server.defaultEnv };

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

      console.log(`   ${chalk.bold(serverName)}:`);
      console.log(`     command: ${chalk.cyan(`npx ${server.package}`)}`);
      if (server.defaultArgs.length > 0) {
        console.log(
          `     args: ${chalk.dim(JSON.stringify(server.defaultArgs))}`
        );
      }
      if (Object.keys(env).length > 0) {
        console.log("     env:");
        Object.entries(env).forEach(([key, value]) => {
          // Mask sensitive values but show they exist
          const maskedValue =
            key.toLowerCase().includes("key") ||
            key.toLowerCase().includes("token") ||
            key.toLowerCase().includes("secret")
              ? "[MASKED]"
              : value;
          console.log(`       ${key}: ${chalk.dim(maskedValue)}`);
        });
      }
      console.log("");
    }
  }

  // Show missing environment variables
  const allRequiredEnv = new Set<string>();
  serverNames.forEach(serverName => {
    const server = SERVER_REGISTRY[serverName];
    if (server) {
      server.requiredEnv.forEach(envVar => allRequiredEnv.add(envVar));
    }
  });

  const missingEnv = Array.from(allRequiredEnv).filter(
    envVar => !process.env[envVar]
  );

  if (missingEnv.length > 0) {
    console.log(chalk.red("⚠️  Missing required environment variables:"));
    missingEnv.forEach(envVar => {
      const servers = serverNames.filter(name =>
        SERVER_REGISTRY[name]?.requiredEnv.includes(envVar)
      );
      console.log(
        `   ${chalk.red("✗")} ${envVar} (needed by: ${servers.join(", ")})`
      );
    });
    console.log("");
  }

  // Show backup information
  if (!options.force && existingConfig.exists) {
    console.log(chalk.blue("💾 Backup:"));
    console.log(
      `   ${chalk.dim("Current config would be backed up before changes")}`
    );
    console.log("");
  }

  // Show final summary
  console.log(chalk.green("✅ Summary:"));
  console.log(`   • ${serverNames.length} servers would be installed via NPX`);
  console.log(
    `   • Claude config would be ${existingConfig.exists ? "updated" : "created"}`
  );
  console.log(
    `   • ${!options.force && existingConfig.exists ? "Backup would be created" : "No backup needed"}`
  );

  console.log(
    chalk.dim(
      "\n💡 To actually perform these changes, run the same command without --dry-run"
    )
  );
}

async function installServers(
  serverNames: string[],
  options: InitOptions
): Promise<void> {
  const actionVerb = options.dryRun ? "Would install" : "Installing";
  console.log(
    chalk.blue(`\n🔧 ${actionVerb} ${serverNames.length} MCP server(s):`)
  );
  serverNames.forEach(name => {
    const server = SERVER_REGISTRY[name];
    console.log(`   • ${server?.name || name} (${server?.package || name})`);
  });

  if (options.dryRun) {
    await showDryRunDetails(serverNames, options);
    return;
  }

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
    const results = await batchInstallServers(packages, 3);

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (failed.length > 0) {
      spinner.fail(`Installation completed with ${failed.length} failure(s)`);
      console.log(chalk.red("\n❌ Failed installations:"));
      failed.forEach(result => {
        console.log(`   • ${result.packageName}: ${result.error}`);
      });
    } else {
      spinner.succeed("All servers installed successfully");
    }

    if (successful.length === 0) {
      console.error(chalk.red("No servers were installed successfully."));
      process.exit(1);
    }

    // Generate Claude configuration
    const configSpinner = createSpinner(
      "Updating Claude Desktop configuration"
    );
    configSpinner.start();

    const serverConfigs: Record<string, MCPServerConfig> = {};

    for (const result of successful) {
      const serverName = serverNames.find(name => {
        const server = SERVER_REGISTRY[name];
        return server?.package === result.packageName;
      });

      if (serverName) {
        const server = SERVER_REGISTRY[serverName];
        if (server) {
          // Collect environment variables
          const env: Record<string, string> = { ...server.defaultEnv };

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

          serverConfigs[serverName] = generateServerConfig(
            server.package,
            server.version,
            Object.keys(env).length > 0 ? env : undefined,
            server.defaultArgs
          );
        }
      }
    }

    // Update Claude configuration
    const updateResult = await updateClaudeConfig(
      serverConfigs,
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
    console.log(chalk.green("\n✅ Setup completed successfully!"));

    console.log(chalk.bold("\n📋 Next steps:"));
    console.log(
      `   1. ${chalk.cyan("Restart Claude Desktop")} to load the new servers`
    );
    console.log(
      `   2. Run ${chalk.cyan("ai-agent-hub list")} to verify installed servers`
    );
    console.log(
      `   3. Run ${chalk.cyan("ai-agent-hub doctor")} to validate your setup`
    );

    // Show environment variable reminders
    const allRequiredEnv = new Set<string>();
    successful.forEach(result => {
      const serverName = serverNames.find(name => {
        const server = SERVER_REGISTRY[name];
        return server?.package === result.packageName;
      });
      if (serverName) {
        const server = SERVER_REGISTRY[serverName];
        if (server) {
          server.requiredEnv.forEach(envVar => allRequiredEnv.add(envVar));
        }
      }
    });

    const stillMissingEnv = Array.from(allRequiredEnv).filter(
      envVar => !process.env[envVar]
    );

    if (stillMissingEnv.length > 0) {
      console.log(chalk.yellow("\n⚠️  Environment variables still needed:"));
      stillMissingEnv.forEach(envVar => {
        console.log(`   export ${envVar}=your_value_here`);
      });
      console.log(
        chalk.dim("\nAdd these to your shell profile (.bashrc, .zshrc, etc.)")
      );
    }
  } catch (error) {
    spinner.fail("Installation failed");
    throw error;
  }
}

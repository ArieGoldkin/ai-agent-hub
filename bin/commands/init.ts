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
  detectProjectInfo,
  createMCPConfigFromServers,
  hasMCPConfig,
  getMCPJsonPath,
  type ProjectInfo
} from "../../src/claude-code-config.js";
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

interface ConfigurationTargets {
  desktop: boolean;
  code: boolean;
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
        if (projectInfo.hasPackageJson) {
          console.log(`   • package.json: ${chalk.green("Found")}`);
        }
        if (projectInfo.hasGitRepo) {
          console.log(`   • .git directory: ${chalk.green("Found")}`);
        }
        console.log(
          `📄 Claude Code (.mcp.json): ${hasCodeConfig ? chalk.green("Exists") : chalk.dim("Not found")}`
        );
      } else {
        console.log(`📁 Project Directory: ${chalk.dim("No")}`);
      }

      // Determine configuration targets
      let configTargets: ConfigurationTargets;

      if (options.yes) {
        // Auto-detect best configuration in non-interactive mode
        configTargets = {
          desktop: true,
          code: projectInfo.isProject
        };
      } else {
        configTargets = await selectConfigurationTargets(projectInfo, options);
      }

      // Handle existing configurations
      if (existingDesktopConfig.exists && configTargets.desktop) {
        const serverCount = Object.keys(
          existingDesktopConfig.config?.mcpServers || {}
        ).length;
        console.log(
          chalk.green(
            `✅ Found existing Desktop configuration with ${serverCount} MCP server(s)`
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
              "Continue with existing Desktop configuration? This will merge new servers with existing ones."
          })) as { proceed: boolean };
          if (!proceed) {
            console.log(chalk.yellow("Setup cancelled."));
            process.exit(0);
          }
        } else if (options.dryRun && serverCount > 0) {
          console.log(
            chalk.dim(
              "   (Dry run mode - would merge with existing Desktop servers)"
            )
          );
        }
      } else if (configTargets.desktop) {
        console.log(
          chalk.dim(
            "⚠️  No existing Claude Desktop configuration found - will create new one"
          )
        );
      }

      if (
        hasCodeConfig &&
        configTargets.code &&
        !options.force &&
        !options.yes &&
        !options.dryRun
      ) {
        const enquirer = await getEnquirer();
        const { proceed } = (await enquirer.prompt({
          type: "confirm",
          name: "proceed",
          message:
            "Continue with existing Claude Code configuration? This will replace the .mcp.json file."
        })) as { proceed: boolean };
        if (!proceed) {
          console.log(chalk.yellow("Setup cancelled."));
          process.exit(0);
        }
      } else if (hasCodeConfig && configTargets.code && options.dryRun) {
        console.log(
          chalk.dim("   (Dry run mode - would replace existing .mcp.json)")
        );
      }

      // Handle preset mode
      if (options.preset) {
        await handlePresetSetup(options.preset, options, configTargets);
        return;
      }

      // Handle non-interactive mode
      if (options.yes) {
        await handleDefaultSetup(options, configTargets);
        return;
      }

      // Interactive setup
      await handleInteractiveSetup(options, configTargets);
    } catch (error) {
      logger.error("Init command failed:", error);
      console.error(
        chalk.red("\n❌ Setup failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

async function selectConfigurationTargets(
  projectInfo: ProjectInfo,
  options: InitOptions
): Promise<ConfigurationTargets> {
  if (options.dryRun) {
    // In dry run mode, default to both if in project, desktop only otherwise
    return {
      desktop: true,
      code: projectInfo.isProject
    };
  }

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
    message: "Which Claude environment(s) would you like to configure?",
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

async function handlePresetSetup(
  preset: string,
  options: InitOptions,
  configTargets: ConfigurationTargets
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

  await installServers(servers, options, configTargets);
}

async function handleDefaultSetup(
  options: InitOptions,
  configTargets: ConfigurationTargets
): Promise<void> {
  console.log(
    chalk.blue("\n📦 Setting up with default configuration (Core Servers)")
  );

  const servers = SERVER_CATEGORIES.core.servers;
  await installServers(servers, options, configTargets);
}

async function handleInteractiveSetup(
  options: InitOptions,
  configTargets: ConfigurationTargets
): Promise<void> {
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

  await installServers(selectedServers, options, configTargets);
}

async function showDryRunDetails(
  serverNames: string[],
  options: InitOptions,
  configTargets: ConfigurationTargets
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

  if (configTargets.desktop) {
    console.log(chalk.bold("   Claude Desktop:"));
    const claudeConfigPath = detectClaudeConfig();
    const existingConfig = await readClaudeConfig(claudeConfigPath);
    console.log(`     Config file: ${chalk.cyan(claudeConfigPath)}`);

    if (existingConfig.exists) {
      const existingServerCount = Object.keys(
        existingConfig.config?.mcpServers || {}
      ).length;
      console.log(`     Current servers: ${chalk.green(existingServerCount)}`);
      console.log(
        `     After changes: ${chalk.green(existingServerCount + serverNames.length)} (+${serverNames.length})`
      );
    } else {
      console.log(
        `     ${chalk.yellow("Config file does not exist - would create new one")}`
      );
      console.log(`     New servers: ${chalk.green(serverNames.length)}`);
    }
  }

  if (configTargets.code) {
    console.log(chalk.bold("   Claude Code:"));
    const mcpJsonPath = getMCPJsonPath();
    const hasExistingMcpConfig = await hasMCPConfig();
    console.log(`     Config file: ${chalk.cyan(mcpJsonPath)}`);

    if (hasExistingMcpConfig) {
      console.log(
        `     ${chalk.yellow("Existing .mcp.json - would be replaced")}`
      );
    } else {
      console.log(`     ${chalk.green("New .mcp.json file would be created")}`);
    }
    console.log(
      `     Servers to configure: ${chalk.green(serverNames.length)}`
    );
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
  let needsBackup = false;
  if (configTargets.desktop && !options.force) {
    const claudeConfigPath = detectClaudeConfig();
    const existingDesktopConfig = await readClaudeConfig(claudeConfigPath);
    needsBackup = existingDesktopConfig.exists;
  }

  if (needsBackup) {
    console.log(chalk.blue("💾 Backup:"));
    console.log(
      `   ${chalk.dim("Current Desktop config would be backed up before changes")}`
    );
    console.log("");
  }

  // Show final summary
  console.log(chalk.green("✅ Summary:"));
  console.log(`   • ${serverNames.length} servers would be installed via NPX`);

  if (configTargets.desktop) {
    const claudeConfigPath = detectClaudeConfig();
    const existingDesktopConfig = await readClaudeConfig(claudeConfigPath);
    console.log(
      `   • Claude Desktop config would be ${existingDesktopConfig.exists ? "updated" : "created"}`
    );
  }

  if (configTargets.code) {
    const hasExistingMcpConfig = await hasMCPConfig();
    console.log(
      `   • Claude Code .mcp.json would be ${hasExistingMcpConfig ? "updated" : "created"}`
    );
  }

  console.log(
    `   • ${needsBackup ? "Desktop backup would be created" : "No backup needed"}`
  );

  console.log(
    chalk.dim(
      "\n💡 To actually perform these changes, run the same command without --dry-run"
    )
  );
}

async function installServers(
  serverNames: string[],
  options: InitOptions,
  configTargets: ConfigurationTargets
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
    await showDryRunDetails(serverNames, options, configTargets);
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

    // Generate configuration for successful installations
    const successfulServerNames = successful
      .map(result => {
        return serverNames.find(name => {
          const server = SERVER_REGISTRY[name];
          return server?.package === result.packageName;
        });
      })
      .filter(name => name !== undefined) as string[];

    // Collect environment variables for all servers
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

      const updateResult = await updateClaudeConfig(
        serverConfigs,
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

    // Update Claude Code configuration if selected
    if (configTargets.code) {
      const codeSpinner = createSpinner(
        "Creating Claude Code .mcp.json configuration"
      );
      codeSpinner.start();

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

    // Show completion message
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

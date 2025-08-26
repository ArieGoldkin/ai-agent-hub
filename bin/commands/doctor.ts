/**
 * Doctor command - Environment and configuration diagnostics
 */

import { Command } from "commander";
import chalk from "chalk";
import { createLogger } from "../utils/logger.js";

// Import new modules
import {
  readClaudeConfig,
  validateClaudeConfig
} from "../../src/claude-config/index.js";
import { validateMCPConfig } from "../../src/claude-code-config/index.js";
import {
  detectConfigTargets,
  getAllServersWithLocations
} from "../../src/config-manager/index.js";
import {
  getSystemInfo,
  validateInstallation
} from "../../src/mcp-installer/index.js";
import { SERVER_REGISTRY } from "../../src/server-registry/index.js";

const logger = createLogger("doctor");

export const doctorCommand = new Command("doctor")
  .description("Diagnose environment and validate Claude Desktop configuration")
  .option("--fix", "Attempt to fix common issues automatically")
  .option("--verbose", "Show detailed diagnostic information")
  .action(async options => {
    try {
      logger.info("Running AI Agent Hub diagnostics");

      console.log(chalk.blue("🔍 AI Agent Hub Doctor\n"));

      let hasErrors = false;
      let hasWarnings = false;

      // System Information
      console.log(chalk.bold("📊 System Information:"));
      const systemInfo = await getSystemInfo();

      console.log(`   Platform: ${chalk.cyan(systemInfo.platform)}`);
      console.log(
        `   Node.js: ${chalk.cyan(systemInfo.nodeVersion || "not found")}`
      );

      // Node.js version check
      if (systemInfo.nodeVersion) {
        const nodeVersion = parseInt(
          systemInfo.nodeVersion.slice(1).split(".")[0] ?? "0"
        );
        if (nodeVersion >= 20) {
          console.log(`   ${chalk.green("✅")} Node.js version is compatible`);
        } else {
          console.log(
            `   ${chalk.red("❌")} Node.js version is too old (requires >= 20.0.0)`
          );
          hasErrors = true;
        }
      } else {
        console.log(`   ${chalk.red("❌")} Node.js not found`);
        hasErrors = true;
      }

      // NPX availability
      console.log(
        `   NPX: ${chalk.cyan(systemInfo.npxVersion || "not found")}`
      );
      if (systemInfo.npxVersion) {
        console.log(`   ${chalk.green("✅")} NPX is available`);
      } else {
        console.log(`   ${chalk.red("❌")} NPX is not available`);
        hasErrors = true;
      }

      // UVX availability (for git server)
      console.log(
        `   UVX: ${systemInfo.uvxAvailable ? chalk.green("available") : chalk.dim("not available")}`
      );
      if (!systemInfo.uvxAvailable) {
        console.log(
          `   ${chalk.yellow("⚠️ ")} UVX not available - git server will not work`
        );
        hasWarnings = true;
      }

      console.log();

      // All Configurations
      console.log(chalk.bold("🖥️  Configurations:"));

      const configState = await detectConfigTargets();
      const allServerLocations = await getAllServersWithLocations();
      const uniqueServers = [
        ...new Set(allServerLocations.map(s => s.serverId))
      ];

      // Check each configuration target
      for (const target of configState.targets) {
        console.log(`   ${target.name}:`);
        console.log(`     Path: ${chalk.cyan(target.path)}`);

        if (target.exists) {
          console.log(`     ${chalk.green("✅")} Configuration file exists`);

          // Validate format based on type
          if (target.type === "desktop") {
            const config = await readClaudeConfig(target.path);
            if (config.config && validateClaudeConfig(config.config)) {
              console.log(
                `     ${chalk.green("✅")} Configuration format is valid`
              );
            } else {
              console.log(
                `     ${chalk.red("❌")} Configuration format is invalid`
              );
              hasErrors = true;
            }
          } else if (target.type === "code") {
            const validation = await validateMCPConfig();
            if (validation.valid) {
              console.log(
                `     ${chalk.green("✅")} Configuration format is valid`
              );
            } else {
              console.log(
                `     ${chalk.red("❌")} Configuration format is invalid`
              );
              validation.errors.forEach(error => {
                console.log(`       ${chalk.dim(error)}`);
              });
              hasErrors = true;
            }

            if (validation.warnings.length > 0) {
              validation.warnings.forEach(warning => {
                console.log(`     ${chalk.yellow("⚠️ ")} ${warning}`);
              });
              hasWarnings = true;
            }
          }

          const serverCount =
            target.type === "desktop"
              ? configState.servers.desktop.length
              : configState.servers.code.length;
          console.log(
            `     Configured servers: ${chalk.cyan(serverCount.toString())}`
          );
        } else {
          console.log(
            `     ${chalk.yellow("⚠️ ")} Configuration file does not exist`
          );
          if (target.type === "desktop") {
            hasWarnings = true;
          }
        }
      }

      console.log(
        `   Total unique servers: ${chalk.cyan(uniqueServers.length.toString())}`
      );
      if (uniqueServers.length === 0) {
        console.log(`   ${chalk.yellow("⚠️ ")} No MCP servers configured`);
        hasWarnings = true;
      } else {
        console.log(`   ${chalk.green("✅")} MCP servers are configured`);
      }

      console.log();

      // MCP Server Validation
      if (uniqueServers.length > 0) {
        console.log(chalk.bold("🔧 MCP Server Status:"));

        for (const serverName of uniqueServers) {
          const server = SERVER_REGISTRY[serverName];

          if (server) {
            const locations = allServerLocations.filter(
              s => s.serverId === serverName
            );
            const locationStr = locations.map(s => s.configType).join(", ");
            console.log(
              `   ${chalk.bold(serverName)} (${server.name}) ${chalk.dim(`[${locationStr}]`)}:`
            );

            // Check environment variables
            if (server.requiredEnv.length > 0) {
              const missingEnv = server.requiredEnv.filter(
                env => !process.env[env]
              );
              if (missingEnv.length === 0) {
                console.log(
                  `     ${chalk.green("✅")} All required environment variables set`
                );
              } else {
                console.log(
                  `     ${chalk.red("❌")} Missing required env vars: ${missingEnv.join(", ")}`
                );
                hasErrors = true;
              }
            }

            // Validate installation (optional, as it might be slow)
            if (options.verbose) {
              try {
                const validation = await validateInstallation(
                  server.package,
                  server.version
                );
                if (validation.valid) {
                  console.log(
                    `     ${chalk.green("✅")} Package is accessible via NPX`
                  );
                } else {
                  console.log(
                    `     ${chalk.yellow("⚠️ ")} Package validation failed: ${validation.error}`
                  );
                  hasWarnings = true;
                }
              } catch {
                console.log(
                  `     ${chalk.yellow("⚠️ ")} Could not validate package accessibility`
                );
                hasWarnings = true;
              }
            }
          } else {
            console.log(`   ${chalk.bold(serverName)}:`);
            console.log(
              `     ${chalk.yellow("⚠️ ")} Unknown server (not in registry)`
            );
            hasWarnings = true;
          }
        }

        console.log();
      }

      // Environment Variables Check
      console.log(chalk.bold("🔐 Environment Variables:"));

      const allRequiredEnvVars = new Set<string>();
      const allOptionalEnvVars = new Set<string>();

      Object.values(SERVER_REGISTRY).forEach(server => {
        server.requiredEnv.forEach(env => allRequiredEnvVars.add(env));
        server.optionalEnv.forEach(env => allOptionalEnvVars.add(env));
      });

      // Check common environment variables
      const commonEnvVars = [
        "GITHUB_TOKEN",
        "DATABASE_URL",
        "CONTEXT7_API_KEY"
      ];

      for (const envVar of commonEnvVars) {
        if (process.env[envVar]) {
          console.log(`   ${chalk.green("✅")} ${envVar} is set`);
        } else {
          if (allRequiredEnvVars.has(envVar)) {
            console.log(
              `   ${chalk.red("❌")} ${envVar} is not set (required by some servers)`
            );
            hasWarnings = true;
          } else {
            console.log(`   ${chalk.dim("○")} ${envVar} is not set (optional)`);
          }
        }
      }

      console.log();

      // Summary
      console.log(chalk.bold("📋 Summary:"));

      if (hasErrors) {
        console.log(
          `   ${chalk.red("❌")} Errors detected - some functionality may not work`
        );
      } else {
        console.log(`   ${chalk.green("✅")} No critical errors detected`);
      }

      if (hasWarnings) {
        console.log(
          `   ${chalk.yellow("⚠️ ")} Warnings found - see details above`
        );
      } else {
        console.log(`   ${chalk.green("✅")} No warnings`);
      }

      console.log();

      // Recommendations
      console.log(chalk.bold("💡 Recommendations:"));

      if (hasErrors) {
        console.log("   1. Fix critical errors shown above");
        console.log("   2. Ensure Node.js >= 20.0.0 and NPX are installed");
      }

      if (allServerLocations.length === 0) {
        console.log(
          `   • Run ${chalk.cyan("ai-agent-hub init")} to set up MCP servers`
        );
      }

      if (hasWarnings) {
        console.log(
          "   • Set missing environment variables for enhanced functionality"
        );
        console.log(
          `   • Run ${chalk.cyan("ai-agent-hub list")} to see server requirements`
        );
      }

      if (!systemInfo.uvxAvailable) {
        console.log(
          `   • Install uv/uvx for Python-based servers: ${chalk.cyan("pip install uv")}`
        );
      }

      console.log(
        `   • Run ${chalk.cyan("ai-agent-hub doctor --verbose")} for detailed validation`
      );

      // Verbose system information
      if (options.verbose) {
        console.log(chalk.bold("\n🔍 Detailed System Information:"));
        console.log(`   Architecture: ${process.arch}`);
        console.log(
          `   Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
        );
        console.log(`   Working Directory: ${process.cwd()}`);
        console.log(`   PATH: ${process.env.PATH?.split(":").length} entries`);

        // Show configuration contents for each target that exists
        for (const target of configState.targets) {
          if (target.exists) {
            console.log(`\n📄 ${target.name} Configuration Contents:`);
            if (target.type === "desktop") {
              const config = await readClaudeConfig(target.path);
              if (config.config) {
                console.log(JSON.stringify(config.config, null, 2));
              }
            } else if (target.type === "code") {
              const { loadMCPConfig } = await import(
                "../../src/claude-code-config/index.js"
              );
              const config = await loadMCPConfig();
              if (config) {
                console.log(JSON.stringify(config, null, 2));
              }
            }
          }
        }
      }

      if (options.fix) {
        console.log(chalk.bold("\n🔧 Auto-fix Mode:"));
        console.log(
          `   ${chalk.yellow("⚠️ ")} Auto-fix functionality is not yet implemented`
        );
        console.log(
          "   Please address issues manually using the recommendations above"
        );
      }

      // Exit with error code if there are critical issues
      if (hasErrors) {
        process.exit(1);
      }
    } catch (error) {
      logger.error("Doctor command failed:", error);
      console.error(
        chalk.red("\n❌ Diagnostics failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

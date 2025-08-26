/**
 * Setup command helper utilities
 */

import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";

// Dynamic import for enquirer since it's a CommonJS module
async function getEnquirer() {
  const enquirer = await import("enquirer");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkg = enquirer.default as any;
  return {
    prompt: pkg.prompt || pkg,
    Select: pkg.Select,
    MultiSelect: pkg.MultiSelect
  };
}

export interface SetupMode {
  type: "quick" | "custom";
  preset?: "dev" | "prod" | "minimal";
}

export interface ServerSelection {
  core: string[];
  optional: string[];
}

export interface AgentSelection {
  agents: string[];
}

export interface SetupOptions {
  profileName: string;
  debugLogging: boolean;
  autoStart: boolean;
  port: number;
}

export interface EnvironmentConfig {
  githubToken?: string;
  context7ApiKey?: string;
}

export const PRESET_CONFIGS = {
  dev: {
    name: "Development",
    description: "Full development setup with all tools and debugging",
    servers: {
      core: ["filesystem", "git", "github"],
      optional: ["sequential-thinking", "context7", "playwright"]
    },
    options: {
      profileName: "development",
      debugLogging: true,
      autoStart: false,
      port: 3000
    }
  },
  prod: {
    name: "Production",
    description: "Production-ready setup with core servers only",
    servers: {
      core: ["filesystem", "git", "github"],
      optional: []
    },
    options: {
      profileName: "production",
      debugLogging: false,
      autoStart: true,
      port: 3000
    }
  },
  minimal: {
    name: "Minimal",
    description: "Minimal setup with filesystem and git only",
    servers: {
      core: ["filesystem", "git"],
      optional: []
    },
    options: {
      profileName: "minimal",
      debugLogging: false,
      autoStart: false,
      port: 3000
    }
  }
};

export function displayWelcome(): void {
  console.log();
  console.log(chalk.cyan("╔════════════════════════════════════════╗"));
  console.log(
    chalk.cyan("║         ") +
      chalk.bold.white("AI Agent Hub Setup") +
      chalk.cyan("         ║")
  );
  console.log(
    chalk.cyan("║    ") +
      chalk.dim("MCP Server Orchestration System") +
      chalk.cyan("    ║")
  );
  console.log(chalk.cyan("╚════════════════════════════════════════╝"));
  console.log();
  console.log(chalk.dim("Welcome to the interactive setup wizard!"));
  console.log(
    chalk.dim("This will help you configure your AI Agent Hub instance.")
  );
  console.log();
}

export async function selectSetupMode(): Promise<SetupMode> {
  const { Select } = await getEnquirer();

  const response = await new Select({
    name: "mode",
    message: "How would you like to set up AI Agent Hub?",
    choices: [
      {
        name: "quick",
        message:
          chalk.green("Quick Setup") +
          chalk.dim(" - Use pre-configured profiles")
      },
      {
        name: "custom",
        message:
          chalk.blue("Custom Configuration") +
          chalk.dim(" - Choose individual settings")
      }
    ]
  }).run();

  if (response === "quick") {
    const preset = (await new Select({
      name: "preset",
      message: "Choose a preset configuration:",
      choices: Object.entries(PRESET_CONFIGS).map(([key, config]) => ({
        name: key,
        message: `${config.name} - ${chalk.dim(config.description)}`
      }))
    }).run()) as keyof typeof PRESET_CONFIGS;

    return { type: "quick", preset };
  }

  return { type: "custom" };
}

export async function selectAgents(): Promise<AgentSelection> {
  try {
    const agentsDir = resolve(process.cwd(), "agents");
    const agentFiles = await readdir(agentsDir);
    const agents = agentFiles
      .filter(file => file.endsWith(".md"))
      .map(file => file.replace(".md", ""));

    if (agents.length === 0) {
      console.log(
        chalk.yellow("No agent definitions found in agents/ directory")
      );
      return { agents: [] };
    }

    console.log();
    console.log(chalk.bold("Agent Selection"));
    console.log(chalk.dim("Choose which AI agents to enable:"));
    console.log();

    const { MultiSelect } = await getEnquirer();
    const selectedAgents = await new MultiSelect({
      name: "agents",
      message: "Select AI agents to enable:",
      choices: agents.map(agent => {
        const displayName = agent
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return {
          name: agent,
          message: `${displayName} - ${chalk.dim(getAgentDescription(agent))}`
        };
      }),
      instructions: chalk.dim("(Use spacebar to select, enter to confirm)")
    }).run();

    return { agents: selectedAgents };
  } catch {
    console.log(chalk.yellow("Could not read agents directory"));
    return { agents: [] };
  }
}

export async function configureOptions(): Promise<SetupOptions> {
  console.log();
  console.log(chalk.bold("Configuration Options"));
  console.log();

  const { prompt } = await getEnquirer();
  const responses = await prompt([
    {
      type: "input",
      name: "profileName",
      message: "Profile name:",
      initial: "custom"
    },
    {
      type: "confirm",
      name: "debugLogging",
      message: "Enable debug logging?",
      initial: false
    },
    {
      type: "confirm",
      name: "autoStart",
      message: "Auto-start gateway on boot?",
      initial: false
    },
    {
      type: "numeral",
      name: "port",
      message: "Gateway port:",
      initial: 3000
    }
  ]);

  return responses as SetupOptions;
}

export async function configureEnvironment(
  selectedServers: ServerSelection
): Promise<EnvironmentConfig> {
  const config: EnvironmentConfig = {};
  const requiredTokens: string[] = [];

  // Check which tokens are needed
  if (
    selectedServers.core.includes("github") ||
    selectedServers.optional.includes("github")
  ) {
    if (!process.env["GITHUB_TOKEN"]) {
      requiredTokens.push("GitHub Token");
    }
  }

  if (selectedServers.optional.includes("context7")) {
    if (!process.env["CONTEXT7_API_KEY"]) {
      requiredTokens.push("Context7 API Key");
    }
  }

  if (requiredTokens.length === 0) {
    return config;
  }

  console.log();
  console.log(chalk.bold("Environment Configuration"));
  console.log(chalk.dim("Some servers require API keys or tokens:"));
  console.log();

  const { prompt } = await getEnquirer();

  if (
    !process.env["GITHUB_TOKEN"] &&
    (selectedServers.core.includes("github") ||
      selectedServers.optional.includes("github"))
  ) {
    const response = await prompt({
      type: "password",
      name: "githubToken",
      message: "GitHub Personal Access Token:"
    } as { type: string; name: string; message: string });
    config.githubToken = (response as Record<string, string>).githubToken;
  }

  if (
    !process.env["CONTEXT7_API_KEY"] &&
    selectedServers.optional.includes("context7")
  ) {
    const response = await prompt({
      type: "password",
      name: "context7ApiKey",
      message: "Context7 API Key (optional):"
    } as { type: string; name: string; message: string });
    const contextResponse = response as Record<string, string>;
    if (contextResponse.context7ApiKey) {
      config.context7ApiKey = contextResponse.context7ApiKey;
    }
  }

  return config;
}

export function displayConfigPreview(
  servers: ServerSelection,
  agents: AgentSelection,
  options: SetupOptions,
  environment: EnvironmentConfig
): void {
  console.log();
  console.log(chalk.bold("Configuration Preview"));
  console.log(chalk.dim("═".repeat(50)));

  console.log(`Profile: ${chalk.cyan(options.profileName)}`);
  console.log(`Port: ${chalk.cyan(options.port)}`);
  console.log(
    `Debug Logging: ${options.debugLogging ? chalk.green("Yes") : chalk.red("No")}`
  );
  console.log(
    `Auto Start: ${options.autoStart ? chalk.green("Yes") : chalk.red("No")}`
  );

  console.log();
  console.log(chalk.bold("Servers:"));
  console.log(`  Core: ${chalk.green(servers.core.join(", "))}`);
  if (servers.optional.length > 0) {
    console.log(`  Optional: ${chalk.blue(servers.optional.join(", "))}`);
  }

  if (agents.agents.length > 0) {
    console.log();
    console.log(chalk.bold("Agents:"));
    console.log(`  ${chalk.cyan(agents.agents.join(", "))}`);
  }

  if (Object.keys(environment).length > 0) {
    console.log();
    console.log(chalk.bold("Environment:"));
    if (environment.githubToken)
      console.log(`  GitHub Token: ${chalk.green("Configured")}`);
    if (environment.context7ApiKey)
      console.log(`  Context7 API: ${chalk.green("Configured")}`);
  }

  console.log();
}

function getAgentDescription(agent: string): string {
  const descriptions: Record<string, string> = {
    "ai-ml-engineer": "ML model development and data science",
    "backend-system-architect": "Backend systems and API design",
    "code-quality-reviewer": "Code review and quality assurance",
    "frontend-ui-developer": "Frontend development and UI components",
    "rapid-ui-designer": "Quick UI prototyping and design",
    "sprint-prioritizer": "Sprint planning and task prioritization",
    "studio-coach": "Development coaching and mentoring",
    "ux-researcher": "User experience research and testing",
    "whimsy-injector": "Creative and playful development approach"
  };
  return descriptions[agent] || "AI agent for specialized tasks";
}

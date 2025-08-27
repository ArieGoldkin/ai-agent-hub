/**
 * Simple interactive prompt utility using Node.js built-in readline
 * Zero external dependencies
 */

import { createInterface } from "readline";
import { getClaudeDesktopConfigDescription } from "../../lib/paths.js";

export interface PromptChoice {
  key: string;
  label: string;
  description: string;
}

export interface InstallationChoice {
  target: 'project' | 'desktop' | 'both' | 'custom';
  installAgents: boolean;
  installProjectMCP: boolean;
  installDesktopMCP: boolean;
}

/**
 * Simple prompt for user input
 */
export function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Show multiple choice prompt and return the selected choice
 */
export async function multiChoice(question: string, choices: PromptChoice[]): Promise<string> {
  console.log(`\n${question}\n`);
  
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice.label}`);
    console.log(`     ${choice.description}\n`);
  });

  while (true) {
    const answer = await prompt("Enter your choice (number): ");
    const choiceIndex = parseInt(answer) - 1;
    
    if (choiceIndex >= 0 && choiceIndex < choices.length) {
      return choices[choiceIndex].key;
    }
    
    console.log("❌ Invalid choice. Please enter a valid number.\n");
  }
}

/**
 * Ask user where they want to create AI Agent Hub files
 */
export async function promptInstallationTarget(_inProject: boolean, hasDesktop: boolean): Promise<InstallationChoice> {
  const choices: PromptChoice[] = [];
  
  if (hasDesktop) {
    choices.push({
      key: 'desktop',
      label: 'Claude Desktop',
      description: 'Create MCP servers globally in Claude Desktop configuration'
    });
  }
  
  choices.push({
    key: 'project',
    label: 'Claude Code (in repo)',
    description: 'Create AI agents + MCP servers in current directory (.claude/agents/ + .mcp.json)'
  });
  
  if (hasDesktop) {
    choices.push({
      key: 'both',
      label: 'Both',
      description: 'Create agents in repo + MCP servers in both repo and Claude Desktop'
    });
  }

  const choice = await multiChoice("🤖 Where would you like to create AI Agent Hub files?", choices);
  switch (choice) {
    case 'project':
      return {
        target: 'project',
        installAgents: true,
        installProjectMCP: true,
        installDesktopMCP: false
      };
    case 'desktop':
      return {
        target: 'desktop',
        installAgents: false,
        installProjectMCP: false,
        installDesktopMCP: true
      };
    case 'both':
      return {
        target: 'both',
        installAgents: true,
        installProjectMCP: true,
        installDesktopMCP: true
      };
    default:
      throw new Error(`Unknown choice: ${choice}`);
  }
}

/**
 * Show confirmation of what will be created
 */
export function showInstallationPlan(choice: InstallationChoice, _inProject: boolean, _hasDesktop: boolean): void {
  console.log("\n📋 Creation Plan:\n");
  
  if (choice.installAgents) {
    console.log("✅ AI Agents:");
    console.log("   • 9 specialized agent personalities → .claude/agents/");
    console.log("   • Agent configuration → .claude/settings.local.json\n");
  }
  
  if (choice.installProjectMCP) {
    console.log("✅ Project MCP Servers:");
    console.log("   • 5 MCP servers → .mcp.json");
    console.log("   • memory, sequential-thinking, context7, playwright, supabase\n");
  }
  
  if (choice.installDesktopMCP) {
    console.log("✅ Claude Desktop MCP Servers:");
    console.log(`   • 7 MCP servers → ${getClaudeDesktopConfigDescription()}`);
    console.log("   • All project servers + filesystem, github\n");
  }
  
  if (!choice.installAgents && !choice.installProjectMCP && !choice.installDesktopMCP) {
    console.log("❌ Nothing will be created");
    console.log("   Please select at least one creation option\n");
  }
}

/**
 * Confirm creation with user
 */
export async function confirmInstallation(): Promise<boolean> {
  const confirm = await multiChoice("Proceed with creation?", [
    { key: 'yes', label: 'Yes, create now', description: 'Continue with the file creation' },
    { key: 'no', label: 'Cancel', description: 'Exit without creating anything' }
  ]);
  
  return confirm === 'yes';
}
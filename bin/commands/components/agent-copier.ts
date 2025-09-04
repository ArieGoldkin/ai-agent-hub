/**
 * Agent file copier component
 */

import { existsSync, readdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

/**
 * List of required agent files
 */
export const REQUIRED_AGENTS = [
  'ai-ml-engineer.md',
  'backend-system-architect.md',
  'code-quality-reviewer.md',
  'frontend-ui-developer.md',
  'rapid-ui-designer.md',
  'sprint-prioritizer.md',
  'studio-coach.md',
  'ux-researcher.md',
  'whimsy-injector.md'
];

/**
 * Agent descriptions for display
 */
export const AGENT_DESCRIPTIONS: Record<string, string> = {
  'ai-ml-engineer.md': 'AI/ML implementation expert',
  'backend-system-architect.md': 'System design specialist',
  'code-quality-reviewer.md': 'Code review automation',
  'frontend-ui-developer.md': 'UI/UX implementation',
  'rapid-ui-designer.md': 'Quick UI prototyping',
  'sprint-prioritizer.md': 'Agile planning assistant',
  'studio-coach.md': 'Team coordination',
  'ux-researcher.md': 'User research & testing',
  'whimsy-injector.md': 'Creative enhancement'
};

/**
 * Copy missing agents to target directory
 */
export async function copyMissingAgents(
  agentsPath: string,
  missingAgents: string[]
): Promise<void> {
  console.log(`📦 Installing ${missingAgents.length} missing AI Agent Hub personalities...`);
  
  for (const agentFile of missingAgents) {
    const sourcePath = join(agentsPath, agentFile);
    const destPath = join(".claude/agents", agentFile);
    
    if (existsSync(sourcePath)) {
      const content = await readFile(sourcePath);
      await writeFile(destPath, content);
    }
  }
  
  console.log(`✅ Installed ${missingAgents.length} AI agent personalities:`);
  
  for (const agent of missingAgents) {
    console.log(`   • ${agent.replace('.md', '')} - ${AGENT_DESCRIPTIONS[agent] || 'Specialized agent'}`);
  }
}

/**
 * Report on custom agents that were preserved
 */
export function reportCustomAgents(existingAgents: string[]): void {
  const customAgents = existingAgents.filter(a => !REQUIRED_AGENTS.includes(a));
  if (customAgents.length > 0) {
    console.log(`📌 Preserved ${customAgents.length} existing custom agent(s):`);
    for (const agent of customAgents) {
      console.log(`   • ${agent.replace('.md', '')}`);
    }
  }
}

/**
 * Get list of missing agents
 */
export function getMissingAgents(): string[] {
  const existingAgents = readdirSync(".claude/agents").filter(f => f.endsWith('.md'));
  const existingAgentNames = new Set(existingAgents);
  
  return REQUIRED_AGENTS.filter(agent => !existingAgentNames.has(agent));
}
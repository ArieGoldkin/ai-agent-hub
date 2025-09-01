/**
 * Agent Registry section generator
 */

import { AgentMetadata } from "../types.js";
import { formatAgentName, getAgentEmoji, getShortDescription } from "../utils.js";

/**
 * Generate agent registry section with rich metadata
 */
export function generateAgentRegistry(agents: AgentMetadata[]): string {
  const sections: string[] = ['## Agent Registry\n'];
  
  sections.push('*Dynamically generated from installed agents*\n');
  
  for (const agent of agents) {
    const emoji = getAgentEmoji(agent.name);
    sections.push(`### ${formatAgentName(agent.name)} ${emoji}`);
    
    // Role description
    sections.push(`- **Role**: ${getShortDescription(agent.description)}`);
    
    // Tools if available
    if (agent.tools && agent.tools.length > 0) {
      sections.push(`- **Tools**: ${agent.tools.join(', ')}`);
    }
    
    // Orchestration info
    if (agent.orchestrator && agent.manages) {
      sections.push(`- **Orchestrates**: ${agent.manages.map(formatAgentName).join(', ')}`);
    }
    
    // Context flow
    if (agent.reads_from && agent.reads_from.length > 0) {
      sections.push(`- **Reads from**: ${agent.reads_from.map(formatAgentName).join(', ')}`);
    }
    if (agent.writes_to && agent.writes_to.length > 0) {
      sections.push(`- **Writes to**: ${agent.writes_to.map(formatAgentName).join(', ')}`);
    }
    
    // Provides context
    if (agent.provides_context && agent.provides_context.length > 0) {
      sections.push(`- **Provides**: ${agent.provides_context.join(', ')}`);
    }
    
    // Invocation pattern
    sections.push(`- **Trigger**: "Use ${formatAgentName(agent.name)} to [task]"`);
    
    sections.push('');  // Empty line between agents
  }
  
  return sections.join('\n');
}
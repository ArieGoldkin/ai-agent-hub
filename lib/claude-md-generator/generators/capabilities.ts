/**
 * Agent Capabilities Matrix generator
 */

import { AgentMetadata } from "../types.js";
import { formatAgentName, agentHasCapability } from "../utils.js";

/**
 * Generate capabilities matrix
 */
export function generateCapabilitiesMatrix(agents: AgentMetadata[]): string {
  const sections: string[] = ['## Agent Capabilities Matrix\n'];
  
  // Define capability categories
  const capabilities = [
    'Planning',
    'Design',
    'Backend',
    'Frontend',
    'ML/AI',
    'Quality',
    'Research',
    'Delight'
  ];
  
  // Create matrix header
  sections.push('| Agent | ' + capabilities.join(' | ') + ' |');
  sections.push('|-------|' + capabilities.map(() => '-------').join('|') + '|');
  
  // Add agent rows
  for (const agent of agents) {
    const row = [`| ${formatAgentName(agent.name)} |`];
    
    for (const capability of capabilities) {
      const hasCapability = agentHasCapability(agent, capability);
      row.push(hasCapability ? ' ✓ |' : ' - |');
    }
    
    sections.push(row.join(''));
  }
  
  sections.push('');
  
  return sections.join('\n');
}
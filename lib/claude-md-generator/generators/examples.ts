/**
 * Agent Invocation Examples generator
 */

import { AgentMetadata } from "../types.js";
import { formatAgentName } from "../utils.js";

/**
 * Generate invocation examples from agent descriptions
 */
export function generateInvocationExamples(agents: AgentMetadata[]): string {
  const sections: string[] = ['## Agent Invocation Examples\n'];
  
  sections.push('### Common Patterns\n');
  
  for (const agent of agents) {
    sections.push(`**${formatAgentName(agent.name)}**:`);
    
    // Extract examples from description if it contains them
    if (agent.description && agent.description.includes('<example>')) {
      const examples = agent.description.match(/<example>([\s\S]*?)<\/example>/g);
      if (examples) {
        for (const example of examples) {
          const cleaned = example
            .replace(/<\/?example>/g, '')
            .replace(/<commentary>[\s\S]*?<\/commentary>/g, '')
            .trim();
          
          // Extract just the user message
          const userMatch = cleaned.match(/user:\s*"([^"]+)"/);
          if (userMatch) {
            sections.push(`- "Use ${formatAgentName(agent.name)} to ${userMatch[1].toLowerCase()}"`);
          }
        }
      }
    } else {
      // Generate generic example
      sections.push(`- "Use ${formatAgentName(agent.name)} to [specific task]"`);
    }
    
    sections.push('');
  }
  
  return sections.join('\n');
}
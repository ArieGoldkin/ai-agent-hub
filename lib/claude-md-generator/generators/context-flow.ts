/**
 * Context Flow visualization generator
 */

import { AgentMetadata } from "../types.js";
import { formatAgentName, getNodeId } from "../utils.js";

/**
 * Generate context flow visualization
 */
export function generateContextFlow(agents: AgentMetadata[]): string {
  const sections: string[] = ['## Context Flow\n'];
  
  sections.push('```mermaid');
  sections.push('graph TD');
  
  // Find orchestrator
  const orchestrator = agents.find(a => a.orchestrator);
  
  if (orchestrator) {
    // Show orchestrator at top
    sections.push(`  SC[${formatAgentName(orchestrator.name)}]`);
    sections.push(`  style SC fill:#f9f,stroke:#333,stroke-width:4px`);
    
    // Show managed agents
    if (orchestrator.manages) {
      for (const managed of orchestrator.manages) {
        const agent = agents.find(a => a.name === managed);
        if (agent) {
          const nodeId = getNodeId(agent.name);
          sections.push(`  ${nodeId}[${formatAgentName(agent.name)}]`);
          sections.push(`  SC --> ${nodeId}`);
        }
      }
    }
  }
  
  // Show other context flows
  for (const agent of agents) {
    if (agent.reads_from) {
      for (const source of agent.reads_from) {
        const sourceId = getNodeId(source);
        const targetId = getNodeId(agent.name);
        sections.push(`  ${sourceId} -.->|context| ${targetId}`);
      }
    }
  }
  
  sections.push('```\n');
  
  sections.push('### Context Dependencies\n');
  
  for (const agent of agents) {
    if (agent.depends_on && agent.depends_on.length > 0) {
      sections.push(`- **${formatAgentName(agent.name)}** depends on: ${agent.depends_on.join(', ')}`);
    }
  }
  
  sections.push('');
  
  return sections.join('\n');
}
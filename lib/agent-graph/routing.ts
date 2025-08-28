/**
 * Agent Routing Functions
 * 
 * Functions for determining next agents and parallel execution patterns
 * based on current workflow state and available context.
 */

import { agentNodes } from './nodes.js';
import { handoffRelationships } from './relationships.js';

/**
 * Get valid next agents based on current agent and context
 */
export function getNextAgents(
  currentAgent: string,
  availableContext: Set<string>
): string[] {
  const validAgents: string[] = [];
  
  for (const relationship of handoffRelationships) {
    if (relationship.from === currentAgent || relationship.from === "*") {
      const node = agentNodes[relationship.to];
      if (!node) continue;
      
      // Check if required context is available
      const hasRequired = relationship.contextRequired.every(
        ctx => ctx === "*" || availableContext.has(ctx)
      );
      
      if (hasRequired) {
        validAgents.push(relationship.to);
      }
    }
  }
  
  return [...new Set(validAgents)];
}

/**
 * Identify agents that can run in parallel
 */
export function getParallelAgents(agents: string[]): string[][] {
  const parallel: string[][] = [];
  const sequential: string[] = [];
  
  for (const agent of agents) {
    const node = agentNodes[agent];
    if (!node) continue;
    
    if (node.canRunParallel) {
      // Check if it can run with others
      const group = parallel.find(grp => 
        grp.every(a => {
          const otherNode = agentNodes[a];
          return otherNode?.canRunParallel;
        })
      );
      
      if (group) {
        group.push(agent);
      } else {
        parallel.push([agent]);
      }
    } else {
      sequential.push(agent);
    }
  }
  
  return [...parallel, ...sequential.map(a => [a])];
}
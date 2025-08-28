/**
 * Agent Graph Validation
 * 
 * Functions for validating the agent graph structure and
 * detecting potential issues like circular dependencies.
 */

import { agentNodes } from './nodes.js';
import { handoffRelationships } from './relationships.js';

/**
 * Detect circular dependencies
 */
export function detectCircularDependencies(): string[] {
  const issues: string[] = [];
  const visited = new Set<string>();
  const stack = new Set<string>();
  
  function dfs(agent: string, path: string[]): void {
    if (stack.has(agent)) {
      issues.push(`Circular dependency: ${path.join(" → ")} → ${agent}`);
      return;
    }
    
    if (visited.has(agent)) return;
    
    visited.add(agent);
    stack.add(agent);
    
    const relationships = handoffRelationships.filter(r => r.from === agent);
    for (const rel of relationships) {
      dfs(rel.to, [...path, agent]);
    }
    
    stack.delete(agent);
  }
  
  for (const agent of Object.keys(agentNodes)) {
    if (!visited.has(agent)) {
      dfs(agent, []);
    }
  }
  
  return issues;
}
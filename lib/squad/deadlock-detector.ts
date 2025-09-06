import { DeadlockInfo } from './lock-types.js';

export class DeadlockDetector {
  static findCycle(dependencies: Map<number, Set<number>>): number[] {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();
    const cycleAgents: number[] = [];
    
    const hasCycle = (agent: number): boolean => {
      visited.add(agent);
      recursionStack.add(agent);
      
      const deps = dependencies.get(agent);
      if (deps) {
        for (const dep of deps) {
          if (!visited.has(dep)) {
            if (hasCycle(dep)) {
              cycleAgents.push(agent);
              return true;
            }
          } else if (recursionStack.has(dep)) {
            cycleAgents.push(agent);
            return true;
          }
        }
      }
      
      recursionStack.delete(agent);
      return false;
    };
    
    for (const agent of dependencies.keys()) {
      if (!visited.has(agent) && hasCycle(agent)) {
        return cycleAgents;
      }
    }
    
    return [];
  }
  
  static createDeadlockInfo(cycleAgents: number[]): DeadlockInfo {
    if (cycleAgents.length > 0) {
      return { hasDeadlock: true, agents: cycleAgents.reverse() };
    }
    return { hasDeadlock: false };
  }
}
/**
 * Bottleneck Detection Module
 * 
 * Detects workflow bottlenecks including slow agents, context overloads, and circular dependencies.
 */

import type { SessionContext } from '../types/context.js';
import type { BottleneckReport, AgentBottleneck, ContextOverload, CircularDependency } from '../types/analytics/index.js';
import { calculateAverageResponseTime, calculateRedundancy } from './utils.js';

/**
 * Identify agents with performance bottlenecks
 */
export function identifySlowAgents(context: SessionContext): AgentBottleneck[] {
  const bottlenecks: AgentBottleneck[] = [];
  
  context.agents.forEach((contexts, agentName) => {
    const avgProcessingTime = calculateAverageResponseTime(contexts);
    if (avgProcessingTime > 300000) { // 5 minutes
      bottlenecks.push({
        agentName,
        averageProcessingTime: avgProcessingTime,
        contextQueueSize: contexts.length,
        lastActivity: contexts[contexts.length - 1]?.timestamp || new Date(0),
        blockedBy: [],
        blocking: [],
        severity: avgProcessingTime > 600000 ? 'high' : 'medium'
      });
    }
  });
  
  return bottlenecks;
}

/**
 * Detect agents with context overloads
 */
export function detectContextOverloads(context: SessionContext): ContextOverload[] {
  const overloads: ContextOverload[] = [];
  
  context.agents.forEach((contexts, agentName) => {
    if (contexts.length > 10) {
      const contextSize = JSON.stringify(contexts).length;
      overloads.push({
        agentName,
        contextCount: contexts.length,
        contextSizeBytes: contextSize,
        redundancyLevel: calculateRedundancy(contexts),
        processingSlowdown: Math.min(contexts.length * 0.1, 0.5),
        recommendations: ['Consider context pruning', 'Implement context summarization']
      });
    }
  });
  
  return overloads;
}

/**
 * Find circular dependencies in agent handoffs
 */
export function findCircularDependencies(context: SessionContext): CircularDependency[] {
  // Simplified circular dependency detection
  const handoffs = context.decisionHistory.filter(d => d.type === 'handoff' && d.targetAgent);
  const dependencies: CircularDependency[] = [];
  
  // This is a basic implementation - could be enhanced with graph analysis
  const agentPairs = new Map<string, string[]>();
  handoffs.forEach(h => {
    const from = h.agentName;
    const to = h.targetAgent!;
    if (!agentPairs.has(from)) agentPairs.set(from, []);
    agentPairs.get(from)!.push(to);
  });
  
  return dependencies; // Placeholder for more sophisticated cycle detection
}

/**
 * Analyze queue depths for all agents
 */
export function analyzeQueueDepths(context: SessionContext): Array<{ 
  agentName: string; 
  pendingContexts: number; 
  processingTime: number; 
  estimatedClearTime: number 
}> {
  const queues: Array<{ agentName: string; pendingContexts: number; processingTime: number; estimatedClearTime: number }> = [];
  
  context.agents.forEach((contexts, agentName) => {
    const avgProcessingTime = calculateAverageResponseTime(contexts);
    queues.push({
      agentName,
      pendingContexts: contexts.length,
      processingTime: avgProcessingTime,
      estimatedClearTime: avgProcessingTime * contexts.length
    });
  });
  
  return queues;
}

/**
 * Identify stale contexts that haven't been accessed recently
 */
export function identifyStaleContexts(context: SessionContext): Array<{ 
  agentName: string; 
  contextAge: number; 
  lastAccessed: Date; 
  relevanceScore: number; 
  recommendation: 'archive' | 'update' | 'remove' 
}> {
  const stale: Array<{ agentName: string; contextAge: number; lastAccessed: Date; relevanceScore: number; recommendation: 'archive' | 'update' | 'remove' }> = [];
  const now = Date.now();
  
  context.agents.forEach((contexts, agentName) => {
    contexts.forEach(agentContext => {
      const age = (now - agentContext.timestamp.getTime()) / 3600000; // hours
      if (age > 24) { // More than 24 hours
        stale.push({
          agentName,
          contextAge: age,
          lastAccessed: agentContext.timestamp,
          relevanceScore: Math.max(0, 1 - (age / 168)), // Decreases over a week
          recommendation: age > 168 ? 'archive' : 'update'
        });
      }
    });
  });
  
  return stale;
}

/**
 * Generate recommendations for addressing bottlenecks
 */
export function generateBottleneckRecommendations(
  slowAgents: AgentBottleneck[], 
  overloads: ContextOverload[], 
  circular: CircularDependency[]
): string[] {
  const recommendations: string[] = [];
  
  if (slowAgents.length > 0) {
    recommendations.push("Consider optimizing slow agents or redistributing workload");
  }
  
  if (overloads.length > 0) {
    recommendations.push("Implement context summarization to reduce memory usage");
  }
  
  if (circular.length > 0) {
    recommendations.push("Review workflow design to eliminate circular dependencies");
  }
  
  return recommendations;
}

/**
 * Detect workflow bottlenecks and performance issues
 */
export function detectBottlenecks(context: SessionContext): BottleneckReport {
  const slowestAgents = identifySlowAgents(context);
  const contextOverloads = detectContextOverloads(context);
  const circularDependencies = findCircularDependencies(context);
  const queueDepths = analyzeQueueDepths(context);
  const staleContexts = identifyStaleContexts(context);
  const recommendations = generateBottleneckRecommendations(
    slowestAgents, contextOverloads, circularDependencies
  );

  return {
    slowestAgents,
    contextOverloads,
    circularDependencies,
    queueDepths,
    staleContexts,
    recommendations
  };
}
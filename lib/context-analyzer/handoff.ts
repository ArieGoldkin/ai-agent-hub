/**
 * Handoff Pattern Analysis Module
 * 
 * Analyzes handoff patterns between agents including success rates and common paths.
 */

import type { SessionContext, DecisionRecord } from '../types/context.js';
import type { HandoffAnalysis, HandoffPath, HandoffStats } from '../types/analytics/index.js';
import { findCircularDependencies } from './bottleneck.js';

/**
 * Identify common handoff paths between agents
 */
export function identifyCommonHandoffPaths(handoffs: DecisionRecord[]): HandoffPath[] {
  const pathMap = new Map<string, HandoffPath>();
  
  handoffs.forEach(handoff => {
    if (!handoff.targetAgent) return;
    
    const pathKey = `${handoff.agentName}->${handoff.targetAgent}`;
    if (!pathMap.has(pathKey)) {
      pathMap.set(pathKey, {
        fromAgent: handoff.agentName,
        toAgent: handoff.targetAgent,
        frequency: 0,
        averageTime: 0,
        successRate: 0,
        commonReasons: []
      });
    }
    
    const path = pathMap.get(pathKey)!;
    path.frequency++;
    path.commonReasons.push(handoff.reason);
  });
  
  return Array.from(pathMap.values()).sort((a, b) => b.frequency - a.frequency);
}

/**
 * Calculate average time between handoffs
 */
export function calculateAverageHandoffTime(handoffs: DecisionRecord[]): number {
  if (handoffs.length < 2) return 0;
  
  let totalTime = 0;
  for (let i = 1; i < handoffs.length; i++) {
    totalTime += handoffs[i].timestamp.getTime() - handoffs[i - 1].timestamp.getTime();
  }
  return totalTime / (handoffs.length - 1);
}

/**
 * Analyze handoff statistics by agent
 */
export function analyzeHandoffsByAgent(handoffs: DecisionRecord[]): Record<string, HandoffStats> {
  const stats: Record<string, HandoffStats> = {};
  
  handoffs.forEach(handoff => {
    if (!stats[handoff.agentName]) {
      stats[handoff.agentName] = {
        agentName: handoff.agentName,
        handoffsInitiated: 0,
        handoffsReceived: 0,
        successAsSource: 0,
        successAsTarget: 0,
        averageInitiationTime: 0,
        averageProcessingTime: 0
      };
    }
    
    stats[handoff.agentName].handoffsInitiated++;
    if (handoff.confidence > 0.7) {
      stats[handoff.agentName].successAsSource++;
    }
  });
  
  return stats;
}

/**
 * Analyze handoff patterns between agents
 */
export function analyzeHandoffPatterns(context: SessionContext): HandoffAnalysis {
  const handoffDecisions = context.decisionHistory.filter(d => d.type === 'handoff');
  const totalHandoffs = handoffDecisions.length;
  const successfulHandoffs = handoffDecisions.filter(d => d.confidence > 0.7).length;
  const failedHandoffs = totalHandoffs - successfulHandoffs;
  const successRate = totalHandoffs > 0 ? successfulHandoffs / totalHandoffs : 0;

  const commonPaths = identifyCommonHandoffPaths(handoffDecisions);
  const circularDeps = findCircularDependencies(context).map(cd => cd.agents.join(' → '));
  const avgHandoffTime = calculateAverageHandoffTime(handoffDecisions);
  const handoffsByAgent = analyzeHandoffsByAgent(handoffDecisions);

  return {
    totalHandoffs,
    successfulHandoffs,
    failedHandoffs,
    successRate,
    commonPaths,
    circularDependencies: circularDeps,
    averageHandoffTime: avgHandoffTime,
    handoffsByAgent
  };
}
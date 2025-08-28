/**
 * Context Growth Analysis Module
 * 
 * Analyzes context accumulation patterns, storage efficiency, and growth trends.
 */

import type { SessionContext } from '../types/context.js';
import type { ContextGrowthAnalysis, AccumulationPattern } from '../types/analytics.js';
import { calculateContextSize } from './utils.js';

/**
 * Calculate overall redundancy across all agents
 */
function calculateOverallRedundancy(context: SessionContext): number {
  const totalContexts = Array.from(context.agents.values()).reduce((sum, contexts) => sum + contexts.length, 0);
  const uniqueContexts = new Set();
  
  context.agents.forEach(contexts => {
    contexts.forEach(agentContext => {
      uniqueContexts.add(JSON.stringify(agentContext.context));
    });
  });
  
  return totalContexts > 0 ? Math.round((1 - uniqueContexts.size / totalContexts) * 100) : 0;
}

/**
 * Identify context accumulation patterns for each agent
 */
function identifyAccumulationPatterns(context: SessionContext): AccumulationPattern[] {
  const patterns: AccumulationPattern[] = [];
  
  context.agents.forEach((contexts, agentName) => {
    if (contexts.length < 3) return;
    
    const avgSize = contexts.reduce((sum, c) => sum + JSON.stringify(c).length, 0) / contexts.length;
    const duration = contexts[contexts.length - 1].timestamp.getTime() - contexts[0].timestamp.getTime();
    const frequency = duration > 0 ? contexts.length / (duration / 3600000) : 0; // per hour
    
    patterns.push({
      agentName,
      pattern: frequency > 2 ? 'exponential' : frequency > 0.5 ? 'linear' : 'sporadic',
      averageSize: avgSize,
      frequency,
      predictedGrowth: frequency * avgSize,
      recommendation: frequency > 2 ? 'Monitor closely - rapid growth detected' : 'Normal growth pattern'
    });
  });
  
  return patterns;
}

/**
 * Calculate total context size across all agents
 */
function calculateTotalContextSize(context: SessionContext): number {
  let totalSize = 0;
  context.agents.forEach(contexts => {
    totalSize += calculateContextSize(contexts);
  });
  return totalSize;
}

/**
 * Analyze context accumulation patterns and growth
 */
export function analyzeContextAccumulation(context: SessionContext): ContextGrowthAnalysis {
  const startTime = context.startTime;
  const endTime = context.lastUpdated;
  const totalGrowth = calculateTotalContextSize(context);
  const duration = endTime.getTime() - startTime.getTime();
  const growthRate = duration > 0 ? (totalGrowth / (duration / 3600000)) : 0; // bytes per hour

  const contextsByAgent: Record<string, number> = {};
  context.agents.forEach((contexts, agentName) => {
    contextsByAgent[agentName] = contexts.length;
  });

  const redundancy = calculateOverallRedundancy(context);
  const patterns = identifyAccumulationPatterns(context);
  const efficiency = Math.max(0, 100 - redundancy);

  return {
    sessionId: context.sessionId,
    startTime,
    endTime,
    totalGrowth,
    growthRate,
    contextsByAgent,
    redundancyDetected: redundancy,
    accumulationPatterns: patterns,
    storageEfficiency: efficiency
  };
}
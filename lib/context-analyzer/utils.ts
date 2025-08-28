/**
 * Context Analyzer Utilities
 * 
 * Shared utility functions for context analysis calculations and formatting.
 */

import type { AgentContext, DecisionRecord } from '../types/context.js';

/**
 * Calculate average response time between context entries
 */
export function calculateAverageResponseTime(contexts: AgentContext[]): number {
  if (contexts.length < 2) return 0;
  
  let totalTime = 0;
  for (let i = 1; i < contexts.length; i++) {
    totalTime += contexts[i].timestamp.getTime() - contexts[i - 1].timestamp.getTime();
  }
  return totalTime / (contexts.length - 1);
}

/**
 * Calculate processing speed (contexts per minute)
 */
export function calculateProcessingSpeed(contexts: AgentContext[]): number {
  if (contexts.length === 0) return 0;
  
  const duration = contexts[contexts.length - 1].timestamp.getTime() - contexts[0].timestamp.getTime();
  const minutes = duration / 60000;
  return minutes > 0 ? contexts.length / minutes : 0;
}

/**
 * Calculate average confidence score from contexts
 */
export function calculateAverageConfidence(contexts: AgentContext[]): number {
  const confidences = contexts.filter(c => c.confidence !== undefined).map(c => c.confidence!);
  return confidences.length > 0 ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length : 0;
}

/**
 * Calculate handoff success rate for an agent
 */
export function calculateHandoffSuccessRate(decisions: DecisionRecord[]): number {
  const handoffs = decisions.filter(d => d.type === 'handoff');
  if (handoffs.length === 0) return 0;
  
  const successful = handoffs.filter(d => d.confidence > 0.7).length;
  return successful / handoffs.length;
}

/**
 * Calculate decision quality score
 */
export function calculateDecisionQuality(decisions: DecisionRecord[]): number {
  if (decisions.length === 0) return 0;
  return decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
}

/**
 * Calculate context size in bytes
 */
export function calculateContextSize(contexts: AgentContext[]): number {
  return JSON.stringify(contexts).length;
}

/**
 * Calculate redundancy percentage in contexts
 */
export function calculateRedundancy(contexts: AgentContext[]): number {
  const unique = new Set();
  contexts.forEach(context => {
    unique.add(JSON.stringify(context.context));
  });
  
  return contexts.length > 0 ? Math.round((1 - unique.size / contexts.length) * 100) : 0;
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
/**
 * Performance Analysis Module
 * 
 * Analyzes workflow performance metrics and individual agent performance.
 */

import type { SessionContext } from '../types/context.js';
import type { PerformanceMetrics, AgentPerformance } from '../types/analytics.js';
import {
  calculateAverageResponseTime,
  calculateProcessingSpeed,
  calculateAverageConfidence,
  calculateHandoffSuccessRate,
  calculateDecisionQuality
} from './utils.js';

/**
 * Generate agent-specific performance recommendations
 */
function generateAgentRecommendations(agentName: string, context: SessionContext): string[] {
  const recommendations: string[] = [];
  const contexts = context.agents.get(agentName) || [];
  const decisions = context.decisionHistory.filter(d => d.agentName === agentName);
  
  if (contexts.length === 0) {
    recommendations.push("Consider adding context entries to improve collaboration");
  }
  
  if (decisions.length > 0) {
    const avgConfidence = calculateDecisionQuality(decisions);
    if (avgConfidence < 0.6) {
      recommendations.push("Focus on improving decision confidence scores");
    }
  }
  
  return recommendations;
}

/**
 * Analyze performance metrics for a specific agent
 */
export function analyzeAgentPerformance(agentName: string, context: SessionContext): AgentPerformance {
  const contexts = context.agents.get(agentName) || [];
  const decisions = context.decisionHistory.filter(d => d.agentName === agentName);
  
  return {
    agentName,
    totalContextAdded: contexts.length,
    averageResponseTime: calculateAverageResponseTime(contexts),
    contextProcessingSpeed: calculateProcessingSpeed(contexts),
    averageConfidenceScore: calculateAverageConfidence(contexts),
    handoffSuccessRate: calculateHandoffSuccessRate(decisions),
    decisionQuality: calculateDecisionQuality(decisions),
    lastActive: contexts.length > 0 ? contexts[contexts.length - 1].timestamp : new Date(0),
    totalDecisions: decisions.length,
    recommendations: generateAgentRecommendations(agentName, context)
  };
}

/**
 * Calculate overall workflow efficiency score
 */
export function calculateEfficiencyScore(agentPerformance: AgentPerformance[]): number {
  if (agentPerformance.length === 0) return 0;
  
  const avgConfidence = agentPerformance.reduce((sum, ap) => sum + ap.averageConfidenceScore, 0) / agentPerformance.length;
  const avgHandoffSuccess = agentPerformance.reduce((sum, ap) => sum + ap.handoffSuccessRate, 0) / agentPerformance.length;
  
  return Math.round((avgConfidence * 0.6 + avgHandoffSuccess * 0.4) * 100);
}

/**
 * Calculate workflow completeness percentage
 */
export function calculateWorkflowCompleteness(context: SessionContext): number {
  const totalAgents = 9; // Known agents in the system
  const activeAgents = context.agents.size;
  return Math.round((activeAgents / totalAgents) * 100);
}

/**
 * Analyze overall workflow performance metrics
 */
export function analyzeWorkflowPerformance(context: SessionContext): PerformanceMetrics {
  const sessionDuration = Date.now() - context.startTime.getTime();
  const agentNames = Array.from(context.agents.keys());
  const totalContextEntries = Array.from(context.agents.values())
    .reduce((sum, contexts) => sum + contexts.length, 0);
  
  const agentPerformance = agentNames.map(agent => analyzeAgentPerformance(agent, context));
  const averageThroughput = (totalContextEntries / (sessionDuration / 3600000)); // per hour
  const efficiencyScore = calculateEfficiencyScore(agentPerformance);
  const completeness = calculateWorkflowCompleteness(context);

  return {
    sessionId: context.sessionId,
    sessionDuration,
    totalAgentsInvolved: agentNames.length,
    totalContextEntries,
    totalDecisions: context.decisionHistory.length,
    averageThroughput,
    efficiencyScore,
    workflowCompleteness: completeness,
    agentPerformance,
    computedAt: new Date()
  };
}
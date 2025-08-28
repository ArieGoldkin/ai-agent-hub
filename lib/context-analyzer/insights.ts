/**
 * Insights Generation Module
 * 
 * Generates comprehensive insights, recommendations, and optimization opportunities.
 */

import type { SessionContext } from '../types/context.js';
import type { 
  PerformanceMetrics, 
  BottleneckReport, 
  HandoffAnalysis,
  InsightReport,
  OptimizationOpportunity,
  Warning,
  ActionableRecommendation
} from '../types/analytics/index.js';

/**
 * Assess overall workflow health
 */
export function assessOverallHealth(
  perf: PerformanceMetrics, 
  _bottlenecks: BottleneckReport, 
  handoffs: HandoffAnalysis
): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
  if (perf.efficiencyScore >= 90 && handoffs.successRate >= 0.9) return 'excellent';
  if (perf.efficiencyScore >= 70 && handoffs.successRate >= 0.7) return 'good';
  if (perf.efficiencyScore >= 50 && handoffs.successRate >= 0.5) return 'fair';
  if (perf.efficiencyScore >= 30) return 'poor';
  return 'critical';
}

/**
 * Identify key findings from analysis
 */
export function identifyKeyFindings(
  perf: PerformanceMetrics, 
  bottlenecks: BottleneckReport, 
  handoffs: HandoffAnalysis
): string[] {
  const findings: string[] = [];
  
  findings.push(`Session involved ${perf.totalAgentsInvolved} agents with ${perf.totalContextEntries} context entries`);
  findings.push(`Overall efficiency score: ${perf.efficiencyScore}%`);
  findings.push(`Handoff success rate: ${Math.round(handoffs.successRate * 100)}%`);
  
  if (bottlenecks.slowestAgents.length > 0) {
    findings.push(`${bottlenecks.slowestAgents.length} agents showing performance bottlenecks`);
  }
  
  return findings;
}

/**
 * Identify optimization opportunities
 */
export function identifyOptimizationOpportunities(
  perf: PerformanceMetrics, 
  bottlenecks: BottleneckReport
): OptimizationOpportunity[] {
  const opportunities: OptimizationOpportunity[] = [];
  
  if (perf.efficiencyScore < 70) {
    opportunities.push({
      type: 'efficiency',
      description: 'Improve overall workflow efficiency',
      potentialImprovement: 100 - perf.efficiencyScore,
      effort: 'medium',
      priority: 'high',
      affectedAgents: perf.agentPerformance.map(ap => ap.agentName)
    });
  }
  
  if (bottlenecks.contextOverloads.length > 0) {
    opportunities.push({
      type: 'performance',
      description: 'Optimize context management to reduce memory usage',
      potentialImprovement: 20,
      effort: 'low',
      priority: 'medium',
      affectedAgents: bottlenecks.contextOverloads.map(co => co.agentName)
    });
  }
  
  return opportunities;
}

/**
 * Generate warning messages for critical issues
 */
export function generateWarnings(bottlenecks: BottleneckReport): Warning[] {
  const warnings: Warning[] = [];
  
  bottlenecks.slowestAgents.forEach(agent => {
    if (agent.severity === 'high' || agent.severity === 'critical') {
      warnings.push({
        severity: agent.severity,
        message: `Agent ${agent.agentName} is experiencing significant performance issues`,
        affectedAgents: [agent.agentName],
        detectedAt: new Date(),
        impact: 'Workflow delays and reduced efficiency',
        suggestedAction: 'Review agent configuration and optimize processing'
      });
    }
  });
  
  return warnings;
}

/**
 * Generate actionable recommendations
 */
export function generateActionableRecommendations(
  opportunities: OptimizationOpportunity[], 
  _warnings: Warning[]
): ActionableRecommendation[] {
  const recommendations: ActionableRecommendation[] = [];
  
  opportunities.forEach(opp => {
    recommendations.push({
      category: 'workflow',
      title: opp.description,
      description: `Focus on ${opp.type} improvements`,
      implementation: 'Review and optimize agent interactions',
      expectedBenefit: `${opp.potentialImprovement}% improvement`,
      priority: opp.priority,
      estimatedEffort: `${opp.effort} effort required`,
      affectedAgents: opp.affectedAgents
    });
  });
  
  return recommendations;
}

/**
 * Calculate analysis confidence based on available data
 */
export function calculateAnalysisConfidence(context: SessionContext): number {
  const contextCount = Array.from(context.agents.values()).reduce((sum, contexts) => sum + contexts.length, 0);
  const decisionCount = context.decisionHistory.length;
  const agentCount = context.agents.size;
  
  // Confidence based on data availability
  let confidence = 0;
  if (contextCount >= 10) confidence += 30;
  if (decisionCount >= 5) confidence += 30;
  if (agentCount >= 3) confidence += 40;
  
  return Math.min(confidence, 100);
}

/**
 * Generate comprehensive insights and recommendations
 */
export function generateInsights(
  context: SessionContext,
  performance: PerformanceMetrics,
  bottlenecks: BottleneckReport,
  handoffs: HandoffAnalysis
): InsightReport {
  const overallHealth = assessOverallHealth(performance, bottlenecks, handoffs);
  const keyFindings = identifyKeyFindings(performance, bottlenecks, handoffs);
  const optimizations = identifyOptimizationOpportunities(performance, bottlenecks);
  const warnings = generateWarnings(bottlenecks);
  const actionableRecs = generateActionableRecommendations(optimizations, warnings);
  const performanceScore = Math.round(performance.efficiencyScore);
  const confidenceLevel = calculateAnalysisConfidence(context);

  return {
    sessionId: context.sessionId,
    generatedAt: new Date(),
    overallHealth,
    keyFindings,
    optimizationOpportunities: optimizations,
    warnings,
    actionableRecommendations: actionableRecs,
    performanceScore,
    confidenceLevel
  };
}
/**
 * Insight and Recommendation Types
 * 
 * Type definitions for workflow insights, optimization opportunities,
 * warnings, and actionable recommendations.
 */

/**
 * Comprehensive insights and recommendations
 */
export interface InsightReport {
  sessionId: string;
  generatedAt: Date;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  keyFindings: string[];
  optimizationOpportunities: OptimizationOpportunity[];
  warnings: Warning[];
  actionableRecommendations: ActionableRecommendation[];
  performanceScore: number; // 0-100
  confidenceLevel: number; // 0-100
}

/**
 * Optimization opportunity identification
 */
export interface OptimizationOpportunity {
  type: 'performance' | 'efficiency' | 'quality' | 'workflow';
  description: string;
  potentialImprovement: number; // percentage
  effort: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedAgents: string[];
}

/**
 * Warning about workflow issues
 */
export interface Warning {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedAgents: string[];
  detectedAt: Date;
  impact: string;
  suggestedAction: string;
}

/**
 * Actionable recommendation for workflow improvement
 */
export interface ActionableRecommendation {
  category: 'workflow' | 'performance' | 'context' | 'handoff';
  title: string;
  description: string;
  implementation: string;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort: string;
  affectedAgents: string[];
}
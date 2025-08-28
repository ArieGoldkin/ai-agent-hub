/**
 * Performance Metric Types
 * 
 * Type definitions for agent and workflow performance analysis,
 * including timing, throughput, and quality metrics.
 */

/**
 * Performance metrics for individual agents
 */
export interface AgentPerformance {
  agentName: string;
  totalContextAdded: number;
  averageResponseTime: number; // milliseconds
  contextProcessingSpeed: number; // contexts per minute
  averageConfidenceScore: number;
  handoffSuccessRate: number;
  decisionQuality: number;
  lastActive: Date;
  totalDecisions: number;
  recommendations: string[];
}

/**
 * Overall performance metrics for the workflow
 */
export interface PerformanceMetrics {
  sessionId: string;
  sessionDuration: number; // milliseconds
  totalAgentsInvolved: number;
  totalContextEntries: number;
  totalDecisions: number;
  averageThroughput: number; // contexts per hour
  efficiencyScore: number; // 0-100
  workflowCompleteness: number; // 0-100
  agentPerformance: AgentPerformance[];
  computedAt: Date;
}

/**
 * Context growth analysis over time
 */
export interface ContextGrowthAnalysis {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  totalGrowth: number; // bytes
  growthRate: number; // bytes per hour
  contextsByAgent: Record<string, number>;
  redundancyDetected: number; // percentage
  accumulationPatterns: AccumulationPattern[];
  storageEfficiency: number; // 0-100
}

/**
 * Context accumulation patterns
 */
export interface AccumulationPattern {
  agentName: string;
  pattern: 'linear' | 'exponential' | 'sporadic' | 'declining';
  averageSize: number;
  frequency: number;
  predictedGrowth: number;
  recommendation: string;
}
/**
 * Analytics Types
 * 
 * Type definitions for context analysis and performance insights system
 * that helps teams understand and optimize their agent collaboration workflows.
 */

import type { DecisionRecord } from './context.js';

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
 * Analysis of handoff patterns between agents
 */
export interface HandoffAnalysis {
  totalHandoffs: number;
  successfulHandoffs: number;
  failedHandoffs: number;
  successRate: number;
  commonPaths: HandoffPath[];
  circularDependencies: string[];
  averageHandoffTime: number;
  handoffsByAgent: Record<string, HandoffStats>;
}

/**
 * Common handoff paths between agents
 */
export interface HandoffPath {
  fromAgent: string;
  toAgent: string;
  frequency: number;
  averageTime: number;
  successRate: number;
  commonReasons: string[];
}

/**
 * Handoff statistics for individual agents
 */
export interface HandoffStats {
  agentName: string;
  handoffsInitiated: number;
  handoffsReceived: number;
  successAsSource: number;
  successAsTarget: number;
  averageInitiationTime: number;
  averageProcessingTime: number;
}

/**
 * Workflow bottleneck identification
 */
export interface BottleneckReport {
  slowestAgents: AgentBottleneck[];
  contextOverloads: ContextOverload[];
  circularDependencies: CircularDependency[];
  queueDepths: QueueDepth[];
  staleContexts: StaleContext[];
  recommendations: string[];
}

/**
 * Agent-specific bottleneck information
 */
export interface AgentBottleneck {
  agentName: string;
  averageProcessingTime: number;
  contextQueueSize: number;
  lastActivity: Date;
  blockedBy: string[];
  blocking: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Context overload detection
 */
export interface ContextOverload {
  agentName: string;
  contextCount: number;
  contextSizeBytes: number;
  redundancyLevel: number;
  processingSlowdown: number;
  recommendations: string[];
}

/**
 * Circular dependency in agent workflow
 */
export interface CircularDependency {
  agents: string[];
  cycleLength: number;
  detectionTime: Date;
  impactSeverity: 'low' | 'medium' | 'high';
  suggestedBreakPoint: string;
}

/**
 * Queue depth analysis
 */
export interface QueueDepth {
  agentName: string;
  pendingContexts: number;
  processingTime: number;
  estimatedClearTime: number;
}

/**
 * Stale context identification
 */
export interface StaleContext {
  agentName: string;
  contextAge: number; // hours
  lastAccessed: Date;
  relevanceScore: number;
  recommendation: 'archive' | 'update' | 'remove';
}

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
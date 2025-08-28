/**
 * Workflow Analysis Types
 * 
 * Type definitions for analyzing agent workflow patterns,
 * handoffs, bottlenecks, and process efficiency.
 */

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
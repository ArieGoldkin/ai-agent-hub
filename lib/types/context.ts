/**
 * Context Types
 * 
 * Type definitions for the context management system that enables
 * agents to share information and make informed handoff decisions.
 */

/**
 * Main context container for a session
 */
export interface SessionContext {
  sessionId: string;
  startTime: Date;
  lastUpdated: Date;
  agents: Map<string, AgentContext[]>;
  decisionHistory: DecisionRecord[];
  metadata?: Record<string, any>;
}

/**
 * Individual agent's contribution to the context
 */
export interface AgentContext {
  agentName: string;
  timestamp: Date;
  context: {
    summary?: string;
    findings?: string[];
    recommendations?: string[];
    concerns?: string[];
    nextSteps?: string[];
    data?: Record<string, any>;
  };
  decisions?: DecisionRecord[];
  confidence?: number;
}

/**
 * Record of a single decision made by an agent
 */
export interface DecisionRecord {
  type: 'handoff' | 'continue' | 'escalate' | 'complete' | 'defer';
  agentName: string;
  timestamp: Date;
  reason: string;
  confidence: number;
  targetAgent?: string;
  context?: Record<string, any>;
}

/**
 * Signal for handing off work to another agent
 */
export interface HandoffSignal {
  fromAgent: string;
  targetAgent: string;
  reason: string;
  context: {
    summary: string;
    relevantFindings?: string[];
    suggestedApproach?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    data?: Record<string, any>;
  };
  confidence: number;
  timestamp: Date;
}

/**
 * Context serialization format for persistence
 */
export interface SerializedSessionContext {
  sessionId: string;
  startTime: string;
  lastUpdated: string;
  agents: Record<string, AgentContext[]>;
  decisionHistory: DecisionRecord[];
  metadata?: Record<string, any>;
}
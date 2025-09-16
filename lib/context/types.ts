/**
 * Shared context types for AI Agent Hub
 * Enables structured data exchange between agents
 */

export interface SharedContext {
  // Metadata
  version: string;
  timestamp: string;
  session_id: string;
  project_type?: string;
  
  // Agent-specific contributions
  agent_decisions: {
    [agentName: string]: {
      timestamp: string;
      decisions: Array<{
        type: string;
        description: string;
        data: unknown;
      }>;
    };
  };
  
  // Backend contributions
  api_design?: {
    endpoints: Array<{
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      description: string;
      request_schema?: unknown;
      response_schema?: unknown;
      authentication?: boolean;
    }>;
    base_url?: string;
    version?: string;
  };
  
  database_schema?: {
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primary_key?: boolean;
        foreign_key?: { table: string; column: string };
      }>;
      indexes?: Array<{ name: string; columns: string[] }>;
    }>;
    relationships?: Array<{
      from: string;
      to: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    }>;
  };
  
  // Frontend contributions
  ui_components?: Array<{
    name: string;
    type: 'page' | 'component' | 'layout' | 'widget';
    props?: Record<string, unknown>;
    children?: string[];
    api_dependencies?: string[];
    state_management?: string;
  }>;
  
  routes?: Array<{
    path: string;
    component: string;
    auth_required?: boolean;
    roles?: string[];
  }>;
  
  // Shared resources
  shared_types?: {
    [typeName: string]: {
      definition: unknown;
      used_by: string[];
      source: string;
    };
  };
  
  // Progress tracking
  tasks_completed?: Array<{
    agent: string;
    task: string;
    timestamp: string;
    files_modified: string[];
  }>;
  
  tasks_pending?: Array<{
    task: string;
    assigned_to?: string;
    priority?: 'low' | 'medium' | 'high';
    dependencies?: string[];
  }>;

  // Intelligent Orchestration Enhancements
  orchestration_state?: OrchestrationState;
}

/**
 * Enhanced orchestration state for intelligent routing and workflow management
 */
export interface OrchestrationState {
  // Current workflow information
  active_workflow?: {
    id: string;
    type: 'sequential' | 'parallel' | 'hierarchical' | 'consensus';
    started_at: string;
    coordinator_agent: string;
    participants: string[];
    current_phase: string;
    progress_percentage: number;
  };

  // Agent routing intelligence
  routing_history: Array<{
    timestamp: string;
    user_input: string;
    intent_analysis: {
      primary_intent: string;
      complexity_score: number; // 1-10
      domains: string[];
      confidence: number; // 0-1
    };
    routing_decision: {
      selected_agents: string[];
      reasoning: string;
      coordination_pattern: string;
    };
    performance_metrics: {
      response_time_ms: number;
      token_usage?: number;
      success_rating?: number; // 0-1
    };
  }>;

  // Context-aware intelligence
  project_intelligence: {
    architecture_patterns: string[];
    technology_stack: string[];
    established_conventions: Record<string, string>;
    learned_vocabulary: Record<string, string>;
    agent_specializations: Record<string, string[]>; // agent -> domains they handle well
  };

  // Performance optimization data
  performance_analytics: {
    token_usage_by_agent: Record<string, number>;
    average_task_completion_time: number;
    agent_collaboration_frequency: Record<string, Record<string, number>>;
    successful_routing_patterns: Array<{
      pattern: string;
      success_rate: number;
      use_count: number;
    }>;
  };

  // Workflow coordination
  coordination_queue?: Array<{
    id: string;
    type: 'handoff' | 'parallel_sync' | 'dependency_wait' | 'decision_point';
    from_agent?: string;
    to_agent?: string;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    metadata: Record<string, unknown>;
  }>;
}
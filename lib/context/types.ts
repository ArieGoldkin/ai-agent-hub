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
    status?: 'pending' | 'blocked' | 'in_progress' | 'complete';
    blocker_reason?: string;
  }>;

  // Evidence-Based Verification (v3.5.0)
  quality_evidence?: QualityEvidence;

  // Quality Gates (v3.5.0)
  quality_gates?: Array<{
    task_id: string;
    timestamp: string;
    complexity_score: number;
    gate_status: 'pass' | 'warning' | 'blocked';
    critical_questions_count: number;
    unanswered_questions: number;
    dependencies_blocked: number;
    attempt_count: number;
    can_proceed: boolean;
    blocking_reasons?: string[];
    assumptions?: string[];
  }>;

  // Attempt Tracking (v3.5.0)
  attempt_tracking?: {
    [taskId: string]: {
      attempts: Array<{
        timestamp: string;
        approach: string;
        outcome: 'success' | 'failed';
        failure_reason?: string;
        learnings?: string;
      }>;
      first_attempt: string;
    };
  };

  // Intelligent Orchestration Enhancements
  orchestration_state?: OrchestrationState;
}

/**
 * Quality evidence tracking for production-grade verification
 * Records proof of testing, building, and quality checks
 */
export interface QualityEvidence {
  // Test evidence
  tests?: {
    executed: boolean;
    command?: string;
    exit_code?: number;
    passed?: number;
    failed?: number;
    skipped?: number;
    coverage_percent?: number;
    duration_seconds?: number;
    timestamp: string;
    evidence_file?: string;
  };

  // Build evidence
  build?: {
    executed: boolean;
    command?: string;
    exit_code?: number;
    errors?: number;
    warnings?: number;
    artifacts?: Array<{ file: string; size_kb: number }>;
    duration_seconds?: number;
    timestamp: string;
    evidence_file?: string;
  };

  // Code quality evidence
  linter?: {
    executed: boolean;
    tool?: string;
    command?: string;
    exit_code?: number;
    errors?: number;
    warnings?: number;
    timestamp: string;
  };

  type_checker?: {
    executed: boolean;
    tool?: string;
    command?: string;
    exit_code?: number;
    errors?: number;
    timestamp: string;
  };

  security_scan?: {
    executed: boolean;
    tool?: string;
    critical?: number;
    high?: number;
    moderate?: number;
    low?: number;
    timestamp: string;
  };

  // Deployment evidence
  deployment?: {
    executed: boolean;
    environment?: string;
    exit_code?: number;
    health_check_passed?: boolean;
    timestamp: string;
  };

  // Quality standard assessment
  quality_standard_met?: 'minimum' | 'production-grade' | 'gold-standard';
  all_checks_passed?: boolean;
  last_updated: string;
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
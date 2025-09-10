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
}
/**
 * TypeScript Type Definitions Generator
 *
 * Generates TypeScript interface definitions for the context system
 */

/**
 * Generate the SharedContext TypeScript interface
 */
export function generateContextStructure(): string[] {
  return [
    '## 📊 Context Structure\n',
    '```typescript',
    'interface SharedContext {',
    '  version: string;',
    '  timestamp: string;',
    '  session_id: string;',
    '  mode: "classic" | "squad";',
    '',
    '  agent_decisions: {',
    '    [agentName: string]: Array<{',
    '      timestamp: string;',
    '      decision: string;',
    '      rationale: string;',
    '      impact?: string;',
    '      dependencies?: string[];',
    '    }>;',
    '  };',
    '',
    '  tasks_completed: Array<{',
    '    id: string;',
    '    description: string;',
    '    agent: string;',
    '    timestamp: string;',
    '    artifacts?: string[];',
    '    metrics?: Record<string, any>;',
    '  }>;',
    '',
    '  tasks_pending: Array<{',
    '    id: string;',
    '    description: string;',
    '    blocker?: string;',
    '    agent: string;',
    '    timestamp: string;',
    '    suggested_resolution?: string;',
    '    priority?: "low" | "medium" | "high";',
    '  }>;',
    '',
    '  codebase_patterns?: {',
    '    component_style?: "functional" | "class";',
    '    state_management?: "redux" | "context" | "zustand" | "mobx";',
    '    api_pattern?: "REST" | "GraphQL";',
    '    testing_framework?: "jest" | "vitest" | "mocha";',
    '    styling?: "css-modules" | "styled-components" | "tailwind";',
    '  };',
    '',
    '  last_activity?: string;',
    '  active_agent?: string;',
    '}',
    '```\n'
  ];
}
/**
 * Test Scenarios Module
 * 
 * Contains test scenario generation and mock data for Frontend and Quality Review phases.
 */

import type { AgentContext } from "../../lib/types/context.js";

// Re-export from test-data
export { generateUXResearchContext, generateBackendArchitectureContext } from "./test-data.js";

/**
 * Generate test data for different workflow scenarios
 */
export function generateTestScenarios(): Array<{name: string; agents: string[]; complexity: 'low' | 'medium' | 'high'}> {
  return [
    {
      name: "Simple Feature Request",
      agents: ["studio-coach", "frontend-ui-developer", "code-quality-reviewer"],
      complexity: "low"
    },
    {
      name: "Full-Stack Feature",
      agents: ["studio-coach", "ux-researcher", "backend-system-architect", "frontend-ui-developer", "code-quality-reviewer"],
      complexity: "medium" 
    },
    {
      name: "Complex System Integration",
      agents: ["studio-coach", "ux-researcher", "sprint-prioritizer", "backend-system-architect", "ai-ml-engineer", "frontend-ui-developer", "code-quality-reviewer", "whimsy-injector"],
      complexity: "high"
    }
  ];
}

/**
 * Generate Frontend Implementation context for authentication workflow
 */
export function generateFrontendImplementationContext(): Omit<AgentContext, 'agentName' | 'timestamp'> {
  return {
    context: {
      summary: "React authentication components and state management",
      findings: [
        "TanStack Query optimal for auth state management",
        "React Context provides global auth state",
        "TypeScript ensures type safety for auth flows"
      ],
      recommendations: [
        "Implement auth hooks for reusability",
        "Add comprehensive error boundaries",
        "Use React Suspense for loading states"
      ],
      data: {
        components: {
          AuthProvider: {
            file: "src/contexts/AuthContext.tsx",
            exports: ["AuthProvider", "useAuth", "AuthState"]
          },
          LoginModal: {
            file: "src/components/auth/LoginModal.tsx",
            features: ["Social login buttons", "Loading states", "Error handling"]
          }
        },
        stateManagement: {
          library: "jotai + @tanstack/react-query",
          patterns: ["atomic state", "server state separation"]
        }
      }
    },
    decisions: [{
      type: 'handoff',
      agentName: 'frontend-ui-developer', 
      timestamp: new Date(),
      reason: 'Frontend implementation complete, needs quality review',
      confidence: 0.89,
      targetAgent: 'code-quality-reviewer'
    }],
    confidence: 0.89
  };
}

/**
 * Generate Code Quality Review context for authentication workflow
 */
export function generateCodeQualityContext(): Omit<AgentContext, 'agentName' | 'timestamp'> {
  return {
    context: {
      summary: "Authentication system code quality review and testing",
      findings: [
        "Security best practices properly implemented",
        "TypeScript coverage at 95% for auth modules",
        "Unit test coverage at 87% across components"
      ],
      recommendations: [
        "Add integration tests for OAuth flows",
        "Implement E2E tests with Playwright", 
        "Add security headers validation"
      ],
      data: {
        testCoverage: {
          unit: 0.87,
          integration: 0.73,
          e2e: 0.60
        },
        securityAudit: {
          jwtHandling: "passed",
          oauthFlow: "passed",
          tokenStorage: "passed"
        },
        performanceMetrics: {
          bundleSize: "+12KB",
          initialLoad: "1.2s",
          authFlow: "0.8s"
        }
      }
    },
    decisions: [{
      type: 'complete',
      agentName: 'code-quality-reviewer',
      timestamp: new Date(),
      reason: 'Authentication system passes all quality gates',
      confidence: 0.93
    }],
    confidence: 0.93
  };
}
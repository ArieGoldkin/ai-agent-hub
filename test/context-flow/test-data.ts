/**
 * Test Data Module
 * 
 * Contains mock data generation for UX Research and Backend Architecture phases.
 */

import type { AgentContext } from "../../lib/types/context.js";

/**
 * Generate UX Research context for authentication workflow
 */
export function generateUXResearchContext(): Omit<AgentContext, 'agentName' | 'timestamp'> {
  return {
    context: {
      summary: "Authentication user experience research completed",
      findings: [
        "Users prefer social login over email/password (78% adoption rate)",
        "Mobile users need seamless social auth flow",
        "Security-conscious users want 2FA options"
      ],
      recommendations: [
        "Prioritize Google and GitHub social login",
        "Implement progressive enhancement for 2FA",
        "Design mobile-first authentication UI"
      ],
      data: {
        userPersonas: [
          {
            name: "Developer User",
            preferences: ["GitHub login", "CLI integration"],
            painPoints: ["Complex signup flows", "Lost passwords"]
          }
        ],
        conversionRates: {
          socialLogin: 0.94,
          traditionalSignup: 0.67
        }
      }
    },
    decisions: [{
      type: 'handoff',
      agentName: 'ux-researcher',
      timestamp: new Date(),
      reason: 'Requirements defined, need backend architecture',
      confidence: 0.88,
      targetAgent: 'backend-system-architect'
    }],
    confidence: 0.88
  };
}

/**
 * Generate Backend Architecture context for authentication workflow
 */
export function generateBackendArchitectureContext(): Omit<AgentContext, 'agentName' | 'timestamp'> {
  return {
    context: {
      summary: "Authentication system architecture and API design",
      findings: [
        "JWT tokens provide stateless authentication", 
        "OAuth 2.0 flow required for social providers",
        "Need secure token storage and refresh mechanism"
      ],
      recommendations: [
        "Use RS256 for JWT signing with rotating keys",
        "Implement OAuth state validation for CSRF protection",
        "Add Redis for refresh token blacklisting"
      ],
      data: {
        apiEndpoints: {
          "/auth/google": { method: "GET", description: "Initiate Google OAuth flow" },
          "/auth/github": { method: "GET", description: "Initiate GitHub OAuth flow" },
          "/auth/callback": { method: "POST", description: "Handle OAuth callbacks" }
        },
        databaseSchema: {
          users: {
            id: "uuid PRIMARY KEY",
            email: "varchar UNIQUE NOT NULL",
            provider: "varchar NOT NULL"
          }
        }
      }
    },
    decisions: [{
      type: 'handoff',
      agentName: 'backend-system-architect',
      timestamp: new Date(),
      reason: 'Architecture complete, need frontend implementation',
      confidence: 0.94,
      targetAgent: 'frontend-ui-developer'
    }],
    confidence: 0.94
  };
}
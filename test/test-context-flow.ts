#!/usr/bin/env node

/**
 * Context Flow Test Script
 * 
 * Simulates a complete agent workflow with context accumulation and analysis.
 * Tests the context management system and analytics capabilities.
 */

import { ContextManager } from "../lib/context-manager.js";
import { ContextAnalyzer } from "../lib/context-analyzer/index.js";
import type { AgentContext, DecisionRecord } from "../lib/types/context.js";

/**
 * Test script that simulates an authentication feature workflow
 */
async function runContextFlowTest(): Promise<void> {
  console.log("🧪 Starting Context Flow Test");
  console.log("==============================\n");

  const contextManager = new ContextManager("./test-session");
  let testResults: { [key: string]: boolean } = {};

  try {
    // Test 1: Initialize Session
    console.log("1️⃣ Initializing test session...");
    await contextManager.initSession("test-auth-workflow-001");
    const initialContext = await contextManager.getContext();
    testResults.sessionInit = !!initialContext && initialContext.sessionId === "test-auth-workflow-001";
    console.log(`   ✅ Session initialized: ${initialContext?.sessionId}`);

    // Test 2: UX Research Phase
    console.log("\n2️⃣ Adding UX Research context...");
    const uxContext: Omit<AgentContext, 'agentName' | 'timestamp'> = {
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

    await contextManager.addAgentContext("ux-researcher", uxContext);
    console.log("   ✅ UX Research context added");

    // Test 3: Backend Architecture Phase
    console.log("\n3️⃣ Adding Backend Architecture context...");
    const backendContext: Omit<AgentContext, 'agentName' | 'timestamp'> = {
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

    await contextManager.addAgentContext("backend-system-architect", backendContext);
    console.log("   ✅ Backend Architecture context added");

    // Test 4: Frontend Implementation Phase
    console.log("\n4️⃣ Adding Frontend Implementation context...");
    const frontendContext: Omit<AgentContext, 'agentName' | 'timestamp'> = {
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

    await contextManager.addAgentContext("frontend-ui-developer", frontendContext);
    console.log("   ✅ Frontend Implementation context added");

    // Test 5: Code Quality Review Phase
    console.log("\n5️⃣ Adding Code Quality Review context...");
    const qualityContext: Omit<AgentContext, 'agentName' | 'timestamp'> = {
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

    await contextManager.addAgentContext("code-quality-reviewer", qualityContext);
    console.log("   ✅ Code Quality Review context added");

    // Test 6: Context Retrieval and Validation
    console.log("\n6️⃣ Testing context retrieval...");
    const finalContext = await contextManager.getContext();
    testResults.contextRetrieval = !!finalContext;
    testResults.agentCount = finalContext?.agents.size === 4;
    testResults.decisionHistory = (finalContext?.decisionHistory.length || 0) >= 4;
    
    console.log(`   📊 Total agents: ${finalContext?.agents.size}`);
    console.log(`   📝 Total contexts: ${Array.from(finalContext?.agents.values() || []).reduce((sum, contexts) => sum + contexts.length, 0)}`);
    console.log(`   🔄 Total decisions: ${finalContext?.decisionHistory.length}`);

    // Test 7: Analytics Generation
    console.log("\n7️⃣ Running analytics tests...");
    if (finalContext) {
      const analyzer = new ContextAnalyzer(finalContext);
      
      // Performance analysis
      const performance = analyzer.analyzeWorkflowPerformance();
      testResults.performanceAnalysis = performance.totalAgentsInvolved === 4;
      console.log(`   📈 Efficiency Score: ${performance.efficiencyScore}%`);
      
      // Handoff analysis
      const handoffs = analyzer.analyzeHandoffPatterns();
      testResults.handoffAnalysis = handoffs.totalHandoffs >= 4;
      console.log(`   🔄 Handoff Success Rate: ${(handoffs.successRate * 100).toFixed(1)}%`);
      
      // Bottleneck detection
      const bottlenecks = analyzer.detectBottlenecks();
      testResults.bottleneckDetection = bottlenecks !== null;
      console.log(`   🚧 Bottlenecks detected: ${bottlenecks.slowestAgents.length}`);
      
      // Insights generation
      const insights = analyzer.generateInsights();
      testResults.insightsGeneration = insights.overallHealth !== null;
      console.log(`   💡 Overall Health: ${insights.overallHealth}`);
      console.log(`   🎯 Performance Score: ${insights.performanceScore}%`);
      
      // Context growth analysis
      const growth = analyzer.analyzeContextAccumulation();
      testResults.growthAnalysis = growth.totalGrowth > 0;
      console.log(`   📊 Context Growth: ${growth.totalGrowth} bytes`);
      console.log(`   💾 Storage Efficiency: ${growth.storageEfficiency}%`);
      
      // Decision quality tracking
      const quality = analyzer.trackDecisionQuality();
      testResults.qualityTracking = quality.averageQuality > 0;
      console.log(`   🎯 Average Decision Quality: ${(quality.averageQuality * 100).toFixed(1)}%`);
      console.log(`   📈 Confidence Trend: ${quality.confidenceTrend}`);
    }

    // Test 8: Context Search and Filtering
    console.log("\n8️⃣ Testing context search capabilities...");
    const uxContexts = await contextManager.getContextForAgent("ux-researcher");
    testResults.contextSearch = uxContexts.length === 1;
    console.log(`   🔍 UX contexts found: ${uxContexts.length}`);
    
    const backendContexts = await contextManager.getContextForAgent("backend-system-architect");
    testResults.contextFiltering = backendContexts.length === 1 && backendContexts[0].confidence === 0.94;
    console.log(`   🏗️  Backend contexts found: ${backendContexts.length}`);

    // Test Results Summary
    console.log("\n📊 Test Results Summary");
    console.log("=======================");
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result).length;
    const successRate = (passedTests / totalTests) * 100;

    Object.entries(testResults).forEach(([test, passed]) => {
      const status = passed ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} ${test}`);
    });

    console.log(`\n🎯 Success Rate: ${passedTests}/${totalTests} (${successRate.toFixed(1)}%)`);
    
    if (successRate === 100) {
      console.log("🎉 All tests passed! Context flow system is working correctly.");
    } else {
      console.log("⚠️  Some tests failed. Please review the implementation.");
    }

    // Test 9: Cleanup
    console.log("\n9️⃣ Cleaning up test session...");
    await contextManager.clearSession();
    console.log("   🧹 Test session cleaned up");

  } catch (error) {
    console.error("\n❌ Test execution failed:");
    console.error(error instanceof Error ? error.message : error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available");
    process.exit(1);
  }
}

/**
 * Utility function to simulate realistic delays between agent activities
 */
async function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate test data for different workflow scenarios
 */
function generateTestScenarios(): Array<{name: string; agents: string[]; complexity: 'low' | 'medium' | 'high'}> {
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

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runContextFlowTest()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Test suite failed:", error);
      process.exit(1);
    });
}

export { runContextFlowTest };
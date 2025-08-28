#!/usr/bin/env node

/**
 * Context Flow Test Suite
 * 
 * Main test runner that orchestrates all context flow tests in a modular architecture.
 * Simulates a complete agent workflow with context accumulation and analysis.
 */

import { ContextManager } from "../../lib/context-manager.js";
import { 
  initializeTestResults, 
  printTestSummary, 
  validateTestResults,
  type TestResults 
} from "./test-helpers.js";
import { 
  testSessionInitialization,
  testContextRetrieval,
  testContextSearch,
  testSessionCleanup,
  validateSessionState,
  testSessionPersistence
} from "./session-tests.js";
import { 
  testUXResearchPhase,
  testBackendArchitecturePhase,
  testFrontendImplementationPhase,
  testCodeQualityPhase,
  validateAgentHandoffChain,
  testWorkflowTiming
} from "./agent-workflow-tests.js";
import { 
  testAnalyticsGeneration,
  testAnalyticsConsistency
} from "./analytics-tests.js";
import { runAdvancedValidationTests } from "./advanced-validation-tests.js";

/**
 * Main test execution function
 */
async function runContextFlowTest(): Promise<void> {
  console.log("🧪 Starting Context Flow Test Suite");
  console.log("===================================\n");

  const contextManager = new ContextManager("./test-session");
  let testResults: TestResults = initializeTestResults([
    'sessionInit',
    'uxResearchPhase',
    'backendArchitecturePhase', 
    'frontendImplementationPhase',
    'codeQualityPhase',
    'contextRetrieval',
    'agentCount',
    'decisionHistory',
    'performanceAnalysis',
    'handoffAnalysis',
    'bottleneckDetection',
    'insightsGeneration',
    'growthAnalysis',
    'qualityTracking',
    'contextSearch',
    'contextFiltering',
    'handoffChainIntegrity'
  ]);

  try {
    // Phase 1: Session Management Tests
    await runSessionTests(contextManager, testResults);
    
    // Phase 2: Agent Workflow Tests
    await runAgentWorkflowTests(contextManager, testResults);
    
    // Phase 3: Context and Analytics Tests
    await runContextAndAnalyticsTests(contextManager, testResults);
    
    // Phase 4: Advanced Validation Tests
    const context = await contextManager.getContext();
    await runAdvancedValidationTests(context, testResults);
    
    // Phase 5: Cleanup
    await runCleanupTests(contextManager);

    // Final Results
    printTestResults(testResults);

  } catch (error) {
    console.error("\n❌ Test execution failed:");
    console.error(error instanceof Error ? error.message : error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available");
    process.exit(1);
  }
}

/**
 * Run session management tests
 */
async function runSessionTests(contextManager: ContextManager, testResults: TestResults): Promise<void> {
  console.log("📋 Phase 1: Session Management Tests");
  console.log("===================================");
  
  await testSessionInitialization(contextManager, testResults);
  
  // Validate session state after initialization
  const sessionValid = await validateSessionState(contextManager);
  testResults.sessionValidation = sessionValid;
  
  // Test session persistence
  const persistenceValid = await testSessionPersistence(contextManager);
  testResults.sessionPersistence = persistenceValid;
}

/**
 * Run agent workflow simulation tests
 */
async function runAgentWorkflowTests(contextManager: ContextManager, testResults: TestResults): Promise<void> {
  console.log("\n🤖 Phase 2: Agent Workflow Tests");
  console.log("================================");
  
  await testUXResearchPhase(contextManager, testResults);
  await testBackendArchitecturePhase(contextManager, testResults);
  await testFrontendImplementationPhase(contextManager, testResults);
  await testCodeQualityPhase(contextManager, testResults);
  
  // Validate handoff chain integrity
  await validateAgentHandoffChain(contextManager, testResults);
  
  // Test workflow timing
  const timingValid = await testWorkflowTiming(contextManager);
  testResults.workflowTiming = timingValid;
}

/**
 * Run context retrieval and analytics tests
 */
async function runContextAndAnalyticsTests(contextManager: ContextManager, testResults: TestResults): Promise<void> {
  console.log("\n📊 Phase 3: Context and Analytics Tests");
  console.log("======================================");
  
  // Test context retrieval
  await testContextRetrieval(contextManager, testResults);
  
  // Get final context for analytics
  const finalContext = await contextManager.getContext();
  
  if (finalContext) {
    // Test analytics generation
    await testAnalyticsGeneration(finalContext, testResults);
    
    // Test analytics consistency
    const analyticsConsistent = await testAnalyticsConsistency(finalContext);
    testResults.analyticsConsistency = analyticsConsistent;
  }
  
  // Test context search capabilities
  await testContextSearch(contextManager, testResults);
}

/**
 * Run cleanup tests
 */
async function runCleanupTests(contextManager: ContextManager): Promise<void> {
  console.log("\n🧹 Phase 5: Cleanup");
  console.log("==================");
  
  await testSessionCleanup(contextManager);
}

/**
 * Print final test results
 */
function printTestResults(testResults: TestResults): void {
  // Validate test results structure
  const validationPassed = validateTestResults(testResults, Object.keys(testResults));
  
  if (validationPassed) {
    printTestSummary(testResults);
  } else {
    console.log("\n❌ Test result validation failed");
    process.exit(1);
  }
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
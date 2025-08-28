/**
 * Session Tests Module
 * 
 * Contains tests for session initialization, context retrieval, and cleanup functionality.
 */

import { ContextManager } from "../../lib/context-manager.js";
import { logTestStep, logTestSuccess, formatContextStats, type TestResults } from "./test-helpers.js";

/**
 * Test session initialization functionality
 */
export async function testSessionInitialization(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(1, "Initializing test session");
  
  await contextManager.initSession("test-auth-workflow-001");
  const initialContext = await contextManager.getContext();
  
  testResults.sessionInit = !!initialContext && initialContext.sessionId === "test-auth-workflow-001";
  
  if (testResults.sessionInit) {
    logTestSuccess(`Session initialized: ${initialContext?.sessionId}`);
  } else {
    console.log(`   ❌ Session initialization failed`);
  }
}

/**
 * Test context retrieval and validation functionality
 */
export async function testContextRetrieval(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(6, "Testing context retrieval");
  
  const finalContext = await contextManager.getContext();
  testResults.contextRetrieval = !!finalContext;
  testResults.agentCount = finalContext?.agents.size === 4;
  testResults.decisionHistory = (finalContext?.decisionHistory.length || 0) >= 4;
  
  if (finalContext) {
    const totalContexts = Array.from(finalContext.agents.values()).reduce(
      (sum, contexts) => sum + contexts.length, 
      0
    );
    
    formatContextStats(
      finalContext.agents.size,
      totalContexts,
      finalContext.decisionHistory.length
    );
  }
}

/**
 * Test context search and filtering capabilities
 */
export async function testContextSearch(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(8, "Testing context search capabilities");
  
  // Test UX researcher context search
  const uxContexts = await contextManager.getContextForAgent("ux-researcher");
  testResults.contextSearch = uxContexts.length === 1;
  console.log(`   🔍 UX contexts found: ${uxContexts.length}`);
  
  // Test backend architect context filtering
  const backendContexts = await contextManager.getContextForAgent("backend-system-architect");
  testResults.contextFiltering = backendContexts.length === 1 && backendContexts[0].confidence === 0.94;
  console.log(`   🏗️  Backend contexts found: ${backendContexts.length}`);
  
  // Additional validation for context data integrity
  if (uxContexts.length > 0) {
    const uxContext = uxContexts[0];
    const hasValidSummary = uxContext.context.summary?.includes("Authentication");
    const hasValidFindings = uxContext.context.findings && uxContext.context.findings.length > 0;
    const hasValidData = uxContext.context.data && typeof uxContext.context.data === 'object';
    
    if (hasValidSummary && hasValidFindings && hasValidData) {
      logTestSuccess("UX context data integrity validated");
    } else {
      console.log("   ❌ UX context data integrity check failed");
    }
  }
  
  if (backendContexts.length > 0) {
    const backendContext = backendContexts[0];
    const hasValidArchitecture = backendContext.context.data?.apiEndpoints && 
                                 backendContext.context.data?.databaseSchema;
    
    if (hasValidArchitecture) {
      logTestSuccess("Backend context architecture data validated");
    } else {
      console.log("   ❌ Backend context architecture data check failed");
    }
  }
}

/**
 * Test session cleanup functionality
 */
export async function testSessionCleanup(contextManager: ContextManager): Promise<void> {
  logTestStep(9, "Cleaning up test session");
  
  try {
    await contextManager.clearSession();
    logTestSuccess("Test session cleaned up");
  } catch (error) {
    console.log(`   ❌ Session cleanup failed: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
}

/**
 * Validate session state consistency
 */
export async function validateSessionState(contextManager: ContextManager): Promise<boolean> {
  try {
    const context = await contextManager.getContext();
    
    if (!context) {
      console.log("   ❌ No context available for validation");
      return false;
    }
    
    // Check session ID consistency
    if (!context.sessionId || context.sessionId.length === 0) {
      console.log("   ❌ Invalid session ID");
      return false;
    }
    
    // Check timestamp consistency
    if (!context.startTime || !(context.startTime instanceof Date)) {
      console.log("   ❌ Invalid start time");
      return false;
    }
    
    // Check agents map consistency
    if (!context.agents || !(context.agents instanceof Map)) {
      console.log("   ❌ Invalid agents map");
      return false;
    }
    
    // Check decision history consistency
    if (!Array.isArray(context.decisionHistory)) {
      console.log("   ❌ Invalid decision history");
      return false;
    }
    
    logTestSuccess("Session state validation passed");
    return true;
    
  } catch (error) {
    console.log(`   ❌ Session state validation failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

/**
 * Test session persistence across operations
 */
export async function testSessionPersistence(contextManager: ContextManager): Promise<boolean> {
  try {
    const contextBefore = await contextManager.getContext();
    const sessionIdBefore = contextBefore?.sessionId;
    const agentCountBefore = contextBefore?.agents.size || 0;
    
    // Simulate some operation that shouldn't affect session persistence
    const testContext = await contextManager.getContext();
    
    const sessionIdAfter = testContext?.sessionId;
    const agentCountAfter = testContext?.agents.size || 0;
    
    const sessionPersisted = sessionIdBefore === sessionIdAfter;
    const dataConsistent = agentCountBefore === agentCountAfter;
    
    if (sessionPersisted && dataConsistent) {
      logTestSuccess("Session persistence validated");
      return true;
    } else {
      console.log("   ❌ Session persistence check failed");
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Session persistence test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}
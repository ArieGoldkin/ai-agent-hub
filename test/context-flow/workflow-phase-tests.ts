/**
 * Workflow Phase Tests Module
 * 
 * Contains individual phase tests for the agent workflow simulation.
 */

import { ContextManager } from "../../lib/context-manager.js";
import { logTestStep, logTestSuccess, type TestResults } from "./test-helpers.js";
import { generateUXResearchContext, generateBackendArchitectureContext } from "./test-data.js";
import { generateFrontendImplementationContext, generateCodeQualityContext } from "./test-scenarios.js";

/**
 * Test UX Research phase workflow
 */
export async function testUXResearchPhase(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(2, "Adding UX Research context");
  
  const uxContext = generateUXResearchContext();
  
  try {
    await contextManager.addAgentContext("ux-researcher", uxContext);
    logTestSuccess("UX Research context added");
    
    // Validate the context was properly stored
    const contexts = await contextManager.getContextForAgent("ux-researcher");
    const contextStored = contexts.length === 1;
    const dataIntegrity = contexts[0]?.context.summary?.includes("Authentication");
    const decisionMade = (contexts[0]?.decisions?.length || 0) === 1;
    const handoffTarget = contexts[0]?.decisions?.[0]?.targetAgent === "backend-system-architect";
    
    if (contextStored && dataIntegrity && decisionMade && handoffTarget) {
      testResults.uxResearchPhase = true;
      logTestSuccess("UX Research validation passed");
    } else {
      testResults.uxResearchPhase = false;
      console.log("   ❌ UX Research validation failed");
    }
    
  } catch (error) {
    testResults.uxResearchPhase = false;
    console.log(`   ❌ UX Research phase failed: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Test Backend Architecture phase workflow
 */
export async function testBackendArchitecturePhase(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(3, "Adding Backend Architecture context");
  
  const backendContext = generateBackendArchitectureContext();
  
  try {
    await contextManager.addAgentContext("backend-system-architect", backendContext);
    logTestSuccess("Backend Architecture context added");
    
    // Validate the context was properly stored
    const contexts = await contextManager.getContextForAgent("backend-system-architect");
    const contextStored = contexts.length === 1;
    const hasApiEndpoints = !!contexts[0]?.context.data?.apiEndpoints;
    const hasDbSchema = !!contexts[0]?.context.data?.databaseSchema;
    const confidenceLevel = contexts[0]?.confidence === 0.94;
    const handoffTarget = contexts[0]?.decisions?.[0]?.targetAgent === "frontend-ui-developer";
    
    if (contextStored && hasApiEndpoints && hasDbSchema && confidenceLevel && handoffTarget) {
      testResults.backendArchitecturePhase = true;
      logTestSuccess("Backend Architecture validation passed");
    } else {
      testResults.backendArchitecturePhase = false;
      console.log("   ❌ Backend Architecture validation failed");
    }
    
  } catch (error) {
    testResults.backendArchitecturePhase = false;
    console.log(`   ❌ Backend Architecture phase failed: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Test Frontend Implementation phase workflow
 */
export async function testFrontendImplementationPhase(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(4, "Adding Frontend Implementation context");
  
  const frontendContext = generateFrontendImplementationContext();
  
  try {
    await contextManager.addAgentContext("frontend-ui-developer", frontendContext);
    logTestSuccess("Frontend Implementation context added");
    
    // Validate the context was properly stored
    const contexts = await contextManager.getContextForAgent("frontend-ui-developer");
    const contextStored = contexts.length === 1;
    const hasComponents = !!contexts[0]?.context.data?.components;
    const hasStateManagement = !!contexts[0]?.context.data?.stateManagement;
    const confidenceLevel = contexts[0]?.confidence === 0.89;
    const handoffTarget = contexts[0]?.decisions?.[0]?.targetAgent === "code-quality-reviewer";
    
    if (contextStored && hasComponents && hasStateManagement && confidenceLevel && handoffTarget) {
      testResults.frontendImplementationPhase = true;
      logTestSuccess("Frontend Implementation validation passed");
    } else {
      testResults.frontendImplementationPhase = false;
      console.log("   ❌ Frontend Implementation validation failed");
    }
    
  } catch (error) {
    testResults.frontendImplementationPhase = false;
    console.log(`   ❌ Frontend Implementation phase failed: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Test Code Quality Review phase workflow
 */
export async function testCodeQualityPhase(
  contextManager: ContextManager, 
  testResults: TestResults
): Promise<void> {
  logTestStep(5, "Adding Code Quality Review context");
  
  const qualityContext = generateCodeQualityContext();
  
  try {
    await contextManager.addAgentContext("code-quality-reviewer", qualityContext);
    logTestSuccess("Code Quality Review context added");
    
    // Validate the context was properly stored
    const contexts = await contextManager.getContextForAgent("code-quality-reviewer");
    const contextStored = contexts.length === 1;
    const hasTestCoverage = !!contexts[0]?.context.data?.testCoverage;
    const hasSecurityAudit = !!contexts[0]?.context.data?.securityAudit;
    const hasPerformanceMetrics = !!contexts[0]?.context.data?.performanceMetrics;
    const confidenceLevel = contexts[0]?.confidence === 0.93;
    const isComplete = contexts[0]?.decisions?.[0]?.type === "complete";
    
    if (contextStored && hasTestCoverage && hasSecurityAudit && hasPerformanceMetrics && confidenceLevel && isComplete) {
      testResults.codeQualityPhase = true;
      logTestSuccess("Code Quality Review validation passed");
    } else {
      testResults.codeQualityPhase = false;
      console.log("   ❌ Code Quality Review validation failed");
    }
    
  } catch (error) {
    testResults.codeQualityPhase = false;
    console.log(`   ❌ Code Quality Review phase failed: ${error instanceof Error ? error.message : error}`);
  }
}
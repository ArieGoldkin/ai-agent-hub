/**
 * Workflow Validation Tests Module
 * 
 * Contains validation tests for agent workflow integrity and timing.
 */

import { ContextManager } from "../../lib/context-manager.js";
import { logTestSuccess, type TestResults } from "./test-helpers.js";

/**
 * Validate agent handoff chain integrity
 */
export async function validateAgentHandoffChain(
  contextManager: ContextManager,
  testResults: TestResults
): Promise<void> {
  try {
    const context = await contextManager.getContext();
    if (!context) {
      testResults.handoffChainIntegrity = false;
      return;
    }
    
    const expectedChain = [
      { from: "ux-researcher", to: "backend-system-architect" },
      { from: "backend-system-architect", to: "frontend-ui-developer" },
      { from: "frontend-ui-developer", to: "code-quality-reviewer" },
      { from: "code-quality-reviewer", to: null } // final step
    ];
    
    let chainValid = true;
    
    for (const step of expectedChain) {
      const agentContexts = await contextManager.getContextForAgent(step.from);
      if (agentContexts.length === 0) {
        chainValid = false;
        break;
      }
      
      const decision = agentContexts[0]?.decisions?.[0];
      if (step.to && decision?.targetAgent !== step.to) {
        chainValid = false;
        break;
      }
      
      if (!step.to && decision?.type !== "complete") {
        chainValid = false;
        break;
      }
    }
    
    testResults.handoffChainIntegrity = chainValid;
    
    if (chainValid) {
      logTestSuccess("Agent handoff chain integrity validated");
    } else {
      console.log("   ❌ Agent handoff chain integrity validation failed");
    }
    
  } catch (error) {
    testResults.handoffChainIntegrity = false;
    console.log(`   ❌ Handoff chain validation error: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Test workflow timing and sequence
 */
export async function testWorkflowTiming(contextManager: ContextManager): Promise<boolean> {
  try {
    const context = await contextManager.getContext();
    if (!context || context.decisionHistory.length === 0) {
      return false;
    }
    
    // Verify decisions are in chronological order
    const decisions = context.decisionHistory;
    for (let i = 1; i < decisions.length; i++) {
      if (decisions[i].timestamp < decisions[i-1].timestamp) {
        console.log("   ❌ Decision timestamps not in chronological order");
        return false;
      }
    }
    
    // Verify all decisions have reasonable confidence levels (> 0.8)
    const allHighConfidence = decisions.every(decision => decision.confidence > 0.8);
    if (!allHighConfidence) {
      console.log("   ❌ Some decisions have low confidence levels");
      return false;
    }
    
    logTestSuccess("Workflow timing validation passed");
    return true;
    
  } catch (error) {
    console.log(`   ❌ Workflow timing test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}
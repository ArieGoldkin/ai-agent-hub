/**
 * Advanced Validation Tests Module
 * 
 * Contains advanced validation tests for context data integrity, memory usage, and scalability.
 */

import type { TestResults } from "./test-helpers.js";

/**
 * Test context data integrity
 */
export async function testContextDataIntegrity(context: any): Promise<boolean> {
  try {
    // Check required fields exist
    if (!context.sessionId || !context.startTime || !context.agents || !context.decisionHistory) {
      console.log("   ❌ Missing required context fields");
      return false;
    }
    
    // Check data types
    if (typeof context.sessionId !== 'string' || 
        !(context.startTime instanceof Date) ||
        !(context.agents instanceof Map) ||
        !Array.isArray(context.decisionHistory)) {
      console.log("   ❌ Invalid context field types");
      return false;
    }
    
    // Check agent contexts have required structure
    for (const [agentName, contexts] of context.agents) {
      if (!Array.isArray(contexts) || contexts.length === 0) {
        console.log(`   ❌ Invalid context structure for agent: ${agentName}`);
        return false;
      }
      
      for (const ctx of contexts) {
        if (!ctx.context || !ctx.decisions || typeof ctx.confidence !== 'number') {
          console.log(`   ❌ Invalid context object structure for agent: ${agentName}`);
          return false;
        }
      }
    }
    
    console.log("   ✅ Context data integrity validation passed");
    return true;
    
  } catch (error) {
    console.log(`   ❌ Context data integrity test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

/**
 * Test memory usage efficiency
 */
export async function testMemoryUsage(context: any): Promise<boolean> {
  try {
    const contextString = JSON.stringify(context);
    const sizeInBytes = Buffer.byteLength(contextString, 'utf8');
    const sizeInKB = sizeInBytes / 1024;
    
    // Context should be reasonable size (under 100KB for this test)
    const memoryEfficient = sizeInKB < 100;
    
    console.log(`   📊 Context size: ${sizeInKB.toFixed(2)} KB`);
    
    if (memoryEfficient) {
      console.log("   ✅ Memory usage efficiency validation passed");
    } else {
      console.log("   ❌ Context size exceeds reasonable limits");
    }
    
    return memoryEfficient;
    
  } catch (error) {
    console.log(`   ❌ Memory usage test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

/**
 * Test scalability indicators
 */
export async function testScalabilityIndicators(context: any): Promise<boolean> {
  try {
    const agentCount = context.agents.size;
    const decisionCount = context.decisionHistory.length;
    const avgContextsPerAgent = Array.from(context.agents.values())
      .reduce((sum: number, contexts: any) => sum + (Array.isArray(contexts) ? contexts.length : 0), 0) / agentCount;
    
    // Good scalability indicators
    const reasonableAgentCount = agentCount >= 3 && agentCount <= 10;
    const reasonableDecisionRatio = decisionCount / agentCount >= 0.5;
    const reasonableContextRatio = avgContextsPerAgent >= 1 && avgContextsPerAgent <= 3;
    
    console.log(`   📈 Agents: ${agentCount}, Decisions: ${decisionCount}, Avg Contexts/Agent: ${avgContextsPerAgent.toFixed(1)}`);
    
    const scalabilityGood = reasonableAgentCount && reasonableDecisionRatio && reasonableContextRatio;
    
    if (scalabilityGood) {
      console.log("   ✅ Scalability indicators validation passed");
    } else {
      console.log("   ❌ Poor scalability indicators detected");
    }
    
    return scalabilityGood;
    
  } catch (error) {
    console.log(`   ❌ Scalability indicators test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

/**
 * Run all advanced validation tests
 */
export async function runAdvancedValidationTests(context: any, testResults: TestResults): Promise<void> {
  console.log("\n🔍 Phase 4: Advanced Validation Tests");
  console.log("====================================");
  
  if (context) {
    // Test context data integrity
    const dataIntegrityValid = await testContextDataIntegrity(context);
    testResults.contextDataIntegrity = dataIntegrityValid;
    
    // Test memory usage efficiency
    const memoryEfficient = await testMemoryUsage(context);
    testResults.memoryEfficiency = memoryEfficient;
    
    // Test scalability indicators
    const scalabilityGood = await testScalabilityIndicators(context);
    testResults.scalabilityIndicators = scalabilityGood;
  }
}
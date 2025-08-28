/**
 * Test Helpers Module
 * 
 * Contains display formatting and logging functions for test output.
 */

// Re-export from test-utils
export type { TestResults } from "./test-utils.js";
export { 
  simulateDelay, 
  initializeTestResults, 
  validateTestResults, 
  EXPECTED_TEST_NAMES 
} from "./test-utils.js";

/**
 * Print test results summary with colored output
 */
export function printTestSummary(testResults: { [key: string]: boolean }): void {
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
}

/**
 * Log test step with formatted output
 */
export function logTestStep(stepNumber: number, description: string): void {
  const emoji = getStepEmoji(stepNumber);
  console.log(`\n${emoji} ${description}...`);
}

/**
 * Log test success with checkmark
 */
export function logTestSuccess(message: string): void {
  console.log(`   ✅ ${message}`);
}

/**
 * Log test failure with X mark
 */
export function logTestFailure(message: string): void {
  console.log(`   ❌ ${message}`);
}

/**
 * Get appropriate emoji for test step number
 */
function getStepEmoji(stepNumber: number): string {
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  return emojis[stepNumber - 1] || '🔢';
}

/**
 * Format context statistics for display
 */
export function formatContextStats(agentCount: number, totalContexts: number, totalDecisions: number): void {
  console.log(`   📊 Total agents: ${agentCount}`);
  console.log(`   📝 Total contexts: ${totalContexts}`);
  console.log(`   🔄 Total decisions: ${totalDecisions}`);
}

/**
 * Format analytics results for display
 */
export function formatAnalyticsResults(analytics: {
  efficiencyScore?: number;
  handoffSuccessRate?: number;
  bottleneckCount?: number;
  overallHealth?: string;
  performanceScore?: number;
  contextGrowth?: number;
  storageEfficiency?: number;
  averageQuality?: number;
  confidenceTrend?: string;
}): void {
  if (analytics.efficiencyScore !== undefined) {
    console.log(`   📈 Efficiency Score: ${analytics.efficiencyScore}%`);
  }
  
  if (analytics.handoffSuccessRate !== undefined) {
    console.log(`   🔄 Handoff Success Rate: ${(analytics.handoffSuccessRate * 100).toFixed(1)}%`);
  }
  
  if (analytics.bottleneckCount !== undefined) {
    console.log(`   🚧 Bottlenecks detected: ${analytics.bottleneckCount}`);
  }
  
  if (analytics.overallHealth) {
    console.log(`   💡 Overall Health: ${analytics.overallHealth}`);
  }
  
  if (analytics.performanceScore !== undefined) {
    console.log(`   🎯 Performance Score: ${analytics.performanceScore}%`);
  }
  
  if (analytics.contextGrowth !== undefined) {
    console.log(`   📊 Context Growth: ${analytics.contextGrowth} bytes`);
  }
  
  if (analytics.storageEfficiency !== undefined) {
    console.log(`   💾 Storage Efficiency: ${analytics.storageEfficiency}%`);
  }
  
  if (analytics.averageQuality !== undefined) {
    console.log(`   🎯 Average Decision Quality: ${(analytics.averageQuality * 100).toFixed(1)}%`);
  }
  
  if (analytics.confidenceTrend) {
    console.log(`   📈 Confidence Trend: ${analytics.confidenceTrend}`);
  }
}
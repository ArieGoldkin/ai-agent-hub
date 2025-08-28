/**
 * Analytics Tests Module
 * 
 * Main orchestrator for analytics and performance analysis functionality tests.
 */

import type { SessionContext } from "../../lib/types/context.js";
import { ContextAnalyzer } from "../../lib/context-analyzer/index.js";
import { logTestStep, type TestResults } from "./test-helpers.js";
import { 
  testPerformanceAnalysis,
  testHandoffAnalysis,
  testBottleneckDetection,
  testAnalyticsConsistency
} from "./analytics-core-tests.js";
import { 
  testInsightsGeneration,
  testContextGrowthAnalysis,
  testDecisionQualityTracking
} from "./analytics-insights-tests.js";

/**
 * Test analytics generation functionality
 */
export async function testAnalyticsGeneration(
  finalContext: SessionContext, 
  testResults: TestResults
): Promise<void> {
  logTestStep(7, "Running analytics tests");
  
  if (!finalContext) {
    console.log("   ❌ No context available for analytics");
    testResults.performanceAnalysis = false;
    testResults.handoffAnalysis = false;
    testResults.bottleneckDetection = false;
    testResults.insightsGeneration = false;
    testResults.growthAnalysis = false;
    testResults.qualityTracking = false;
    return;
  }
  
  const analyzer = new ContextAnalyzer(finalContext);
  
  // Test core analytics
  await testPerformanceAnalysis(analyzer, testResults);
  await testHandoffAnalysis(analyzer, testResults);
  await testBottleneckDetection(analyzer, testResults);
  
  // Test insights and advanced analytics
  await testInsightsGeneration(analyzer, testResults);
  await testContextGrowthAnalysis(analyzer, testResults);
  await testDecisionQualityTracking(analyzer, testResults);
}

export { testAnalyticsConsistency };
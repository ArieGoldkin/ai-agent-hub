/**
 * Analytics Core Tests Module
 * 
 * Contains tests for basic analytics functionality including performance and handoff analysis.
 */

import { ContextAnalyzer } from "../../lib/context-analyzer/index.js";
import type { SessionContext } from "../../lib/types/context.js";
import { formatAnalyticsResults, type TestResults } from "./test-helpers.js";

export async function testPerformanceAnalysis(analyzer: ContextAnalyzer, testResults: TestResults): Promise<void> {
  try {
    const performance = analyzer.analyzeWorkflowPerformance();
    testResults.performanceAnalysis = performance.totalAgentsInvolved === 4;
    formatAnalyticsResults({ efficiencyScore: performance.efficiencyScore });
    
    const validEfficiencyScore = performance.efficiencyScore >= 0 && performance.efficiencyScore <= 100;
    const validAgentCount = performance.totalAgentsInvolved > 0;
    const validThroughput = performance.averageThroughput >= 0;
    
    if (!validEfficiencyScore || !validAgentCount || !validThroughput) {
      console.log("   ❌ Performance analysis validation failed");
      testResults.performanceAnalysis = false;
    }
  } catch (error) {
    console.log(`   ❌ Performance analysis failed: ${error instanceof Error ? error.message : error}`);
    testResults.performanceAnalysis = false;
  }
}

export async function testHandoffAnalysis(analyzer: ContextAnalyzer, testResults: TestResults): Promise<void> {
  try {
    const handoffs = analyzer.analyzeHandoffPatterns();
    testResults.handoffAnalysis = handoffs.totalHandoffs >= 4;
    formatAnalyticsResults({ handoffSuccessRate: handoffs.successRate });
    
    const validSuccessRate = handoffs.successRate >= 0 && handoffs.successRate <= 1;
    const validHandoffCount = handoffs.totalHandoffs > 0;
    const validCommonPaths = Array.isArray(handoffs.commonPaths);
    
    if (!validSuccessRate || !validHandoffCount || !validCommonPaths) {
      console.log("   ❌ Handoff analysis validation failed");
      testResults.handoffAnalysis = false;
    }
  } catch (error) {
    console.log(`   ❌ Handoff analysis failed: ${error instanceof Error ? error.message : error}`);
    testResults.handoffAnalysis = false;
  }
}

export async function testBottleneckDetection(analyzer: ContextAnalyzer, testResults: TestResults): Promise<void> {
  try {
    const bottlenecks = analyzer.detectBottlenecks();
    testResults.bottleneckDetection = bottlenecks !== null;
    formatAnalyticsResults({ bottleneckCount: bottlenecks?.slowestAgents.length || 0 });
    
    if (bottlenecks) {
      const validSlowAgents = Array.isArray(bottlenecks.slowestAgents);
      const validCircularDeps = Array.isArray(bottlenecks.circularDependencies);
      const validContextOverloads = Array.isArray(bottlenecks.contextOverloads);
      
      if (!validSlowAgents || !validCircularDeps || !validContextOverloads) {
        console.log("   ❌ Bottleneck detection structure validation failed");
        testResults.bottleneckDetection = false;
      }
    }
  } catch (error) {
    console.log(`   ❌ Bottleneck detection failed: ${error instanceof Error ? error.message : error}`);
    testResults.bottleneckDetection = false;
  }
}

export async function testAnalyticsConsistency(finalContext: SessionContext): Promise<boolean> {
  try {
    const analyzer = new ContextAnalyzer(finalContext);
    const performance = analyzer.analyzeWorkflowPerformance();
    const handoffs = analyzer.analyzeHandoffPatterns();
    const insights = analyzer.generateInsights();
    
    // Check consistency between agent counts
    if (performance.totalAgentsInvolved !== finalContext.agents.size) {
      console.log("   ❌ Agent count inconsistency between performance and context");
      return false;
    }
    
    // Check handoff count consistency with decision history
    const decisionHandoffs = finalContext.decisionHistory.filter(d => d.type === 'handoff').length;
    if (Math.abs(decisionHandoffs - handoffs.totalHandoffs) > 1) {
      console.log("   ❌ Handoff count inconsistency between decision history and analysis");
      return false;
    }
    
    // Check performance score reasonableness
    if (Math.abs(insights.performanceScore - performance.efficiencyScore) > 20) {
      console.log("   ❌ Performance score inconsistency between insights and workflow analysis");
      return false;
    }
    
    console.log("   ✅ Analytics consistency validation passed");
    return true;
  } catch (error) {
    console.log(`   ❌ Analytics consistency test failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}
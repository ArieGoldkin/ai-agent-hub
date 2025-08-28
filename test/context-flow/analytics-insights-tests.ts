/**
 * Analytics Insights Tests Module
 * 
 * Contains tests for advanced analytics functionality including insights, growth, and quality tracking.
 */

import { ContextAnalyzer } from "../../lib/context-analyzer/index.js";
import { formatAnalyticsResults, type TestResults } from "./test-helpers.js";

/**
 * Test insights generation functionality
 */
export async function testInsightsGeneration(
  analyzer: ContextAnalyzer, 
  testResults: TestResults
): Promise<void> {
  try {
    const insights = analyzer.generateInsights();
    
    testResults.insightsGeneration = insights.overallHealth !== null;
    
    const analyticsResults = {
      overallHealth: insights.overallHealth,
      performanceScore: insights.performanceScore
    };
    
    formatAnalyticsResults(analyticsResults);
    
    // Additional validation
    const validHealth = typeof insights.overallHealth === 'string';
    const validScore = insights.performanceScore >= 0 && insights.performanceScore <= 100;
    const validOpportunities = Array.isArray(insights.optimizationOpportunities);
    const validWarnings = Array.isArray(insights.warnings);
    
    if (!validHealth || !validScore || !validOpportunities || !validWarnings) {
      console.log("   ❌ Insights generation validation failed");
      testResults.insightsGeneration = false;
    }
    
  } catch (error) {
    console.log(`   ❌ Insights generation failed: ${error instanceof Error ? error.message : error}`);
    testResults.insightsGeneration = false;
  }
}

/**
 * Test context growth analysis functionality
 */
export async function testContextGrowthAnalysis(
  analyzer: ContextAnalyzer, 
  testResults: TestResults
): Promise<void> {
  try {
    const growth = analyzer.analyzeContextAccumulation();
    
    testResults.growthAnalysis = growth.totalGrowth > 0;
    
    const analyticsResults = {
      contextGrowth: growth.totalGrowth,
      storageEfficiency: growth.storageEfficiency
    };
    
    formatAnalyticsResults(analyticsResults);
    
    // Additional validation
    const validGrowth = growth.totalGrowth >= 0;
    const validEfficiency = growth.storageEfficiency >= 0 && growth.storageEfficiency <= 100;
    const validAccumulationPatterns = Array.isArray(growth.accumulationPatterns) && growth.accumulationPatterns.length > 0;
    
    if (!validGrowth || !validEfficiency || !validAccumulationPatterns) {
      console.log("   ❌ Context growth analysis validation failed");
      testResults.growthAnalysis = false;
    }
    
  } catch (error) {
    console.log(`   ❌ Context growth analysis failed: ${error instanceof Error ? error.message : error}`);
    testResults.growthAnalysis = false;
  }
}

/**
 * Test decision quality tracking functionality
 */
export async function testDecisionQualityTracking(
  analyzer: ContextAnalyzer, 
  testResults: TestResults
): Promise<void> {
  try {
    const quality = analyzer.trackDecisionQuality();
    
    testResults.qualityTracking = quality.averageQuality > 0;
    
    const analyticsResults = {
      averageQuality: quality.averageQuality,
      confidenceTrend: quality.confidenceTrend
    };
    
    formatAnalyticsResults(analyticsResults);
    
    // Additional validation
    const validAverage = quality.averageQuality >= 0 && quality.averageQuality <= 1;
    const validTrend = typeof quality.confidenceTrend === 'string';
    const validRecommendations = Array.isArray(quality.recommendations) && quality.recommendations.length > 0;
    
    if (!validAverage || !validTrend || !validRecommendations) {
      console.log("   ❌ Decision quality tracking validation failed");
      testResults.qualityTracking = false;
    }
    
  } catch (error) {
    console.log(`   ❌ Decision quality tracking failed: ${error instanceof Error ? error.message : error}`);
    testResults.qualityTracking = false;
  }
}
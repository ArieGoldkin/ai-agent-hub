/**
 * Analyze Operations
 * 
 * Core analysis command implementations
 */

import { ContextAnalyzer } from "../../../lib/context-analyzer/index.js";
import { 
  displayPerformanceMetrics,
  displayHandoffPatterns,
  displayBottleneckAnalysis,
  displayInsightsAnalysis,
  displayGrowthAnalysis,
  displayQualityAnalysis,
  displayFullAnalysisReport
} from "./display.js";

/**
 * Show performance metrics analysis
 */
export async function showPerformanceAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const metrics = analyzer.analyzeWorkflowPerformance();
  displayPerformanceMetrics(metrics);
}

/**
 * Show handoff pattern analysis
 */
export async function showHandoffAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const handoffs = analyzer.analyzeHandoffPatterns();
  displayHandoffPatterns(handoffs);
}

/**
 * Show bottleneck analysis
 */
export async function showBottleneckAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const bottlenecks = analyzer.detectBottlenecks();
  displayBottleneckAnalysis(bottlenecks);
}

/**
 * Show comprehensive insights
 */
export async function showInsightsAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const insights = analyzer.generateInsights();
  displayInsightsAnalysis(insights);
}

/**
 * Show context growth analysis
 */
export async function showGrowthAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const growth = analyzer.analyzeContextAccumulation();
  displayGrowthAnalysis(growth);
}

/**
 * Show decision quality analysis
 */
export async function showQualityAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const quality = analyzer.trackDecisionQuality();
  displayQualityAnalysis(quality);
}

/**
 * Show comprehensive analysis
 */
export async function showFullAnalysis(analyzer: ContextAnalyzer): Promise<void> {
  const report = analyzer.generatePerformanceReport();
  displayFullAnalysisReport(report);
}
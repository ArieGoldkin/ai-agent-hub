/**
 * Context Analyzer - Main Module
 * 
 * Orchestrates all context analysis modules to provide comprehensive workflow insights.
 * This is the main entry point that maintains the same public API as the original monolithic class.
 */

import type { SessionContext } from '../types/context.js';
import type {
  PerformanceMetrics,
  HandoffAnalysis,
  BottleneckReport,
  InsightReport,
  ContextGrowthAnalysis
} from '../types/analytics/index.js';

import { analyzeWorkflowPerformance } from './performance.js';
import { analyzeHandoffPatterns } from './handoff.js';
import { detectBottlenecks } from './bottleneck.js';
import { generateInsights } from './insights.js';
import { trackDecisionQuality } from './decision.js';
import { analyzeContextAccumulation } from './growth.js';

/**
 * ContextAnalyzer class for advanced workflow analysis
 */
export class ContextAnalyzer {
  private context: SessionContext;

  constructor(sessionContext: SessionContext) {
    this.context = sessionContext;
  }

  /**
   * Analyze overall workflow performance metrics
   */
  analyzeWorkflowPerformance(): PerformanceMetrics {
    return analyzeWorkflowPerformance(this.context);
  }

  /**
   * Detect workflow bottlenecks and performance issues
   */
  detectBottlenecks(): BottleneckReport {
    return detectBottlenecks(this.context);
  }

  /**
   * Analyze handoff patterns between agents
   */
  analyzeHandoffPatterns(): HandoffAnalysis {
    return analyzeHandoffPatterns(this.context);
  }

  /**
   * Generate comprehensive insights and recommendations
   */
  generateInsights(): InsightReport {
    const performance = this.analyzeWorkflowPerformance();
    const bottlenecks = this.detectBottlenecks();
    const handoffs = this.analyzeHandoffPatterns();

    return generateInsights(this.context, performance, bottlenecks, handoffs);
  }

  /**
   * Track decision quality and confidence scores
   */
  trackDecisionQuality(): { averageQuality: number; confidenceTrend: string; recommendations: string[] } {
    return trackDecisionQuality(this.context);
  }

  /**
   * Analyze context accumulation patterns and growth
   */
  analyzeContextAccumulation(): ContextGrowthAnalysis {
    return analyzeContextAccumulation(this.context);
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport(): {
    performance: PerformanceMetrics;
    bottlenecks: BottleneckReport;
    handoffs: HandoffAnalysis;
    insights: InsightReport;
    growth: ContextGrowthAnalysis;
  } {
    return {
      performance: this.analyzeWorkflowPerformance(),
      bottlenecks: this.detectBottlenecks(),
      handoffs: this.analyzeHandoffPatterns(),
      insights: this.generateInsights(),
      growth: this.analyzeContextAccumulation()
    };
  }
}

// Export the main class as default
export default ContextAnalyzer;

// Re-export all type definitions for convenience
export type {
  PerformanceMetrics,
  HandoffAnalysis,
  BottleneckReport,
  InsightReport,
  ContextGrowthAnalysis
} from '../types/analytics/index.js';
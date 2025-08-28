/**
 * Analytics Types
 * 
 * Unified export module for all analytics type definitions.
 * Provides backward compatibility for existing imports.
 */

// Performance metric types
export type {
  AgentPerformance,
  PerformanceMetrics,
  ContextGrowthAnalysis,
  AccumulationPattern
} from './performance.js';

// Workflow analysis types
export type {
  HandoffAnalysis,
  HandoffPath,
  HandoffStats,
  BottleneckReport,
  AgentBottleneck,
  ContextOverload,
  CircularDependency,
  QueueDepth,
  StaleContext
} from './workflow.js';

// Insight and recommendation types
export type {
  InsightReport,
  OptimizationOpportunity,
  Warning,
  ActionableRecommendation
} from './insights.js';

// Visualization and display types
export type {
  ChartDataPoint,
  ProgressBarConfig,
  TableColumn,
  DisplayOptions
} from './visualization.js';
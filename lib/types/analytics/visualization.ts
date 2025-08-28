/**
 * Visualization and Display Types
 * 
 * Type definitions for data visualization, charts, and display formatting.
 * Currently includes foundational types for future visualization features.
 */

// This module is prepared for future visualization types
// Currently, the analytics system uses ASCII charts and tables
// but can be extended with more sophisticated visualization types

/**
 * Chart data point for time series visualization
 */
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

/**
 * Progress bar configuration for ASCII displays
 */
export interface ProgressBarConfig {
  width: number;
  filled: string;
  empty: string;
  showPercentage: boolean;
}

/**
 * Table column configuration for formatted displays
 */
export interface TableColumn {
  header: string;
  field: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

/**
 * Display formatting options
 */
export interface DisplayOptions {
  showTimestamps: boolean;
  colorEnabled: boolean;
  maxWidth?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
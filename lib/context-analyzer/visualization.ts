/**
 * Visualization Utilities Module
 * 
 * ASCII chart generation and data visualization helpers for console output.
 */

/**
 * Draw a progress bar with ASCII characters
 */
export function drawProgressBar(label: string, value: number, max: number): string {
  const width = 30;
  const filled = Math.round((value / max) * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const percentage = Math.round((value / max) * 100);
  
  return `${label.padEnd(12)} │${bar}│ ${percentage}%`;
}

/**
 * Draw a simple timeline chart for handoff success rates
 */
export function drawTimelineChart(successRate: number): string {
  const timeline = "▁▂▃▄▅▆▇█";
  const success = Math.min(7, Math.floor(successRate * 8));
  const chart = timeline.charAt(success).repeat(20);
  return `Timeline: ${chart} (${(successRate * 100).toFixed(0)}% success rate)`;
}

/**
 * Get emoji for severity levels
 */
export function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case 'low': return '🟢';
    case 'medium': return '🟡';
    case 'high': return '🟠';
    case 'critical': return '🔴';
    default: return '⚪';
  }
}

/**
 * Get emoji for health status
 */
export function getHealthEmoji(health: string): string {
  switch (health) {
    case 'excellent': return '💚';
    case 'good': return '💙';
    case 'fair': return '💛';
    case 'poor': return '🧡';
    case 'critical': return '❤️';
    default: return '🤍';
  }
}

/**
 * Get emoji for priority levels
 */
export function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'low': return '🔵';
    case 'medium': return '🟡';
    case 'high': return '🟠';
    case 'critical': return '🔴';
    default: return '⚪';
  }
}

/**
 * Get emoji for accumulation patterns
 */
export function getPatternEmoji(pattern: string): string {
  switch (pattern) {
    case 'linear': return '📈';
    case 'exponential': return '📊';
    case 'sporadic': return '📉';
    case 'declining': return '📉';
    default: return '📊';
  }
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format time in milliseconds to human readable string
 */
export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * Format relative time from a date
 */
export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
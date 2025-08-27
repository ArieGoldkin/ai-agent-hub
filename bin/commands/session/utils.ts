/**
 * Session Utility Functions
 * 
 * Helper functions for session operations
 */

/**
 * Generate a default session name
 */
export function generateSessionName(): string {
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
  return `session-${timestamp}`;
}

/**
 * Get duration between two dates
 */
export function getDuration(start: string | Date, end: string | Date): string {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const diff = endMs - startMs;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
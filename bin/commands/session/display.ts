/**
 * Session Display Functions
 * 
 * Formatting and display utilities for session information
 */

import type { SessionContext } from "../../../lib/types/context.js";

/**
 * Format session context for display
 */
export function formatSessionDisplay(context: SessionContext): string {
  const lines: string[] = [];
  
  lines.push(`\n📊 Current Session: ${context.sessionId}`);
  lines.push(`   Started: ${formatDate(context.startTime)}`);
  lines.push(`   Last Updated: ${formatDate(context.lastUpdated)}`);
  
  // Show agents involved
  if (context.agents.size > 0) {
    lines.push("\n   Agents Involved:");
    for (const [agent, interactions] of context.agents) {
      const count = interactions.length;
      lines.push(`     • ${agent} (${count} interaction${count !== 1 ? 's' : ''})`);
    }
  }
  
  // Show recent decisions
  if (context.decisionHistory.length > 0) {
    lines.push("\n   Recent Decisions:");
    const recentDecisions = context.decisionHistory.slice(-5);
    for (const decision of recentDecisions) {
      const icon = getDecisionIcon(decision.type);
      lines.push(`     ${icon} ${decision.type}: ${decision.reason}`);
      if (decision.targetAgent) {
        lines.push(`        → Target: ${decision.targetAgent}`);
      }
    }
  }
  
  // Show metadata if exists
  if (context.metadata && Object.keys(context.metadata).length > 0) {
    lines.push("\n   Metadata:");
    for (const [key, value] of Object.entries(context.metadata)) {
      lines.push(`     • ${key}: ${value}`);
    }
  }
  
  lines.push("");
  return lines.join("\n");
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

/**
 * Get icon for decision type
 */
export function getDecisionIcon(type: string): string {
  const icons: Record<string, string> = {
    handoff: '🔄',
    continue: '➡️',
    escalate: '⚠️',
    complete: '✅',
    defer: '⏸️'
  };
  return icons[type] || '•';
}
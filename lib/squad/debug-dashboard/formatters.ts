import { AgentStatus, DebugSession } from '../debug-mode/types.js';

export class DashboardFormatters {
  static getStatusIcon(status: AgentStatus['status']): string {
    switch (status) {
      case 'pending': return '⏸️';
      case 'running': return '🔄';
      case 'waiting': return '⏳';
      case 'complete': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  }

  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  static getAgentDuration(agent: AgentStatus): string {
    if (!agent.startTime) return '-';
    
    const end = agent.endTime || new Date();
    const duration = end.getTime() - agent.startTime.getTime();
    return this.formatDuration(duration);
  }

  static estimateCost(tokens: number): string {
    // Rough estimate: $0.003 per 1K tokens
    const cost = (tokens / 1000) * 0.003;
    return cost.toFixed(4);
  }

  static getProgressBar(percent: number): string {
    const filled = Math.floor(percent / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  static formatSessionDuration(session: DebugSession): string {
    const elapsed = Date.now() - session.startTime.getTime();
    return this.formatDuration(elapsed);
  }
}
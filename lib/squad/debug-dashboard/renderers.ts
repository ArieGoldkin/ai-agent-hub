import { DebugSession, AgentStatus } from '../debug-mode/types.js';
import { LockInfo } from '../lock-types.js';
import { DashboardFormatters } from './formatters.js';

export class DashboardRenderers {
  static renderHeader(session: DebugSession): string {
    const now = new Date().toISOString();
    const executionMode = session.config.sequential ? 'Sequential' : 'Parallel';
    const elapsed = DashboardFormatters.formatSessionDuration(session);
    
    let md = `# Squad Debug Dashboard\n\n`;
    md += `**Session ID:** ${session.config.sessionId}\n`;
    md += `**Last Updated:** ${now}\n`;
    md += `**Elapsed Time:** ${elapsed}\n\n`;
    md += `## Execution Mode: ${executionMode}\n\n`;
    
    return md;
  }

  static renderAgentTable(agents: AgentStatus[]): string {
    let md = `## Agent Status\n\n`;
    md += `| Agent | Status | Tokens | Files Modified | Current Operation | Duration |\n`;
    md += `|-------|--------|--------|----------------|-------------------|----------|\n`;
    
    for (const agent of agents) {
      const statusIcon = DashboardFormatters.getStatusIcon(agent.status);
      const duration = DashboardFormatters.getAgentDuration(agent);
      const filesCount = agent.filesModified.length;
      
      md += `| ${agent.id} | ${statusIcon} ${agent.status} | ${agent.tokensUsed} | ${filesCount} | ${agent.currentOperation} | ${duration} |\n`;
    }
    
    return md;
  }

  static renderFileLocks(locks: LockInfo[], waitingAgents: Map<string, Set<number>>): string {
    let md = `\n## File Lock Status\n\n`;
    
    if (locks.length === 0) {
      md += `*No active file locks*\n`;
    } else {
      md += `| File | Locked By | Duration |\n`;
      md += `|------|-----------|----------|\n`;
      
      for (const lock of locks) {
        const age = Date.now() - new Date(lock.timestamp).getTime();
        const duration = DashboardFormatters.formatDuration(age);
        md += `| ${lock.filepath} | Agent-${lock.agentId} | ${duration} |\n`;
      }
    }
    
    if (waitingAgents.size > 0) {
      md += `\n### Waiting Queue\n\n`;
      for (const [file, agents] of waitingAgents) {
        const agentList = Array.from(agents).join(', ');
        md += `- **${file}:** Agents ${agentList} waiting\n`;
      }
    }
    
    return md;
  }

  static renderTokenUsage(session: DebugSession): string {
    let md = `\n## Token Usage\n\n`;
    md += `- **Total Used:** ${session.tokenUsage.total.toLocaleString()} / ${session.tokenUsage.budget.toLocaleString()} budget\n`;
    md += `- **Usage Rate:** ${session.tokenUsage.rate.toFixed(1)} tokens/second\n`;
    md += `- **Estimated Cost:** $${DashboardFormatters.estimateCost(session.tokenUsage.total)}\n`;
    
    const percentUsed = (session.tokenUsage.total / session.tokenUsage.budget * 100).toFixed(1);
    md += `- **Budget Used:** ${percentUsed}% ${DashboardFormatters.getProgressBar(parseFloat(percentUsed))}\n`;
    
    return md;
  }

  static renderFileOperations(session: DebugSession): string {
    let md = `\n## Recent File Operations (Last 10)\n\n`;
    const recentOps = session.fileOperations.slice(-10).reverse();
    
    if (recentOps.length === 0) {
      md += `*No file operations yet*\n`;
    } else {
      md += `| Time | Agent | Operation | File | Success | Duration |\n`;
      md += `|------|-------|-----------|------|---------|----------|\n`;
      
      for (const op of recentOps) {
        const time = new Date(op.timestamp).toLocaleTimeString();
        const success = op.success ? '✅' : '❌';
        md += `| ${time} | ${op.agentId} | ${op.operation} | ${op.filepath} | ${success} | ${op.duration}ms |\n`;
      }
    }
    
    return md;
  }

  static renderErrors(agents: AgentStatus[]): string {
    const failedAgents = agents.filter(a => a.status === 'failed');
    if (failedAgents.length === 0) return '';
    
    let md = `\n## ⚠️ Errors\n\n`;
    for (const agent of failedAgents) {
      md += `### ${agent.id}\n`;
      md += `\`\`\`\n${agent.error || 'Unknown error'}\n\`\`\`\n\n`;
    }
    
    return md;
  }

  static renderDebugCommands(session: DebugSession): string {
    let md = `\n## Debug Commands\n\n`;
    md += `\`\`\`bash\n`;
    md += `# Tail execution log\n`;
    md += `tail -f ${session.config.debugDir}/execution-trace.log\n\n`;
    md += `# View agent context\n`;
    md += `cat ${session.config.debugDir}/context-[agent-id].json\n\n`;
    md += `# Analyze session\n`;
    md += `npx ai-agent-hub squad-debug-analyze ${session.config.sessionId}\n`;
    md += `\`\`\`\n`;
    
    return md;
  }
}
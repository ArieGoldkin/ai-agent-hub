import { DebugSession, AgentStatus } from '../debug-mode/types.js';
import chalk from 'chalk';

export class SessionAnalyzer {
  analyzeFailures(session: DebugSession): AgentStatus[] {
    return Array.from(session.agents.values())
      .filter(a => a.status === 'failed');
  }

  suggestFixes(session: DebugSession, failedAgents: AgentStatus[]): string[] {
    const suggestions = new Set<string>();

    for (const agent of failedAgents) {
      if (agent.error?.includes('lock')) {
        suggestions.add('Use --squad-debug to run in sequential mode and avoid lock conflicts');
      }
      if (agent.error?.includes('undefined') || agent.error?.includes('null')) {
        suggestions.add('Check file dependencies - some agents may be reading files before they are created');
      }
      if (agent.error?.includes('timeout')) {
        suggestions.add('Increase timeout values or reduce agent workload');
      }
      if (agent.error?.includes('token')) {
        suggestions.add('Reduce agent scope or increase token budget');
      }
    }

    if (session.config.sequential === false && failedAgents.length > 1) {
      suggestions.add('Multiple failures in parallel mode - try sequential mode with --squad-debug');
    }

    return Array.from(suggestions);
  }

  detectDeadlocks(session: DebugSession): string[] {
    const deadlocks: string[] = [];
    const waitingOps = session.fileOperations
      .filter(op => op.operation === 'lock' && !op.success);

    const fileWaits = new Map<string, string[]>();
    for (const op of waitingOps) {
      if (!fileWaits.has(op.filepath)) {
        fileWaits.set(op.filepath, []);
      }
      fileWaits.get(op.filepath)!.push(op.agentId);
    }

    for (const [file, agents] of fileWaits) {
      if (agents.length > 1) {
        deadlocks.push(`${file} blocked by agents: ${agents.join(', ')}`);
      }
    }

    return deadlocks;
  }

  identifyBottlenecks(session: DebugSession): string[] {
    const bottlenecks: string[] = [];
    
    const slowOps = session.fileOperations
      .filter(op => op.duration > 1000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3);

    for (const op of slowOps) {
      bottlenecks.push(`${op.agentId} ${op.operation} ${op.filepath} took ${op.duration}ms`);
    }

    const fileCounts = new Map<string, number>();
    for (const op of session.fileOperations) {
      fileCounts.set(op.filepath, (fileCounts.get(op.filepath) || 0) + 1);
    }

    const hotFiles = Array.from(fileCounts.entries())
      .filter(([_, count]) => count > 5)
      .sort((a, b) => b[1] - a[1]);

    for (const [file, count] of hotFiles) {
      bottlenecks.push(`${file} accessed ${count} times (potential contention)`);
    }

    return bottlenecks;
  }

  calculateAverageOperationTime(session: DebugSession): number {
    if (session.fileOperations.length === 0) return 0;
    
    const total = session.fileOperations
      .reduce((sum, op) => sum + op.duration, 0);
    
    return total / session.fileOperations.length;
  }

  formatDuration(session: DebugSession): string {
    if (!session.endTime) return 'In progress';
    
    const duration = new Date(session.endTime).getTime() - 
                    new Date(session.startTime).getTime();
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  printAnalysis(session: DebugSession, sessionId: string): void {
    console.log(chalk.bold('\n📊 Debug Session Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`Session ID: ${sessionId}`);
    console.log(`Duration: ${this.formatDuration(session)}`);
    console.log(`Mode: ${session.config.sequential ? 'Sequential' : 'Parallel'}`);
    console.log();

    const failedAgents = this.analyzeFailures(session);

    if (failedAgents.length > 0) {
      console.log(chalk.red.bold('❌ Failed Agents:'));
      for (const agent of failedAgents) {
        console.log(`\n  ${chalk.yellow(agent.id)}:`);
        console.log(`    Error: ${agent.error}`);
        console.log(`    Last Operation: ${agent.currentOperation}`);
        console.log(`    Files Modified: ${agent.filesModified.join(', ') || 'none'}`);
        
        const agentOps = session.fileOperations
          .filter(op => op.agentId === agent.id && !op.success);
        
        if (agentOps.length > 0) {
          console.log(`    Failed Operations:`);
          for (const op of agentOps) {
            console.log(`      - ${op.operation} ${op.filepath}`);
          }
        }
      }
      
      console.log(chalk.green.bold('\n💡 Suggested Fixes:'));
      const suggestions = this.suggestFixes(session, failedAgents);
      suggestions.forEach(s => console.log(`  • ${s}`));
    } else {
      console.log(chalk.green('✅ No failures detected'));
    }

    const deadlocks = this.detectDeadlocks(session);
    if (deadlocks.length > 0) {
      console.log(chalk.yellow.bold('\n⚠️ Potential Deadlocks Detected:'));
      for (const deadlock of deadlocks) {
        console.log(`  ${deadlock}`);
      }
      console.log(chalk.green('\n💡 Try running with --squad-debug for sequential execution'));
    }

    console.log(chalk.blue.bold('\n📈 Performance Metrics:'));
    console.log(`  Total Tokens: ${session.tokenUsage.total.toLocaleString()}`);
    console.log(`  Token Rate: ${session.tokenUsage.rate.toFixed(1)} tokens/sec`);
    console.log(`  File Operations: ${session.fileOperations.length}`);
    
    const avgOpTime = this.calculateAverageOperationTime(session);
    console.log(`  Avg Operation Time: ${avgOpTime.toFixed(1)}ms`);

    const bottlenecks = this.identifyBottlenecks(session);
    if (bottlenecks.length > 0) {
      console.log(chalk.yellow.bold('\n🔥 Performance Bottlenecks:'));
      for (const bottleneck of bottlenecks) {
        console.log(`  - ${bottleneck}`);
      }
    }
  }
}
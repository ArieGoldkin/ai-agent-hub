import { DebugSession } from '../debug-mode/types.js';
import chalk from 'chalk';

export class SessionReplay {
  async replaySession(session: DebugSession, sessionId: string): Promise<void> {
    console.log(chalk.bold('\n▶️  Replaying Debug Session'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`Session ID: ${sessionId}`);
    console.log(`Original Duration: ${this.formatDuration(session)}`);
    console.log();

    const operations = session.fileOperations
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    console.log('Press ENTER to step through operations, or "q" to quit\n');

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const time = new Date(op.timestamp).toLocaleTimeString();
      const success = op.success ? chalk.green('✅') : chalk.red('❌');
      
      console.log(`[${i + 1}/${operations.length}] ${time} ${success}`);
      console.log(`  Agent: ${chalk.yellow(op.agentId)}`);
      console.log(`  Operation: ${chalk.cyan(op.operation)} ${op.filepath}`);
      console.log(`  Duration: ${op.duration}ms`);
      
      if (op.beforeHash || op.afterHash) {
        console.log(`  Hash: ${op.beforeHash || '-'} → ${op.afterHash || '-'}`);
      }

      const agent = session.agents.get(op.agentId);
      if (agent) {
        console.log(`  Agent Status: ${agent.status}`);
        console.log(`  Current Op: ${agent.currentOperation}`);
      }

      console.log();

      const input = await this.waitForInput();
      if (input === 'q') break;
    }

    console.log('\n✅ Replay complete');
  }

  private async waitForInput(): Promise<string> {
    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }

  private formatDuration(session: DebugSession): string {
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
}
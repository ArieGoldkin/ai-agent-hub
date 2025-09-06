import chalk from 'chalk';
import { LockInfo, DeadlockInfo } from './lock-types.js';

export class MonitorDisplay {
  static formatAge(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return chalk.red(`${hours}h ${minutes % 60}m`);
    } else if (minutes > 0) {
      return chalk.yellow(`${minutes}m ${seconds % 60}s`);
    } else {
      return chalk.green(`${seconds}s`);
    }
  }

  static displayHeader(): void {
    console.clear();
    console.log(chalk.bold.cyan('🔒 Squad Mode Lock Monitor'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`Last Updated: ${new Date().toLocaleTimeString()}`));
    console.log();
  }

  static displayLocks(locks: LockInfo[]): void {
    console.log(chalk.bold.green('📁 Active Locks:'));
    if (locks.length === 0) {
      console.log(chalk.gray('  No active locks'));
    } else {
      for (const lock of locks) {
        const age = Date.now() - new Date(lock.timestamp).getTime();
        const ageStr = this.formatAge(age);
        const isStale = age > 120000; // 2 minutes
        
        const status = isStale ? chalk.red('STALE') : chalk.green('ACTIVE');
        console.log(`  ${status} Agent ${chalk.yellow(lock.agentId)} → ${chalk.cyan(lock.filepath)} (${ageStr})`);
      }
    }
    console.log();
  }

  static displayWaitingAgents(waitingAgents: Map<string, Set<number>>): void {
    console.log(chalk.bold.yellow('⏳ Waiting Agents:'));
    if (waitingAgents.size === 0) {
      console.log(chalk.gray('  No agents waiting'));
    } else {
      for (const [filepath, agents] of waitingAgents) {
        const agentList = Array.from(agents).join(', ');
        console.log(`  File: ${chalk.cyan(filepath)}`);
        console.log(`    Waiting: Agents ${chalk.yellow(agentList)}`);
      }
    }
    console.log();
  }

  static displayDeadlock(deadlock: DeadlockInfo): void {
    console.log(chalk.bold.red('⚠️  Deadlock Status:'));
    if (deadlock.hasDeadlock && deadlock.agents) {
      console.log(chalk.red(`  DEADLOCK DETECTED!`));
      console.log(chalk.red(`  Involved agents: ${deadlock.agents.join(' → ')}`));
    } else {
      console.log(chalk.green('  No deadlocks detected'));
    }
    console.log();
  }

  static displayStaleLocks(locks: LockInfo[]): void {
    const staleLocks = locks.filter(lock => {
      const age = Date.now() - new Date(lock.timestamp).getTime();
      return age > 120000; // 2 minutes
    });

    if (staleLocks.length > 0) {
      console.log(chalk.bold.magenta('🧹 Stale Locks (> 2 minutes):'));
      for (const lock of staleLocks) {
        const age = Date.now() - new Date(lock.timestamp).getTime();
        console.log(`  Agent ${chalk.yellow(lock.agentId)} → ${chalk.cyan(lock.filepath)} (${this.formatAge(age)})`);
      }
      console.log();
    }
  }

  static displayCommands(): void {
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.bold('Commands:'));
    console.log('  ' + chalk.green('c') + ' - Clean stale locks (> 5 minutes)');
    console.log('  ' + chalk.green('f') + ' - Force clean ALL locks (dangerous!)');
    console.log('  ' + chalk.green('r') + ' - Refresh display');
    console.log('  ' + chalk.green('q') + ' - Quit');
    console.log();
  }
}
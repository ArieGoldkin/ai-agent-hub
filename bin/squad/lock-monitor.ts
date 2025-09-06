#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';
import * as fs from 'fs/promises';
import chalk from 'chalk';
import { MonitorDisplay } from '../../lib/squad/monitor-display.js';

class LockMonitor {
  private lockManager: FileLockManager;
  private refreshInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.lockManager = new FileLockManager();
  }

  async displayStatus(): Promise<void> {
    MonitorDisplay.displayHeader();
    
    const locks = await this.lockManager.getCurrentLocks();
    const waitingAgents = this.lockManager.getWaitingAgents();
    const deadlock = await this.lockManager.detectDeadlock();

    MonitorDisplay.displayLocks(locks);
    MonitorDisplay.displayWaitingAgents(waitingAgents);
    MonitorDisplay.displayDeadlock(deadlock);
    MonitorDisplay.displayStaleLocks(locks);
    MonitorDisplay.displayCommands();
  }

  async cleanStaleLocks(ageMinutes: number = 5): Promise<void> {
    console.log(chalk.yellow(`\nCleaning locks older than ${ageMinutes} minutes...`));
    const cleaned = await this.lockManager.forceReleaseStaleLocks(ageMinutes);
    console.log(chalk.green(`✓ Cleaned ${cleaned} stale lock(s)\n`));
    await this.sleep(2000);
  }

  async forceCleanAll(): Promise<void> {
    console.log(chalk.red('\n⚠️  WARNING: This will remove ALL locks!'));
    console.log(chalk.red('This may cause data corruption if agents are actively working.'));
    console.log(chalk.yellow('Are you sure? (y/N): '));
    
    const response = await this.readUserInput();
    
    if (response.toLowerCase() === 'y') {
      try {
        await fs.rm('.squad/locks', { recursive: true, force: true });
        await fs.mkdir('.squad/locks', { recursive: true });
        console.log(chalk.green('✓ All locks removed\n'));
      } catch (error) {
        console.log(chalk.red(`✗ Error: ${error}\n`));
      }
    } else {
      console.log(chalk.gray('Cancelled\n'));
    }
    
    await this.sleep(2000);
  }

  private readUserInput(): Promise<string> {
    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }

  async start(): Promise<void> {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    await this.displayStatus();

    this.refreshInterval = setInterval(async () => {
      await this.displayStatus();
    }, 2000);

    process.stdin.on('data', async (key: string) => {
      await this.handleKeyPress(key);
    });

    setInterval(async () => {
      await this.lockManager.forceReleaseStaleLocks(5);
    }, 5 * 60 * 1000);
  }

  private async handleKeyPress(key: string): Promise<void> {
    switch (key) {
      case 'q':
      case '\u0003': // Ctrl+C
        this.stop();
        break;
      
      case 'c':
        this.pauseRefresh();
        await this.cleanStaleLocks(5);
        this.resumeRefresh();
        break;
      
      case 'f':
        this.pauseRefresh();
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        await this.forceCleanAll();
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
        }
        this.resumeRefresh();
        break;
      
      case 'r':
        await this.displayStatus();
        break;
    }
  }

  private pauseRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private resumeRefresh(): void {
    this.refreshInterval = setInterval(async () => {
      await this.displayStatus();
    }, 2000);
  }

  stop(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    
    console.log(chalk.gray('\nMonitor stopped'));
    process.exit(0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new LockMonitor();
  monitor.start().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
  
  process.on('SIGINT', () => monitor.stop());
  process.on('SIGTERM', () => monitor.stop());
}
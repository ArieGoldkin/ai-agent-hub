#!/usr/bin/env node

import * as fs from 'fs/promises';
import { LockInfo, LockStatus, DeadlockInfo } from '../../lib/squad/lock-types.js';
import { getLockPath, logOperation } from '../../lib/squad/lock-utils.js';
import { DeadlockDetector } from '../../lib/squad/deadlock-detector.js';
import { LockCore } from '../../lib/squad/lock-core.js';

export class FileLockManager {
  private readonly lockDir: string;
  private readonly debugLog: string;
  private readonly waitingAgents: Map<string, Set<number>> = new Map();

  constructor(lockDir: string = '.squad/locks', debugLog: string = '.squad/debug/locks.log') {
    this.lockDir = lockDir;
    this.debugLog = debugLog;
  }

  async acquireLock(filepath: string, agentId: number, timeout: number = 30000): Promise<boolean> {
    const lockPath = getLockPath(this.lockDir, filepath);
    const startTime = Date.now();
    let attempts = 0;
    
    this.addToWaitingQueue(filepath, agentId);
    await logOperation(this.debugLog, `Agent ${agentId} attempting to acquire lock for ${filepath}`);
    await fs.mkdir(this.lockDir, { recursive: true });
    
    while (Date.now() - startTime < timeout) {
      const acquired = await LockCore.tryAcquire(lockPath, filepath, agentId, this.debugLog);
      if (acquired) {
        this.removeFromWaitingQueue(filepath, agentId);
        await logOperation(this.debugLog, `Agent ${agentId} acquired lock for ${filepath} after ${attempts} attempts`);
        return true;
      }
      
      attempts++;
      const backoff = Math.min(100 * Math.pow(1.5, attempts), 1000);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
    
    this.removeFromWaitingQueue(filepath, agentId);
    await logOperation(this.debugLog, `Agent ${agentId} timed out acquiring lock for ${filepath} after ${timeout}ms`);
    return false;
  }

  async releaseLock(filepath: string, agentId: number): Promise<void> {
    const lockPath = getLockPath(this.lockDir, filepath);
    await LockCore.release(lockPath, filepath, agentId, this.debugLog);
  }

  async isLocked(filepath: string): Promise<LockStatus> {
    const lockPath = getLockPath(this.lockDir, filepath);
    return LockCore.checkLockStatus(lockPath);
  }

  async forceReleaseStaleLocks(ageMinutes: number = 2): Promise<number> {
    const ageMs = ageMinutes * 60 * 1000;
    let released = 0;
    
    try {
      await fs.mkdir(this.lockDir, { recursive: true });
      const files = await fs.readdir(this.lockDir);
      
      for (const file of files) {
        if (!file.endsWith('.lock')) continue;
        released += await LockCore.cleanStaleLock(this.lockDir, file, ageMs, this.debugLog);
      }
    } catch {
      // Ignore errors during cleanup
    }
    
    return released;
  }

  async detectDeadlock(): Promise<DeadlockInfo> {
    const dependencies = await this.buildDependencyGraph();
    const cycleAgents = DeadlockDetector.findCycle(dependencies);
    
    if (cycleAgents.length > 0) {
      await logOperation(this.debugLog, `Deadlock detected involving agents: ${cycleAgents.join(', ')}`);
    }
    
    return DeadlockDetector.createDeadlockInfo(cycleAgents);
  }

  private async buildDependencyGraph(): Promise<Map<number, Set<number>>> {
    const dependencies = new Map<number, Set<number>>();
    
    try {
      const files = await fs.readdir(this.lockDir);
      
      for (const file of files) {
        if (!file.endsWith('.lock')) continue;
        await this.addDependencies(file, dependencies);
      }
    } catch {
      // Return empty map on error
    }
    
    return dependencies;
  }

  private async addDependencies(file: string, dependencies: Map<number, Set<number>>): Promise<void> {
    try {
      const lockContent = await fs.readFile(`${this.lockDir}/${file}`, 'utf-8');
      const lockInfo: LockInfo = JSON.parse(lockContent);
      const waitingForFile = this.waitingAgents.get(lockInfo.filepath);
      
      if (waitingForFile) {
        for (const waitingAgent of waitingForFile) {
          if (!dependencies.has(waitingAgent)) {
            dependencies.set(waitingAgent, new Set());
          }
          dependencies.get(waitingAgent)!.add(lockInfo.agentId);
        }
      }
    } catch {
      // Ignore individual file errors
    }
  }

  async getCurrentLocks(): Promise<LockInfo[]> {
    return LockCore.getAllLocks(this.lockDir);
  }

  getWaitingAgents(): Map<string, Set<number>> {
    return new Map(this.waitingAgents);
  }

  private addToWaitingQueue(filepath: string, agentId: number): void {
    if (!this.waitingAgents.has(filepath)) {
      this.waitingAgents.set(filepath, new Set());
    }
    this.waitingAgents.get(filepath)!.add(agentId);
  }

  private removeFromWaitingQueue(filepath: string, agentId: number): void {
    this.waitingAgents.get(filepath)?.delete(agentId);
    if (this.waitingAgents.get(filepath)?.size === 0) {
      this.waitingAgents.delete(filepath);
    }
  }
}
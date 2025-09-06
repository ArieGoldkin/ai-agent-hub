#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class AgentWrapper {
  private lockManager: FileLockManager;
  private agentId: number;

  constructor(agentId: number) {
    this.agentId = agentId;
    this.lockManager = new FileLockManager();
  }

  /**
   * Read file with lock protection
   */
  async readFile(filepath: string): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff
        await this.sleep(100 * Math.pow(2, attempt));
      }

      const acquired = await this.lockManager.acquireLock(filepath, this.agentId, 30000);
      
      if (!acquired) {
        lastError = new Error(`Failed to acquire read lock for ${filepath}`);
        continue;
      }

      try {
        const content = await fs.readFile(filepath, 'utf-8');
        return content;
      } catch (error) {
        lastError = error as Error;
      } finally {
        await this.lockManager.releaseLock(filepath, this.agentId);
      }
    }

    throw lastError || new Error(`Failed to read ${filepath} after ${maxRetries} attempts`);
  }

  /**
   * Write file with lock protection
   */
  async writeFile(filepath: string, content: string): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff
        await this.sleep(100 * Math.pow(2, attempt));
      }

      const acquired = await this.lockManager.acquireLock(filepath, this.agentId, 30000);
      
      if (!acquired) {
        lastError = new Error(`Failed to acquire write lock for ${filepath}`);
        continue;
      }

      try {
        // Ensure directory exists
        const dir = path.dirname(filepath);
        await fs.mkdir(dir, { recursive: true });
        
        // Write with atomic operation (write to temp, then rename)
        const tempPath = `${filepath}.tmp.${this.agentId}`;
        await fs.writeFile(tempPath, content);
        await fs.rename(tempPath, filepath);
        
        return;
      } catch (error) {
        lastError = error as Error;
        // Clean up temp file if it exists
        const tempPath = `${filepath}.tmp.${this.agentId}`;
        await fs.unlink(tempPath).catch(() => {});
      } finally {
        await this.lockManager.releaseLock(filepath, this.agentId);
      }
    }

    throw lastError || new Error(`Failed to write ${filepath} after ${maxRetries} attempts`);
  }

  /**
   * Append to file with lock protection
   */
  async appendFile(filepath: string, content: string): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff
        await this.sleep(100 * Math.pow(2, attempt));
      }

      const acquired = await this.lockManager.acquireLock(filepath, this.agentId, 30000);
      
      if (!acquired) {
        lastError = new Error(`Failed to acquire append lock for ${filepath}`);
        continue;
      }

      try {
        // Ensure directory exists
        const dir = path.dirname(filepath);
        await fs.mkdir(dir, { recursive: true });
        
        await fs.appendFile(filepath, content);
        return;
      } catch (error) {
        lastError = error as Error;
      } finally {
        await this.lockManager.releaseLock(filepath, this.agentId);
      }
    }

    throw lastError || new Error(`Failed to append to ${filepath} after ${maxRetries} attempts`);
  }

  /**
   * Delete file with lock protection
   */
  async deleteFile(filepath: string): Promise<void> {
    const acquired = await this.lockManager.acquireLock(filepath, this.agentId, 30000);
    
    if (!acquired) {
      throw new Error(`Failed to acquire delete lock for ${filepath}`);
    }

    try {
      await fs.unlink(filepath);
    } finally {
      await this.lockManager.releaseLock(filepath, this.agentId);
    }
  }

  /**
   * Check for deadlocks
   */
  async checkDeadlock(): Promise<void> {
    const deadlock = await this.lockManager.detectDeadlock();
    if (deadlock.hasDeadlock && deadlock.agents?.includes(this.agentId)) {
      console.warn(`⚠️  Agent ${this.agentId} is involved in a deadlock with agents: ${deadlock.agents.join(', ')}`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
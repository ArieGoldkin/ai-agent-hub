import * as fs from 'fs/promises';
import { LockInfo, LockStatus } from './lock-types.js';
import { logOperation } from './lock-utils.js';

export class LockCore {
  static async tryAcquire(
    lockPath: string,
    filepath: string,
    agentId: number,
    debugLog: string
  ): Promise<boolean> {
    try {
      const lockInfo: LockInfo = {
        agentId,
        timestamp: new Date().toISOString(),
        operation: 'write',
        filepath
      };
      
      await fs.writeFile(lockPath, JSON.stringify(lockInfo, null, 2), { flag: 'wx' });
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
        const status = await this.checkLockStatus(lockPath);
        if (status.locked && status.age && status.age > 120000) {
          await logOperation(debugLog, `Agent ${agentId} found stale lock for ${filepath} (age: ${status.age}ms)`);
          try {
            await fs.unlink(lockPath);
            await logOperation(debugLog, `Agent ${agentId} removed stale lock for ${filepath}`);
          } catch {
            // Another agent might have already removed it
          }
        }
      }
      return false;
    }
  }

  static async checkLockStatus(lockPath: string): Promise<LockStatus> {
    try {
      const lockContent = await fs.readFile(lockPath, 'utf-8');
      const lockInfo: LockInfo = JSON.parse(lockContent);
      const age = Date.now() - new Date(lockInfo.timestamp).getTime();
      
      return { locked: true, agentId: lockInfo.agentId, age };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return { locked: false };
      }
      throw error;
    }
  }

  static async release(
    lockPath: string,
    filepath: string,
    agentId: number,
    debugLog: string
  ): Promise<void> {
    try {
      const lockContent = await fs.readFile(lockPath, 'utf-8');
      const lockInfo: LockInfo = JSON.parse(lockContent);
      
      if (lockInfo.agentId !== agentId) {
        await logOperation(debugLog, `Agent ${agentId} attempted to release lock for ${filepath} held by agent ${lockInfo.agentId}`);
        throw new Error(`Lock for ${filepath} is held by agent ${lockInfo.agentId}, not ${agentId}`);
      }
      
      await fs.unlink(lockPath);
      await logOperation(debugLog, `Agent ${agentId} released lock for ${filepath}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        await logOperation(debugLog, `Agent ${agentId} tried to release non-existent lock for ${filepath}`);
      } else {
        throw error;
      }
    }
  }

  static async cleanStaleLock(
    lockDir: string,
    file: string,
    ageMs: number,
    debugLog: string
  ): Promise<number> {
    const lockPath = `${lockDir}/${file}`;
    try {
      const lockContent = await fs.readFile(lockPath, 'utf-8');
      const lockInfo: LockInfo = JSON.parse(lockContent);
      const age = Date.now() - new Date(lockInfo.timestamp).getTime();
      
      if (age > ageMs) {
        await fs.unlink(lockPath);
        await logOperation(debugLog, `Force released stale lock for ${lockInfo.filepath} (agent ${lockInfo.agentId}, age: ${Math.round(age/1000)}s)`);
        return 1;
      }
    } catch {
      // Ignore individual file errors
    }
    return 0;
  }

  static async getAllLocks(lockDir: string): Promise<LockInfo[]> {
    const locks: LockInfo[] = [];
    
    try {
      await fs.mkdir(lockDir, { recursive: true });
      const files = await fs.readdir(lockDir);
      
      for (const file of files) {
        if (!file.endsWith('.lock')) continue;
        
        try {
          const lockContent = await fs.readFile(`${lockDir}/${file}`, 'utf-8');
          locks.push(JSON.parse(lockContent));
        } catch {
          // Ignore individual file errors
        }
      }
    } catch {
      // Return empty array on error
    }
    
    return locks;
  }
}
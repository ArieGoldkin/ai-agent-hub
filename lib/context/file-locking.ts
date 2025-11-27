/**
 * File Locking Module for Context Management
 * Provides atomic locking with stale lock detection
 * @version 3.7.0
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';

export interface LockData {
  pid: number;
  timestamp: string;
  hostname?: string;
}

export interface LockConfig {
  timeoutMs: number;
  retryIntervalMs: number;
  staleThresholdMs: number;
}

export const DEFAULT_LOCK_CONFIG: LockConfig = {
  timeoutMs: 30000,        // 30 seconds max lock wait
  retryIntervalMs: 50,     // 50ms between retries
  staleThresholdMs: 60000  // 1 minute = stale lock
};

/**
 * Non-blocking sleep using busy wait
 * For short durations only
 */
function sleep(ms: number): void {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait - acceptable for short durations
  }
}

/**
 * Read lock file data
 */
export function readLockData(lockPath: string): LockData | null {
  try {
    const content = readFileSync(lockPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Check if a lock is stale
 */
export function isLockStale(
  lockPath: string,
  staleThresholdMs: number = DEFAULT_LOCK_CONFIG.staleThresholdMs
): boolean {
  try {
    const lockData = readLockData(lockPath);
    if (!lockData) return true;

    // Check age
    const lockAge = Date.now() - new Date(lockData.timestamp).getTime();
    if (lockAge > staleThresholdMs) return true;

    // Check if process exists
    if (lockData.pid) {
      try {
        process.kill(lockData.pid, 0);
        return false; // Process exists
      } catch {
        return true; // Process doesn't exist
      }
    }

    return false;
  } catch {
    return true;
  }
}

/**
 * Force release a lock (for stale locks)
 */
export function forceReleaseLock(lockPath: string): void {
  try {
    if (existsSync(lockPath)) {
      unlinkSync(lockPath);
    }
  } catch (error) {
    console.error('⚠️ Error force releasing lock:', error);
  }
}

/**
 * Release a file lock
 */
export function releaseLock(lockPath: string): void {
  try {
    if (existsSync(lockPath)) {
      const lockData = readLockData(lockPath);
      if (lockData && lockData.pid === process.pid) {
        unlinkSync(lockPath);
      } else {
        console.warn('⚠️ Attempted to release lock owned by another process');
      }
    }
  } catch (error) {
    console.error('⚠️ Error releasing lock:', error);
  }
}

/**
 * Acquire a file lock with timeout and stale lock detection
 */
export function acquireLock(
  lockPath: string,
  config: LockConfig = DEFAULT_LOCK_CONFIG
): boolean {
  const startTime = Date.now();

  while (Date.now() - startTime < config.timeoutMs) {
    if (existsSync(lockPath)) {
      if (isLockStale(lockPath, config.staleThresholdMs)) {
        console.warn('⚠️ Removing stale lock file');
        forceReleaseLock(lockPath);
      } else {
        sleep(config.retryIntervalMs);
        continue;
      }
    }

    try {
      const lockData: LockData = {
        pid: process.pid,
        timestamp: new Date().toISOString(),
        hostname: process.env.HOSTNAME || 'unknown'
      };
      writeFileSync(lockPath, JSON.stringify(lockData), { flag: 'wx' });
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
        sleep(config.retryIntervalMs);
        continue;
      }
      throw error;
    }
  }

  console.error(`❌ Lock acquisition timed out after ${config.timeoutMs}ms`);
  return false;
}

/**
 * Get lock status for debugging
 */
export function getLockStatus(lockPath: string): {
  isLocked: boolean;
  lockData: LockData | null;
  isStale: boolean;
} {
  const isLocked = existsSync(lockPath);
  if (!isLocked) {
    return { isLocked: false, lockData: null, isStale: false };
  }

  const lockData = readLockData(lockPath);
  return {
    isLocked: true,
    lockData,
    isStale: isLockStale(lockPath)
  };
}

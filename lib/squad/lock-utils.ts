import { createHash } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Encode filepath to safe filename for lock file
 */
export function encodePath(filepath: string): string {
  const hash = createHash('md5').update(filepath).digest('hex');
  const safeName = filepath.replace(/[^a-zA-Z0-9]/g, '_').slice(-20);
  return `${safeName}_${hash}.lock`;
}

/**
 * Get lock file path for a given filepath
 */
export function getLockPath(lockDir: string, filepath: string): string {
  return path.join(lockDir, encodePath(filepath));
}

/**
 * Log lock operations for debugging
 */
export async function logOperation(debugLog: string, message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    await fs.mkdir(path.dirname(debugLog), { recursive: true });
    await fs.appendFile(debugLog, logEntry);
  } catch {
    // Ignore logging errors to prevent blocking
  }
}
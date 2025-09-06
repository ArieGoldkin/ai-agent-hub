#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function testDeadlockDetection(): Promise<boolean> {
  console.log('\n🧪 Test 3: Deadlock detection with circular dependencies');
  
  const manager = new FileLockManager('.squad/test-locks', '.squad/debug/test-locks.log');
  
  const fileA = 'file-a.ts';
  const fileB = 'file-b.ts';
  const fileC = 'file-c.ts';
  
  await manager.acquireLock(fileA, 1, 1000);
  console.log('  ✓ Agent 1 acquired lock on file A');
  
  await manager.acquireLock(fileB, 2, 1000);
  console.log('  ✓ Agent 2 acquired lock on file B');
  
  await manager.acquireLock(fileC, 3, 1000);
  console.log('  ✓ Agent 3 acquired lock on file C');
  
  const promises = [
    manager.acquireLock(fileB, 1, 100).catch(() => null),
    manager.acquireLock(fileC, 2, 100).catch(() => null),
    manager.acquireLock(fileA, 3, 100).catch(() => null),
  ];
  
  await sleep(50);
  
  const deadlock = await manager.detectDeadlock();
  console.log(`  ✓ Deadlock detected: ${deadlock.hasDeadlock}`);
  if (deadlock.agents) {
    console.log(`  ✓ Agents involved: ${deadlock.agents.join(' → ')}`);
  }
  
  await Promise.all(promises);
  await manager.releaseLock(fileA, 1);
  await manager.releaseLock(fileB, 2);
  await manager.releaseLock(fileC, 3);
  
  const passed = deadlock.hasDeadlock === true;
  console.log(passed ? '  ✅ Test passed: Deadlock correctly detected' : '  ❌ Test failed');
  
  return passed;
}
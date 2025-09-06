#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function testConcurrentWrite(): Promise<boolean> {
  console.log('\n🧪 Test 1: Concurrent write access to package.json');
  
  const manager = new FileLockManager('.squad/test-locks', '.squad/debug/test-locks.log');
  const testFile = 'package.json';
  let agent1Success = false;
  let agent2Success = false;
  let agent1AcquiredFirst = false;
  
  const agent1Promise = (async () => {
    const acquired = await manager.acquireLock(testFile, 1, 5000);
    if (acquired) {
      agent1Success = true;
      agent1AcquiredFirst = !agent2Success;
      console.log('  ✓ Agent 1 acquired lock');
      await sleep(1000);
      await manager.releaseLock(testFile, 1);
      console.log('  ✓ Agent 1 released lock');
    }
  })();
  
  const agent2Promise = (async () => {
    await sleep(100);
    const acquired = await manager.acquireLock(testFile, 2, 5000);
    if (acquired) {
      agent2Success = true;
      console.log('  ✓ Agent 2 acquired lock');
      await sleep(500);
      await manager.releaseLock(testFile, 2);
      console.log('  ✓ Agent 2 released lock');
    }
  })();
  
  await Promise.all([agent1Promise, agent2Promise]);
  
  const passed = agent1Success && agent2Success && agent1AcquiredFirst;
  console.log(passed ? '  ✅ Test passed: Locks prevented concurrent access' : '  ❌ Test failed');
  
  return passed;
}

export async function testStaleLockCleanup(): Promise<boolean> {
  console.log('\n🧪 Test 2: Stale lock cleanup after agent crash');
  
  const manager = new FileLockManager('.squad/test-locks', '.squad/debug/test-locks.log');
  const testFile = 'src/index.ts';
  
  const acquired1 = await manager.acquireLock(testFile, 1, 1000);
  console.log(`  ✓ Agent 1 acquired lock: ${acquired1}`);
  
  console.log('  💥 Agent 1 crashed without releasing lock');
  console.log('  ⏳ Waiting 2.5 seconds for lock to become stale...');
  await sleep(2500);
  
  const cleaned = await manager.forceReleaseStaleLocks(0.03);
  console.log(`  ✓ Cleaned ${cleaned} stale lock(s)`);
  
  const acquired2 = await manager.acquireLock(testFile, 2, 1000);
  if (acquired2) {
    console.log('  ✓ Agent 2 acquired lock after stale cleanup');
    await manager.releaseLock(testFile, 2);
  }
  
  const passed = acquired1 && cleaned === 1 && acquired2;
  console.log(passed ? '  ✅ Test passed: Stale locks cleaned successfully' : '  ❌ Test failed');
  
  return passed;
}
#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';
import * as fs from 'fs/promises';

/**
 * Stress test - Heavy concurrent load
 */
async function runStressTest() {
  console.log('💪 Running stress test with heavy concurrent load...\n');
  
  const manager = new FileLockManager('.squad/stress-locks', '.squad/debug/stress-locks.log');
  
  // Test parameters
  const agents = 20;
  const filesPerAgent = 5;
  const operationsPerFile = 10;
  const timeout = 5000;
  
  console.log(`  Agents: ${agents}`);
  console.log(`  Files per agent: ${filesPerAgent}`);
  console.log(`  Operations per file: ${operationsPerFile}`);
  console.log(`  Total operations: ${agents * filesPerAgent * operationsPerFile}\n`);
  
  const startTime = Date.now();
  let successCount = 0;
  let failureCount = 0;
  let timeoutCount = 0;
  
  // Create stress test
  const stressPromises = [];
  
  for (let agentId = 1; agentId <= agents; agentId++) {
    stressPromises.push((async () => {
      for (let fileNum = 0; fileNum < filesPerAgent; fileNum++) {
        const filename = `stress-${fileNum}.json`;
        
        for (let op = 0; op < operationsPerFile; op++) {
          try {
            const acquired = await manager.acquireLock(filename, agentId, timeout);
            
            if (acquired) {
              // Simulate work with random duration
              await new Promise(resolve => setTimeout(resolve, Math.random() * 5));
              
              await manager.releaseLock(filename, agentId);
              successCount++;
            } else {
              timeoutCount++;
            }
          } catch {
            failureCount++;
          }
        }
      }
    })());
  }
  
  // Wait for all operations
  await Promise.all(stressPromises);
  
  const duration = Date.now() - startTime;
  const totalOps = agents * filesPerAgent * operationsPerFile;
  const opsPerSecond = (totalOps / (duration / 1000)).toFixed(2);
  
  // Check for deadlocks
  const deadlock = await manager.detectDeadlock();
  
  // Force clean any remaining locks
  const staleLocks = await manager.forceReleaseStaleLocks(0);
  
  console.log('📊 Stress Test Results:');
  console.log(`  Duration: ${duration}ms`);
  console.log(`  Operations/second: ${opsPerSecond}`);
  console.log(`  Successful: ${successCount}/${totalOps}`);
  console.log(`  Timeouts: ${timeoutCount}`);
  console.log(`  Failures: ${failureCount}`);
  console.log(`  Deadlocks: ${deadlock.hasDeadlock ? 'YES' : 'NO'}`);
  console.log(`  Stale locks cleaned: ${staleLocks}`);
  
  // Clean up
  await fs.rm('.squad/stress-locks', { recursive: true, force: true }).catch(() => {});
  await fs.rm('.squad/debug/stress-locks.log', { force: true }).catch(() => {});
  
  const passed = successCount + timeoutCount === totalOps && !deadlock.hasDeadlock;
  
  if (passed) {
    console.log('\n✨ Stress test passed! System handles heavy load without corruption.');
    process.exit(0);
  } else {
    console.log('\n❌ Stress test had issues. Review the results above.');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runStressTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
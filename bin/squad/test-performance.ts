#!/usr/bin/env node

import { FileLockManager } from './file-lock.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { performance } from 'perf_hooks';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function testPerformance(): Promise<boolean> {
  console.log('\n🧪 Test 4: Performance test with 100 rapid lock operations');
  
  const manager = new FileLockManager('.squad/test-locks', '.squad/debug/test-locks.log');
  const operations = 100;
  let successCount = 0;
  const times: number[] = [];
  
  for (let i = 0; i < operations; i++) {
    const testFile = `perf-test-${i % 10}.ts`;
    const agentId = (i % 5) + 1;
    
    const start = performance.now();
    const acquired = await manager.acquireLock(testFile, agentId, 1000);
    if (acquired) {
      const acquireTime = performance.now() - start;
      times.push(acquireTime);
      successCount++;
      
      await sleep(Math.random() * 10);
      await manager.releaseLock(testFile, agentId);
    }
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const maxTime = Math.max(...times);
  const uncontestedTimes = times.filter(t => t < 10);
  const avgUncontestedTime = uncontestedTimes.length > 0 
    ? uncontestedTimes.reduce((a, b) => a + b, 0) / uncontestedTimes.length
    : 0;
  
  console.log(`  ✓ Successful operations: ${successCount}/${operations}`);
  console.log(`  ✓ Average acquire time: ${avgTime.toFixed(2)}ms`);
  console.log(`  ✓ Max acquire time: ${maxTime.toFixed(2)}ms`);
  console.log(`  ✓ Avg uncontested time: ${avgUncontestedTime.toFixed(2)}ms`);
  
  const passed = successCount === operations && avgUncontestedTime < 100;
  console.log(passed ? '  ✅ Test passed: Performance within acceptable limits' : '  ❌ Test failed');
  
  return passed;
}

export async function testNoCorruption(): Promise<boolean> {
  console.log('\n🧪 Test 5: No file corruption with 10 parallel agents');
  
  const manager = new FileLockManager('.squad/test-locks', '.squad/debug/test-locks.log');
  const testFile = '.squad/test-data.json';
  const agents = 10;
  const operationsPerAgent = 5;
  
  await fs.mkdir(path.dirname(testFile), { recursive: true });
  await fs.writeFile(testFile, JSON.stringify({ counter: 0, operations: [] }, null, 2));
  
  const agentPromises = [];
  for (let agentId = 1; agentId <= agents; agentId++) {
    agentPromises.push((async () => {
      for (let op = 0; op < operationsPerAgent; op++) {
        const acquired = await manager.acquireLock(testFile, agentId, 10000);
        if (!acquired) {
          throw new Error(`Agent ${agentId} failed to acquire lock`);
        }
        
        try {
          const content = await fs.readFile(testFile, 'utf-8');
          const data = JSON.parse(content);
          
          data.counter++;
          data.operations.push({
            agent: agentId,
            operation: op,
            timestamp: new Date().toISOString()
          });
          
          await sleep(Math.random() * 20);
          await fs.writeFile(testFile, JSON.stringify(data, null, 2));
        } finally {
          await manager.releaseLock(testFile, agentId);
        }
      }
    })());
  }
  
  await Promise.all(agentPromises);
  
  const finalContent = await fs.readFile(testFile, 'utf-8');
  const finalData = JSON.parse(finalContent);
  
  const expectedOperations = agents * operationsPerAgent;
  const actualOperations = finalData.operations.length;
  const correctCounter = finalData.counter === expectedOperations;
  
  console.log(`  ✓ Expected operations: ${expectedOperations}`);
  console.log(`  ✓ Actual operations: ${actualOperations}`);
  console.log(`  ✓ Counter value: ${finalData.counter}`);
  console.log(`  ✓ Data integrity: ${correctCounter ? 'VALID' : 'CORRUPTED'}`);
  
  await fs.unlink(testFile).catch(() => {});
  
  const passed = actualOperations === expectedOperations && correctCounter;
  console.log(passed ? '  ✅ Test passed: No data corruption detected' : '  ❌ Test failed');
  
  return passed;
}
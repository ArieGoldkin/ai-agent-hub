#!/usr/bin/env node

import * as fs from 'fs/promises';
import { testConcurrentWrite, testStaleLockCleanup } from './test-concurrent.js';
import { testDeadlockDetection } from './test-deadlock.js';
import { testPerformance, testNoCorruption } from './test-performance.js';

async function cleanup() {
  try {
    await fs.rm('.squad/test-locks', { recursive: true, force: true });
    await fs.rm('.squad/debug/test-locks.log', { force: true });
  } catch {
    // Ignore cleanup errors
  }
}

async function runTests() {
  console.log('🔒 File Lock Manager Test Suite');
  console.log('================================');
  
  await cleanup();
  
  const tests = [
    testConcurrentWrite,
    testStaleLockCleanup,
    testDeadlockDetection,
    testPerformance,
    testNoCorruption
  ];
  
  const results: boolean[] = [];
  
  for (const test of tests) {
    try {
      const passed = await test();
      results.push(passed);
      await cleanup();
    } catch (error) {
      console.error(`  ❌ Test error: ${error}`);
      results.push(false);
    }
  }
  
  console.log('\n📊 Test Summary');
  console.log('===============');
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`  Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('\n✨ All tests passed! File locking mechanism is production-ready.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review and fix issues.');
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
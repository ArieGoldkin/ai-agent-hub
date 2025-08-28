/**
 * Test Utilities Module
 * 
 * Contains utility functions for test execution and formatting.
 */

/**
 * Test results tracking interface
 */
export interface TestResults {
  [key: string]: boolean;
}

/**
 * Utility function to simulate realistic delays between agent activities
 */
export async function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initialize test results object with default false values
 */
export function initializeTestResults(testNames: string[]): TestResults {
  const results: TestResults = {};
  testNames.forEach(name => {
    results[name] = false;
  });
  return results;
}

/**
 * Validate test results structure and log details
 */
export function validateTestResults(testResults: TestResults, expectedTests: string[]): boolean {
  const actualTests = Object.keys(testResults);
  const missingTests = expectedTests.filter(test => !(test in testResults));
  const unexpectedTests = actualTests.filter(test => !expectedTests.includes(test));
  
  if (missingTests.length > 0) {
    console.error(`❌ Missing test results: ${missingTests.join(', ')}`);
    return false;
  }
  
  if (unexpectedTests.length > 0) {
    console.warn(`⚠️  Unexpected test results: ${unexpectedTests.join(', ')}`);
  }
  
  return true;
}

/**
 * Expected test names for validation
 */
export const EXPECTED_TEST_NAMES = [
  'sessionInit',
  'contextRetrieval',
  'agentCount',
  'decisionHistory',
  'performanceAnalysis',
  'handoffAnalysis',
  'bottleneckDetection',
  'insightsGeneration',
  'growthAnalysis',
  'qualityTracking',
  'contextSearch',
  'contextFiltering'
];
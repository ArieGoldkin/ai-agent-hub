#!/usr/bin/env node

import { DebugMode } from './debug-mode.js';
import { DebugLogger } from './debug-logger.js';
import { DebugDashboard } from './debug-dashboard.js';
import { DebugCommands } from './debug-commands.js';

/**
 * Test the debug mode functionality
 */
async function testDebugMode() {
  console.log('🧪 Testing Squad Debug Mode\n');

  // Initialize debug mode
  const debugMode = DebugMode.getInstance();
  await debugMode.initialize({
    enabled: true,
    sequential: true,
    verboseLogging: true,
    saveContext: true,
    tokenTracking: true
  });

  const logger = DebugLogger.getInstance();
  await logger.initialize();

  const dashboard = new DebugDashboard();
  await dashboard.start(1000); // Update every second for testing

  console.log(`✅ Debug mode initialized`);
  console.log(`   Session: ${debugMode.getSessionId()}`);
  console.log(`   Dir: ${debugMode.getDebugDir()}`);
  console.log(`   Tail: ${logger.getTailCommand()}\n`);

  // Simulate agent execution
  console.log('📦 Simulating agent execution...\n');

  // Register agents
  debugMode.registerAgent('frontend-1', 1);
  debugMode.registerAgent('frontend-2', 2);
  debugMode.registerAgent('backend-1', 3);

  // Simulate Frontend-1 starting
  await logger.logAgentStart('frontend-1', {
    task: 'Create Button component',
    files: ['src/Button.tsx']
  });

  debugMode.updateAgentStatus('frontend-1', {
    status: 'running',
    currentOperation: 'Creating Button.tsx'
  });

  // Simulate file operations
  await logger.logFileOperation({
    agentId: 'frontend-1',
    operation: 'lock',
    filepath: 'src/Button.tsx',
    success: true,
    duration: 5
  });

  await logger.logFileOperation({
    agentId: 'frontend-1',
    operation: 'write',
    filepath: 'src/Button.tsx',
    success: true,
    duration: 15,
    beforeContent: '',
    afterContent: 'export const Button = () => <button>Click me</button>;'
  });

  await logger.logFileOperation({
    agentId: 'frontend-1',
    operation: 'unlock',
    filepath: 'src/Button.tsx',
    success: true,
    duration: 2
  });

  // Log token usage
  await logger.logTokenUsage('frontend-1', 150, 'Component creation');

  debugMode.updateAgentStatus('frontend-1', {
    status: 'complete',
    filesModified: ['src/Button.tsx']
  });

  await logger.logAgentComplete('frontend-1', {
    filesCreated: ['src/Button.tsx'],
    tokensUsed: 150
  });

  // Simulate Frontend-2 with conflict
  await logger.logAgentStart('frontend-2', {
    task: 'Update package.json',
    files: ['package.json']
  });

  debugMode.updateAgentStatus('frontend-2', {
    status: 'waiting',
    currentOperation: 'Waiting for lock on package.json'
  });

  // Simulate lock wait
  await new Promise(resolve => setTimeout(resolve, 500));

  await logger.logFileOperation({
    agentId: 'frontend-2',
    operation: 'lock',
    filepath: 'package.json',
    success: false,
    duration: 500
  });

  // Simulate Backend-1 with error
  await logger.logAgentStart('backend-1', {
    task: 'Create API endpoint',
    files: ['api/endpoint.ts']
  });

  debugMode.updateAgentStatus('backend-1', {
    status: 'running',
    currentOperation: 'Creating endpoint'
  });

  await logger.logTokenUsage('backend-1', 200, 'API generation');

  // Simulate error
  const error = new Error('Cannot read property "config" of undefined');
  await logger.logAgentError('backend-1', error);

  // Wait for dashboard to update
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Stop dashboard
  await dashboard.stop();

  // Save session
  await debugMode.saveSession();
  await logger.close();

  console.log('\n✅ Test execution complete\n');

  // Test analysis
  console.log('🔍 Testing analysis commands...\n');

  const commands = new DebugCommands();
  await commands.analyzeSession(debugMode.getSessionId());

  // Test snapshot
  await commands.saveSnapshot('test-snapshot');

  console.log('\n✅ All debug mode tests passed!');

  // Display dashboard location
  const dashboardPath = `${debugMode.getDebugDir()}/dashboard.md`;
  console.log(`\n📊 View dashboard: ${dashboardPath}`);
  console.log(`📝 View logs: ${debugMode.getDebugDir()}/execution-trace.log`);
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDebugMode().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}
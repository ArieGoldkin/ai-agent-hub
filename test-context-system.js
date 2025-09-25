#!/usr/bin/env node

/**
 * Context System Verification Script
 *
 * This script tests that the context preservation system works correctly
 * by simulating agent interactions and verifying context updates.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const CONTEXT_FILE = '.claude/context/shared-context.json';
const TEST_RESULTS = [];

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
  TEST_RESULTS.push({ status: 'PASS', message });
}

function error(message) {
  log(`❌ ${message}`, 'red');
  TEST_RESULTS.push({ status: 'FAIL', message });
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test functions
function testContextFileExists() {
  info('Testing: Context file exists...');

  if (fs.existsSync(CONTEXT_FILE)) {
    success('Context file exists at .claude/context/shared-context.json');
    return true;
  } else {
    error('Context file not found');
    return false;
  }
}

function testContextStructure() {
  info('Testing: Context structure validity...');

  try {
    const context = JSON.parse(fs.readFileSync(CONTEXT_FILE, 'utf8'));

    // Check required fields
    const requiredFields = ['version', 'timestamp', 'session_id', 'mode', 'agent_decisions', 'tasks_completed', 'tasks_pending'];
    const missingFields = requiredFields.filter(field => !(field in context));

    if (missingFields.length > 0) {
      error(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Check field types
    if (!Array.isArray(context.tasks_completed)) {
      error('tasks_completed must be an array');
      return false;
    }

    if (!Array.isArray(context.tasks_pending)) {
      error('tasks_pending must be an array');
      return false;
    }

    if (typeof context.agent_decisions !== 'object') {
      error('agent_decisions must be an object');
      return false;
    }

    success('Context structure is valid');
    return true;
  } catch (err) {
    error(`Failed to parse context file: ${err.message}`);
    return false;
  }
}

function simulateAgentWork(agentName) {
  info(`Testing: Simulating ${agentName} agent work...`);

  try {
    const context = JSON.parse(fs.readFileSync(CONTEXT_FILE, 'utf8'));

    // Initialize agent decisions array if not exists
    if (!context.agent_decisions[agentName]) {
      context.agent_decisions[agentName] = [];
    }

    // Add a test decision
    const testDecision = {
      timestamp: new Date().toISOString(),
      decision: `Test decision from ${agentName}`,
      rationale: 'Testing context system functionality',
      impact: 'Verifies context updates work correctly'
    };

    context.agent_decisions[agentName].push(testDecision);

    // Add a completed task
    const testTask = {
      id: `test-${Date.now()}`,
      description: `Test task completed by ${agentName}`,
      agent: agentName,
      timestamp: new Date().toISOString(),
      artifacts: [`/test/file-${agentName}.js`],
      metrics: {
        test: true,
        duration: '100ms'
      }
    };

    context.tasks_completed.push(testTask);

    // Update timestamp
    context.timestamp = new Date().toISOString();
    context.last_activity = context.timestamp;
    context.active_agent = agentName;

    // Save context
    fs.writeFileSync(CONTEXT_FILE, JSON.stringify(context, null, 2));

    success(`Successfully simulated ${agentName} agent work`);
    return true;
  } catch (err) {
    error(`Failed to simulate agent work: ${err.message}`);
    return false;
  }
}

function verifyAgentTemplates() {
  info('Testing: Agent templates contain context protocol...');

  const agentFiles = [
    'agents/ai-ml-engineer.md',
    'agents/backend-system-architect.md',
    'agents/code-quality-reviewer.md',
    'agents/frontend-ui-developer.md',
    'agents/rapid-ui-designer.md',
    'agents/sprint-prioritizer.md',
    'agents/studio-coach.md',
    'agents/ux-researcher.md',
    'agents/whimsy-injector.md'
  ];

  let allContainProtocol = true;

  for (const file of agentFiles) {
    if (!fs.existsSync(file)) {
      warning(`Agent file not found: ${file}`);
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('## Context Protocol (AUTO-LOADED)')) {
      success(`${path.basename(file)} contains context protocol`);
    } else {
      error(`${path.basename(file)} missing context protocol`);
      allContainProtocol = false;
    }
  }

  return allContainProtocol;
}

function verifyContextMiddleware() {
  info('Testing: Context middleware exists...');

  const middlewarePath = 'assets/instructions/context-middleware.md';

  if (fs.existsSync(middlewarePath)) {
    const content = fs.readFileSync(middlewarePath, 'utf8');
    if (content.includes('Automatic Context Management')) {
      success('Context middleware properly configured');
      return true;
    } else {
      error('Context middleware content invalid');
      return false;
    }
  } else {
    error('Context middleware not found');
    return false;
  }
}

function verifyCLAUDEmd() {
  info('Testing: CLAUDE.md references context middleware...');

  if (!fs.existsSync('CLAUDE.md')) {
    error('CLAUDE.md not found');
    return false;
  }

  const content = fs.readFileSync('CLAUDE.md', 'utf8');

  if (content.includes('context-middleware.md') && content.includes('AUTO-LOADED')) {
    success('CLAUDE.md properly references context middleware');
    return true;
  } else {
    error('CLAUDE.md does not reference context middleware');
    return false;
  }
}

function testContextPersistence() {
  info('Testing: Context persistence across sessions...');

  try {
    // Read current context
    const context1 = JSON.parse(fs.readFileSync(CONTEXT_FILE, 'utf8'));
    const taskCount1 = context1.tasks_completed.length;

    // Simulate new session
    simulateAgentWork('test-agent-persistence');

    // Read updated context
    const context2 = JSON.parse(fs.readFileSync(CONTEXT_FILE, 'utf8'));
    const taskCount2 = context2.tasks_completed.length;

    if (taskCount2 > taskCount1) {
      success('Context persists and accumulates across sessions');
      return true;
    } else {
      error('Context not persisting correctly');
      return false;
    }
  } catch (err) {
    error(`Persistence test failed: ${err.message}`);
    return false;
  }
}

// Main test runner
function runTests() {
  console.log();
  log('╔══════════════════════════════════════════════════════╗', 'cyan');
  log('║      Context Preservation System Verification        ║', 'cyan');
  log('╚══════════════════════════════════════════════════════╝', 'cyan');
  console.log();

  // Run all tests
  const tests = [
    { name: 'Context File Exists', fn: testContextFileExists },
    { name: 'Context Structure', fn: testContextStructure },
    { name: 'Agent Templates', fn: verifyAgentTemplates },
    { name: 'Context Middleware', fn: verifyContextMiddleware },
    { name: 'CLAUDE.md Configuration', fn: verifyCLAUDEmd },
    { name: 'Frontend Agent Simulation', fn: () => simulateAgentWork('frontend-ui-developer') },
    { name: 'Backend Agent Simulation', fn: () => simulateAgentWork('backend-system-architect') },
    { name: 'Context Persistence', fn: testContextPersistence }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    console.log();
    log(`━━━ ${test.name} ━━━`, 'bright');
    const result = test.fn();
    if (result) {
      passedTests++;
    } else {
      failedTests++;
    }
  }

  // Print summary
  console.log();
  log('══════════════════════════════════════════════════════', 'cyan');
  log('                    TEST SUMMARY                      ', 'bright');
  log('══════════════════════════════════════════════════════', 'cyan');
  console.log();

  success(`Passed: ${passedTests}`);
  if (failedTests > 0) {
    error(`Failed: ${failedTests}`);
  }

  const successRate = (passedTests / (passedTests + failedTests) * 100).toFixed(1);

  console.log();
  if (failedTests === 0) {
    log(`🎉 ALL TESTS PASSED! (${successRate}%)`, 'green');
    log('Context preservation system is fully operational!', 'green');
  } else {
    log(`⚠️  SOME TESTS FAILED (${successRate}% passed)`, 'yellow');
    log('Please review the failures above and fix the issues.', 'yellow');
  }

  console.log();

  // Exit with appropriate code
  process.exit(failedTests === 0 ? 0 : 1);
}

// Run the tests
runTests();
/**
 * Context Protocol Sections Generator
 *
 * Generates the core protocol instructions for context management
 */

/**
 * Generate protocol introduction and overview
 */
export function generateProtocolIntroduction(): string[] {
  return [
    '# ⚡ Automatic Context Management\n',
    '## CRITICAL: This file is auto-loaded for ALL agents\n',
    'The context system ensures session persistence, cross-agent knowledge sharing, and continuous learning across all AI Agent Hub projects. Every agent MUST interact with the context system to maintain project continuity.\n',
    '## 🎯 Context Protocol\n'
  ];
}

/**
 * Generate "Before Starting" protocol section
 */
export function generateBeforeProtocol(): string[] {
  return [
    '### Before Starting ANY Task\n',
    '```javascript',
    '// Load existing context',
    "const fs = require('fs');",
    "const contextPath = '.claude/context/shared-context.json';",
    "const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));",
    '',
    '// Extract relevant information',
    "const myAgentName = 'current-agent-name'; // Replace with actual agent name",
    'const myPreviousWork = context.agent_decisions[myAgentName] || [];',
    'const completedTasks = context.tasks_completed || [];',
    'const pendingTasks = context.tasks_pending || [];',
    '',
    '// Check for patterns and conventions',
    'const existingPatterns = {',
    '  componentStyle: detectComponentPattern(completedTasks),',
    '  stateManagement: detectStatePattern(completedTasks),',
    '  apiPattern: detectAPIPattern(completedTasks)',
    '};',
    '```\n'
  ];
}

/**
 * Generate "During Work" protocol section
 */
export function generateDuringProtocol(): string[] {
  return [
    '### During Work\n',
    '```javascript',
    '// Track major decisions',
    'if (!context.agent_decisions[myAgentName]) {',
    '  context.agent_decisions[myAgentName] = [];',
    '}',
    '',
    'context.agent_decisions[myAgentName].push({',
    '  timestamp: new Date().toISOString(),',
    '  decision: "Created UserAuth component using JWT",',
    '  rationale: "Matches existing authentication pattern in codebase",',
    '  impact: "All future auth components should follow this pattern",',
    '  dependencies: ["jsonwebtoken", "bcrypt"]',
    '});',
    '',
    '// Update working context periodically',
    'context.last_activity = new Date().toISOString();',
    'context.active_agent = myAgentName;',
    '```\n'
  ];
}

/**
 * Generate "After Completion" protocol section
 */
export function generateAfterProtocol(): string[] {
  return [
    '### After Completing Work\n',
    '```javascript',
    '// Mark tasks as completed',
    "const taskId = 'task-' + Date.now();",
    'context.tasks_completed.push({',
    '  id: taskId,',
    '  description: "Implemented user authentication flow",',
    '  agent: myAgentName,',
    '  timestamp: new Date().toISOString(),',
    '  artifacts: [',
    '    "/components/UserAuth.tsx",',
    '    "/api/auth/login.ts",',
    '    "/lib/jwt-utils.ts"',
    '  ],',
    '  metrics: {',
    '    linesOfCode: 450,',
    '    testsAdded: 12,',
    '    performance: "45ms average response"',
    '  }',
    '});',
    '',
    '// Remove from pending if it was there',
    'context.tasks_pending = context.tasks_pending.filter(t => t.id !== taskId);',
    '',
    '// Update session timestamp',
    'context.timestamp = new Date().toISOString();',
    '',
    '// Save context',
    "fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));",
    '```\n'
  ];
}

/**
 * Generate "Error Handling" protocol section
 */
export function generateErrorProtocol(): string[] {
  return [
    '### On Errors or Blockers\n',
    '```javascript',
    '// Document blockers for next session',
    'context.tasks_pending.push({',
    "  id: 'pending-' + Date.now(),",
    '  description: "Database migration needed for new schema",',
    '  blocker: "Requires production data backup first",',
    '  agent: myAgentName,',
    '  timestamp: new Date().toISOString(),',
    '  suggested_resolution: "Run backup script, then apply migration",',
    '  priority: "high"',
    '});',
    '',
    '// Save immediately to preserve state',
    "fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));",
    '```\n'
  ];
}
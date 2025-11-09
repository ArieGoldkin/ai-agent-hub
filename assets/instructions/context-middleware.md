# ⚡ Automatic Context Management

## CRITICAL: This file is auto-loaded for ALL agents

The context system ensures session persistence, cross-agent knowledge sharing, and continuous learning across all AI Agent Hub projects. Every agent MUST interact with the context system to maintain project continuity.

## 🎯 Context Protocol

### Before Starting ANY Task

```javascript
// Load existing context
const fs = require('fs');
const contextPath = '.claude/context/shared-context.json';
const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));

// Extract relevant information
const myAgentName = 'current-agent-name'; // Replace with actual agent name
const myPreviousWork = context.agent_decisions[myAgentName] || [];
const completedTasks = context.tasks_completed || [];
const pendingTasks = context.tasks_pending || [];

// Check for patterns and conventions
const existingPatterns = {
  componentStyle: detectComponentPattern(completedTasks),
  stateManagement: detectStatePattern(completedTasks),
  apiPattern: detectAPIPattern(completedTasks)
};
```

### During Work

```javascript
// Track major decisions
if (!context.agent_decisions[myAgentName]) {
  context.agent_decisions[myAgentName] = [];
}

context.agent_decisions[myAgentName].push({
  timestamp: new Date().toISOString(),
  decision: "Created UserAuth component using JWT",
  rationale: "Matches existing authentication pattern in codebase",
  impact: "All future auth components should follow this pattern",
  dependencies: ["jsonwebtoken", "bcrypt"]
});

// Update working context periodically
context.last_activity = new Date().toISOString();
context.active_agent = myAgentName;
```

### After Completing Work

```javascript
// Mark tasks as completed
const taskId = 'task-' + Date.now();
context.tasks_completed.push({
  id: taskId,
  description: "Implemented user authentication flow",
  agent: myAgentName,
  timestamp: new Date().toISOString(),
  artifacts: [
    "/components/UserAuth.tsx",
    "/api/auth/login.ts",
    "/lib/jwt-utils.ts"
  ],
  metrics: {
    linesOfCode: 450,
    testsAdded: 12,
    performance: "45ms average response"
  }
});

// Remove from pending if it was there
context.tasks_pending = context.tasks_pending.filter(t => t.id !== taskId);

// Update session timestamp
context.timestamp = new Date().toISOString();

// Save context
fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));
```

### On Errors or Blockers

```javascript
// Document blockers for next session
context.tasks_pending.push({
  id: 'pending-' + Date.now(),
  description: "Database migration needed for new schema",
  blocker: "Requires production data backup first",
  agent: myAgentName,
  timestamp: new Date().toISOString(),
  suggested_resolution: "Run backup script, then apply migration",
  priority: "high"
});

// Save immediately to preserve state
fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));
```

## 📊 Context Structure

```typescript
interface SharedContext {
  version: string;
  timestamp: string;
  session_id: string;
  mode: "classic" | "squad";

  agent_decisions: {
    [agentName: string]: Array<{
      timestamp: string;
      decision: string;
      rationale: string;
      impact?: string;
      dependencies?: string[];
    }>;
  };

  tasks_completed: Array<{
    id: string;
    description: string;
    agent: string;
    timestamp: string;
    artifacts?: string[];
    metrics?: Record<string, any>;
  }>;

  tasks_pending: Array<{
    id: string;
    description: string;
    blocker?: string;
    agent: string;
    timestamp: string;
    suggested_resolution?: string;
    priority?: "low" | "medium" | "high";
  }>;

  codebase_patterns?: {
    component_style?: "functional" | "class";
    state_management?: "redux" | "context" | "zustand" | "mobx";
    api_pattern?: "REST" | "GraphQL";
    testing_framework?: "jest" | "vitest" | "mocha";
    styling?: "css-modules" | "styled-components" | "tailwind";
  };

  last_activity?: string;
  active_agent?: string;
}
```

## 🔄 Synchronization with Squad System

When working in Squad mode, the context system automatically synchronizes with Squad communication files:

```javascript
// Detect Squad mode
const squadPath = '.squad/sessions/';
const isSquadMode = fs.existsSync(squadPath);

if (isSquadMode) {
  // Read Squad communications
  const commFiles = fs.readdirSync(squadPath)
    .filter(f => f.startsWith('role-comm-'));

  // Sync decisions to context
  commFiles.forEach(file => {
    const content = fs.readFileSync(`${squadPath}/${file}`, 'utf8');
    const agentName = extractAgentName(file);

    // Parse markdown and update context
    const decisions = parseMarkdownDecisions(content);
    context.agent_decisions[agentName] = decisions;
  });
}
```

## 🚀 Best Practices

### 1. Atomic Updates
- Save context after EVERY major decision
- Don't batch updates - write immediately
- Use timestamps for all entries

### 2. Pattern Detection
```javascript
function detectComponentPattern(tasks) {
  const components = tasks.filter(t =>
    t.artifacts?.some(a => a.includes('component'))
  );

  // Analyze for functional vs class components
  const functionalCount = components.filter(c =>
    c.description.includes('hook') ||
    c.description.includes('functional')
  ).length;

  return functionalCount > components.length / 2 ? 'functional' : 'class';
}
```

### 3. Conflict Prevention
```javascript
// Check if another agent is actively working
if (context.active_agent && context.active_agent !== myAgentName) {
  const lastActivity = new Date(context.last_activity);
  const now = new Date();
  const minutesSinceActivity = (now - lastActivity) / 60000;

  if (minutesSinceActivity < 5) {
    console.warn(`⚠️ ${context.active_agent} is currently active`);
    // Coordinate through Squad system or wait
  }
}
```

### 4. Session Continuity
```javascript
// On session resume, provide summary
function getSessionSummary(context) {
  return {
    lastActive: context.timestamp,
    completedCount: context.tasks_completed.length,
    pendingCount: context.tasks_pending.length,
    activeAgents: Object.keys(context.agent_decisions),
    recentDecisions: Object.values(context.agent_decisions)
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  };
}
```

## 🔍 Validation

Always validate context updates:

```javascript
function validateContext(context) {
  const required = ['version', 'timestamp', 'session_id', 'mode'];
  const missing = required.filter(field => !context[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  // Validate structure
  if (!Array.isArray(context.tasks_completed)) {
    throw new Error('tasks_completed must be an array');
  }

  if (!Array.isArray(context.tasks_pending)) {
    throw new Error('tasks_pending must be an array');
  }

  return true;
}
```

## 🛡️ Evidence Collection Protocol (v3.5.0)

### CRITICAL: Evidence Required Before Task Completion

All agents MUST collect evidence before marking tasks complete. Evidence proves that code actually works, not just that it was written.

### Evidence Types

**1. Test Evidence** (Highest Priority)
```javascript
// After running tests, record evidence
context.quality_evidence = context.quality_evidence || { last_updated: new Date().toISOString() };
context.quality_evidence.tests = {
  executed: true,
  command: 'npm test',
  exit_code: 0,  // MUST be 0 for success
  passed: 24,
  failed: 0,
  skipped: 1,
  coverage_percent: 87.5,
  duration_seconds: 12.4,
  timestamp: new Date().toISOString(),
  evidence_file: '.claude/quality-gates/evidence/tests-2025-11-02-143022.log'
};
context.quality_evidence.last_updated = new Date().toISOString();
fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));
```

**2. Build Evidence**
```javascript
// After successful build
context.quality_evidence = context.quality_evidence || { last_updated: new Date().toISOString() };
context.quality_evidence.build = {
  executed: true,
  command: 'npm run build',
  exit_code: 0,  // MUST be 0 for success
  errors: 0,
  warnings: 2,
  artifacts: [
    { file: 'dist/main.js', size_kb: 245 },
    { file: 'dist/vendor.js', size_kb: 512 }
  ],
  duration_seconds: 24.3,
  timestamp: new Date().toISOString(),
  evidence_file: '.claude/quality-gates/evidence/build-2025-11-02-143022.log'
};
context.quality_evidence.last_updated = new Date().toISOString();
fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));
```

**3. Code Quality Evidence**
```javascript
// After linting and type checking
context.quality_evidence = context.quality_evidence || { last_updated: new Date().toISOString() };

// Linter evidence
context.quality_evidence.linter = {
  executed: true,
  tool: 'ESLint',
  command: 'npm run lint',
  exit_code: 0,  // MUST be 0 for no critical errors
  errors: 0,
  warnings: 3,
  timestamp: new Date().toISOString()
};

// Type checker evidence
context.quality_evidence.type_checker = {
  executed: true,
  tool: 'TypeScript',
  command: 'npm run typecheck',
  exit_code: 0,  // MUST be 0 for no type errors
  errors: 0,
  timestamp: new Date().toISOString()
};

context.quality_evidence.last_updated = new Date().toISOString();
fs.writeFileSync(contextPath, JSON.stringify(context, null, 2));
```

### Evidence Quality Standards

The context system automatically assesses quality standards based on evidence:

**Minimum Standard** (at least ONE passes):
- Tests pass (exit_code 0) OR
- Build succeeds (exit_code 0) OR
- Linter passes (exit_code 0)

**Production-Grade** (ALL must pass):
- Tests pass (exit_code 0)
- Coverage ≥70%
- Build succeeds (exit_code 0)
- No critical linter errors (exit_code 0)
- Type checker passes (exit_code 0)

**Gold Standard** (ALL must pass):
- Tests pass (exit_code 0)
- Coverage ≥80%
- Build succeeds (exit_code 0)
- No linter warnings (warnings: 0)
- Type checker passes (exit_code 0)

### Enforcement Rules

**Rule 1: Evidence Before Completion**
```javascript
// ❌ BAD: No evidence
context.tasks_completed.push({
  description: "Implemented user login",
  agent: myAgentName
  // Missing evidence!
});

// ✅ GOOD: With evidence
if (context.quality_evidence?.tests?.exit_code === 0) {
  context.tasks_completed.push({
    description: "Implemented user login",
    agent: myAgentName,
    evidence_summary: "Tests passed (exit 0), coverage 87%",
    quality_standard: context.quality_evidence.quality_standard_met
  });
} else {
  console.warn('⚠️ Cannot mark complete - no passing test evidence');
}
```

**Rule 2: Failed Evidence = Task Not Complete**
```javascript
// Check evidence before claiming completion
if (context.quality_evidence?.tests?.exit_code !== 0) {
  // Tests failed - DO NOT mark complete
  context.tasks_pending.push({
    id: 'pending-' + Date.now(),
    description: "Fix failing tests in user login",
    blocker: `${context.quality_evidence.tests.failed} tests failing`,
    agent: myAgentName,
    priority: "high"
  });
  return; // Stop here
}

// Only proceed if evidence shows success
context.tasks_completed.push({...});
```

**Rule 3: Reference Evidence in Completion Messages**
```javascript
// Always include evidence summary when marking complete
const evidenceSummary = `
Evidence:
- Tests: ${context.quality_evidence.tests?.exit_code === 0 ? '✅' : '❌'} (${context.quality_evidence.tests?.passed} passed, ${context.quality_evidence.tests?.failed} failed)
- Build: ${context.quality_evidence.build?.exit_code === 0 ? '✅' : '❌'}
- Coverage: ${context.quality_evidence.tests?.coverage_percent}%
- Quality: ${context.quality_evidence.quality_standard_met || 'below-minimum'}
`;

context.tasks_completed.push({
  description: "Implemented user authentication",
  agent: myAgentName,
  evidence_summary: evidenceSummary,
  artifacts: ["/components/UserAuth.tsx"],
  timestamp: new Date().toISOString()
});
```

### Using the Evidence Verification Skill

All agents have access to the `evidence-verification` skill which provides:
- Evidence collection templates
- Verification workflows
- Quality checklists
- Command references by language

Load the skill when you need guidance on collecting evidence:
```
I need to collect evidence for this implementation. Loading evidence-verification skill...
```

## 🎯 Integration Checklist (Updated v3.5.0)

- [ ] Context loaded at agent start
- [ ] Decisions tracked during work
- [ ] **Evidence collected during work** ⭐ NEW
- [ ] **Evidence verified before completion** ⭐ NEW
- [ ] Tasks marked completed/pending
- [ ] **Completion includes evidence summary** ⭐ NEW
- [ ] Context saved before exit
- [ ] Squad system synchronized (if applicable)
- [ ] Patterns detected and followed
- [ ] Conflicts checked and prevented
- [ ] Session continuity maintained

Remember: **Context preservation is NOT optional**. It's the foundation of intelligent, continuous AI development.

**NEW in v3.5.0:** Evidence collection is MANDATORY. No task can be marked complete without verifiable proof of success.
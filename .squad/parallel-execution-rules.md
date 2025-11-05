# Parallel Execution Rules and Conflict Prevention

This document defines the rules and mechanisms for safe parallel agent execution.

---

## Quality Gates for Parallel Execution (v3.5.0)

### MANDATORY Pre-Execution Gate Check

Before starting ANY parallel execution phase, Studio Coach MUST validate quality gates for ALL tasks:

**Gate Check Workflow:**
```
1. For each task in parallel plan:
   a. Run quality gate check (complexity, questions, dependencies)
   b. Record gate status in context
   c. If ANY task BLOCKED → halt entire parallel phase
   d. If ANY task has 3+ attempts → escalate to user

2. If all gates PASS or WARNING:
   a. Document assumptions for WARNING tasks
   b. Proceed with parallel execution

3. If any gates BLOCKED:
   a. Identify blocking reasons
   b. Resolve blockers (clarify requirements, wait for dependencies)
   c. Re-run gate checks
   d. Only proceed when all gates clear
```

**Example Gate Check Before Parallel Phase:**
```javascript
// Before Phase 3: Implementation
const tasks = [
  { id: 'task-1', agent: 'frontend-ui-developer', task: 'Build user dashboard' },
  { id: 'task-2', agent: 'backend-system-architect', task: 'Create metrics API' },
  { id: 'task-3', agent: 'ai-ml-engineer', task: 'Integrate recommendation engine' }
];

// Run gates for all tasks
const gateResults = tasks.map(task => validateQualityGate(task));

// Check for blockers
const blockedTasks = gateResults.filter(r => r.status === 'blocked');
if (blockedTasks.length > 0) {
  console.log(`⛔ PARALLEL PHASE BLOCKED`);
  console.log(`Blocked tasks: ${blockedTasks.map(t => t.taskId).join(', ')}`);
  console.log(`Reasons: ${blockedTasks[0].blockingReasons.join(', ')}`);

  // Escalate and halt
  escalateToUser(blockedTasks);
  return; // DO NOT START PARALLEL PHASE
}

// All gates pass/warning - safe to proceed
console.log(`✅ All quality gates passed - starting parallel phase`);
startParallelExecution(tasks);
```

### Stuck Detection During Parallel Execution

**Monitor each agent's attempts:**
```javascript
// After each agent reports progress
function checkAgentProgress(agentId, taskId, status) {
  if (status === 'failed' || status === 'error') {
    // Track the attempt
    context.trackAttempt(taskId, {
      timestamp: new Date().toISOString(),
      approach: agent.current_approach,
      outcome: 'failed',
      failure_reason: agent.error_message
    });

    const attemptCount = context.getAttemptCount(taskId);

    if (attemptCount >= 3) {
      // STUCK - Halt this agent, escalate
      console.log(`🚨 Agent ${agentId} stuck on ${taskId} after ${attemptCount} attempts`);

      // Mark task as blocked
      tasks[taskId].status = 'blocked';
      tasks[taskId].blocker_reason = `Stuck after ${attemptCount} attempts`;

      // Check for cascade
      checkFailureCascade(taskId);

      // Escalate to user
      escalateStuckTask(agentId, taskId, context.attempt_tracking[taskId]);

      return 'ESCALATED';
    }
  }
}
```

### Failure Cascade Detection

**Before assigning next task to agent, check for upstream failures:**
```javascript
function checkFailureCascade(failedTaskId) {
  // Find all tasks depending on failed task
  const dependentTasks = allTasks.filter(t =>
    t.dependencies && t.dependencies.includes(failedTaskId)
  );

  if (dependentTasks.length === 0) {
    return; // No cascade
  }

  console.log(`⚠️ CASCADE DETECTED: ${dependentTasks.length} tasks blocked by ${failedTaskId}`);

  // Block all dependent tasks
  dependentTasks.forEach(task => {
    task.status = 'blocked';
    task.blocker_reason = `Upstream dependency ${failedTaskId} failed`;

    // Stop agent if currently working on this task
    if (task.assigned_agent) {
      stopAgent(task.assigned_agent, task.id);
    }

    // Log cascade
    console.log(`  ⛔ Blocked: ${task.id} (assigned to ${task.assigned_agent})`);

    // Recursively check for further cascades
    checkFailureCascade(task.id);
  });

  // Update shared context
  context.writeContext({
    ...context,
    cascade_events: [
      ...(context.cascade_events || []),
      {
        timestamp: new Date().toISOString(),
        failed_task: failedTaskId,
        blocked_tasks: dependentTasks.map(t => t.id),
        impact: dependentTasks.length
      }
    ]
  });
}
```

### Sync Point Gate Validation

**At each sync point (e.g., after parallel phase), validate:**
```javascript
function validateSyncPoint(completedTasks) {
  const syncResults = {
    all_passed: true,
    evidence_collected: true,
    quality_standard_met: true,
    failures: []
  };

  completedTasks.forEach(task => {
    // Check 1: Evidence exists
    const taskEvidence = getEvidenceForTask(task.id);
    if (!taskEvidence) {
      syncResults.all_passed = false;
      syncResults.evidence_collected = false;
      syncResults.failures.push({
        task: task.id,
        reason: 'No evidence collected'
      });
    }

    // Check 2: Evidence shows passing
    if (taskEvidence && !evidenceShowsPassing(taskEvidence)) {
      syncResults.all_passed = false;
      syncResults.failures.push({
        task: task.id,
        reason: 'Evidence shows failures (tests/build/lint)'
      });
    }

    // Check 3: Quality standard met
    if (taskEvidence?.quality_standard_met === 'below-minimum') {
      syncResults.quality_standard_met = false;
      syncResults.failures.push({
        task: task.id,
        reason: 'Quality standard not met'
      });
    }
  });

  if (!syncResults.all_passed) {
    console.log(`❌ SYNC POINT FAILED`);
    syncResults.failures.forEach(f => {
      console.log(`  Task ${f.task}: ${f.reason}`);
    });

    // Block next phase
    return { canProceed: false, failures: syncResults.failures };
  }

  console.log(`✅ SYNC POINT PASSED - All evidence verified`);
  return { canProceed: true };
}
```

### Parallel Execution Rules (Updated)

**Rule 1: Gate Check Before Starting**
- ❌ **OLD:** Start parallel work immediately
- ✅ **NEW:** Run quality gates, only proceed if all PASS/WARNING

**Rule 2: Monitor Attempts During Execution**
- ❌ **OLD:** Let agents retry indefinitely
- ✅ **NEW:** Track attempts, escalate at 3, halt parallel work if stuck

**Rule 3: Detect Cascades Immediately**
- ❌ **OLD:** Let dependent agents continue working
- ✅ **NEW:** Block dependent tasks instantly, stop agents, prevent wasted cycles

**Rule 4: Validate Evidence at Sync**
- ❌ **OLD:** Accept completion claims
- ✅ **NEW:** Verify evidence exists and shows passing, reject without proof

**Rule 5: Block Next Phase on Failures**
- ❌ **OLD:** Continue to next phase with failing tasks
- ✅ **NEW:** STOP if any task lacks evidence or shows failures

---

## File Ownership Matrix

### Ownership Levels
1. **EXCLUSIVE**: Only one agent can modify this file/directory
2. **SEQUENTIAL**: Multiple agents can modify, but only in sequence
3. **READ-ONLY**: All agents can read, none can modify during parallel phase
4. **PARTITIONED**: File divided into sections, each owned by different agent

### Directory Ownership Defaults

```yaml
ownership_matrix:
  /frontend:
    default_owner: frontend-ui-developer
    subdirectories:
      /components: EXCLUSIVE
      /styles: EXCLUSIVE
      /hooks: EXCLUSIVE
      /utils: SEQUENTIAL
    
  /backend:
    default_owner: backend-system-architect
    subdirectories:
      /api: EXCLUSIVE
      /models: EXCLUSIVE
      /services: SEQUENTIAL
      /utils: SEQUENTIAL
  
  /ml:
    default_owner: ai-ml-engineer
    subdirectories:
      /models: EXCLUSIVE
      /prompts: EXCLUSIVE
      /pipelines: EXCLUSIVE
  
  /shared:
    default_owner: NONE
    access: SEQUENTIAL
    subdirectories:
      /types: SEQUENTIAL
      /constants: READ-ONLY
      /config: SEQUENTIAL
```

## Merge Strategy for Shared Files

### Sequential Edit Protocol
1. Agent announces intent to edit in `.squad/locks/intentions.md`
2. Checks for existing lock file
3. Creates lock if none exists
4. Performs edit
5. Releases lock and updates completion log

### Lock File Format
```markdown
File: .squad/locks/[filename].lock

LOCKED_BY: agent-1-frontend-ui-developer
LOCKED_AT: 2024-01-20T10:30:00Z
PURPOSE: Adding user metrics to dashboard
ESTIMATED_DURATION: 10 minutes
HANDOFF_TO: agent-2-backend-system-architect (optional)
```

## Communication Protocol

### Message Files
Each agent maintains a communication file:
```
.squad/comms/agent-[id]-comm.md
```

### Message Format
```markdown
## Status Update [timestamp]
- Current Task: [what agent is working on]
- Files Modified: [list]
- Files Needed: [dependencies]
- Blockers: [any blocking issues]
- Next: [planned next action]
```

### Handoff Protocol
```markdown
## Handoff Request [timestamp]
FROM: agent-1-frontend-ui-developer
TO: agent-2-backend-system-architect
FILE: /shared/types/metrics.ts
STATUS: Ready for backend implementation
NOTES: Added TypeScript interfaces for metrics
```

## Lock Mechanism Implementation

### Creating a Lock
```bash
# Check if lock exists
if [ -f ".squad/locks/${FILE}.lock" ]; then
    echo "File is locked, waiting..."
    # Wait or handle conflict
else
    # Create lock
    cat > ".squad/locks/${FILE}.lock" << EOF
LOCKED_BY: ${AGENT_ID}
LOCKED_AT: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
PURPOSE: ${EDIT_PURPOSE}
EOF
fi
```

### Releasing a Lock
```bash
# After edit complete
rm ".squad/locks/${FILE}.lock"
echo "Released: ${FILE}" >> .squad/logs/lock-history.log
```

## Conflict Resolution

### Conflict Detection
1. **File Already Modified**: Check git status before editing
2. **Lock Timeout**: Locks older than 30 minutes are considered stale
3. **Dependency Missing**: Required file not yet created
4. **Merge Conflict**: Git reports conflict during parallel work

### Resolution Strategies

#### 1. Wait and Retry
```markdown
Status: BLOCKED
Reason: File locked by agent-2
Strategy: Wait 5 minutes and retry
Fallback: Work on alternative task
```

#### 2. Negotiate Ownership
```markdown
Request: Transfer ownership of /shared/types/user.ts
From: agent-1-frontend
To: agent-2-backend
Reason: Backend needs to add database fields
```

#### 3. Split Work
```markdown
File: /shared/config/app.config.ts
Split Strategy:
- Agent-1: Lines 1-50 (frontend config)
- Agent-2: Lines 51-100 (backend config)
- Agent-3: Lines 101-150 (ml config)
```

## Parallel Execution Zones

### Green Zones (Safe for Parallel)
- Different top-level directories
- Non-overlapping component trees
- Independent API endpoints
- Separate database tables
- Different ML models

### Yellow Zones (Caution Required)
- Shared type definitions
- Common utilities
- Configuration files
- Environment variables
- Package dependencies

### Red Zones (Sequential Only)
- Package.json/package-lock.json
- Database migrations
- CI/CD configurations
- Git operations
- Production deployments

## Performance Monitoring

### Metrics to Track
```markdown
File: .squad/metrics/parallel-performance.md

## Execution Metrics
- Total Tasks: 24
- Parallel Agents: 3
- Conflicts Encountered: 2
- Conflicts Resolved: 2
- Average Lock Wait: 45 seconds
- Parallel Efficiency: 72%

## Agent Performance
| Agent | Tasks | Files Modified | Conflicts | Time |
|-------|-------|---------------|-----------|------|
| agent-1 | 8 | 12 | 0 | 25m |
| agent-2 | 10 | 15 | 1 | 30m |
| agent-3 | 6 | 8 | 1 | 20m |
```

## Safety Rules

### Never Parallel
1. Database schema changes
2. Package dependency updates
3. Git commits and merges
4. Production deployments
5. Security configurations

### Always Check Before Edit
1. `git status` - ensure clean state
2. Lock existence - check `.squad/locks/`
3. Agent communications - read recent messages
4. File ownership - verify in allocation plan

### Recovery Procedures
1. **Deadlock**: Kill all locks, restart allocation
2. **Corruption**: Revert to last known good state
3. **Conflict**: Invoke sequential fallback mode
4. **Timeout**: Escalate to supervisor (studio-coach)

## Validation Checklist

Before starting parallel execution:
- [ ] All agents have unique IDs
- [ ] File ownership matrix is complete
- [ ] No overlapping MODIFY permissions
- [ ] Lock directory exists and is empty
- [ ] Communication files are initialized
- [ ] Allocation plan is validated
- [ ] Git repository is clean
- [ ] Backup/rollback plan exists
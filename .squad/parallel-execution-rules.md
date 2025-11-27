# Parallel Execution Rules and Conflict Prevention

This document defines the rules and mechanisms for safe parallel agent execution.

---

## Quality Gates for Parallel Execution (v3.7.0)

> **Implementation**: See `.squad/patterns/parallel-execution.ts` for code patterns.

### Pre-Execution Gate Check

Before ANY parallel phase, Studio Coach MUST:
1. Run quality gate for each task (complexity, dependencies)
2. If ANY task BLOCKED → halt entire phase
3. If ANY task has 3+ attempts → escalate to user
4. Document assumptions for WARNING tasks

### Core Functions

| Function | Purpose |
|----------|---------|
| `validateParallelPhase()` | Check all gates before starting |
| `checkAgentProgress()` | Monitor attempts, detect stuck (≥3) |
| `checkFailureCascade()` | Block dependent tasks on failure |
| `validateSyncPoint()` | Verify evidence before next phase |

### Parallel Execution Rules

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
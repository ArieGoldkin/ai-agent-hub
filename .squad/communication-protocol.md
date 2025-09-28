# Squad Communication Protocol

## File-Based Messaging System

### Directory Structure
```
.squad/sessions/
├── [timestamp]/
│   ├── session-status.md           # Overall session state
│   ├── role-plan-*.md              # Task assignments
│   ├── role-comm-*.md              # Progress updates
│   ├── artifacts/                  # Generated files
│   └── locks/                      # File lock tracking
.claude/context/
├── shared-context.json             # Unified context (synced automatically)
└── instructions/context-middleware.md # Context protocol
```

### Context Synchronization
Squad communication files automatically sync with `.claude/context/shared-context.json`:
- Agent decisions from `role-comm-*.md` → `agent_decisions`
- Completed tasks → `tasks_completed`
- Blocked items → `tasks_pending`
- Session continuity preserved across Squad/Classic modes

## Message Formats

### 1. Session Status (Supervisor Maintains)
**File**: `session-status.md`
```yaml
session_id: sess_[timestamp]_[hash]
started_at: 2024-01-15T10:00:00Z
status: active|completed|failed
phase: requirements|design|implementation|quality
agents_active:
  - frontend-ui-developer[1]
  - backend-system-architect
tasks_total: 12
tasks_completed: 7
validation_gates:
  requirements: passed
  design: passed
  implementation: in_progress
  quality: pending
```

### 2. Task Assignment (role-plan)
**File**: `role-plan-[agent]-[task-id].md`
```yaml
# Task Assignment
meta:
  task_id: task_[timestamp]_[sequence]
  agent: frontend-ui-developer
  instance: 1
  created_at: 2024-01-15T10:30:00Z
  priority: high|medium|low
  timeout: 300  # seconds

dependencies:
  requires:
    - task_001  # Must complete first
    - task_002
  blocks:
    - task_010  # Cannot start until this completes

instruction: |
  Create a SearchableDropdown component with the following requirements:
  - Support keyboard navigation (arrow keys, enter, escape)
  - Filter options as user types
  - Show loading state during async data fetch
  - WCAG 2.1 AA compliant

boundaries:
  allowed:
    - frontend/src/components/SearchableDropdown.tsx
    - frontend/src/components/SearchableDropdown.test.tsx
    - frontend/src/styles/dropdown.css
  forbidden:
    - backend/**
    - database/**
    - .env

inputs:
  design_spec: designs/searchable-dropdown-v2.md
  api_contract: api/search-endpoint.yaml
  
outputs:
  component: frontend/src/components/SearchableDropdown.tsx
  tests: frontend/src/components/SearchableDropdown.test.tsx
  documentation: docs/components/SearchableDropdown.md

success_criteria:
  - Component renders without errors
  - All props are typed (no 'any')
  - Keyboard navigation works
  - Tests achieve 80% coverage
  - Accessibility audit passes
```

### 3. Progress Update (role-comm)
**File**: `role-comm-[agent]-[task-id].md`
```yaml
# Progress Update
meta:
  task_id: task_[timestamp]_[sequence]
  agent: frontend-ui-developer
  instance: 1
  updated_at: 2024-01-15T10:35:00Z
  
status: pending|in_progress|completed|blocked
progress_percentage: 75

current_action: |
  Implementing keyboard navigation handlers

completed_steps:
  - Created component structure
  - Added TypeScript interfaces
  - Implemented search filtering
  - Added loading states

remaining_steps:
  - Keyboard navigation
  - Accessibility attributes
  - Unit tests

artifacts_created:
  - path: frontend/src/components/SearchableDropdown.tsx
    lines: 186
    status: draft
  - path: frontend/src/types/dropdown.ts
    lines: 24
    status: complete

validation_results:
  typescript: 
    status: passing
    errors: 0
    warnings: 2
  eslint:
    status: passing
    errors: 0
  tests:
    status: not_run
    coverage: 0
  build:
    status: passing
    time_ms: 1250

blockers:
  - description: Need clarification on error state design
    blocking_since: 2024-01-15T10:34:00Z
    requires_agent: rapid-ui-designer

time_spent: 180  # seconds
tokens_used: 4500
```

### 4. Inter-Agent Communication
**File**: `role-comm-[from-agent]-to-[to-agent]-[id].md`
```yaml
# Inter-Agent Message
meta:
  message_id: msg_[timestamp]_[hash]
  from_agent: frontend-ui-developer
  to_agent: backend-system-architect
  created_at: 2024-01-15T10:36:00Z
  priority: high

type: question|request|notification
subject: API contract clarification needed

message: |
  The search endpoint spec shows a 'limit' parameter but no 'offset'.
  How should we handle pagination for large result sets?

context:
  task_id: task_001
  component: SearchableDropdown
  file: frontend/src/components/SearchableDropdown.tsx

response_needed: true
response_by: 2024-01-15T10:45:00Z
```

## Synchronization Patterns

### 1. Polling Pattern (Default)
Agents check for new messages every 5 seconds:
```bash
while true; do
  check_for_new_tasks "role-plan-${AGENT_NAME}-*.md"
  process_tasks
  update_progress "role-comm-${AGENT_NAME}-*.md"
  sleep 5
done
```

### 2. Event-Driven Pattern (Optimized)
Use file watchers for immediate response:
```bash
fswatch -o ".squad/sessions/*/role-plan-${AGENT_NAME}-*.md" | \
  xargs -n1 -I{} process_new_task {}
```

### 3. Broadcast Pattern
Supervisor announces phase changes:
```yaml
# File: broadcast-phase-change.md
phase: implementation
timestamp: 2024-01-15T11:00:00Z
agents_activate:
  - frontend-ui-developer[1]
  - frontend-ui-developer[2]
  - backend-system-architect
agents_deactivate:
  - ux-researcher
  - rapid-ui-designer
```

## File Locking Mechanism

### Lock File Format
**File**: `locks/[filename]-[agent]-[timestamp].lock`
```yaml
file: frontend/src/App.tsx
locked_by: frontend-ui-developer[1]
locked_at: 2024-01-15T10:37:00Z
expires_at: 2024-01-15T10:39:00Z
task_id: task_001
operation: modify|delete|create
```

### Lock Operations
```bash
# Acquire lock
acquire_lock() {
  if [ ! -f "locks/$1-*.lock" ]; then
    echo "..." > "locks/$1-$AGENT-$(date +%s).lock"
    return 0
  fi
  return 1
}

# Release lock
release_lock() {
  rm -f "locks/$1-$AGENT-*.lock"
}
```

## Message Priority Handling

### Priority Levels
1. **critical**: System failures, blocking issues (immediate)
2. **high**: Task dependencies, validation failures (< 1 min)
3. **medium**: Standard tasks, progress updates (< 5 min)
4. **low**: Optimizations, nice-to-have features (when available)

### Queue Processing
Supervisor processes messages in priority order:
```python
message_queue = PriorityQueue()
for message in scan_messages():
    priority = get_priority(message)
    message_queue.put((priority, message))
```

## Error Handling Protocol

### Error Message Format
```yaml
# File: error-[agent]-[timestamp].md
error_id: err_[timestamp]_[hash]
agent: frontend-ui-developer
task_id: task_001
severity: critical|error|warning
occurred_at: 2024-01-15T10:38:00Z

error:
  type: TypeScriptCompilationError
  message: "Type 'string' is not assignable to type 'number'"
  file: frontend/src/components/SearchableDropdown.tsx
  line: 45
  column: 12

attempted_fixes:
  - Changed type annotation to string
  - Result: Created new error in dependent component

requires_intervention: true
suggested_agent: backend-system-architect
```

## Performance Monitoring

### Metrics Tracked
```yaml
# File: metrics-[session-id].md
session_metrics:
  messages_sent: 145
  messages_received: 143
  avg_response_time_ms: 750
  tasks_completed: 12
  tasks_failed: 2
  validation_gates_passed: 3
  validation_gates_failed: 1
  
per_agent_metrics:
  frontend-ui-developer:
    tasks_assigned: 8
    tasks_completed: 6
    avg_completion_time_s: 240
    tokens_used: 32000
    success_rate: 0.75
```

## Cleanup Protocol

### Session Completion
1. Archive session folder to `.squad/archives/`
2. Clear active locks
3. Generate session summary report
4. Clean up temporary files

### Retention Policy
- Active sessions: Keep indefinitely
- Completed sessions: Archive after 24 hours
- Archived sessions: Delete after 30 days
- Failed sessions: Keep for 7 days for debugging
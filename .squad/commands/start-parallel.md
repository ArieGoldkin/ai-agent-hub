# Start Parallel Agent Execution

Instructions for launching multiple agents to work simultaneously on allocated tasks.

## Step 0: Check for Requirements in Command

**FIRST:** Check if requirements were provided with this command.

If requirements were NOT provided with the command, proceed to gather them:

## Step 1: Discover or Gather Requirements

### Search for Existing Requirements

Search for any existing requirements or documentation:

```bash
# Search for PRD or requirements files
find . -type f \( -name "*prd*.md" -o -name "*requirements*.md" -o -name "README.md" -o -name "TODO.md" -o -name "ROADMAP.md" \) -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null

# Check README for features section
grep -i "features\|requirements\|user stories" README.md 2>/dev/null

# Check for GitHub issues
ls .github/issues/*.md 2>/dev/null
```

### If Requirements Found

Summarize what you found and confirm:

```markdown
📄 Found existing requirements in [filename]:
"[1-2 sentence summary of what the project is building]"

Is this what you're building? (Y/n):
```

**If YES:** Proceed to Step 1 with existing requirements
**If NO:** Ask for requirements (see below)

### If No Requirements Found (or user said NO)

Ask the single question:

```markdown
📋 **What would you like to build?**

Please describe your requirements and I'll orchestrate multiple agents to build it in parallel:

> _[Wait for user response]_
```

### Smart Inference from User Input

#### Examples of Inference

**Example 1 - Minimal Input:**
```
User: "user auth system"
Inferred:
- Frontend: login/register forms
- Backend: auth endpoints, JWT handling
- Database: user tables, sessions
→ 3 agents recommended
```

**Example 2 - Detailed Input:**
```
User: "Dashboard showing real-time metrics with charts, 
      export to CSV, and email alerts"
Inferred:
- Frontend: dashboard UI, charts, real-time updates
- Backend: metrics API, WebSocket server, export service
- Notifications: email service
→ 3-4 agents recommended
```

**Example 3 - Vague Input:**
```
User: "something like Twitter"
Inferred:
- Frontend: timeline, post creation
- Backend: posts API, user API
- Database: posts, users, follows
→ Start with 2 agents (conservative)
```

#### Inference Logic

```python
def infer_requirements(user_input):
    # Keywords to components mapping
    component_keywords = {
        'frontend': ['dashboard', 'UI', 'interface', 'form', 'page', 'screen'],
        'backend': ['API', 'endpoint', 'server', 'auth', 'database'],
        'realtime': ['websocket', 'real-time', 'live', 'updates'],
        'ml': ['ML', 'AI', 'predict', 'recommend', 'analyze'],
        'data': ['export', 'CSV', 'report', 'analytics']
    }
    
    # Extract components from keywords
    components = detect_components(user_input, component_keywords)
    
    # Generate concrete tasks
    tasks = []
    if 'frontend' in components:
        tasks.extend(['Create UI components', 'Style layouts', 'Handle state'])
    if 'backend' in components:
        tasks.extend(['Build API endpoints', 'Setup database', 'Handle auth'])
    if 'ml' in components:
        tasks.extend(['Train model', 'Create pipeline', 'API integration'])
    
    # Smart agent count
    if len(tasks) <= 3:
        agent_count = 1  # Sequential is fine
    elif len(components) <= 3 and no_complex_dependencies:
        agent_count = len(components)  # One agent per component
    else:
        agent_count = min(len(components), 5)  # Cap at 5 for manageability
    
    return {
        "description": user_input,
        "components": components,
        "tasks": tasks,
        "recommended_agents": agent_count
    }
```

### Confirmation Before Proceeding

Show the user what you understood:

```markdown
I'll build this with [N] parallel agents:
- Component 1: [what it does]
- Component 2: [what it does]
- Component 3: [what it does]

Ready to start? (Y/n):
```

## Prerequisites

Once requirements are confirmed:
1. Generate task allocation based on requirements
2. Create `.squad/parallel-plans/agent-*-plan.md` files
3. Initialize directories (`.squad/locks/`, `.squad/comms/`)
4. Ensure Git repository is in clean state

## Launch Instructions

### Step 1: Prepare Environment

```bash
# Initialize parallel execution environment
mkdir -p .squad/locks
mkdir -p .squad/comms
mkdir -p .squad/logs
mkdir -p .squad/metrics

# Clear any stale locks
rm -f .squad/locks/*.lock

# Initialize communication files
for i in 1 2 3; do
  echo "# Agent $i Communication Log" > .squad/comms/agent-$i-comm.md
  echo "Status: READY" >> .squad/comms/agent-$i-comm.md
  echo "Initialized: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> .squad/comms/agent-$i-comm.md
done
```

### Step 2: Set Agent Environment Variables

Each terminal/agent needs unique identification:

**Terminal 1 - Frontend Agent:**
```bash
export AGENT_ID="agent-1-frontend-ui-developer"
export AGENT_TYPE="frontend-ui-developer"
export AGENT_PLAN=".squad/parallel-plans/agent-1-plan.md"
export AGENT_COMM=".squad/comms/agent-1-comm.md"
export PARALLEL_MODE="true"
```

**Terminal 2 - Backend Agent:**
```bash
export AGENT_ID="agent-2-backend-system-architect"
export AGENT_TYPE="backend-system-architect"
export AGENT_PLAN=".squad/parallel-plans/agent-2-plan.md"
export AGENT_COMM=".squad/comms/agent-2-comm.md"
export PARALLEL_MODE="true"
```

**Terminal 3 - AI/ML Agent:**
```bash
export AGENT_ID="agent-3-ai-ml-engineer"
export AGENT_TYPE="ai-ml-engineer"
export AGENT_PLAN=".squad/parallel-plans/agent-3-plan.md"
export AGENT_COMM=".squad/comms/agent-3-comm.md"
export PARALLEL_MODE="true"
```

### Step 3: Launch Agents

In each terminal, instruct the agent to start work:

```markdown
You are operating in PARALLEL EXECUTION MODE as ${AGENT_ID}.

Your execution plan is in: ${AGENT_PLAN}
Your communication file is: ${AGENT_COMM}

Rules for parallel execution:
1. ONLY modify files listed in your plan under "MODIFY" or "CREATE"
2. Before editing any file, check for locks in .squad/locks/
3. Create a lock before editing, remove it after completion
4. Update your communication file every 5 minutes
5. If blocked, work on alternative tasks or wait

Begin by:
1. Reading your execution plan
2. Confirming your file ownership
3. Starting with the first task
4. Creating locks as needed

Start now.
```

### Step 4: Monitor Progress Dashboard

**Coordinator Terminal (Terminal 4):**

Create a monitoring script:

```bash
#!/bin/bash
# monitor-parallel.sh

while true; do
  clear
  echo "==================================="
  echo "PARALLEL EXECUTION MONITOR"
  echo "Time: $(date)"
  echo "==================================="
  
  echo -e "\n📊 AGENT STATUS:"
  for i in 1 2 3; do
    if [ -f ".squad/comms/agent-$i-comm.md" ]; then
      status=$(grep "^Status:" .squad/comms/agent-$i-comm.md | tail -1)
      task=$(grep "^Current Task:" .squad/comms/agent-$i-comm.md | tail -1)
      echo "Agent $i: $status"
      echo "  $task"
    fi
  done
  
  echo -e "\n🔒 ACTIVE LOCKS:"
  for lock in .squad/locks/*.lock 2>/dev/null; do
    if [ -f "$lock" ]; then
      filename=$(basename "$lock" .lock)
      locked_by=$(grep "LOCKED_BY:" "$lock" | cut -d: -f2)
      echo "  $filename -> $locked_by"
    fi
  done
  
  echo -e "\n📁 RECENT FILE CHANGES:"
  git status --short | head -5
  
  echo -e "\n⏱️  METRICS:"
  if [ -f ".squad/metrics/parallel-performance.md" ]; then
    grep "Parallel Efficiency:" .squad/metrics/parallel-performance.md
  fi
  
  sleep 5
done
```

Run the monitor:
```bash
chmod +x monitor-parallel.sh
./monitor-parallel.sh
```

## Parallel Execution Protocol

### Starting Work
1. Agent reads its plan file
2. Updates status to "ACTIVE" in comm file
3. Begins first task from plan
4. Creates lock before file modification
5. Updates progress regularly

### During Execution
```markdown
## Status Update Format
Status: ACTIVE
Current Task: Implementing user dashboard component
Files Modified: 
  - /frontend/components/Dashboard.tsx (created)
  - /frontend/styles/dashboard.css (created)
Progress: 2/5 tasks complete
Next: API integration hooks
Timestamp: 2024-01-20T11:00:00Z
```

### Handling Blocks
```markdown
## Blocker Report
Status: BLOCKED
Blocker: File /shared/types/user.ts locked by agent-2
Waiting Since: 2024-01-20T11:15:00Z
Alternative Task: Starting on error handling components
Resolution: Will retry in 5 minutes
```

### Completion
```markdown
## Completion Report
Status: COMPLETE
Tasks Completed: 5/5
Files Created: 8
Files Modified: 3
Total Time: 35 minutes
Handoffs: None pending
Final Notes: All dashboard components ready for integration
```

## Coordination Commands

### Check All Agent Status
```bash
for i in 1 2 3; do
  echo "=== Agent $i ==="
  tail -10 .squad/comms/agent-$i-comm.md | grep -E "Status:|Current Task:"
done
```

### Force Unlock (Emergency)
```bash
# Use only if agent has crashed
rm -f .squad/locks/[filename].lock
echo "Force unlocked: [filename]" >> .squad/logs/force-unlock.log
```

### Pause All Agents
```bash
echo "PAUSE_REQUESTED" > .squad/control/pause.flag
# Agents should check for this flag
```

### Resume All Agents
```bash
rm -f .squad/control/pause.flag
```

## Success Indicators

✅ **Good Parallel Execution:**
- All agents report ACTIVE status
- No locks held > 10 minutes
- Regular communication updates
- Files being created/modified
- No merge conflicts in git

⚠️ **Warning Signs:**
- Lock held > 10 minutes
- Agent status stuck
- Multiple BLOCKED statuses
- No communication updates
- Git conflicts appearing

❌ **Failure Indicators:**
- Deadlock (circular lock waiting)
- Agent crash/termination
- File corruption
- Unresolvable conflicts
- Plan deviation

## Troubleshooting

### Agent Not Starting
- Verify environment variables are set
- Check plan file exists and is readable
- Ensure agent has correct permissions
- Verify git repository is clean

### Locks Not Releasing
- Check agent communication for errors
- Force unlock if agent has crashed
- Verify lock directory permissions
- Check for stale lock files (> 30 min)

### Merge Conflicts
- Stop all agents immediately
- Resolve conflicts manually
- Clear all locks
- Restart with updated plans

### Communication Breakdown
- Check comm file permissions
- Verify agents are updating files
- Ensure filesystem isn't full
- Check for network/terminal issues

## Best Practices

1. **Start Small**: Begin with 2 agents before scaling to 3+
2. **Clear Boundaries**: Ensure file ownership is unambiguous  
3. **Frequent Syncs**: Update communication files every 3-5 minutes
4. **Quick Locks**: Hold locks only for actual edit time
5. **Alternative Tasks**: Always have backup work if blocked
6. **Clean Handoffs**: Document clearly when passing work
7. **Regular Commits**: Commit completed work frequently
8. **Monitor Actively**: Watch the dashboard for issues
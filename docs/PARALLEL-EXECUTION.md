# Parallel Execution Framework

## Overview

The Parallel Execution Framework enables multiple AI agents to work simultaneously on different parts of your project, achieving up to 66% time reduction compared to sequential execution.

## Quick Start

### 1. Install Squad Mode

```bash
# Using node directly (recommended)
node /path/to/ai-agent-hub/dist/bin/cli.js --mode squad --project-only

# Or if installed globally
ai-agent-hub --mode squad --project-only
```

### 2. Start Parallel Execution

The system will automatically:
1. **Search** for existing requirements (PRD, README, docs)
2. **Confirm** if found, or **Ask** one simple question if not
3. **Infer** components and tasks from your description
4. **Allocate** work across optimal number of agents

#### Example: No Requirements Found
```markdown
$ Start parallel execution

Searching for existing requirements...
✗ No requirements found

What are you building? (describe in your own words):
> A dashboard showing user metrics with real-time updates

I'll build this with 3 parallel agents:
- Frontend: Dashboard UI with real-time updates
- Backend: Metrics API and WebSocket server
- Database: Metrics storage and queries

Ready to start? (Y/n): Y
```

#### Example: Requirements Found
```markdown
$ Start parallel execution

📄 Found existing requirements in README.md:
"E-commerce platform with cart and checkout"

Is this what you're building? (Y/n): Y
✅ Using existing requirements
```

### 3. Automatic Task Allocation

Based on your input, the system:
- Extracts components (frontend, backend, ML, etc.)
- Generates concrete tasks
- Determines optimal agent count (1-9)
- Creates conflict-free execution plans

**No PRD file needed!** The system works with whatever you provide.

### 4. Start Parallel Agents

Open 3+ terminals and start agents:

**Terminal 1 - Frontend Agent:**
```bash
export AGENT_ID="agent-1-frontend"
# Tell Claude to read .squad/parallel-plans/agent-1-plan.md and start work
```

**Terminal 2 - Backend Agent:**
```bash
export AGENT_ID="agent-2-backend"
# Tell Claude to read .squad/parallel-plans/agent-2-plan.md and start work
```

**Terminal 3 - ML Agent:**
```bash
export AGENT_ID="agent-3-ml"
# Tell Claude to read .squad/parallel-plans/agent-3-plan.md and start work
```

### 5. Monitor Progress

**Terminal 4 - Monitoring:**
```bash
# If you have the test scenario installed
.claude/examples/parallel-test/monitor-parallel.sh

# Or manually check status
watch -n 5 'grep "Status:" .squad/comms/agent-*-comm.md'
```

## Architecture

### File Structure

```
.claude/
├── commands/                      # Parallel execution commands
│   ├── allocate-tasks-parallel.md # Task distribution logic
│   ├── start-parallel.md          # Launch instructions
│   └── sync-parallel.md           # Coordination & sync
├── parallel-execution-rules.md    # Conflict prevention rules
├── examples/                       # Test scenarios
│   └── parallel-test/             # Complete working example
└── agents/                        # Slim 25-line agent templates

.squad/                            # Runtime files (created during execution)
├── feature-prd.md                 # Product requirements
├── parallel-plans/                # Individual agent plans
│   ├── agent-1-plan.md
│   ├── agent-2-plan.md
│   └── agent-3-plan.md
├── locks/                         # File lock mechanism
├── comms/                         # Agent communication
└── logs/                          # Execution logs
```

### Core Components

#### 1. Task Allocation System
- Parses PRD requirements
- Identifies independent work streams
- Creates conflict-free file assignments
- Generates individual agent plans

#### 2. Lock Mechanism
- Prevents simultaneous file modifications
- Automatic timeout for stale locks
- Lock files in `.squad/locks/[filename].lock`

#### 3. Communication Protocol
- Each agent maintains `.squad/comms/agent-[id]-comm.md`
- Status updates every 3-5 minutes
- Handoff notifications for dependencies

#### 4. Sync Coordinator
- Monitors all agent progress
- Detects and resolves conflicts
- Reassigns blocked work
- Generates status reports

## Conflict Prevention

### File Ownership Matrix

```yaml
/frontend:
  owner: frontend-ui-developer
  access: EXCLUSIVE
  
/backend:
  owner: backend-system-architect
  access: EXCLUSIVE
  
/ml:
  owner: ai-ml-engineer
  access: EXCLUSIVE
  
/shared:
  owner: NONE
  access: SEQUENTIAL  # Requires locks
```

### Safe Parallel Zones

✅ **Can Run in Parallel:**
- Different top-level directories
- Non-overlapping components
- Independent API endpoints
- Separate database tables

⚠️ **Requires Coordination:**
- Shared type definitions
- Common utilities
- Configuration files
- Package.json

❌ **Never Parallel:**
- Git operations
- Database migrations
- Production deployments
- Package installations

## Communication Format

### Status Update
```markdown
## Status Update [timestamp]
Status: ACTIVE
Current Task: Implementing dashboard
Files Modified: 
  - /frontend/Dashboard.tsx (created)
Progress: 3/5 tasks complete
Next: API integration
```

### Handoff Request
```markdown
## Handoff Request [timestamp]
FROM: agent-1-frontend
TO: agent-2-backend
FILE: /shared/types/metrics.ts
STATUS: Ready for backend implementation
```

## Performance Metrics

### Expected Efficiency Gains

| Scenario | Sequential | Parallel | Efficiency |
|----------|------------|----------|------------|
| 3-feature dashboard | 6 hours | 2 hours | 66% |
| API + UI + Tests | 4 hours | 1.5 hours | 62% |
| Full stack feature | 8 hours | 3 hours | 62% |

### Monitoring Metrics

- **Task Completion Rate**: Tasks/hour per agent
- **Lock Contention**: Average wait time for locks
- **Conflict Rate**: Conflicts per hour
- **Parallel Efficiency**: (Sequential time / Parallel time)

## Best Practices

### 1. Task Distribution
- Keep related code in same agent
- Minimize cross-agent dependencies
- Create shared types first
- Plan handoffs explicitly

### 2. Lock Management
- Hold locks minimally
- Release immediately after edits
- Check for stale locks regularly
- Use read-only when possible

### 3. Communication
- Update status frequently
- Be specific about blockers
- Document handoff requirements
- Include time estimates

### 4. Error Recovery
- Save work frequently
- Have fallback tasks ready
- Monitor for stuck agents
- Keep coordinator informed

## Troubleshooting

### Common Issues

#### Agent Not Starting
```bash
# Check environment variables
echo $AGENT_ID

# Verify plan exists
cat .squad/parallel-plans/agent-1-plan.md

# Check for existing locks
ls .squad/locks/
```

#### Lock Conflicts
```bash
# Check lock age
stat .squad/locks/file.lock

# Force unlock if stale (>30 min)
rm .squad/locks/file.lock
```

#### Agent Blocked
```markdown
# In agent's terminal
Status: BLOCKED
Waiting for: /shared/types/user.ts
Alternative: Working on tests instead
```

## Example Test Scenario

A complete working example is included in `.claude/examples/parallel-test/`:

1. **Feature PRD**: Analytics dashboard specification
2. **3 Agent Plans**: Frontend, Backend, ML tasks
3. **Monitor Script**: Real-time progress dashboard
4. **Test Instructions**: Step-by-step validation

Run the test:
```bash
cd .claude/examples/parallel-test
./test-scenario.md  # Follow instructions
```

## Advanced Usage

### Custom Allocation Rules

Modify `.claude/commands/allocate-tasks-parallel.md` to customize:
- Task complexity scoring
- Agent skill matching
- Dependency resolution
- Load balancing algorithms

### Scaling to More Agents

The framework supports 3+ agents. For larger teams:
1. Increase monitoring frequency
2. Use hierarchical coordination
3. Implement queue-based task distribution
4. Add automated conflict resolution

### Integration with CI/CD

```yaml
# .github/workflows/parallel-build.yml
jobs:
  frontend:
    runs-on: ubuntu-latest
    # Frontend agent tasks
    
  backend:
    runs-on: ubuntu-latest  
    # Backend agent tasks
    
  ml:
    runs-on: ubuntu-latest
    # ML agent tasks
```

## Token Efficiency

Squad mode with parallel execution provides:
- **97% token reduction** via slim templates (25 lines vs 286-1315)
- **66% time reduction** via parallel execution
- **Combined benefit**: Faster delivery at lower cost

## Future Enhancements

Planned improvements:
- [ ] Automatic conflict resolution
- [ ] Dynamic work rebalancing
- [ ] Visual progress dashboard
- [ ] Integration with project management tools
- [ ] Automated testing coordination

## Support

For issues or questions:
- Check example in `.claude/examples/parallel-test/`
- Review `.claude/parallel-execution-rules.md`
- Examine agent communication files
- Monitor lock directory for conflicts
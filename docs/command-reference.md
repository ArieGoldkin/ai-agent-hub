# 📚 AI Agent Hub - Complete Command Reference

## 🎯 Overview

This document provides a complete reference for all AI Agent Hub commands, including setup, session management, analytics, and orchestration features.

---

## 📋 Command Categories

### 1️⃣ Installation & Setup Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ai-agent-hub` | Interactive setup (asks where to install) | `npx ai-agent-hub` |
| `ai-agent-hub --both` | Install to both project and desktop | `npx ai-agent-hub --both` |
| `ai-agent-hub --project-only` | Install only to current project | `npx ai-agent-hub --project-only` |
| `ai-agent-hub --desktop-only` | Install only to Claude Desktop | `npx ai-agent-hub --desktop-only` |

### 2️⃣ Information Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ai-agent-hub --help` | Show comprehensive help | `npx ai-agent-hub --help` |
| `ai-agent-hub --version` | Display version information | `npx ai-agent-hub --version` |
| `ai-agent-hub --list-agents` | Show all 9 AI agents with descriptions | `npx ai-agent-hub --list-agents` |
| `ai-agent-hub --list-servers` | List configured MCP servers | `npx ai-agent-hub --list-servers` |

### 3️⃣ Server Management Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ai-agent-hub --add <server>` | Add a specific MCP server | `npx ai-agent-hub --add supabase` |
| `ai-agent-hub --remove <server>` | Remove an MCP server | `npx ai-agent-hub --remove postgres` |

### 4️⃣ Session Management Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ai-agent-hub session start [name]` | Start new collaboration session | `npx ai-agent-hub session start "feature-auth"` |
| `ai-agent-hub session show` | Display current session context | `npx ai-agent-hub session show` |
| `ai-agent-hub session clear` | Archive and clear current session | `npx ai-agent-hub session clear` |
| `ai-agent-hub session list` | Show last 5 archived sessions | `npx ai-agent-hub session list` |
| `ai-agent-hub session help` | Show session command help | `npx ai-agent-hub session help` |

### 5️⃣ Analytics Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ai-agent-hub analyze` | Full workflow analysis with all insights | `npx ai-agent-hub analyze` |
| `ai-agent-hub analyze performance` | Agent performance metrics and timing | `npx ai-agent-hub analyze performance` |
| `ai-agent-hub analyze handoffs` | Handoff pattern analysis between agents | `npx ai-agent-hub analyze handoffs` |
| `ai-agent-hub analyze bottlenecks` | Detect workflow slowdowns and issues | `npx ai-agent-hub analyze bottlenecks` |
| `ai-agent-hub analyze insights` | Optimization suggestions and recommendations | `npx ai-agent-hub analyze insights` |
| `ai-agent-hub analyze growth` | Context accumulation and evolution tracking | `npx ai-agent-hub analyze growth` |
| `ai-agent-hub analyze quality` | Decision quality tracking and validation | `npx ai-agent-hub analyze quality` |

---

## 🔄 Session Workflow Commands

### Starting a New Development Session

```bash
# 1. Start a new session with a descriptive name
npx ai-agent-hub session start "implement-user-auth"

# 2. Session automatically initializes:
# - Creates unique session ID
# - Sets up context tracking
# - Prepares agent orchestration
```

### Using Session Templates

```bash
# Use a pre-built template for common workflows
npx ai-agent-hub session start --template feature-development

# Available templates:
# - feature-development
# - bug-fix
# - refactoring
# - performance-optimization
```

### Monitoring Session Progress

```bash
# View current session state
npx ai-agent-hub session show

# Output includes:
# - Active agents
# - Context accumulation
# - Decision history
# - Current phase
```

### Analyzing Workflow Performance

```bash
# Full analysis of current session
npx ai-agent-hub analyze

# Specific analysis types
npx ai-agent-hub analyze performance  # Agent timing metrics
npx ai-agent-hub analyze handoffs     # Inter-agent communication
npx ai-agent-hub analyze bottlenecks  # Performance issues
```

### Completing a Session

```bash
# Archive and clear when done
npx ai-agent-hub session clear

# Session is automatically:
# - Archived with timestamp
# - Saved for future reference
# - Cleared from active state
```

---

## 🤖 Agent-Specific Commands

While agents are primarily invoked through Claude's interface, you can interact with their context:

### View Agent Context
```bash
# See what context an agent has accumulated
npx ai-agent-hub session show

# Look for agent-specific sections:
# - ux-researcher: User requirements
# - backend-system-architect: API designs
# - frontend-ui-developer: Component specs
```

### Agent Orchestration Flow
```bash
# The Studio Coach agent orchestrates others automatically
# Start with: "Hey Studio Coach, let's build [feature]"

# Coach will:
# 1. Initialize session
# 2. Route to appropriate agents
# 3. Manage context handoffs
# 4. Track progress
```

---

## 📊 Advanced Analytics Commands

### Performance Deep Dive
```bash
# Detailed performance metrics
npx ai-agent-hub analyze performance

# Shows:
# - Agent execution times
# - Confidence scores (0-100%)
# - Success rates
# - Context size growth
```

### Bottleneck Detection
```bash
# Find workflow inefficiencies
npx ai-agent-hub analyze bottlenecks

# Detects:
# - Slow agents (>5s response)
# - Circular dependencies
# - Context overload (>100KB)
# - Blocked handoffs
```

### Optimization Insights
```bash
# Get actionable recommendations
npx ai-agent-hub analyze insights

# Provides:
# - Workflow optimizations
# - Agent reordering suggestions
# - Parallelization opportunities
# - Context reduction strategies
```

---

## 🎯 Command Combinations

### Full Feature Development Flow
```bash
# 1. Start session
npx ai-agent-hub session start "new-feature"

# 2. Work with agents in Claude
# "Studio Coach, let's implement user authentication"

# 3. Monitor progress
npx ai-agent-hub session show

# 4. Analyze performance
npx ai-agent-hub analyze

# 5. Complete session
npx ai-agent-hub session clear
```

### Debugging Workflow Issues
```bash
# 1. Check current state
npx ai-agent-hub session show

# 2. Find bottlenecks
npx ai-agent-hub analyze bottlenecks

# 3. Get recommendations
npx ai-agent-hub analyze insights

# 4. View agent handoffs
npx ai-agent-hub analyze handoffs
```

### Performance Optimization Flow
```bash
# 1. Start performance session
npx ai-agent-hub session start --template performance-optimization

# 2. Run full analysis
npx ai-agent-hub analyze

# 3. Focus on specific metrics
npx ai-agent-hub analyze performance
npx ai-agent-hub analyze quality

# 4. Implement recommendations
npx ai-agent-hub analyze insights
```

---

## 🚀 Quick Reference Card

### Essential Commands
```bash
npx ai-agent-hub                      # Setup
npx ai-agent-hub session start        # Begin work
npx ai-agent-hub session show         # Check status
npx ai-agent-hub analyze              # Review performance
npx ai-agent-hub session clear        # Finish work
```

### Debug Commands
```bash
npx ai-agent-hub --list-agents        # Available agents
npx ai-agent-hub analyze bottlenecks  # Find issues
npx ai-agent-hub analyze insights     # Get solutions
```

### Information Commands
```bash
npx ai-agent-hub --help               # Full help
npx ai-agent-hub --version            # Version info
npx ai-agent-hub session help         # Session help
```

---

## 📝 Notes

- All commands support both `npx ai-agent-hub` and direct execution if installed globally
- Session data is stored in `.claude/session-context.json`
- Analytics are computed in real-time from session data
- Templates are stored in `.claude/session-templates/`
- Agent personalities are in `.claude/agents/`

---

## 🔗 Related Documentation

- [README.md](../README.md) - Main documentation
- [WORKFLOW.md](../WORKFLOW.md) - Visual workflow guide
- [CLAUDE.md](../CLAUDE.md) - Development guide
- [Session Templates](../.claude/session-templates/) - Workflow templates
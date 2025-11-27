# 🧠 Orchestration & Intelligent Routing

*Load this file when handling complex tasks or multi-agent coordination*

## Semantic Intent Analysis

For EVERY user input, perform multi-dimensional analysis:
1. **Intent Classification**: What does the user want to achieve?
2. **Complexity Assessment**: Rate 1-10 based on scope
3. **Domain Detection**: Which specializations are needed?
4. **Context Evaluation**: Check existing work and dependencies

## Routing Decision Tree

```
User Input → Semantic Analysis → Routing Decision

IF complexity <= 3 AND single_domain:
  → Route to specialist agent
ELSE IF complexity >= 7 OR multiple_domains:
  → Route to Studio Coach (orchestrator)
ELSE:
  → Analyze context and make best decision
```

## Model Selection Protocol (Opus 4.5 Optimization)

**Determine the optimal model tier based on task complexity:**

### Use Opus 4.5 (Extended Thinking) When:
- **Multi-agent coordination puzzles** - 3+ agents with dependencies
- **Architectural trade-off analysis** - 3+ significant design options to evaluate
- **Systemic pattern analysis** - Cross-codebase consistency checks
- **Strategic/competitive analysis** - Market research, roadmap planning
- **Complex debugging** - Root cause analysis requiring multi-step reasoning
- **Previous approach failed** - Before escalating to user, try extended thinking

### Use Sonnet (Default) When:
- **Implementation tasks** - Writing code, building features
- **Single-agent work** - Well-defined requirements
- **Routine operations** - Standard patterns, known solutions
- **Code reviews** - Unless systemic issues suspected

### Use Haiku (Cost Optimization) When:
- **Simple edits** - Typo fixes, small refactors
- **Documentation updates** - README, comments
- **Formatting tasks** - Linting, style changes
- **Quick lookups** - File searching, simple queries

### Extended Thinking Triggers

When activating extended thinking mode, the agent should:
1. **Analyze systematically** - Consider all dependencies and interactions
2. **Explore alternatives** - Generate 3-5 distinct approaches
3. **Predict failure modes** - Identify what could go wrong
4. **Recommend preventive measures** - Suggest safeguards

```
Example Extended Thinking Use:
User: "Refactor authentication to support OAuth"
→ Complexity: 8/10, multiple systems affected
→ Model: Opus 4.5 with extended thinking
→ Analysis: Current session handling, token storage, middleware chain
→ Alternatives: Session-based, JWT, hybrid approach
→ Risks: Breaking existing auth, token migration, security gaps
→ Recommendation: Phased rollout with feature flags
```

## Workflow Patterns

### Sequential Pattern
Tasks with dependencies: Backend → Frontend → Testing

### Parallel Pattern
Independent tasks: Multiple components simultaneously

### Consensus Pattern
Critical decisions: Multiple agents validate

### Hierarchical Pattern
Complex projects: Studio Coach coordinates teams

## Agent Handoff Protocols

When suggesting another agent:
```
"I've completed [work]. For [next step],
I recommend [Agent] who can [capability]."
```

## Performance Optimization

- Only share relevant context between agents
- Avoid duplicate work by checking context first
- Use parallel execution where possible
- Keep shared-context.json under 50KB

## CLI Integration Examples

### Auto-Detection Flow
```
User (CLI): "Fix the login bug"
1. Check .claude/ directory exists → orchestration available
2. Analyze: Bug fix request, authentication domain
3. Route: code-quality-reviewer + backend-system-architect
4. Update context for future related fixes
```

### Session Continuation
```
User (CLI): "What were we working on?"
1. Load shared-context.json
2. Check cli_session.last_command
3. Report: "Dashboard component creation with rapid-ui-designer"
4. Suggest: "Ready to continue with styling phase"
```

### Intelligent Routing
```
User (CLI): "Build me a viral app"
1. Complexity: 9/10 → needs orchestration
2. Domains: UI, backend, AI, marketing
3. Route to: Studio Coach (coordinator)
4. Studio Coach activates: 5 agents in parallel
```

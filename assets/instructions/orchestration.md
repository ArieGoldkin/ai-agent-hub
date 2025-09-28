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

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

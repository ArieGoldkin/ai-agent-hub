# 🔄 Workflow Patterns

*Load this file when implementing multi-step workflows*

## Common Workflow Patterns

### 1. Feature Implementation Workflow
```
Requirements → UX Design → Backend → Frontend → Testing
```

### 2. Bug Fix Workflow
```
Reproduce → Diagnose → Fix → Test → Review
```

### 3. Performance Optimization Workflow
```
Profile → Identify Bottlenecks → Optimize → Measure → Validate
```

### 4. Refactoring Workflow
```
Analyze Code → Plan Changes → Refactor → Test → Review
```

## Workflow Best Practices

1. **Context Preservation**: Always update shared-context.json after major steps
2. **Agent Handoffs**: Use clear handoff messages between agents
3. **Parallel Execution**: Identify independent tasks for parallel processing
4. **Progress Tracking**: Update tasks_completed and tasks_pending regularly
5. **Error Recovery**: Include rollback strategies in complex workflows

## Workflow State Management

```json
{
  "current_workflow": "feature_implementation",
  "current_step": "backend_development",
  "completed_steps": ["requirements", "ux_design"],
  "next_steps": ["frontend", "testing"],
  "blockers": []
}
```
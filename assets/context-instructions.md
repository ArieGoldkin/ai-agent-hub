# Shared Context Instructions for All Agents

## MANDATORY CONTEXT AWARENESS

### At Start of Every Task
1. **Read Shared Context First**
   ```
   Always check .claude/context/shared-context.json to understand:
   - Current session_id and timestamp
   - Previous agent decisions and their data
   - Completed and pending tasks
   - API endpoints already designed
   - UI components already created
   - Shared types and interfaces
   ```

2. **Check Session Persistence**
   ```
   Read .claude/context/session.json to understand:
   - How long the session has been active
   - Which agents have been working
   - What files have been modified
   - Current task being worked on
   ```

3. **Review Vocabulary Learning**
   ```
   Check .claude/context/vocabulary.json for:
   - User's preferred terminology
   - Domain-specific language
   - Project conventions
   ```

### During Task Execution
1. **Update Context Continuously**
   - Write decisions to shared-context.json immediately
   - Update session with current activity
   - Add new vocabulary terms as discovered

2. **Coordinate with Other Agents**
   - Check if other agents have relevant decisions
   - Build on existing work, don't duplicate
   - Leave clear handoff notes for next agent

### Before Task Completion
1. **Write Final Context**
   ```json
   {
     "agent_decisions": {
       "[your-agent-name]": {
         "timestamp": "ISO-8601",
         "decisions": [
           {
             "type": "api_design|ui_component|architecture|etc",
             "description": "What was decided",
             "data": { /* specific details */ }
           }
         ]
       }
     }
   }
   ```

2. **Update Task Lists**
   - Move completed tasks to tasks_completed
   - Add any new discovered tasks to tasks_pending
   - Update session task count

## Context File Locations
- **Shared Context**: `.claude/context/shared-context.json`
- **Session Info**: `.claude/context/session.json`
- **Vocabulary**: `.claude/context/vocabulary.json`
- **Context Triggers**: `.claude/context-triggers.md`

## Critical Rules
1. **NEVER** start work without reading context
2. **ALWAYS** update context after major decisions
3. **PRESERVE** other agents' context when updating
4. **COORDINATE** through shared context, not assumptions
5. **BUILD ON** existing work, don't replace it

## Example Context Usage

### Reading Context (Start of Task)
```typescript
// Check what Backend Architect already designed
const context = JSON.parse(fs.readFileSync('.claude/context/shared-context.json'));
const apiEndpoints = context.api_design?.endpoints || [];
const sharedTypes = context.shared_types || {};
```

### Writing Context (After Decision)
```typescript
// Add your UI component decision
context.ui_components = context.ui_components || [];
context.ui_components.push({
  name: "UserDashboard",
  type: "page",
  api_dependencies: ["/api/users/profile", "/api/users/stats"],
  state_management: "zustand"
});

// Update agent decisions
context.agent_decisions["frontend-ui-developer"] = {
  timestamp: new Date().toISOString(),
  decisions: [{
    type: "component_architecture",
    description: "Created dashboard with real-time updates",
    data: { components: ["UserDashboard", "StatsWidget"] }
  }]
};
```

## Session Continuity Protocol

When any agent starts:
1. Check if session exists
2. If yes, read previous context and continue
3. If no, initialize new session
4. Always maintain session_id consistency

This ensures every agent interaction builds on previous work, creating a coherent development flow across all CLI invocations.
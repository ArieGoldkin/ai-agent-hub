# AI Agent Hub - Testing Workflow

This document provides a complete testing workflow to validate your ai-agent-hub installation.

**Prerequisites:** You've run `npx ai-agent-hub@latest` and installation is complete.

---

## 🎯 Testing Scenario: Task Manager Application

We'll build a simple **Task Manager** with a REST API backend and React frontend. This scenario exercises:
- Multiple agents (backend, frontend, code review)
- Multiple skills (API design, testing, security)
- All 3 core MCP servers
- Context sharing between agents

**Estimated time:** 30-60 minutes

---

## ✅ Pre-Test Verification

Before starting, verify your installation:

### 1. Check Installed Files
```bash
# Should exist:
ls -la .claude/agents/          # 9 agent files
ls -la .claude/instructions/    # Including mcp-optimization.md
ls -la skills/                  # 14 skill folders
cat CLAUDE.md                   # Should show 3 MCP servers
cat .mcp.json                   # Should have memory, sequential-thinking, context7
```

### 2. Verify MCP Servers
```bash
# In Claude Code, run:
/context
```

**Expected output:**
- 3 MCP servers active: memory, sequential-thinking, context7
- ~7,000 tokens from MCP (not ~30,000)

### 3. Check Generated CLAUDE.md
```bash
cat CLAUDE.md | grep -A 10 "MCP Servers"
```

**Should show:**
- 3 core servers listed
- Optional servers mentioned (browsermcp, shadcn)
- Reference to `.claude/instructions/mcp-optimization.md`

---

## 📋 Testing Workflow

### Phase 1: Backend API Design (15-20 min)

**Objective:** Test backend-system-architect agent + api-design-framework skill

#### Step 1: Start Backend Design
Open Claude Code and give this prompt:

```
I need to design a REST API for a task manager application.

Requirements:
- CRUD operations for tasks (create, read, update, delete)
- Task fields: id, title, description, status, priority, createdAt
- User authentication (simple JWT)
- PostgreSQL database

Please design the API structure following REST best practices.
```

#### Expected Behavior:
✅ **Agent Auto-Detection:** backend-system-architect should activate (check for agent mention)
✅ **Agent File Loaded:** Claude reads `.claude/agents/backend-system-architect.md` for implementation protocols
✅ **Skill Reference:** Claude reads `/skills/api-design-framework/SKILL.md` for guidance
✅ **MCP Usage:** sequential-thinking for complex architectural decisions
✅ **Context Recording:** Check `.claude/context/shared-context.json` gets updated
✅ **Quality Gate (v3.5.5+):** code-quality-reviewer auto-invokes after implementation
✅ **Validation:** Linting, security scans, and best practices checked automatically

#### Validation:
```bash
# Check if context was recorded
cat .claude/context/shared-context.json | jq '.decisions'

# Verify agent was used
# Claude should mention: "Using backend-system-architect" or similar
```

---

#### Step 2: Request Database Schema
Continue the conversation:

```
Now design the PostgreSQL database schema with migrations.
Reference the database-schema-designer skill documentation for best practices.
```

#### Expected Behavior:
✅ **Skill Reference:** Claude reads `/skills/database-schema-designer/SKILL.md` for templates
✅ **MCP Usage:** memory recalls previous API design decisions
✅ **Output:** SQL migration files or schema definitions

---

### Phase 2: Frontend UI Design (15-20 min)

**Objective:** Test frontend-ui-developer + rapid-ui-designer agents

#### Step 3: Design React UI
New prompt in same session (tests context sharing):

```
Build a React frontend for the task manager API we just designed.

Requirements:
- Task list view with filters (status, priority)
- Create/edit task form
- Use React hooks and modern patterns
- Tailwind CSS for styling
- Responsive design

The backend API endpoints are the ones we designed earlier.
```

#### Expected Behavior:
✅ **Context Awareness:** Agent remembers API endpoints from Phase 1
✅ **Agent Auto-Detection:** frontend-ui-developer activates
✅ **Agent File Loaded:** Claude reads `.claude/agents/frontend-ui-developer.md` for implementation protocols
✅ **Skill Reference:** Claude may read `/skills/design-system-starter/SKILL.md` for patterns
✅ **MCP Usage:** memory retrieves backend API structure
✅ **Shared Context:** Mentions specific endpoints from Phase 1
✅ **Quality Gate (v3.5.5+):** code-quality-reviewer auto-invokes after component implementation
✅ **Validation:** ESLint, TypeScript, and component rules checked automatically

#### Validation:
```bash
# Check context contains both backend and frontend decisions
cat .claude/context/shared-context.json | jq '.decisions[] | select(.agent | contains("frontend"))'
```

---

#### Step 4: Request UI Component Design
Continue:

```
Create a detailed design for the TaskCard component.
Use rapid-ui-designer principles for a delightful UX.
```

#### Expected Behavior:
✅ **Agent Switch:** rapid-ui-designer may activate for design focus
✅ **Design Patterns:** Component architecture, state management
✅ **Visual Guidance:** Layout, spacing, colors

---

### Phase 3: Manual Quality Review - Optional (10-15 min)

**Objective:** Test manual invocation of code-quality-reviewer + security-checklist skill

**Note (v3.5.5+):** Automatic quality gates already triggered after Phase 1 (backend) and Phase 2 (frontend) implementations. This phase tests **manual re-invocation** for comprehensive audits beyond automatic checks.

#### Step 5: Comprehensive Security Audit
New prompt:

```
Perform a comprehensive security audit of the entire Task Manager application (backend + frontend).

Go beyond the automatic quality checks that already ran and focus on:
- Architecture-level security vulnerabilities
- Authentication flow analysis
- Advanced SQL injection vectors
- XSS and CSRF attack surfaces
- OWASP Top 10 compliance review
- Security best practices documentation

Reference the security-checklist skill for comprehensive audit guidance.
```

#### Expected Behavior:
✅ **Previous Quality Gates:** Automatic linting/security scans already completed in Phase 1 & 2
✅ **Manual Re-Invocation:** code-quality-reviewer activates for deeper analysis
✅ **Agent File Loaded:** Claude reads `.claude/agents/code-quality-reviewer.md`
✅ **Skill Reference:** Claude reads `/skills/security-checklist/SKILL.md` for audit templates
✅ **MCP Usage:** sequential-thinking for comprehensive analysis
✅ **Evidence Collection:** Security findings with severity levels
✅ **Actionable Output:** Specific recommendations with code examples
✅ **Comparison:** May reference issues already found in automatic checks

#### Validation:
```bash
# Check for security evidence in context
cat .claude/context/shared-context.json | jq '.evidence[] | select(.type | contains("security"))'
```

---

### Phase 4: Testing Strategy (10 min)

**Objective:** Test testing-strategy-builder skill

#### Step 6: Create Test Plan
New prompt:

```
Create a comprehensive testing strategy for the Task Manager application.

Include:
- Unit tests for API endpoints
- Integration tests for database
- Frontend component tests
- E2E tests for critical flows
- Test coverage targets

Reference the testing-strategy-builder skill for comprehensive test planning.
```

#### Expected Behavior:
✅ **Skill Reference:** Claude reads `/skills/testing-strategy-builder/SKILL.md` for test templates
✅ **MCP Usage:** memory recalls all components from previous phases
✅ **Comprehensive Output:** Test plan covering backend, frontend, integration
✅ **Context Integration:** References specific components discussed earlier

---

## 🔍 MCP Server Monitoring

Throughout the workflow, periodically check MCP usage:

### Monitor Active MCP Servers
```bash
# In Claude Code:
/context
```

**What to verify:**

1. **memory** - Should show stored information:
   - API endpoint designs
   - Component structures
   - Security findings

2. **sequential-thinking** - Used for:
   - Complex architectural decisions
   - Security analysis
   - Multi-step reasoning

3. **context7** - Used when:
   - Looking up React/Next.js patterns
   - Database best practices
   - Framework documentation

### Token Budget Verification
```
/context
```

**Expected:**
- Total MCP overhead: ~7,000 tokens
- NOT ~30,000+ tokens
- Breakdown showing 3 servers

---

## 📊 Validation Checklist

After completing the workflow, verify:

### ✅ Agent System
- [ ] At least 3 different agents activated (backend, frontend, code-quality)
- [ ] Agents auto-detected based on task keywords
- [ ] Agent names mentioned in Claude's responses
- [ ] Appropriate agents for each task type
- [ ] **Agent definition files loaded** (`.claude/agents/<name>.md`) [v3.5.4]
- [ ] **code-quality-reviewer auto-invoked** after implementations [v3.5.5]
- [ ] **Quality checks passed** (linting, security scans, best practices) [v3.5.5]

### ✅ Skills System
- [ ] At least 3 skills loaded (api-design, security-checklist, testing-strategy)
- [ ] Skills loaded progressively (metadata → full content)
- [ ] Skill templates/checklists used in responses
- [ ] Skills referenced in agent reasoning

### ✅ MCP Servers
- [ ] Only 3 core servers active (memory, sequential-thinking, context7)
- [ ] Total MCP tokens ~7,000 (not ~30,000)
- [ ] memory preserved context across conversation
- [ ] sequential-thinking used for complex reasoning
- [ ] context7 consulted for framework docs

### ✅ Context System
- [ ] `.claude/context/shared-context.json` updated throughout
- [ ] Decisions recorded with agent attribution
- [ ] Evidence collected (security findings, test coverage)
- [ ] Context shared between agents (frontend knew about backend API)
- [ ] Session state persisted

### ✅ Documentation
- [ ] CLAUDE.md shows 3 MCP servers
- [ ] `.claude/instructions/mcp-optimization.md` exists
- [ ] mcp-optimization.md explains task-based server usage
- [ ] Generated CLAUDE.md references all instruction files

---

## 🧪 Advanced Testing (Optional)

### Test 1: Add Task-Specific MCP Server

**Scenario:** Need browser automation for testing

**Steps:**
1. Read `.claude/instructions/mcp-optimization.md`
2. Add browsermcp to `.mcp.json`:
   ```json
   {
     "mcpServers": {
       "memory": { ... },
       "sequential-thinking": { ... },
       "context7": { ... },
       "browsermcp": {
         "command": "npx",
         "args": ["@browsermcp/mcp@latest"]
       }
     }
   }
   ```
3. Restart Claude Code
4. Verify with `/context` (should show 4 servers now)
5. Ask Claude to "test the task manager UI in a browser"

**Expected:** browsermcp activates for browser automation

---

### Test 2: Squad Mode (Parallel Execution)

If you installed with Squad mode:

**Prompt:**
```
I need to build a complete task manager app with:
1. REST API (Node.js + Express)
2. React frontend with Tailwind
3. PostgreSQL database
4. Full test coverage
5. Security audit

Please allocate tasks to appropriate agents and execute in parallel.
```

**Expected:**
- `/allocate-tasks-parallel` suggestion
- Multiple agents work simultaneously
- Context coordination via `.squad/` folder
- Faster completion vs. sequential

---

### Test 3: MCP Token Budget

**Test removing a core server:**

1. Comment out `context7` in `.mcp.json`
2. Restart Claude Code
3. Run `/context`
4. Verify token reduction (~2k fewer tokens)
5. Test if documentation lookup still works (should fall back gracefully)

**Restore:**
```bash
# Uncomment context7 and restart
```

---

## 🐛 Troubleshooting

### Issue: No agents activating

**Check:**
```bash
ls -la .claude/agents/
cat .claude/instructions/orchestration.md
```

**Solution:** Ensure orchestration instructions were installed

---

### Issue: MCP servers showing 6+ servers

**Check:**
```bash
cat .mcp.json
```

**Solution:** You may have an old `.mcp.json`. Reinstall or manually update to 3 servers.

---

### Issue: Skills not loading

**Check:**
```bash
ls -la skills/
cat skills/api-design-framework/SKILL.md
```

**Solution:** Ensure skills directory was installed with metadata files.

---

### Issue: Context not persisting

**Check:**
```bash
cat .claude/context/shared-context.json
cat .claude/context/session.json
```

**Solution:** Ensure context files are writable and not corrupted.

---

## 📈 Success Criteria

Your ai-agent-hub installation is working correctly if:

✅ **Agents** - Multiple agents activated based on task type
✅ **Skills** - Skills loaded progressively with templates/checklists
✅ **MCP** - Only 3 core servers (~7k tokens, not ~30k)
✅ **Context** - Information shared between agents across conversation
✅ **Documentation** - All instruction files present and referenced
✅ **Optimization** - mcp-optimization.md guides task-based MCP usage

---

## 🎯 Next Steps After Testing

Once testing is complete:

1. **Delete test repository** (or keep for reference)
2. **Install in real project:** `npx ai-agent-hub@latest`
3. **Choose appropriate mode:**
   - Classic: Learning, exploration, small tasks
   - Squad: Production apps, tight deadlines, parallel work
4. **Customize MCP servers** based on your stack:
   - Add `browsermcp` for UI testing
   - Add `shadcn` for component library work
   - Add `postgres` if using PostgreSQL
5. **Read** `.claude/instructions/mcp-optimization.md` for advanced patterns

---

## 📚 Reference

- **MCP Optimization:** `.claude/instructions/mcp-optimization.md`
- **Agent Capabilities:** `.claude/instructions/agents.md`
- **Orchestration:** `.claude/instructions/orchestration.md`
- **Context System:** `.claude/instructions/context.md`
- **Workflows:** `.claude/instructions/workflows.md`

---

## 🔗 Feedback

If you encounter issues during testing:

1. Check git logs for recent changes: `git log --oneline`
2. Review installation output
3. Verify all files exist (see Pre-Test Verification)
4. Open an issue: https://github.com/ArieGoldkin/ai-agent-hub/issues

---

*This testing workflow validates ai-agent-hub v3.5.5+ with agent activation protocol, mandatory quality gates, and MCP optimization.*

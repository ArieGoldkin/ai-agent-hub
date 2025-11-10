# Review: v3.5.3 Changes - Anthropic Best Practices Implementation

## Summary
Implemented directive language patterns from official Anthropic documentation (2025) to fix agent activation and context awareness issues.

---

## Change 1: Version Update

**Before:**
```
version: 3.5.0
```

**After:**
```
version: 3.5.3
```

---

## Change 2: Header Section (Renamed + Directive Language)

**Before:**
```markdown
## 📋 Dynamic Instruction Loading

This project uses a modular instruction system to optimize token usage.

**IMPORTANT**: Load instructions dynamically based on the task:
```

**After:**
```markdown
## 📋 Modular Instruction System

This project uses specialized instruction files to optimize tokens while maintaining agent capabilities.

**YOU MUST** follow the agent activation protocol below for every task.
```

**Why:** Anthropic recommends "YOU MUST" for mandatory actions vs. passive "IMPORTANT"

---

## Change 3: Instruction Files Table (Simplified)

**Before:**
```markdown
### 📁 Available Instruction Modules

| Module | Purpose | When to Load |
|--------|---------|--------------|
| `.claude/instructions/orchestration.md` | Routing & coordination | Complex tasks, multi-agent work |
| `.claude/instructions/agents.md` | Agent capabilities | When invoking specific agents |
...
```

**After:**
```markdown
### 📁 Available Instruction Files

| File | Contains |
|------|----------|
| `.claude/instructions/orchestration.md` | Agent routing & coordination rules |
| `.claude/instructions/agents.md` | Full agent capabilities & specializations |
...
```

**Why:** Removed "When to Load" column - this is now handled by the MANDATORY protocol below

---

## Change 4: MAJOR - Agent Activation Protocol (NEW SECTION)

**Before (passive suggestions):**
```markdown
## 🎯 Quick Start

1. **Simple tasks**: Work directly without loading extra instructions
2. **Agent work**: Read `.claude/instructions/agents.md` for capabilities
3. **Complex projects**: Read `.claude/instructions/orchestration.md` for routing
4. **Multi-session**: Read `.claude/instructions/context.md` for continuity
5. **CLI usage**: Read `.claude/instructions/cli-integration.md` for auto-detection

## 🔍 Auto-Detection

Check `.claude/context-triggers.md` for keyword-based agent activation.
For semantic routing beyond keywords, load `.claude/instructions/orchestration.md`.
```

**After (directive protocol):**
```markdown
## ⚡ MANDATORY: Agent Activation Protocol

**BEFORE responding to ANY user task, YOU MUST execute this protocol:**

### Step 1: Check for Agent Triggers
Read `.claude/context-triggers.md` and check if the user's request contains keywords matching any agent.

### Step 2: Activate Matching Agent(s)
**IF keywords match** → Read `.claude/instructions/orchestration.md` and activate the specialist agent(s).
**IF multi-domain task** (e.g., "build app", "full project") → Activate Studio Coach to coordinate agents.
**IF no match** → Proceed with general capabilities, but remain alert for implicit domain signals.

### Step 3: Load Context Protocol (When Using Agents)
**WHEN agent is activated** → Read `.claude/instructions/context-middleware.md` for context management rules.
**ALWAYS** record decisions, evidence, and actions to `.claude/context/shared-context.json`.

### Examples of Trigger Matching
- User says "design REST API" → **Backend System Architect** (keywords: API, REST, backend)
- User says "create React component" → **Frontend UI Developer** (keywords: React, component, UI)
- User says "build task manager app" → **Studio Coach** coordinates multiple agents (multi-domain)
```

**Why:**
- Anthropic pattern: "BEFORE responding to ANY task, YOU MUST..."
- Step-by-step protocol with IF/THEN conditions
- Concrete examples showing keyword → agent mapping
- Removes "Work directly without loading" which discouraged activation

---

## Change 5: Context Awareness → Context Protocol

**Before:**
```markdown
## 🧠 Context Awareness (AUTOMATIC)

- **ALL agents auto-load** `.claude/instructions/context-middleware.md`
- Session data: `.claude/context/shared-context.json`
- Context protocol is **mandatory** - agents read/write context automatically
- For full context rules: Read `.claude/instructions/context.md`
- No configuration needed - works out of the box
```

**After:**
```markdown
## 🧠 IMPORTANT: Context Protocol

**WHEN working with activated agents, YOU MUST:**

1. **Read** `.claude/instructions/context-middleware.md` before agent work begins
2. **Record** all decisions, architectural choices, and evidence to `.claude/context/shared-context.json`
3. **Check** existing context at session start to maintain continuity across conversations
4. **Share** context between agents when coordinating multi-agent tasks

**Context file location:** `.claude/context/shared-context.json`
**Full protocol details:** Read `.claude/instructions/context.md` for advanced scenarios
```

**Why:**
- Removed misleading "AUTO-LOAD" claim (nothing actually auto-loads)
- Changed to "WHEN agent is activated" (accurate trigger)
- "YOU MUST" with numbered action items (Anthropic pattern)
- Action verbs: Read, Record, Check, Share

---

## Change 6: Skills Usage

**Before:**
```markdown
**How it works:**
- **Reference documentation** - Claude reads `/skills/<skill-name>/SKILL.md` when needed
- **Progressive disclosure** - Metadata → SKILL.md → bundled resources
- **Templates & checklists** - Includes examples, patterns, and best practices
- **Usage** - Read skill files when tasks match skill descriptions above
```

**After:**
```markdown
**How to use skills:**
- **PROACTIVELY read** `/skills/<skill-name>/SKILL.md` when the user's task matches the skill description
- **Progressive loading** - Start with SKILL.md, then access templates/examples as needed
- **Apply patterns** - Use templates, checklists, and best practices from skill files
- **Examples:** API design task → read `api-design-framework/SKILL.md`; Security review → read `security-checklist/SKILL.md`
```

**Why:**
- "PROACTIVELY read" aligns with Anthropic's subagent documentation
- Concrete examples of task → skill mapping

---

## Change 7: Footer Attribution

**Before:**
```markdown
*💡 This minimal CLAUDE.md saves ~80% context tokens through dynamic loading*
```

**After:**
```markdown
*💡 This CLAUDE.md uses directive language patterns from Anthropic best practices (2025) to ensure proactive agent activation and context awareness while saving ~80% tokens through on-demand instruction loading.*
```

**Why:** Credits Anthropic's official patterns, explains the approach

---

## Key Language Pattern Changes

| Before (Passive) | After (Directive) | Anthropic Pattern |
|------------------|-------------------|-------------------|
| "Check..." | "YOU MUST read..." | ✅ Imperative |
| "Load instructions dynamically" | "BEFORE responding, execute protocol" | ✅ Conditional trigger |
| "AUTO-LOADED" | "WHEN agent is activated" | ✅ Accurate condition |
| "Work directly without loading" | (Removed) | ✅ Encourages activation |
| "when needed" | "PROACTIVELY read" | ✅ Action-oriented |
| "Check for activation" | "Read triggers and activate" | ✅ Specific steps |

---

## Expected Impact

### Your Test Case: "I need to design a REST API for a task manager"

**Current Behavior (v3.5.2):**
- ❌ Never reads context-triggers.md
- ❌ No agent activation
- ❌ No context recording
- ✅ Reads skills (already working)

**Expected Behavior (v3.5.3):**
1. ✅ Reads `.claude/context-triggers.md` (MANDATORY protocol Step 1)
2. ✅ Matches keywords: "REST API", "database" → Backend System Architect
3. ✅ Reads `.claude/instructions/orchestration.md` (IF keywords match)
4. ✅ Activates backend-system-architect agent
5. ✅ Reads `.claude/instructions/context-middleware.md` (WHEN agent activated)
6. ✅ Records decisions to `shared-context.json` (ALWAYS)
7. ✅ Reads `/skills/api-design-framework/SKILL.md` (PROACTIVELY)

---

## Alignment with Anthropic Documentation

✅ **CLAUDE.md Best Practices** - Uses "IMPORTANT", "YOU MUST" emphasis
✅ **Subagent Documentation** - "use PROACTIVELY" pattern for skills
✅ **Prompt Engineering Guide** - Explicit direction for Claude 4.5 models
✅ **Action-Oriented Descriptions** - IF/THEN conditions, step-by-step protocol

---

## Files Modified

1. `lib/claude-md-generator/generators/modular/minimal-claudemd.ts` - Generator source
2. (Generated) User's `CLAUDE.md` - Output file created during installation

---

## Review Checklist

- [ ] Language is directive, not passive
- [ ] "YOU MUST" used for mandatory actions
- [ ] "PROACTIVELY" used for encouraged actions
- [ ] IF/THEN conditions are clear
- [ ] Step-by-step protocol is easy to follow
- [ ] Examples show concrete keyword → agent mapping
- [ ] No misleading "AUTO-LOAD" claims
- [ ] Trigger conditions are accurate (WHEN/IF)
- [ ] Version bumped to 3.5.3
- [ ] Credits Anthropic best practices

---

## Next Steps After Approval

1. Commit changes with descriptive message
2. Bump package.json to 3.5.3
3. Build TypeScript
4. Publish to NPM
5. Test with original workflow scenario
6. Validate agent activation works

---

**Ready to proceed?** Review the changes above and let me know if you'd like any adjustments before committing.

---
name: claude-main
description: AI Agent Hub - Modular Intelligence System
version: 3.4.2
---

# 🚀 AI Agent Hub - Intelligent Orchestration

**Mode**: 📚 Classic (Sequential)

## 📋 Dynamic Instruction Loading

This project uses a modular instruction system to optimize token usage.

**IMPORTANT**: Load instructions dynamically based on the task:

### 📁 Available Instruction Modules

| Module | Purpose | When to Load |
|--------|---------|--------------|
| `.claude/instructions/orchestration.md` | Routing & coordination | Complex tasks, multi-agent work |
| `.claude/instructions/agents.md` | Agent capabilities | When invoking specific agents |
| `.claude/instructions/context.md` | Context system | Session continuity, handoffs |
| `.claude/instructions/workflows.md` | Workflow patterns | Multi-step projects |
| `.claude/instructions/context-middleware.md` | **AUTO-LOADED** Context protocol | Always active for ALL agents |

## 🎯 Quick Start

1. **Simple tasks**: Work directly without loading extra instructions
2. **Agent work**: Read `.claude/instructions/agents.md` for capabilities
3. **Complex projects**: Read `.claude/instructions/orchestration.md` for routing
4. **Multi-session**: Read `.claude/instructions/context.md` for continuity

## 🔍 Auto-Detection

Check `.claude/context-triggers.md` for keyword-based agent activation.
For semantic routing beyond keywords, load `.claude/instructions/orchestration.md`.

## 👥 Available Agents

- **ai-ml-engineer**
- **backend-system-architect**
- **code-quality-reviewer**
- **frontend-ui-developer**
- **rapid-ui-designer**
- **sprint-prioritizer**
- **studio-coach**
- **ux-researcher**
- **whimsy-injector**

## 📚 Claude Code Skills

Specialized knowledge modules installed in `/skills/` directory:

| Skill | Use When |
|-------|----------|
| **architecture-decision-record** | Documenting architectural decisions (ADRs) |
| **api-design-framework** | Designing REST/GraphQL/gRPC APIs |
| **testing-strategy-builder** | Building test plans and coverage strategies |
| **code-review-playbook** | Conducting code reviews with conventional comments |
| **design-system-starter** | Creating design systems, tokens, components |
| **database-schema-designer** | Designing SQL/NoSQL schemas and migrations |
| **security-checklist** | Security audits, OWASP Top 10 compliance |

**How it works:**
- Skills use progressive disclosure (metadata → SKILL.md → bundled resources)
- Includes templates, checklists, references, and examples
- Load automatically when Claude detects relevant tasks
- Location: Check `/skills/<skill-name>/SKILL.md` for details

## 🧠 Context Awareness (AUTOMATIC)

- **ALL agents auto-load** `.claude/instructions/context-middleware.md`
- Session data: `.claude/context/shared-context.json`
- Context protocol is **mandatory** - agents read/write context automatically
- For full context rules: Read `.claude/instructions/context.md`
- No configuration needed - works out of the box

## ⚙️ MCP Servers

Configured in `.mcp.json` - includes memory, thinking, browsing, and more.

---
*💡 This minimal CLAUDE.md saves ~80% context tokens through dynamic loading*
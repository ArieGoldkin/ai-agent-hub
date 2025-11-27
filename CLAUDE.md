---
name: claude-main
description: AI Agent Hub - Source Repository (Package Development)
version: 3.7.0
scope: development
---

# 🚀 AI Agent Hub - Source Repository

> **⚠️ REPOSITORY SCOPE**
>
> This is the **source repository** for developing the ai-agent-hub NPM package.
>
> **No `.claude/` folder exists in this repo** - it's gitignored and not published.
> The installation script CREATES `.claude/` for users from `/agents/`, `/assets/`, and `/skills/`.

---

## 📦 Quick Overview

This repository builds the NPM package: `npx ai-agent-hub@latest`

**Source Structure:**
```
/agents/        # 10 agent personality definitions (source)
/assets/        # Instruction templates (source)
/skills/        # 18 knowledge modules (source)
/lib/           # TypeScript CLI & generators
/bin/           # CLI entry point
/.squad/        # Squad mode orchestration
```

**Installation Creates** (v3.5.9+ unified structure):
```
.claude/
├── agents/              # Copied from /agents/
├── instructions/        # Copied from /assets/ (+ squad files)
├── skills/              # Copied from /skills/
├── context/             # Initialized fresh
├── commands/            # Squad mode only
├── examples/            # Squad mode only
└── settings.local.json

CLAUDE.md               # Generated dynamically
.mcp.json               # MCP server config
```

---

## 🛠️ Common Development Tasks

### Quick Commands

```bash
# Build
npm run build

# Test Installation (Classic)
node dist/bin/cli.js --project-only --mode classic

# Test Installation (Squad)
node dist/bin/cli.js --project-only --mode squad

# Test Migration
node dist/bin/cli.js migrate

# Publish
npm version [patch|minor|major]
npm publish
```

### Quick Edits

| Task | Location | Notes |
|------|----------|-------|
| Add/edit agent | `/agents/*.md` | Update count in help.ts, setup.ts |
| Add/edit instruction | `/assets/instructions/*.md` | Auto-copied on install |
| Add/edit skill | `/skills/*/SKILL.md` | Update count in skills-installer.ts |
| Modify CLI | `/bin/` or `/lib/` | Run `npm run build` after |
| Modify CLAUDE.md gen | `/lib/claude-md-generator/` | Test both modes |
| Update squad mode | `/.squad/` | Verify file locations |

---

## 📚 Detailed Documentation

For comprehensive guides, see the `docs/` folder:

| Document | Purpose |
|----------|---------|
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System architecture, components, installation flow |
| **[DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md)** | Development workflow, testing, publishing checklist |
| **[migrations/v3.5.9-structure-update.md](docs/migrations/v3.5.9-structure-update.md)** | v3.5.9 migration guide, troubleshooting |
| [PRODUCTION-GUIDE.md](docs/PRODUCTION-GUIDE.md) | Production deployment patterns |
| [TOKEN-OPTIMIZATION-ANALYSIS.md](docs/TOKEN-OPTIMIZATION-ANALYSIS.md) | Performance analysis |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## ⚡ Quick Reference

### Package Components (v3.7.0)

- **Agents**: 10 specialists (ai-ml-engineer, backend-system-architect, code-quality-reviewer, frontend-ui-developer, product-manager, rapid-ui-designer, sprint-prioritizer, studio-coach, ux-researcher, whimsy-injector)
- **Skills**: 18 modules (ai-native-development, api-design-framework, architecture-decision-record, brainstorming, code-review-playbook, database-schema-designer, design-system-starter, devops-deployment, edge-computing-patterns, evidence-verification, observability-monitoring, performance-optimization, quality-gates, react-server-components-framework, security-checklist, streaming-api-patterns, testing-strategy-builder, type-safety-validation)
- **Modes**: Classic (sequential) + Squad (parallel, 97% token reduction)

### File Paths (Always Use These)

- ✅ Skills: `.claude/skills/` (never root `skills/`)
- ✅ Squad files: `.claude/instructions/` (never `.claude/` root)
- ✅ Agents: `.claude/agents/`
- ✅ Instructions: `.claude/instructions/`

### Version Checklist

When bumping version, update:
- [ ] `package.json` (use `npm version`)
- [ ] `bin/cli.ts` (CURRENT_VERSION)
- [ ] `lib/claude-md-generator/generators/modular/minimal-claudemd.ts` (frontmatter)
- [ ] Root `CLAUDE.md` (frontmatter) - this file
- [ ] `CHANGELOG.md` (add entry)

---

## 🎨 AI-Specific Instructions

### UI & Frontend Design

When asked to design UI & frontend interfaces, load `.claude/instructions/super-design.md` for detailed design workflows, styling guidelines, and tool integration.

### Context System

When working on this codebase:
- Review existing context in `.claude/context/shared-context.json` (if testing locally)
- Record architectural decisions
- Document significant changes
- Maintain consistency with established patterns

---

## 📖 Documentation Structure

```
docs/
├── ARCHITECTURE.md              # System architecture & components
├── DEVELOPMENT-GUIDE.md         # Development workflow & checklist
├── PRODUCTION-GUIDE.md          # Production deployment
├── TOKEN-OPTIMIZATION-ANALYSIS.md  # Performance analysis
├── migrations/
│   └── v3.5.9-structure-update.md  # Version-specific migration
└── [other guides]
```

**Reading Guide:**
1. Start: [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Understand the system
2. Develop: [DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md) - How to build
3. Migrate: [migrations/](docs/migrations/) - Version-specific changes

---

## 🔄 Recent Changes

### v3.7.0 (2025-11-27) - New Skills & Optimization

**Major Changes:**
- ✅ 3 new skills: devops-deployment, performance-optimization, observability-monitoring
- ✅ Skills restructured with templates/ folders (70%+ size reduction)
- ✅ Squad Mode token optimization (46% reduction)
- ✅ Agent templates optimization (11% reduction)
- ✅ ESLint complexity fixes with helper function extraction
- ✅ Total skills: 18 (was 15)

### v3.5.9 (2025-01-18) - Structure Update

**Major Changes:**
- ✅ Skills moved to `.claude/skills/` (from root `skills/`)
- ✅ Squad files unified in `.claude/instructions/`
- ✅ Migration command: `npx ai-agent-hub migrate`
- ✅ All 10 agents listed

**Details**: See [migrations/v3.5.9-structure-update.md](docs/migrations/v3.5.9-structure-update.md)

---

*💡 This CLAUDE.md is for package development.*
*User installations get auto-generated configuration.*
*For detailed documentation, see `docs/` folder.*

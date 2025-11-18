# AI Agent Hub - Development Guide

> **Version**: 3.5.9
> **Last Updated**: 2025-01-18

This guide provides step-by-step instructions for developing, testing, and publishing the ai-agent-hub NPM package.

---

## 🎯 Development Workflow

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn
- TypeScript knowledge
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/ArieGoldkin/ai-agent-hub.git
cd ai-agent-hub

# Install dependencies
npm install

# Build project
npm run build
```

---

## 🛠️ Common Development Tasks

### 1. Adding a New Agent

**Location**: `/agents/`

**Steps**:
1. Create new file: `/agents/my-new-agent.md`
2. Define agent personality and capabilities
3. Add metadata (name, description, keywords)
4. Register in agent copier: `bin/commands/components/agent-copier.ts`
5. Update agent count in:
   - `bin/commands/help.ts`
   - `bin/commands/setup.ts`
   - `CLAUDE.md` (root)
   - `README.md`
6. For Squad mode, create slim template in `/.squad/templates/`
7. Test installation

**Example Structure**:
```markdown
---
name: my-new-agent
description: Brief description
keywords: [keyword1, keyword2]
---

# Agent Name

## Core Capabilities
[Define what the agent does]

## When to Activate
[Keywords and scenarios]
```

### 2. Updating Instructions

**Location**: `/assets/instructions/`

**Steps**:
1. Edit file: `/assets/instructions/my-instruction.md`
2. Changes automatically copied during next installation
3. Test with both classic and squad modes
4. Update CLAUDE.md generator if instruction is new

**Files**:
- `orchestration.md` - Agent routing
- `agents.md` - Agent reference
- `context.md` - Context system
- `workflows.md` - Multi-step patterns
- `context-middleware.md` - Context protocol
- `cli-integration.md` - CLI behavior
- `super-design.md` - UI design workflow

### 3. Creating a New Skill

**Location**: `/skills/`

**Steps**:
1. Create directory: `/skills/my-skill/`
2. Create `SKILL.md` with frontmatter metadata
3. Add templates, references, checklists as needed
4. Update skill count in:
   - `bin/commands/install-agents/skills-installer.ts`
   - `lib/claude-md-generator/generators/modular/minimal-claudemd.ts`
   - `README.md`
5. Test installation

**SKILL.md Structure**:
```markdown
---
name: my-skill
description: What this skill provides
version: 1.0.0
author: AI Agent Hub
tags: [tag1, tag2, tag3]
---

# Skill Name

## Overview
[What this skill does]

## When to Use This Skill
[Use cases]

## Core Framework
[Main content]
```

### 4. Modifying Squad Mode

**Location**: `/.squad/`

**Components**:
- `/.squad/templates/` - Slim agent templates
- `/.squad/analysis/` - Agent core analysis
- `/.squad/commands/` - Parallel execution commands
- `/.squad/examples/` - Workflow examples
- `/.squad/supervisor-rules.md` - Orchestration rules
- `/.squad/squad-roster.md` - Agent assignments
- `/.squad/communication-protocol.md` - Messaging protocol
- `/.squad/parallel-execution-rules.md` - Conflict prevention

**Steps**:
1. Edit relevant files in `/.squad/`
2. Update squad installer if file structure changes
3. Test squad mode installation
4. Verify files land in correct `.claude/` locations

### 5. Updating CLAUDE.md Generator

**Location**: `/lib/claude-md-generator/`

**Key Files**:
- `generators/modular/minimal-claudemd.ts` - Main generator
- `generators/modular/orchestration-instructions.ts` - Orchestration
- `generators/modular/agents-instructions.ts` - Agent reference
- `generators/modular/context-instructions.ts` - Context system
- `generators/modular/workflows-instructions.ts` - Workflows

**Steps**:
1. Edit TypeScript generator files
2. Run `npm run build`
3. Test with: `node dist/bin/cli.js --project-only`
4. Verify generated CLAUDE.md content
5. Check both classic and squad modes

### 6. Testing Installation Locally

**Test Fresh Installation**:
```bash
# Build latest changes
npm run build

# Test in temporary directory
cd /tmp
mkdir test-install && cd test-install

# Run installation
node /path/to/ai-agent-hub/dist/bin/cli.js --project-only --mode classic

# Verify structure
ls -la .claude/
ls .claude/agents/      # Should have 10 agents
ls .claude/skills/      # Should have 14 skills
ls .claude/instructions/  # Should have core instructions

# Test squad mode
rm -rf .claude .mcp.json CLAUDE.md
node /path/to/ai-agent-hub/dist/bin/cli.js --project-only --mode squad

# Verify squad files
ls .claude/instructions/  # Should include 5 squad files
ls .claude/commands/      # Should have parallel commands
ls .claude/examples/      # Should have examples
```

**Test Migration Command** (v3.5.9+):
```bash
# Create old structure
cd /tmp
mkdir test-migration && cd test-migration
mkdir -p skills .claude
touch .claude/supervisor-rules.md
mkdir skills/test-skill

# Run migration
node /path/to/ai-agent-hub/dist/bin/cli.js migrate

# Verify
ls -la .claude/
test -d .claude/skills && echo "✅ Skills moved"
test -f .claude/instructions/supervisor-rules.md && echo "✅ Squad file moved"
test ! -d skills && echo "✅ Root skills removed"
```

### 7. Publishing to NPM

**Pre-publish Checklist**:
- [ ] All tests passing (`npm run build`)
- [ ] Version bumped in all files (see checklist below)
- [ ] CHANGELOG.md updated
- [ ] Installation tested (classic + squad)
- [ ] Migration tested (if applicable)
- [ ] README.md reflects changes
- [ ] No debugging code left in source

**Publishing Steps**:
```bash
# 1. Ensure clean working directory
git status

# 2. Bump version (updates package.json)
npm version [patch|minor|major]
# Examples:
# npm version patch  # 3.5.9 -> 3.5.10
# npm version minor  # 3.5.9 -> 3.6.0
# npm version major  # 3.5.9 -> 4.0.0

# 3. Build for production
npm run clean
npm run build

# 4. Test the build
node dist/bin/cli.js --help

# 5. Publish to NPM
npm publish

# 6. Push to git
git push origin main
git push --tags

# 7. Create GitHub release (optional)
gh release create v3.5.9 --notes "See CHANGELOG.md"
```

---

## 📋 Development Checklist

Use this checklist when making changes to ensure consistency across the package.

### When Adding or Modifying Agents

- [ ] Update agent file in `/agents/`
- [ ] Register agent in `bin/commands/components/agent-copier.ts`
- [ ] Update agent count in `bin/commands/help.ts`
- [ ] Update agent count in `bin/commands/setup.ts`
- [ ] Update agent list in root `CLAUDE.md`
- [ ] Update agent list in `README.md`
- [ ] Create Squad template in `/.squad/templates/` (if applicable)
- [ ] Update `/.squad/squad-roster.md` (if applicable)
- [ ] Test classic mode installation
- [ ] Test squad mode installation

### When Adding or Modifying Skills

- [ ] Create/update skill in `/skills/my-skill/`
- [ ] Add SKILL.md with proper frontmatter
- [ ] Update count in `bin/commands/install-agents/skills-installer.ts`
- [ ] Update count in `lib/claude-md-generator/generators/modular/minimal-claudemd.ts`
- [ ] Add to skill list with description in `README.md`
- [ ] Test skill installation to `.claude/skills/`
- [ ] Verify progressive loading works

### When Bumping Version

- [ ] Update `package.json` (use `npm version`)
- [ ] Update `bin/cli.ts` (CURRENT_VERSION constant)
- [ ] Update `lib/claude-md-generator/generators/modular/minimal-claudemd.ts` (version in frontmatter)
- [ ] Update root `CLAUDE.md` (version in frontmatter)
- [ ] Update all `docs/*.md` headers (version + date)
- [ ] Add entry to `CHANGELOG.md`
- [ ] Tag git commit with version

### When Changing File Structure

- [ ] Update installation scripts in `/bin/commands/`
- [ ] Update CLAUDE.md generator references
- [ ] Update `docs/ARCHITECTURE.md`
- [ ] Create migration guide in `docs/migrations/`
- [ ] Update root `CLAUDE.md` quick reference
- [ ] Test fresh installation
- [ ] Test migration from old structure
- [ ] Update README.md with new paths

### Path References (v3.5.9+)

Always use these paths in code and documentation:

- ✅ **Skills**: `.claude/skills/` (never root `skills/`)
- ✅ **Squad files**: `.claude/instructions/` (never `.claude/` root)
- ✅ **Agents**: `.claude/agents/`
- ✅ **Instructions**: `.claude/instructions/`
- ✅ **Context**: `.claude/context/shared-context.json`
- ✅ **Settings**: `.claude/settings.local.json`

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

**Classic Mode**:
```bash
# Fresh installation
npm run build
cd /tmp/test-classic && rm -rf .claude CLAUDE.md .mcp.json
node /path/to/dist/bin/cli.js --project-only --mode classic

# Verify
[ -d .claude/agents ] && echo "✅ Agents"
[ -d .claude/skills ] && echo "✅ Skills"
[ -d .claude/instructions ] && echo "✅ Instructions"
[ -f CLAUDE.md ] && echo "✅ CLAUDE.md"
[ $(ls .claude/agents | wc -l) -eq 10 ] && echo "✅ 10 agents"
[ $(ls .claude/skills | wc -l) -eq 14 ] && echo "✅ 14 skills"
```

**Squad Mode**:
```bash
# Fresh installation
cd /tmp/test-squad && rm -rf .claude CLAUDE.md .mcp.json
node /path/to/dist/bin/cli.js --project-only --mode squad

# Verify squad-specific files
[ -f .claude/instructions/supervisor-rules.md ] && echo "✅ Supervisor rules"
[ -f .claude/instructions/squad-roster.md ] && echo "✅ Squad roster"
[ -d .claude/commands ] && echo "✅ Commands"
[ -d .claude/examples ] && echo "✅ Examples"
```

**Migration**:
```bash
# Create old structure
cd /tmp/test-migrate && rm -rf .claude skills
mkdir -p skills/test-skill .claude
touch .claude/supervisor-rules.md

# Run migration
node /path/to/dist/bin/cli.js migrate

# Verify
[ -d .claude/skills/test-skill ] && echo "✅ Skills migrated"
[ -f .claude/instructions/supervisor-rules.md ] && echo "✅ Squad files migrated"
[ ! -d skills ] && echo "✅ Root skills removed"
```

### Automated Tests

Currently, testing is manual. Future improvements:
- Unit tests for CLI argument parsing
- Integration tests for installation
- Snapshot tests for generated CLAUDE.md
- Validation tests for agent/skill metadata

---

## 🔧 Build Commands

```bash
# Compile TypeScript
npm run build

# Type checking only (no compilation)
npm run typecheck

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Clean build artifacts
npm run clean

# Full clean build
npm run clean && npm run build
```

---

## 📝 Code Style Guidelines

### TypeScript

- Use explicit types (avoid `any`)
- Prefer interfaces over type aliases for objects
- Use async/await over promises
- Handle errors explicitly
- Add JSDoc comments for public functions

### File Organization

- One export per file when possible
- Group related functions
- Keep files under 300 lines
- Use descriptive file names

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase()`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Interfaces: `PascalCase`

---

## 🐛 Debugging Tips

### CLI Not Working

```bash
# Check build output
ls -la dist/bin/cli.js

# Run with verbose output
node dist/bin/cli.js --project-only --mode classic 2>&1 | tee debug.log

# Check permissions
chmod +x dist/bin/cli.js
```

### Installation Issues

```bash
# Verify package structure
tar -tzf $(npm pack) | grep -E "(agents|skills|assets)"

# Test from packed tarball
npm pack
tar -xzf ai-agent-hub-3.5.9.tgz
cd package
node dist/bin/cli.js --help
```

### Generated Files Wrong

```bash
# Check generator output
node -e "const gen = require('./dist/lib/claude-md-generator/generators/modular/minimal-claudemd.js'); console.log(gen.generateMinimalClaudeMd([], 'classic'))"
```

---

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [PRODUCTION-GUIDE.md](./PRODUCTION-GUIDE.md) - Production deployment
- [TOKEN-OPTIMIZATION-ANALYSIS.md](./TOKEN-OPTIMIZATION-ANALYSIS.md) - Performance analysis
- [migrations/](./migrations/) - Version-specific migration guides
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [README.md](../README.md) - User-facing documentation

---

*For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md)*
*For version-specific changes, see [migrations/](./migrations/)*

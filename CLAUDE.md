# CLAUDE.md - Development Guide for AI Agent Hub

This file guides Claude in maintaining and developing the AI Agent Hub project.

## Project Philosophy

**"Intelligence emerges from collaboration, not complexity"**

AI Agent Hub is a **lean deployment tool** (not an orchestration platform). Keep it simple:
- The tool deploys agents and gets out of the way
- Intelligence lives in the agents, not the tool
- Complexity was intentionally removed and should not be added back

## Current Architecture (v3.1.0 with Dual-Mode Support)

### Project Metrics
```
Core Metrics:
- 25 TypeScript files (includes dual-mode support)
- ~2,100 lines of code
- 2 dependencies: chalk + js-yaml
- 3-second installation time
- 1 question asked during setup (installation target)
- 2 execution modes: Classic and Squad
```

### File Structure
```
bin/
├── cli.ts                          # Main entry with mode selection
├── commands/
│   ├── setup.ts                   # Core setup logic with mode support
│   ├── install-agents.ts          # Smart agent merging (mode-aware)
│   ├── help.ts                    # Help display with mode info
│   └── migrate-mode.ts            # Mode migration utilities
└── utils/
    ├── prompt.ts                  # Installation target prompt
    ├── mode-manager.ts            # Mode persistence utilities
    ├── mode-helpers.ts            # Mode operation helpers
    └── migration-helpers.ts       # Migration support functions

lib/
├── claude-desktop-setup.ts        # Desktop configuration
├── env-handler.ts                 # Environment management
├── file-ops.ts                    # File utilities
├── mcp-config.ts                  # MCP server configuration
├── mcp-setup.ts                   # MCP setup logic
├── platform-paths.ts              # OS detection
├── templates/
│   └── claude-md.ts               # CLAUDE.md template
└── claude-md-generator/           # Intelligent CLAUDE.md generation
    ├── index.ts                   # Main generator
    ├── parser.ts                  # Agent metadata parser
    ├── types.ts                   # TypeScript interfaces
    ├── utils.ts                   # Helper functions
    └── generators/                # Content generators
        ├── capabilities.ts        # Capability matrix
        ├── context-flow.ts        # Context flow diagram
        ├── examples.ts            # Usage examples
        └── registry.ts            # Agent registry

agents/                             # 9 agent personalities (270-720 lines each)
├── studio-coach.md                # Master orchestrator
├── sprint-prioritizer.md          # Agile planning
├── ux-researcher.md               # User research
├── rapid-ui-designer.md           # UI/UX design
├── backend-system-architect.md    # System design
├── frontend-ui-developer.md       # UI implementation
├── ai-ml-engineer.md              # AI/ML features
├── whimsy-injector.md             # Delight features
└── code-quality-reviewer.md       # Quality assurance

.squad/                            # Squad mode infrastructure
├── templates/                     # Slim agent templates (25 lines each)
│   ├── studio-coach.md
│   ├── sprint-prioritizer.md
│   ├── ux-researcher.md
│   ├── rapid-ui-designer.md
│   ├── backend-system-architect.md
│   ├── frontend-ui-developer.md
│   ├── ai-ml-engineer.md
│   ├── whimsy-injector.md
│   └── code-quality-reviewer.md
├── analysis/                      # Core agent directives (83% reduction)
├── supervisor-rules.md            # Orchestration logic
├── squad-roster.md               # Agent configuration
├── communication-protocol.md     # File-based messaging
└── architecture-decisions.md     # Design rationale

.ai-hub/                          # Mode configurations (created in user projects)
├── modes/
│   ├── classic/config.json      # Classic mode configuration
│   └── squad/config.json        # Squad mode configuration
└── mode-selector-rules.md       # Mode selection documentation
```

## Dual-Mode Operation (NEW in v3.1.0)

### Overview
AI Agent Hub now supports two execution modes to balance simplicity with efficiency:

### Classic Mode (Default)
- **Token Usage**: Full agent prompts (~37,500 tokens across 9 agents)
- **Execution**: Sequential, single-agent at a time
- **Agent Source**: `agents/` directory (full markdown files)
- **Best For**: Simple tasks, small projects, learning
- **No Prerequisites**: Works out of the box

### Squad Mode
- **Token Usage**: Slim templates (~1,080 tokens - 97% reduction)
- **Execution**: Parallel, up to 4 concurrent agents
- **Agent Source**: `.squad/templates/` directory (25-line templates)
- **Supervisor**: studio-coach orchestrates all agents
- **Best For**: Complex features, large projects, production work
- **Prerequisites**: Squad infrastructure files required

### Mode Selection

#### CLI Flags
```bash
npx ai-agent-hub --mode classic    # Force Classic mode
npx ai-agent-hub --mode squad      # Force Squad mode  
npx ai-agent-hub --mode auto       # Auto-detect optimal mode
```

#### Auto-Detection Rules
- **< 10 files**: Classic mode
- **> 50 files**: Squad mode
- **10-50 files**: Classic mode (default)
- **Squad prerequisites missing**: Classic mode
- **Token cost > $2**: Squad mode recommended

### Mode Persistence
- Mode selection saved in `.ai-hub/current-mode.json`
- Remembered for subsequent runs
- Can be overridden with CLI flags

### Mode Migration
```typescript
// Utilities available in bin/commands/migrate-mode.ts
migrateToSquad()     // Classic → Squad with backup
migrateToClassic()   // Squad → Classic with session archival
rollbackMode()       // Restore from backup
validateSquadPrerequisites() // Check Squad readiness
```

## Recent Improvements

### ✅ Dual-Mode System (v3.1.0)
- Classic mode preserves original behavior
- Squad mode adds 97% token reduction
- Auto-detection based on project complexity
- Mode persistence and migration utilities
- Backward compatible - Classic is default

### ✅ Browser MCP Integration
- Added Browser MCP to base servers
- Requires browser extension installation
- Clear setup instructions in README and output
- Connects via `/mcp` command in Claude

### ✅ Smart Agent Merging
- Preserves existing custom agents
- Only installs missing hub agents
- Never overwrites user content
- Clear reporting of what was added vs preserved
- Mode-aware installation (full vs slim)

### ✅ Enhanced CLAUDE.md Generator
- Extracts agent metadata from frontmatter
- Generates capability matrix
- Creates context flow diagrams
- Handles agents with and without metadata
- Preserves custom sections on updates

## Squad Engineering Architecture (Phase 1-2 Complete)

### Overview
Squad mode enables coordinated multi-agent execution while maintaining simplicity. This architecture achieves **97% token reduction** while enabling parallel execution and clear agent boundaries.

### Token Optimization Achievement
- **Original agents**: ~37,500 tokens across 9 agents
- **Core versions** (.squad/analysis/): ~6,300 tokens (83% reduction)
- **Slim templates** (.squad/templates/): ~1,080 tokens (97% reduction)
- Each template is exactly 25 lines, ~120 tokens

### Squad Roster Configuration

#### Supervisor (Orchestration Only)
- **studio-coach**: Claude Opus 4.1, coordinates all agents, never writes code

#### Core Squad (Implementation)
- **frontend-ui-developer** (2 instances): React/TypeScript components
- **backend-system-architect** (1 instance): APIs and database design
- **ai-ml-engineer** (1 instance): LLM integration and prompts

#### Support Squad (Quality & Design)
- **code-quality-reviewer**: Testing and security audits
- **rapid-ui-designer**: UI mockups and design systems
- **ux-researcher**: Requirements and user research

#### Optional Squad (Enhancement)
- **whimsy-injector**: Micro-interactions and delight (Haiku model)
- **sprint-prioritizer**: Planning and prioritization (Haiku model)

## Development Guidelines

### When Adding Features
Ask yourself:
1. Does this make installation simpler or more complex?
2. Can the agents handle this instead of the tool?
3. Will this slow down the 3-second setup?
4. Is this essential for deployment?
5. Does it work in both Classic and Squad modes?

If any answer suggests complexity, don't add it.

### Code Style
- Use TypeScript with strict mode
- Keep files under 150 lines (generator files can be longer)
- Prefer functions over classes
- Minimal external dependencies
- Use async/await over callbacks
- Always use `.js` extension in imports

### Testing Checklist
```bash
# Before any changes:
npm run lint        # Must pass
npm run typecheck   # Must pass
npm run build       # Must succeed

# Test all installation modes:
npx . --mode classic --project-only  # Classic mode
npx . --mode squad --project-only    # Squad mode
npx . --mode auto                     # Auto-detection
npx . --desktop-only                  # Desktop only
npx . --both                         # Both

# Test in clean environment:
cd /tmp/test-project
npx /path/to/ai-agent-hub --mode classic
# Verify: Full agents installed (286-542 lines)

npx /path/to/ai-agent-hub --mode squad
# Verify: Slim agents installed (25 lines each)
```

## What Was Removed (DO NOT RE-ADD)

### ❌ Never Add Back:
1. **Smart vs Basic Mode** - Replaced with Classic/Squad
2. **Project Detection System** - Over-engineered
3. **Session Management** - Agents don't need it (except Squad)
4. **Context Manager** - Unnecessary abstraction
5. **Analytics Commands** - Not core value
6. **Doctor Command** - Rarely used
7. **Trigger Files** (START_SESSION.md) - Indirection
8. **Complex Templates** - One simple template is enough
9. **Adaptive Prompting** - Too many questions
10. **Agent Graph System** - Now in CLAUDE.md generator

## Common Development Tasks

### Update Version
1. Update `package.json` version
2. Update version in `cli.ts` (line 42)
3. Update version in mode migration files

### Add MCP Server
Only add to `lib/mcp-config.ts` if:
- It's universally useful
- Doesn't require complex configuration
- Has NPX package available
- Adds clear value for most users

### Modify Agents
- Update freely in `agents/` directory (Classic mode)
- Update `.squad/templates/` for Squad mode (25 lines max)
- Include frontmatter for metadata
- Generator will extract and use metadata
- Custom agents are preserved during updates

### Test Mode Switching
```bash
# Create test project
mkdir /tmp/test-mode && cd /tmp/test-mode

# Install Classic
npx ai-agent-hub --mode classic --project-only
wc -l .claude/agents/*.md  # Should show 286-542 lines

# Clean and install Squad
rm -rf .claude .ai-hub
npx ai-agent-hub --mode squad --project-only
wc -l .claude/agents/*.md  # Should show 25 lines each

# Test auto-detection
rm -rf .claude .ai-hub
touch file1.js file2.js  # Small project
npx ai-agent-hub --mode auto --project-only
cat .ai-hub/current-mode.json  # Should show "classic"
```

## Troubleshooting Common Issues

### Mode Selection Problems
- Check `.ai-hub/current-mode.json` exists
- Verify mode with `cat .ai-hub/current-mode.json`
- Force mode with `--mode classic` or `--mode squad`

### Squad Mode Not Working
- Check `.squad/templates/` exists in source
- Verify all 9 templates are present
- Falls back to Classic if prerequisites missing

### Token Usage Too High
- Switch to Squad mode for 97% reduction
- Check which mode is active
- Verify slim templates are being used (25 lines)

## Metrics to Maintain

These metrics define success:
- **Setup Time**: < 5 seconds
- **User Prompts**: 1 question max
- **Code Size**: < 2,200 lines total
- **Dependencies**: 2 max (chalk + js-yaml)
- **Files Created**: < 15 per installation
- **TypeScript Files**: ~25 files
- **Classic Mode**: Full compatibility
- **Squad Mode**: 97% token reduction

## Future Considerations

### Acceptable Additions
- Bug fixes
- Platform compatibility improvements
- Agent content updates
- Universal MCP server updates
- Documentation improvements
- Mode detection improvements

### Unacceptable Additions
- New commands beyond setup
- Complex configuration options
- State management systems (except Squad sessions)
- Analytics or telemetry
- Multiple template systems
- Additional prompts during setup
- Breaking changes to Classic mode

## Remember

This tool succeeds by doing less, not more. Every line of code is a liability. The agents are the intelligence - the tool just delivers them.

The dual-mode system provides flexibility without complexity:
- **Classic**: Simple, reliable, full-featured
- **Squad**: Efficient, parallel, token-optimized

**When in doubt, choose simplicity.**

---

*Last Updated: v3.1.0 - Dual-mode operation with Classic and Squad modes*
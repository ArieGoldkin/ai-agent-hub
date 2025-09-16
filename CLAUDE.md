# CLAUDE.md - Development Guide for AI Agent Hub

This file guides Claude in maintaining and developing the AI Agent Hub project.

## Project Philosophy

**"Intelligence emerges from collaboration, not complexity"**

AI Agent Hub is a **lean deployment tool** (not an orchestration platform). Keep it simple:
- The tool deploys agents and gets out of the way
- Intelligence lives in the agents, not the tool
- Complexity was intentionally removed and should not be added back

## Current Architecture (v3.4.1)

### Key Metrics
```
- ~35 TypeScript files, ~2,500 lines (modular)
- 2 dependencies only: chalk + js-yaml
- Setup: 3 seconds, 1 question
- Modes: Classic (learning) | Squad (production + parallel)
- Parallel: 1-9 agents, 66-79% time reduction
- PRD: Optional - works with any input
- Context: Full session persistence & agent collaboration
- Orchestration: Intelligent semantic routing (zero-config)
```

### Core Structure
```
bin/commands/          # CLI commands (setup, install, help)
lib/                   # Core libraries (MCP, desktop, generators)
├── context/           # Context persistence & vocabulary learning
├── claude-md-generator/ # Intelligent documentation generation
│   └── generators/
│       ├── orchestration/  # Semantic routing & handoff protocols
│       └── triggers/       # Intelligent agent triggers
agents/                # Full agents for Classic mode (270-720 lines)
.squad/                # Squad mode infrastructure
├── templates/         # Slim agents (25 lines, 97% reduction)
├── commands/          # Parallel execution (allocate, start, sync)
└── examples/          # Test scenarios and demos
assets/                # Templates, triggers, and instructions
├── context-triggers.md    # Keyword-based agent activation
└── context-instructions.md # Shared context protocol
docs/                  # Documentation
├── intelligent-orchestration-plan.md  # Full implementation roadmap
└── orchestration-workflow-demo.md     # Usage examples
```

## Execution Modes

| Mode | Tokens | Speed | Best For |
|------|--------|-------|-----------|
| **Classic** | ~37,500 | Sequential | Learning, small projects |
| **Squad** | ~1,080 (97% less) | Parallel (66-79% faster) | Production, complex features |

```bash
npx ai-agent-hub --mode classic    # Full agents, sequential
npx ai-agent-hub --mode squad      # Slim agents, parallel  
npx ai-agent-hub --mode auto       # Auto-detect based on project
```

## Latest: Intelligent Orchestration System (v3.4.1)

### 🧠 Zero-Config Semantic Routing
The system now intelligently routes user requests to appropriate agents without manual selection:

1. **Semantic Analysis** - Understands intent beyond keywords
2. **Complexity Scoring** - Evaluates task complexity (1-10 scale)
3. **Domain Detection** - Identifies which specializations are needed
4. **Context Awareness** - Considers existing project work
5. **Automatic Handoffs** - Agents suggest next specialists when needed

### How Orchestration Works
```typescript
// Embedded in generated CLAUDE.md - no runtime code!
interface OrchestrationState {
  active_workflow?: {
    type: 'sequential' | 'parallel' | 'hierarchical' | 'consensus';
    coordinator_agent: string;
    participants: string[];
    current_phase: string;
    progress_percentage: number;
  };
  routing_history: Array<{...}>;
  project_intelligence: {...};
  performance_analytics: {...};
}
```

### Intelligent Features
- **Intent Classification**: "Fix login" vs "Build auth system" - different complexity
- **Multi-Agent Coordination**: Complex tasks automatically use multiple specialists
- **Performance Optimization**: Token usage reduced through smart context sharing
- **Continuous Learning**: System improves routing decisions over time

## Previous: Context-Aware Agent Collaboration (v3.4.0)

### Seamless Session Persistence
Every agent interaction maintains full context awareness:

1. **Session Continuity** - Work persists across Claude sessions
2. **Shared Context** - All agents read/write to `.claude/context/`
3. **Automatic Synchronization** - Decisions immediately available to all agents
4. **Vocabulary Learning** - Adapts to your project's terminology

## Previous: Smart PRD Inference (v3.3.0)

### One-Question Parallel Execution
1. **Searches** for existing requirements (PRD, README, docs)
2. **Confirms** if found, or **Asks** "What are you building?" 
3. **Infers** components and tasks from natural language
4. **Allocates** optimal agent count (1-9) automatically

**No PRD file required!** Works with any input:
- "login system" → 2 agents
- "dashboard with real-time updates" → 3 agents  
- Full PRD → up to 9 agents optimally

### Parallel Execution Benefits
- **File-level mutex** prevents conflicts
- **Smart allocation** based on dependencies
- **Progressive enhancement** - starts conservative, learns
- **66-79% time reduction** proven in testing

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

Current MCP servers included:
- **memory** - Persistent memory across sessions
- **sequential-thinking** - Step-by-step reasoning
- **context7** - Documentation and library context
- **playwright** - Browser automation
- **browsermcp** - Web browsing (requires extension)
- **shadcn** - UI component registry integration
- **github** - GitHub integration (conditional: GITHUB_TOKEN)
- **supabase** - Supabase integration (conditional: SUPABASE_ACCESS_TOKEN)
- **postgres** - PostgreSQL integration (conditional: POSTGRES_CONNECTION_STRING)

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
- **Code Size**: < 2,200 lines (modularized)
- **Dependencies**: 2 max (chalk + js-yaml)
- **TypeScript Files**: ~28 files
- **Classic Mode**: Full compatibility
- **Squad Mode**: 97% token reduction + parallel execution
- **Code Complexity**: < 10 per function
- **File Length**: < 150 lines (except generators)

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

**Core Principles:**
- **Classic Mode**: Simple, educational, sequential
- **Squad Mode**: Efficient, production-ready, parallel
- **Parallel Execution**: Automatic optimization based on task dependencies
- **Code Quality**: Modular, testable, < 150 lines per file

**When in doubt, choose simplicity.**

---

*Last Updated: v3.4.1 - Intelligent Orchestration System with semantic routing*

## Changelog

### v3.4.1 - Intelligent Orchestration System
- **Phase 1 Complete**: Embedded intelligence in generated files (zero runtime overhead)
- Added semantic analysis beyond keyword matching (multi-dimensional intent analysis)
- Implemented complexity scoring for automatic agent selection (1-10 scale)
- Enhanced context system with `OrchestrationState` for workflow tracking
- Modularized generators into focused modules (all files < 150 lines)
- Added intelligent triggers with continuous learning protocol
- Added shadcn MCP server for UI component registry integration
- Performance optimization guidelines embedded in CLAUDE.md

### v3.4.0 - Context-Aware Collaboration
- Added full context persistence system (`.claude/context/`)
- Implemented session continuity across Claude sessions
- Added vocabulary learning for project terminology
- Enhanced all agents with context awareness instructions
- Added automatic context synchronization between agents
- Context triggers for keyword-based agent activation

### v3.3.0 - Smart PRD Inference
- One-question parallel execution
- Automatic agent allocation (1-9 agents)
- Natural language task inference
- 66-79% time reduction with parallel execution

### v3.2.0 - Squad Mode
- 97% token reduction with slim agents
- Parallel execution infrastructure
- File-level mutex for conflict prevention
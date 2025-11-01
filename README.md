# 🚀 AI Agent Hub

<div align="center">

  ### ✨ Transform Claude into 9 Context-Aware AI Agents Working in Parallel ✨
  ### 🧠 Intelligent Orchestration + 79% Faster with Squad Mode 🚀
  ### 📚 7 Expert Skills for Architecture, Testing, Security & More 📚
  ### 🎯 Zero-Config Semantic Routing - Agents Auto-Select Based on Intent 🎯

  ```bash
  npx ai-agent-hub@latest
  ```

  **Works with Claude Desktop & Claude Code**
  
  [![npm version](https://img.shields.io/npm/v/ai-agent-hub?style=flat-square&color=blue)](https://www.npmjs.com/package/ai-agent-hub)
  [![Dependencies](https://img.shields.io/badge/dependencies-2-brightgreen?style=flat-square)](package.json)
  [![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue?style=flat-square)](package.json)
  [![Cross-Platform](https://img.shields.io/badge/platform-macOS%20|%20Windows%20|%20Linux-lightgrey?style=flat-square)](README.md)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
  
</div>

---

## 🚀 Quick Start

```bash
npx ai-agent-hub@latest
```

**One command, two simple questions:**
1. 📍 **Where to install?** → Project / Desktop / Both
2. ⚡ **Which mode?** → Classic (learning) / Squad (production)

**Then in Claude Code:**
```
"Build a viral TikTok app"
```
✨ Agents auto-activate based on your needs and share context automatically!

---

## ⚡ Squad Mode: Build 79% Faster

**Squad Mode** transforms Claude into a coordinated team that works in parallel, not sequentially.

### Visual Comparison

**Traditional (Sequential):**
```
Agent 1 works (30 min) → Agent 2 waits then works (30 min) → Agent 3 waits then works (30 min)
Total: 90 minutes
```

**Squad Mode (Parallel):**
```
Agent 1 works ┐
Agent 2 works ├─ All working simultaneously (30 min)
Agent 3 works ┘
Total: 30 minutes (66% faster!)
```

### Performance Gains
- **97% fewer tokens** - Slim, focused agents
- **66-79% faster** - Parallel execution
- **Smart coordination** - Automatic task distribution
- **Zero conflicts** - File-level mutex

### Parallel Commands in Claude Code

```markdown
# 1. Allocate Tasks
/allocate-tasks-parallel real-time dashboard with user analytics
# Analyzes and distributes to optimal agents (1-9)

# 2. Start Execution
/start-parallel
# Launches multiple agents simultaneously

# 3. Sync Progress
/sync-parallel
# Coordinates results and dependencies
```

### When to Use Each Mode

| **Classic Mode** | **Squad Mode** |
|-----------------|----------------|
| Learning agents | Production apps |
| Small tasks | Complex features |
| Exploration | Tight deadlines |

---

## 🧠 Intelligent Orchestration System (v3.4.2)

**NEW: Zero-config semantic routing with automatic context preservation!**

### How Intelligence Works
```
User says: "Fix the login bug" → System analyzes:
├── Intent: Debug/Fix (not create)
├── Complexity: Score 3 (single domain)
├── Domain: Authentication/Frontend
└── Routes to: Frontend Developer + Quality Reviewer
```

### Semantic Analysis Features
- **🎯 Intent Classification** - Understands what you're trying to achieve
- **📊 Complexity Scoring** - Evaluates task difficulty (1-10 scale)
- **🔍 Domain Detection** - Identifies which specializations are needed
- **🤝 Smart Handoffs** - Agents suggest next specialists automatically
- **📈 Continuous Learning** - Improves routing decisions over time

## 🔄 Context-Aware Collaboration (v3.4.2 Enhanced)

**AUTOMATIC**: All agents now auto-load context middleware for seamless collaboration!

### How It Works
```
1. First agent creates session → Writes decisions to .claude/context/
2. Next agent reads context → Knows what's done, continues work
3. All agents stay in sync → Real-time sharing, no duplicate effort
4. Next session continues → Picks up exactly where you left off
```

### What's New in 3.4.2
- ✅ **Auto-loaded context middleware** - Every agent reads/writes context automatically
- ✅ **Zero-complexity setup** - Works out of the box with `npx`
- ✅ **Squad mode dependencies** - Package.json includes all required dependencies
- ✅ **Graceful degradation** - Context bridge handles missing dependencies smoothly

### Example Flow
```markdown
User: "Build a dashboard with real-time updates"
→ System scores complexity: 7 (multi-domain)
→ Routes to Studio Coach for orchestration
→ Coach coordinates: Backend → Frontend → AI Engineer
→ All agents share context automatically!
```

---

## 🎭 Your 9 Expert Agents

Each agent is a specialized AI personality with deep expertise in their domain.

### 🎬 Studio Coach
**Master Orchestrator & Team Coordinator**
- Coordinates complex multi-agent projects
- Assigns optimal agents for each task
- Motivates team and ensures peak performance
- Manages parallel execution in Squad Mode
- Handles project planning and strategy

### 📊 Sprint Prioritizer
**Agile Planning & Product Strategy**
- Plans 6-day development sprints
- Prioritizes features for maximum impact
- Makes trade-off decisions with ROI analysis
- Manages product roadmaps
- Balances user needs with technical constraints

### 🔍 UX Researcher
**User Research & Testing**
- Conducts user research and interviews
- Creates user personas and journey maps
- Validates design decisions through testing
- Analyzes user behavior patterns
- Provides actionable UX insights

### 🎨 Rapid UI Designer
**Design Systems & Visual Design**
- Creates mockups and wireframes quickly
- Designs component architectures
- Establishes design tokens and styles
- Ensures accessibility compliance (WCAG 2.1)
- Balances aesthetics with implementation speed

### 🏗️ Backend System Architect
**API Design & System Architecture**
- Designs scalable backend systems
- Creates REST/GraphQL/gRPC APIs
- Plans database schemas and migrations
- Implements authentication strategies
- Optimizes for performance and scale

### 💻 Frontend UI Developer
**React/Vue/Angular Implementation**
- Builds responsive user interfaces
- Implements design system components
- Ensures cross-browser compatibility
- Optimizes frontend performance
- Handles state management and routing

### 🤖 AI/ML Engineer
**AI Integration & ML Pipelines**
- Integrates LLM APIs (OpenAI, Anthropic, Google)
- Builds ML pipelines and inference systems
- Implements recommendation engines
- Optimizes model performance
- Handles AI/ML production deployment

### ✨ Whimsy Injector
**Delightful UX & Creative Touches**
- Adds personality to user experiences
- Creates memorable interaction moments
- Designs engaging loading states
- Transforms errors into delightful surprises
- Makes products fun and shareable

### ✅ Code Quality Reviewer
**Quality Assurance & Code Standards**
- Reviews code for best practices
- Checks security vulnerabilities (OWASP Top 10)
- Ensures proper error handling
- Validates test coverage
- Enforces code style and patterns

---

## 📚 Claude Code Skills

**NEW in 3.4.2**: 7 comprehensive skills that supercharge your development workflow!

### What Are Skills?

Skills are specialized knowledge modules that Claude Code dynamically loads when needed.
They transform Claude from a general assistant into a domain expert.
Each skill provides frameworks, templates, examples, and battle-tested best practices.

### Why Skills Matter for Development

**Consistency Across Projects**
- Use the same proven patterns every time
- No reinventing the wheel for common tasks
- Team members follow identical standards

**Faster Onboarding**
- New developers learn best practices instantly
- Comprehensive examples show the "right way"
- Checklists ensure nothing is forgotten

**Higher Quality Code**
- Security vulnerabilities caught early (OWASP Top 10)
- Test coverage strategies built-in
- Code review standards automated

**Time Savings**
- Templates eliminate boilerplate writing
- Examples provide copy-paste starting points
- Checklists prevent costly mistakes

### Available Skills

#### 🏗️ Architecture Decision Record (ADR)
**Document why you made technical choices**
- Creates ADRs following Nygard format
- Captures context, decision, and consequences
- Includes templates with alternatives considered
- Preserves architectural memory for teams
- Prevents endless debates about settled decisions

#### 🌐 API Design Framework
**Build consistent, well-documented APIs**
- REST, GraphQL, and gRPC best practices
- OpenAPI 3.1 specification templates
- Proper HTTP status codes and error handling
- Pagination, filtering, and versioning patterns
- Authentication and rate limiting strategies

#### ✅ Testing Strategy Builder
**Comprehensive test coverage made easy**
- Unit, integration, and E2E test patterns
- Coverage targets and quality gates
- Test plan and test case templates
- Performance testing with k6 examples
- CI/CD integration strategies

#### 👀 Code Review Playbook
**Consistent, constructive code reviews**
- Conventional comments format (praise, issue, nitpick)
- Language-specific checklists (TypeScript, Python)
- Security and performance review patterns
- PR templates and review workflows
- Feedback patterns that improve code quality

#### 🎨 Design System Starter
**Build scalable UI component libraries**
- Design token structures (colors, typography, spacing)
- Atomic design methodology (atoms → organisms)
- WCAG 2.1 accessibility compliance
- Dark mode and theming patterns
- Component API design best practices

#### 🗄️ Database Schema Designer
**Design performant, scalable databases**
- SQL normalization (1NF, 2NF, 3NF)
- NoSQL embedding vs referencing patterns
- Indexing strategies for query optimization
- Zero-downtime migration patterns
- N+1 query prevention techniques

#### 🔒 Security Checklist
**Protect your app from vulnerabilities**
- OWASP Top 10 mitigations (SQL injection, XSS, CSRF)
- Authentication and authorization patterns
- Input validation and sanitization
- Security headers configuration
- GDPR and SOC2 compliance guidelines

### How They Work

Skills use **progressive disclosure** to optimize token usage:

```
1. Claude sees skill metadata (description, tags)
2. Decides if skill is relevant to your task
3. Loads SKILL.md with core framework (~4k words)
4. Accesses detailed examples/templates only when needed
```

### What's Included

Each skill contains:
- **SKILL.md** - Core framework and workflow (~300-400 lines)
- **templates/** - Reusable file templates
- **references/** - Detailed code examples
- **checklists/** - Verification checklists
- **assets/** - Additional resources

### Example Usage

```markdown
# Architecture Decision
"Document why we chose microservices over monolith"
→ Claude loads architecture-decision-record skill
→ Creates ADR following Nygard format
→ Includes context, decision, consequences

# API Design
"Design a REST API for user management"
→ Claude loads api-design-framework skill
→ Follows OpenAPI 3.1 specification
→ Implements proper resource naming, status codes

# Security Audit
"Review authentication implementation"
→ Claude loads security-checklist skill
→ Checks OWASP Top 10 vulnerabilities
→ Provides mitigation recommendations
```

### Token Optimization

Skills are designed for maximum efficiency:
- **Main file**: <5k words (compressed, focused)
- **References**: Loaded only when needed
- **Templates**: Accessed on-demand
- **Total savings**: ~80% compared to monolithic documentation

### Location

All skills are installed in `/skills/` directory in your project.

---

## ⚙️ MCP Servers

Your Claude gets enhanced capabilities through MCP servers:

### Always Included
- **Memory** - Conversation history
- **Sequential Thinking** - Step-by-step reasoning
- **Context7** - Large project management
- **Playwright** - Browser automation
- **Browser MCP** - Web control (requires [extension](https://docs.browsermcp.io/setup-extension))
- **Shadcn** - UI component registry integration

### Desktop-Specific
- **Filesystem** - File system access
- **GitHub** - Repository management

### Optional (with API Keys)
- **GitHub** (project) - `GITHUB_TOKEN`
- **Supabase** - `SUPABASE_ACCESS_TOKEN`
- **Postgres** - `POSTGRES_CONNECTION_STRING`
- **Brave Search** - `BRAVE_API_KEY`

---

## 📦 Installation

### Requirements
- Node.js 20+ ([Download](https://nodejs.org))
- Claude Desktop or Claude Code

### Interactive Install
```bash
npx ai-agent-hub@latest
```

### Advanced Options
```bash
# Skip prompts
npx ai-agent-hub@latest --project-only --mode squad
npx ai-agent-hub@latest --desktop-only --mode classic
npx ai-agent-hub@latest --both --mode auto
```

### What Gets Installed

**Project (.claude/)**
- 9 AI agents (Classic: full, Squad: slim)
- 7 Claude Code skills (comprehensive frameworks & templates)
- Context system (session persistence, shared decisions)
- Context middleware (auto-loaded for all agents)
- Context triggers (keyword-based activation)
- Context bridge (Squad mode synchronization)
- MCP configuration
- Mode-specific instructions

**Claude Desktop**
- Enhanced config with 7 MCP servers
- Global agent availability
- Cross-project context awareness

---

## 🚀 How to Use

### Auto Mode (Default) - Just Describe What You Need
```markdown
"I need user authentication with social login"
# Backend Architect automatically handles API design
# Frontend Developer automatically creates UI
# Context shared between them instantly

"Make the loading screens more fun"
# Whimsy Injector automatically activates

"Build a real-time dashboard"
# Studio Coach coordinates multiple agents in parallel
```

### Explicit Commands (When You Want Control)
```markdown
"Use Studio Coach to plan my startup MVP"
"Have the Backend Architect design a scalable API"
"Get the UI Developer to create a responsive dashboard"
```

![Agent Collaboration Flow](assets/agent-collaboration-flow.png)

### Squad Mode Workflow

![Squad Mode Workflow](assets/squad-workflow.png)

### Squad Mode Example
```markdown
# Step 1: Allocate
/allocate-tasks-parallel social media dashboard
# Output: "Optimal: 3 agents for frontend, backend, database"

# Step 2: Execute
/start-parallel
# Agents work simultaneously on different parts

# Step 3: Sync
/sync-parallel
# Coordinate and merge results
```

---

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env` for additional features:

```bash
# MCP Servers
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
SUPABASE_ACCESS_TOKEN=eyJxxxxxxxxx
POSTGRES_CONNECTION_STRING=postgresql://...
BRAVE_API_KEY=BSA-xxxxxxxxx

# AI Services
OPENAI_API_KEY=sk-xxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxx
GOOGLE_GENERATIVE_AI_API_KEY=AIzaxxxxxxxx
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Agents not showing | Restart Claude |
| Command not found | Check Node.js 20+ |
| Browser MCP not working | Install [extension](https://docs.browsermcp.io/setup-extension) |
| Missing features | Add API keys to `.env` |

### Verify Installation
```bash
ls -la .claude/agents/                      # Should show 9 agents
ls -la skills/                              # Should show 7 skills directories
ls -la .claude/context/                     # Should show session & shared-context files
ls -la .claude/instructions/                # Should show context-middleware.md
cat .claude/context-triggers.md             # Should show keyword triggers
cat .mcp.json                               # Should show MCP config
node .claude/scripts/context-bridge.js      # Squad mode: Should run without errors
```

---

## 📝 Changelog

### v3.4.2 (Latest)
- 🎓 **7 Claude Code Skills** - Comprehensive frameworks for architecture, API design, testing, code review, design systems, databases, and security
- ✅ **Context middleware** - Auto-loaded for all agents, enabling automatic context preservation
- ✅ **Squad mode fixes** - Package.json now includes all required dependencies
- ✅ **Context bridge** - Gracefully handles missing dependencies with helpful messages
- ✅ **Zero-complexity** - Everything works out of the box with `npx`, no manual setup
- ✅ **Bug fixes** - Fixed test scripts and improved error handling

### v3.4.1
- 🧠 Intelligent orchestration with semantic routing
- 🚀 Squad mode for parallel execution
- 📊 Context-aware collaboration

### v3.4.0
- Initial release with 9 specialized agents
- MCP server integration
- Classic and Squad modes

---

## 🤝 Contributing

### Development
```bash
git clone https://github.com/ArieGoldkin/ai-agent-hub
cd ai-agent-hub
npm install
npm run build
```

### Before PR
```bash
npm run lint
npm run typecheck
npm run build
```

---

## 📄 License

MIT © 2024 AI Agent Hub

Created by [Arie Goldkin](https://github.com/ArieGoldkin)

---

<div align="center">
  
  ### 🌟 Ready to Supercharge Claude? 🌟
  
  ```bash
  npx ai-agent-hub@latest
  ```
  
  <sub>Built with ❤️ to make Claude extraordinary</sub>
  
  [⭐ Star](https://github.com/ArieGoldkin/ai-agent-hub) · 
  [🐛 Report Bug](https://github.com/ArieGoldkin/ai-agent-hub/issues) · 
  [💡 Request Feature](https://github.com/ArieGoldkin/ai-agent-hub/issues)
  
</div>
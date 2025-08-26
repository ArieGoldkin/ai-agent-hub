# AI Agent Hub

[![npm version](https://badge.fury.io/js/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/ai-agent-hub)](https://nodejs.org/)

**NPX Tool**: Transform Claude Desktop into a complete development environment in 30 seconds.

```bash
npx ai-agent-hub init
```

## The Problem

Setting up MCP (Model Context Protocol) servers manually is tedious:

- Finding and installing the right packages
- Editing Claude Desktop's JSON configuration by hand
- Managing environment variables and API keys
- Troubleshooting connection issues

## The Solution

One command. One question. Done.

```bash
npx ai-agent-hub init
```

**What happens next:**

1. ✨ Detects your Claude Desktop installation automatically
2. 🤔 Asks: "Global setup (all conversations) or project-specific?"
3. ⚡ Installs 7 MCP servers + 9 AI agent personalities
4. 🔧 Updates your Claude configuration automatically
5. 🚀 Restart Claude Desktop and start coding with superpowers

## What You Get

**7 Powerful MCP Servers:**

- **filesystem** - Read/write files directly from Claude
- **github** - Manage repos, create PRs, review code
- **git** - Full version control operations
- **playwright** - Browser automation and web scraping
- **postgres** - Database queries and management
- **sequential-thinking** - Enhanced reasoning for complex problems
- **memory** - Persistent context across conversations

**9 Specialized AI Agents:**

- AI/ML Engineer, Backend Architect, Frontend Developer
- Code Quality Reviewer, UX Researcher, UI Designer
- Sprint Planner, Studio Coach, Whimsy Injector

## How to Use

### Step 1: Run Setup

```bash
npx ai-agent-hub init
```

### Step 2: Choose Installation Type

You'll see one question:

```
Where would you like to configure MCP servers?
  > Claude Desktop (Global - all projects)
    Claude Code (This project only)
    Both (Desktop + Code)
```

Choose based on your needs:

- **Claude Desktop**: Tools available in all Claude conversations
- **Claude Code**: Tools only for current project (creates `.mcp.json`)
- **Both**: Installs in both locations

### Step 3: Restart Claude

Close and reopen Claude Desktop to activate the new tools.

### What Gets Installed

**🤖 9 Specialized AI Agents** (the main event!):

- 🧠 **AI/ML Engineer** - Machine learning implementation specialist
- 🏗️ **Backend System Architect** - Scalable server-side systems expert
- 💻 **Frontend UI Developer** - Modern JavaScript frameworks specialist
- 🔍 **Code Quality Reviewer** - Code review and security expert
- 👥 **UX Researcher** - User behavior and usability specialist
- 🎨 **Rapid UI Designer** - Fast UI design with modern systems
- 📋 **Sprint Planner** - Agile project management specialist
- 🏆 **Studio Coach** - Team development and collaboration coach
- ✨ **Whimsy Injector** - Creative UI elements and delight specialist

**⚡ 7 Powerful MCP Servers** (automatically configured):

- 📁 **File system access** - Read/write files directly from Claude
- 🔧 **Git commands** - Full version control operations
- 🐙 **GitHub integration** - Manage repos, create PRs, review code
- 🌐 **Browser automation** - Playwright for testing and web scraping
- 🧮 **Enhanced reasoning** - Sequential thinking for complex problems
- 💾 **Persistent memory** - Context that remembers across chats
- 📚 **Documentation search** - Context7 for code examples and docs

## GitHub Integration (Optional)

For GitHub features, create a token at https://github.com/settings/tokens with permissions: `repo`, `workflow`, `gist`

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

The installer will prompt you if needed - no manual configuration required.

## All Commands

```bash
# Initial setup (main command)
npx ai-agent-hub init

# Add additional servers
npx ai-agent-hub add <server-name>

# Remove servers
npx ai-agent-hub remove <server-name>

# List configured servers
npx ai-agent-hub list

# Check configuration
npx ai-agent-hub doctor
```

## Platform Support

- ✅ **macOS** - `~/Library/Application Support/Claude/`
- ✅ **Windows** - `%APPDATA%\Claude\`
- ✅ **Linux** - `~/.config/Claude/`

Auto-detects your platform and Claude installation.

## Requirements

- **Node.js 18+** (for npx)
- **Claude Desktop** installed
- **API keys** (optional, prompted when needed)

## Why This Exists

Manual MCP setup takes 30+ minutes and is error-prone. This tool does it in 30 seconds with zero configuration knowledge required.

**Before:** Edit JSON files, find package names, manage configs
**After:** Run one command, answer one question, start coding

## What This Is NOT

- ❌ Not a background service or daemon
- ❌ Not a server orchestration platform
- ❌ Not a complex configuration manager

**This is a simple installer.** It configures Claude Desktop once and gets out of your way.

## Contributing

Found a bug or want to add a server? [Open an issue](https://github.com/ArieGoldkin/ai-agent-hub/issues) or submit a PR.

## License

MIT © [Arie Goldkin](https://github.com/ArieGoldkin)

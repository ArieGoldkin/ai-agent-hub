# AI Agent Hub

[![npm version](https://badge.fury.io/js/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/ai-agent-hub)](https://nodejs.org/)

**Transform Claude Desktop into a complete development environment in 30 seconds.**

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

## User Experience

```bash
$ npx ai-agent-hub init

🤖 AI Agent Hub - Claude Desktop Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Claude Desktop found: ~/Library/Application Support/Claude/
✅ Node.js 20.x detected

❓ Setup type:
  ❯ Global (available in all conversations)
    Project-specific (creates .mcp.json)

🔧 Installing MCP servers...
✅ @modelcontextprotocol/server-filesystem
✅ @modelcontextprotocol/server-github
✅ @modelcontextprotocol/server-git
✅ @modelcontextprotocol/server-playwright
✅ @modelcontextprotocol/server-postgres
✅ @modelcontextprotocol/server-sequential-thinking
✅ @modelcontextprotocol/server-memory

📝 Claude configuration updated
🎯 9 AI agent personalities added

🎉 Setup complete! Restart Claude Desktop to activate.
```

## GitHub Integration (Optional)

For GitHub features, create a token at https://github.com/settings/tokens with permissions: `repo`, `workflow`, `gist`

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

The installer will prompt you if needed - no manual configuration required.

## All Commands

```bash
# Complete setup wizard
npx ai-agent-hub init

# Add specific servers only
npx ai-agent-hub add filesystem github git

# Remove unwanted servers
npx ai-agent-hub remove postgres playwright

# See what's currently configured
npx ai-agent-hub list

# Diagnose setup issues
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

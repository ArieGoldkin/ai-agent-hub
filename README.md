# AI Agent Hub

Give Claude Desktop superpowers with MCP servers in 30 seconds.

```bash
npx ai-agent-hub init
```

## Quick Start

1. **Run the installer** - One command installs everything
2. **Choose configuration** - Global (all conversations) or project-specific
3. **Restart Claude Desktop** - Servers activate automatically
4. **Start using enhanced Claude** - File access, GitHub, web browsing, and more

The installer detects your Claude Desktop installation and configures it automatically.

## What Gets Installed

**7 Core MCP Servers** (choose during setup):

- **filesystem** - Read/write files on your computer
- **github** - Manage repos, PRs, issues (needs GITHUB_TOKEN)
- **git** - Version control operations
- **playwright** - Browser automation and web scraping
- **postgres** - Database queries and management
- **sequential-thinking** - Enhanced reasoning for complex problems
- **memory** - Persistent context across conversations

**AI Agent Personalities** - Specialized Claude roles:
- AI/ML Engineer, Backend Architect, Frontend Developer
- Code Quality Reviewer, UX Researcher, UI Designer
- Sprint Prioritizer, Studio Coach, Whimsy Injector

## GitHub Token Setup (Optional)

For GitHub integration, create a token at https://github.com/settings/tokens

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Required permissions: `repo`, `workflow`, `gist`

The installer will prompt you if the token is missing.

## Commands

```bash
# Interactive setup wizard
npx ai-agent-hub init

# Add specific servers
npx ai-agent-hub add filesystem github

# Remove servers
npx ai-agent-hub remove postgres

# List configured servers
npx ai-agent-hub list

# Check setup and diagnose issues
npx ai-agent-hub doctor
```

## Configuration Types

**Global Configuration** - Available in all Claude Desktop conversations
- Configures: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

**Project Configuration** - Project-specific servers in `.mcp.json`
- Use when you need different servers per project

## Requirements

- Node.js 18+ (for NPX)
- Claude Desktop installed
- Optional: API keys for specific servers

## License

MIT © [Arie Goldkin](https://github.com/ArieGoldkin)
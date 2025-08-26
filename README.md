# AI Agent Hub

Give Claude Desktop superpowers with MCP servers in 30 seconds.

```bash
npx ai-agent-hub init
```

## What are MCP Servers?

MCP (Model Context Protocol) servers are tools that extend Claude's capabilities beyond text generation. They're like plugins that give Claude the ability to:

- 📁 **Read and write files** on your computer
- 🔧 **Run git commands** and manage code
- 🌐 **Browse the web** and fetch data
- 🗄️ **Query databases** directly
- 🧠 **Remember context** across conversations
- 🔍 **Search documentation** and codebases
- 🐳 **Manage Docker containers**
- ...and much more

Without MCP servers, Claude can only generate text. With them, Claude becomes a powerful development assistant that can actually interact with your tools and environment.

## How It Works

AI Agent Hub automates the complex process of setting up MCP servers:

1. **Detects** your Claude Desktop installation (works on macOS, Windows, Linux)
2. **Prompts** you to select which capabilities you want
3. **Installs** the MCP server packages using NPX (no global installs)
4. **Configures** Claude Desktop automatically (backs up existing config)
5. **Validates** the setup and helps with any missing requirements

The tool supports two configuration modes:
- **Claude Desktop** (global): Servers available in all your Claude conversations
- **Claude Code** (project-level): Project-specific servers defined in `.mcp.json`

## Prerequisites

- **Node.js 18 or higher** - Required for NPX ([Download](https://nodejs.org))
- **Claude Desktop** - The desktop app must be installed ([Download](https://claude.ai/download))
- **API Keys** (for some servers):
  - GitHub integration needs a GitHub token
  - Database servers need connection strings
  - Slack integration needs bot tokens

## Quick Start

### Interactive Setup (Recommended)

```bash
npx ai-agent-hub init
```

Choose from:
- 🎮 **Interactive mode** - Pick servers one by one
- 🚀 **Preset mode** - Use pre-configured bundles
- ⚡ **Quick mode** - Just the essentials

### Use a Preset Directly

```bash
# Basic development setup
npx ai-agent-hub init --preset basic-dev

# Full-stack development
npx ai-agent-hub init --preset full-stack

# AI-enhanced workflow
npx ai-agent-hub init --preset ai-enhanced
```

After installation, restart Claude Desktop to activate the servers.

## Configuration Types

### Claude Desktop (Global Configuration)

Servers configured globally are available in ALL Claude Desktop conversations.

**Config location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Use when:** You want servers available everywhere

### Claude Code (Project Configuration)

Servers configured per-project using `.mcp.json` files in your project root.

**Config location:** `<project-root>/.mcp.json`

**Use when:** You want project-specific servers or different configs per project

## Available MCP Servers

### Core Development

#### filesystem
**Purpose:** Give Claude access to your file system  
**Capabilities:** Read, write, create, delete, search files and directories  
**Requirements:** None  
**Use cases:** Code editing, file management, project scaffolding

#### github ⚠️
**Purpose:** GitHub API integration  
**Capabilities:** Manage repos, issues, PRs, workflows, gists  
**Requirements:** `GITHUB_TOKEN` with appropriate permissions  
**Use cases:** PR creation, issue management, code review

#### git
**Purpose:** Version control operations  
**Capabilities:** Commit, branch, merge, diff, log, status  
**Requirements:** None  
**Use cases:** Version control, code history analysis

### Development Tools

#### playwright
**Purpose:** Browser automation and testing  
**Capabilities:** Web scraping, E2E testing, screenshot capture  
**Requirements:** None (downloads browser on first use)  
**Use cases:** Automated testing, web data extraction

#### postgres ⚠️
**Purpose:** PostgreSQL database operations  
**Capabilities:** Execute queries, manage schemas, data analysis  
**Requirements:** `DATABASE_URL` connection string  
**Use cases:** Database management, data analysis, migrations

#### docker
**Purpose:** Container management  
**Capabilities:** Build, run, stop, inspect containers and images  
**Requirements:** Docker installed and running  
**Use cases:** Container orchestration, deployment

#### sqlite ⚠️
**Purpose:** SQLite database operations  
**Capabilities:** Local database queries and management  
**Requirements:** `SQLITE_DB_PATH` to database file  
**Use cases:** Local data storage, prototyping

### AI Enhancement

#### sequential-thinking
**Purpose:** Enhanced reasoning for complex problems  
**Capabilities:** Step-by-step problem solving, decision trees, analysis  
**Requirements:** None  
**Use cases:** Complex debugging, architecture decisions, algorithm design

#### memory
**Purpose:** Persistent context across conversations  
**Capabilities:** Remember previous interactions, maintain context  
**Requirements:** None  
**Use cases:** Long-term projects, continuous assistance

#### context7
**Purpose:** Documentation and code search  
**Capabilities:** Search docs, find code examples, API references  
**Requirements:** Optional `CONTEXT7_API_KEY` for enhanced features  
**Use cases:** Documentation lookup, code examples

### Utilities

#### fetch
**Purpose:** HTTP client for web requests  
**Capabilities:** GET/POST requests, API interactions, web scraping  
**Requirements:** None  
**Use cases:** API testing, data fetching, web integration

#### slack ⚠️
**Purpose:** Slack workspace integration  
**Capabilities:** Send messages, manage channels, read conversations  
**Requirements:** `SLACK_BOT_TOKEN`  
**Use cases:** Team notifications, chat automation

#### puppeteer
**Purpose:** Alternative browser automation  
**Capabilities:** Similar to playwright with different API  
**Requirements:** None  
**Use cases:** Web automation, testing, scraping

## Environment Variables

Some servers require API keys or configuration. The installer will prompt you automatically, or you can set them beforehand:

### GitHub Token
```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```
Create at: https://github.com/settings/tokens
Required permissions: repo, workflow, gist

### Database URLs
```bash
# PostgreSQL
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# SQLite
export SQLITE_DB_PATH=/path/to/database.db
```

### Slack Bot Token
```bash
export SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx
```
Create at: https://api.slack.com/apps

The installer will detect missing variables and guide you through setup.

## Commands

### Setup Commands

```bash
# Interactive setup wizard
npx ai-agent-hub init

# Use a specific preset
npx ai-agent-hub init --preset basic-dev

# Non-interactive (accept all defaults)
npx ai-agent-hub init --yes
```

### Management Commands

```bash
# Add individual servers
npx ai-agent-hub add github
npx ai-agent-hub add postgres

# Add multiple servers
npx ai-agent-hub add filesystem github git

# Remove servers
npx ai-agent-hub remove playwright
npx ai-agent-hub remove --all
```

### Diagnostic Commands

```bash
# List all servers
npx ai-agent-hub list

# Show configured servers
npx ai-agent-hub list --configured

# Show available servers
npx ai-agent-hub list --available

# Check setup and diagnose issues
npx ai-agent-hub doctor

# Verbose diagnostics
npx ai-agent-hub doctor --verbose
```

## Preset Configurations

### basic-dev
**Includes:** filesystem, git, github  
**For:** Everyday coding tasks  
**Requires:** GITHUB_TOKEN

### full-stack  
**Includes:** basic-dev + postgres, playwright, docker  
**For:** Full-stack web development  
**Requires:** GITHUB_TOKEN, DATABASE_URL

### ai-enhanced
**Includes:** basic-dev + sequential-thinking, memory  
**For:** Complex problem-solving with persistent context  
**Requires:** GITHUB_TOKEN

### research
**Includes:** filesystem, fetch, context7, sequential-thinking  
**For:** Research, documentation, and analysis tasks  
**Requires:** None (optional CONTEXT7_API_KEY)

## Troubleshooting

### Claude Desktop not found
- Make sure Claude Desktop is installed: https://claude.ai/download
- Try running the command with sudo (macOS/Linux)
- Check if the config path exists manually

### NPX command not found
- Install Node.js 18 or higher: https://nodejs.org
- Verify installation: `node --version`

### Server not working after installation
1. Restart Claude Desktop completely
2. Run `npx ai-agent-hub doctor` to check configuration
3. Verify environment variables are set
4. Check server logs in Claude Desktop developer tools

### Permission denied errors
- macOS/Linux: May need to run with `sudo`
- Windows: Run terminal as Administrator
- Check file permissions on config directory

### Environment variable not detected
- Set the variable before running the command
- Or let the installer prompt you for the value
- Use `npx ai-agent-hub doctor` to verify

### Conflicts between global and project configs
- Project configs (`.mcp.json`) override global configs
- Use `list --configured` to see which is active
- Remove project config to use global: `rm .mcp.json`

## Support

- **Issues:** https://github.com/ArieGoldkin/ai-agent-hub/issues
- **NPM:** https://www.npmjs.com/package/ai-agent-hub

## License

MIT © [Arie Goldkin](https://github.com/ArieGoldkin)
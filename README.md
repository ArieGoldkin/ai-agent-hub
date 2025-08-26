# AI Agent Hub

Configure Claude Desktop with MCP servers in 30 seconds.

```bash
npx ai-agent-hub init
```

## What This Does

AI Agent Hub is an NPX installer that automatically configures Claude Desktop with MCP (Model Context Protocol) servers. Instead of manually installing packages and editing configuration files, set up multiple AI capabilities with one command.

## Quick Start

```bash
# Interactive setup with presets
npx ai-agent-hub init

# Or use a preset directly
npx ai-agent-hub init --preset basic-dev
```

## Available MCP Servers

### Core Development
- **filesystem** - Read, write, and search files and directories
- **github** - Manage repositories, issues, and pull requests  
- **git** - Version control operations (commit, branch, diff)

### Development Tools
- **playwright** - Browser automation for testing and web scraping
- **postgres** - PostgreSQL database operations
- **docker** - Container management
- **sqlite** - SQLite database operations

### AI Enhancement
- **sequential-thinking** - Advanced step-by-step reasoning for complex problems
- **memory** - Persistent context that remembers across conversations
- **context7** - Documentation search and code snippet retrieval

### Utilities
- **fetch** - HTTP client for web content and APIs
- **slack** - Slack messaging and workspace management
- **puppeteer** - Alternative browser automation

## Preset Configurations

Quick setup with pre-configured server combinations:

### `--preset basic-dev`
Filesystem, Git, GitHub

### `--preset full-stack`  
Basic-dev + PostgreSQL, Playwright, Docker

### `--preset ai-enhanced`
Basic-dev + Sequential thinking, Memory

### `--preset research`
Filesystem, Fetch, Context7, Sequential thinking

## Commands

```bash
# Interactive setup wizard
npx ai-agent-hub init

# Add a specific server
npx ai-agent-hub add github
npx ai-agent-hub add postgres

# Remove servers
npx ai-agent-hub remove playwright
npx ai-agent-hub remove --all

# List servers
npx ai-agent-hub list              # Show all
npx ai-agent-hub list --configured  # Show installed
npx ai-agent-hub list --available   # Show available to install

# Check your setup
npx ai-agent-hub doctor
```

## License

MIT © [Arie Goldkin](https://github.com/ArieGoldkin)
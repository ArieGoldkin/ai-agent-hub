# AI Agent Hub - MCP Server Installer for Claude Desktop

<p align="center">
  <strong>Configure Claude Desktop with powerful MCP servers in seconds</strong>
</p>

<p align="center">
  One command to give Claude filesystem access, GitHub integration, browser automation, and more.
</p>

## 🚀 Quick Start

```bash
npx ai-agent-hub init
```

That's it! This command will:

1. ✅ Detect your Claude Desktop installation
2. ✅ Let you select MCP servers to install
3. ✅ Configure environment variables
4. ✅ Update Claude's configuration automatically
5. ✅ Provide next steps to verify everything works

## 📦 What is this?

AI Agent Hub is a simple NPX installer that configures [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers for Claude Desktop. Instead of manually editing configuration files and installing packages, just run one command and you're done.

## 🎯 Features

- **🔍 Auto-detection**: Finds Claude Desktop on macOS, Windows, and Linux
- **📦 12+ MCP Servers**: Filesystem, GitHub, browser automation, databases, and more
- **🎨 Interactive Setup**: Beautiful CLI with helpful prompts
- **🔧 Environment Management**: Handles API keys and tokens securely
- **💾 Safe Updates**: Automatic backups before modifying configs
- **🚀 Presets**: Quick configurations for common workflows

## 📋 Available MCP Servers

### Core Servers

- **filesystem** - Read/write files and directories
- **github** - GitHub API integration (repos, issues, PRs)
- **git** - Version control operations

### Development Tools

- **playwright** - Browser automation and testing
- **docker** - Container management
- **postgres** - PostgreSQL database access
- **sqlite** - SQLite database operations

### AI & Knowledge

- **sequential-thinking** - Chain-of-thought reasoning
- **memory** - Persistent context storage
- **fetch** - Web scraping and API calls

### More Coming Soon!

The registry is extensible - new servers are added regularly.

## 🎮 Commands

### Initialize Claude with MCP servers

```bash
npx ai-agent-hub init
```

### Add a specific server

```bash
npx ai-agent-hub add github
```

### Remove servers

```bash
npx ai-agent-hub remove playwright
```

### List configured servers

```bash
npx ai-agent-hub list
```

### Check your setup

```bash
npx ai-agent-hub doctor
```

## 🎯 Preset Configurations

Quick setup for common use cases:

```bash
# Basic development setup (filesystem + git)
npx ai-agent-hub init --preset basic-dev

# Full stack development (+ GitHub, databases)
npx ai-agent-hub init --preset full-stack

# AI development (+ sequential-thinking, memory)
npx ai-agent-hub init --preset ai-enhanced

# Research & analysis (+ fetch, browser automation)
npx ai-agent-hub init --preset research
```

## 🔧 Non-Interactive Mode

Perfect for automation and CI/CD:

```bash
# Accept all defaults
npx ai-agent-hub init --yes

# Use specific preset without prompts
npx ai-agent-hub init --preset full-stack --yes
```

## 🤖 AI Agent Templates

The hub includes templates for specialized AI agents that work best with specific MCP server combinations:

- **AI/ML Engineer** - Optimized for machine learning tasks
- **Frontend Developer** - UI/UX development focus
- **Backend Architect** - System design and APIs
- **Code Reviewer** - Quality assurance and testing
- **And more...**

Each template includes recommended servers and example prompts.

## 📁 Configuration

Claude Desktop configurations are stored at:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude\claude_desktop_config.json`

AI Agent Hub automatically detects and updates these files.

## 🔐 Environment Variables

Some MCP servers require API keys or tokens. The installer will prompt you for these during setup:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

You can also set them before running the installer to skip prompts.

## 🧪 Verify Your Setup

After installation:

1. Run `npx ai-agent-hub doctor` to check everything
2. Restart Claude Desktop
3. In Claude, you should see your MCP servers available
4. Try a command like "Read files in the current directory" (if filesystem is installed)

## 📚 How It Works

1. **Detection**: Finds your Claude Desktop installation
2. **Selection**: Choose from available MCP servers
3. **Installation**: Uses NPX to install server packages
4. **Configuration**: Updates Claude's config with proper commands
5. **Validation**: Ensures everything is set up correctly

## 🤝 Contributing

We welcome contributions! To add a new MCP server:

1. Add it to `src/server-registry.ts`
2. Include metadata (description, required env vars, etc.)
3. Submit a PR

## 📄 License

MIT - Use freely in your projects

## 🙏 Acknowledgments

Built for the Claude and MCP community. Special thanks to Anthropic for Claude Desktop and the Model Context Protocol.

---

<p align="center">
  Made with ❤️ for developers who want to supercharge Claude Desktop
</p>

<p align="center">
  <strong>Questions? Issues? PRs welcome!</strong><br>
  <a href="https://github.com/yourusername/ai-agent-hub">GitHub Repository</a>
</p>

# AI Agent Hub 🚀

<p align="center">
  <strong>Supercharge Claude with powerful tools in seconds</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ai-agent-hub">
    <img src="https://img.shields.io/npm/v/ai-agent-hub.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/ai-agent-hub">
    <img src="https://img.shields.io/npm/dm/ai-agent-hub.svg" alt="npm downloads">
  </a>
  <a href="https://github.com/ArieGoldkin/ai-agent-hub/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
</p>

<p align="center">
  <strong>One command to give Claude filesystem access, GitHub integration, browser automation, and more!</strong>
</p>

```bash
npx ai-agent-hub init
```

---

## 🤔 What Problem Does This Solve?

**Manual MCP (Model Context Protocol) configuration is complex and time-consuming.**

### ❌ **Before AI Agent Hub** (The Hard Way)
```bash
# 1. Find and install each MCP server manually
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-github

# 2. Locate Claude's config (different on each OS)
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Windows: %APPDATA%\Claude\claude_desktop_config.json
# Linux: ~/.config/Claude/claude_desktop_config.json

# 3. Manually edit JSON configuration
# 4. Set up environment variables
# 5. Debug when it doesn't work...
# 6. Repeat for every server you want 😫
```

### ✅ **With AI Agent Hub** (The Easy Way)
```bash
npx ai-agent-hub init
# Interactive setup handles everything! ✨
```

**That's it!** In 30 seconds, Claude has superpowers.

---

## 🎯 Quick Start

### 1️⃣ **Run the Setup Wizard**
```bash
npx ai-agent-hub init
```

### 2️⃣ **Choose Your Setup**
- 🎮 **Interactive Mode**: Pick servers one by one
- 🚀 **Preset Mode**: Use pre-configured bundles
- ⚡ **Quick Mode**: Just the essentials

### 3️⃣ **Restart Claude**
That's it! Claude now has access to your chosen tools.

---

## 🛠️ Available MCP Servers

### Core Development Tools
| Server | Description | What Claude Can Do |
|--------|-------------|-------------------|
| **filesystem** | File system access | Read, write, search files & directories |
| **github** | GitHub integration | Manage repos, issues, PRs, actions |
| **git** | Version control | Commit, branch, merge, diff |

### Advanced Development
| Server | Description | What Claude Can Do |
|--------|-------------|-------------------|
| **playwright** | Browser automation | Web scraping, testing, automation |
| **postgres** | PostgreSQL access | Query databases, manage schemas |
| **docker** | Container management | Build, run, manage containers |
| **sqlite** | SQLite databases | Local database operations |

### AI & Knowledge Tools
| Server | Description | What Claude Can Do |
|--------|-------------|-------------------|
| **sequential-thinking** | Enhanced reasoning | Step-by-step problem solving |
| **memory** | Persistent context | Remember across conversations |
| **fetch** | Web data access | Fetch and process web content |
| **obsidian-vault** | Note management | Access your Obsidian knowledge base |

### Specialized Tools
| Server | Description | What Claude Can Do |
|--------|-------------|-------------------|
| **todoist** | Task management | Create and manage tasks |
| **spotify** | Music control | Control playback, search music |
| **discord** | Discord bot integration | Send messages, manage servers |

---

## 📦 Preset Configurations

Get started faster with pre-configured bundles:

### **🚀 Basic Development** (`--preset basic-dev`)
Perfect for everyday coding
- ✅ Filesystem access
- ✅ Git operations
- ✅ GitHub integration

### **🔧 Full-Stack** (`--preset full-stack`)
Everything for modern web development
- ✅ All basic-dev features
- ✅ Database access (PostgreSQL, SQLite)
- ✅ Browser automation (Playwright)
- ✅ Docker management

### **🧠 AI-Enhanced** (`--preset ai-enhanced`)
Maximize Claude's reasoning capabilities
- ✅ All basic-dev features
- ✅ Sequential thinking for complex problems
- ✅ Persistent memory
- ✅ Web data fetching

### **🔍 Research** (`--preset research`)
For analysis and research tasks
- ✅ Filesystem and git
- ✅ Web scraping (fetch, playwright)
- ✅ Note management (Obsidian)
- ✅ Enhanced reasoning

**Example:**
```bash
npx ai-agent-hub init --preset full-stack
```

---

## 🎮 All Commands

### `init` - Interactive Setup Wizard
```bash
npx ai-agent-hub init              # Interactive mode
npx ai-agent-hub init --preset basic-dev  # Use preset
npx ai-agent-hub init --yes        # Accept all defaults
```

### `add` - Add Individual Servers
```bash
npx ai-agent-hub add github        # Add GitHub integration
npx ai-agent-hub add postgres      # Add PostgreSQL access
```

### `remove` - Remove Servers
```bash
npx ai-agent-hub remove playwright # Remove specific server
npx ai-agent-hub remove --all      # Remove all servers
```

### `list` - View Servers
```bash
npx ai-agent-hub list              # Show all servers
npx ai-agent-hub list --configured # Show only installed
npx ai-agent-hub list --available  # Show available to install
```

### `doctor` - Diagnose Issues
```bash
npx ai-agent-hub doctor            # Check your setup
npx ai-agent-hub doctor --verbose  # Detailed diagnostics
```

---

## 🌟 Real-World Examples

### **Example 1: Code Review Assistant**
```bash
npx ai-agent-hub init --preset basic-dev
```
Now Claude can:
- 📝 Read your entire codebase
- 🔍 Search for patterns across files
- 📊 Analyze git history
- 🐛 Review PRs on GitHub

### **Example 2: Full-Stack Developer**
```bash
npx ai-agent-hub add filesystem github postgres playwright
```
Now Claude can:
- 🏗️ Scaffold entire applications
- 🗄️ Design and query databases
- 🧪 Write end-to-end tests
- 🚀 Deploy via GitHub Actions

### **Example 3: Research Analyst**
```bash
npx ai-agent-hub init --preset research
```
Now Claude can:
- 🌐 Fetch and analyze web data
- 📚 Access your knowledge base
- 📝 Create structured reports
- 🔄 Update findings in real-time

### **Example 4: DevOps Engineer**
```bash
npx ai-agent-hub add docker github postgres
```
Now Claude can:
- 🐳 Manage containerized applications
- ⚙️ Configure CI/CD pipelines
- 🗄️ Optimize database performance
- 📊 Monitor system health

---

## 🔐 Environment Variables

Some servers need API keys. The installer will prompt you automatically, or you can set them in advance:

```bash
# GitHub integration
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Database access
export DATABASE_URL=postgresql://user:pass@localhost/db

# Other services
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
export OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

---

## 🆚 Claude Desktop vs Claude Code

AI Agent Hub supports both:

### **Claude Desktop** (Global Configuration)
- ✅ System-wide MCP servers
- ✅ Available in all Claude Desktop windows
- ✅ Config location varies by OS

### **Claude Code** (Project Configuration)
- ✅ Project-specific servers
- ✅ Configuration in `.mcp.json`
- ✅ Different servers per project

The installer automatically detects your context and configures appropriately!

---

## 🐛 Troubleshooting

### **"Claude Desktop not found"**
```bash
# Make sure Claude Desktop is installed
# Download from: https://claude.ai/desktop
```

### **"NPX not found"**
```bash
# Install Node.js (includes NPX)
# Download from: https://nodejs.org
```

### **"Server not working"**
```bash
# Run diagnostics
npx ai-agent-hub doctor

# Check specific server
npx ai-agent-hub list --configured
```

### **"Environment variable missing"**
```bash
# The installer will tell you what's needed
# Or check with:
npx ai-agent-hub doctor
```

---

## 📖 How It Works

1. **Detection**: Finds your Claude installation automatically
2. **Selection**: Choose servers through interactive wizard or presets
3. **Installation**: Uses NPX to ensure servers are available
4. **Configuration**: Updates Claude's config files properly
5. **Validation**: Verifies everything is set up correctly

No global installs, no manual JSON editing, no hassle!

---

## 🤝 Contributing

We welcome contributions! Visit our [GitHub repository](https://github.com/ArieGoldkin/ai-agent-hub):

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
- ⭐ Star the project!

---

## 📈 Why Choose AI Agent Hub?

- **🚀 Fast**: 30-second setup
- **🎯 Simple**: One command to start
- **🔒 Safe**: Automatic backups of configs
- **📦 Comprehensive**: 12+ servers and growing
- **🎮 Flexible**: Interactive or preset modes
- **🔍 Smart**: Auto-detects your environment
- **💼 Professional**: Used by developers worldwide

---

## 🏁 Get Started Now!

Stop configuring, start creating. Give Claude the tools it needs:

```bash
npx ai-agent-hub init
```

**Transform Claude from an AI assistant into an AI developer!** 🚀

---

## 📄 License

MIT © [Arie Goldkin](https://github.com/ArieGoldkin)

---

<p align="center">
  <strong>Questions? Issues? We're here to help!</strong><br>
  <a href="https://github.com/ArieGoldkin/ai-agent-hub/issues">GitHub Issues</a> •
  <a href="https://www.npmjs.com/package/ai-agent-hub">NPM Package</a>
</p>

<p align="center">
  Made with ❤️ for the Claude community
</p>
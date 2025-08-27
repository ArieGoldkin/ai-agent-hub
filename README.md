# 🚀 AI Agent Hub

<div align="center">
  
  ### ✨ Supercharge Claude with 9 AI Agents & MCP Servers in One Command ✨
  ### 🖥️ Works on macOS, Windows & Linux
  
  [![npm version](https://img.shields.io/npm/v/ai-agent-hub?style=flat-square&color=blue)](https://www.npmjs.com/package/ai-agent-hub)
  [![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](package.json)
  [![Cross-Platform](https://img.shields.io/badge/platform-macOS%20|%20Windows%20|%20Linux-lightgrey?style=flat-square)](README.md)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
  
  <p align="center">
    <strong>Transform Claude into a powerhouse with specialized AI personalities and enhanced capabilities</strong><br>
    <em>Compatible with macOS, Windows, and Linux</em>
  </p>
  
  ```bash
  npx ai-agent-hub@latest
  ```
  
  <sub>One command. Zero config. Instant superpowers. 🎯</sub>
  
</div>

---

## 🎭 What You Get

### 🤖 **9 Specialized AI Agent Personalities**

Transform Claude with expert agents, each with unique skills:

| Agent                           | Superpower                  | Perfect For                                |
| ------------------------------- | --------------------------- | ------------------------------------------ |
| 🧠 **ai-ml-engineer**           | AI/ML implementation expert | LLMs, computer vision, ML pipelines        |
| 🏗️ **backend-system-architect** | System design & scaling     | APIs, databases, microservices             |
| ✅ **code-quality-reviewer**    | Automated code review       | Best practices, testing, refactoring       |
| 💻 **frontend-ui-developer**    | React/Vue/Angular master    | Components, responsive design, performance |
| 🎨 **rapid-ui-designer**        | Lightning-fast prototyping  | Design systems, mockups, UI/UX             |
| 📊 **sprint-prioritizer**       | Agile planning wizard       | Sprint planning, feature prioritization    |
| 🎯 **studio-coach**             | Peak performance coach      | Team coordination, productivity            |
| 🔍 **ux-researcher**            | User insights specialist    | Research, testing, journey mapping         |
| ✨ **whimsy-injector**          | Creative enhancement        | Delightful experiences, memorable moments  |

### ⚙️ **Powerful MCP Server Integration**

Unlock Claude's full potential with these capabilities:

| Server                     | Enhancement                    | Use Case                         |
| -------------------------- | ------------------------------ | -------------------------------- |
| 🧠 **memory**              | Persistent conversation memory | Remember context across sessions |
| 🤔 **sequential-thinking** | Step-by-step reasoning         | Complex problem solving          |
| 📚 **context7**            | Advanced context management    | Large-scale projects             |
| 🎭 **playwright**          | Browser automation             | Testing, web scraping            |
| 🗄️ **supabase**            | Database integration           | Direct DB operations             |
| 📁 **filesystem**          | File operations                | Local file management\*          |
| 🐙 **github**              | Repository access              | Code management\*                |

<sub>\*Claude Code has native filesystem and GitHub support, so these are only added to Claude Desktop</sub>

---

## 🚀 Quick Start

### 📦 **Installation (Interactive Setup!)**

> **💡 Important:** Always use `@latest` to ensure you get the correct version with all features!

```bash
# Run this command and choose your installation preference
npx ai-agent-hub@latest
```

**Interactive Setup** ✨ The tool will:

- 🎯 **Ask where you want to create files** (Claude Code, Claude Desktop, or Both)
- 🤖 Create 9 AI agent personalities where you choose
- ⚙️ Configure MCP servers based on your selection
- 📄 Set up all configuration files
- 🔐 Create environment templates (never overwrites existing `.env`)

### 🚀 **Non-Interactive Options**

For automation or when you know exactly what you want:

```bash
# Create files in current directory only
npx ai-agent-hub@latest --project-only

# Create files in Claude Desktop only 
npx ai-agent-hub@latest --desktop-only

# Create files in both locations
npx ai-agent-hub@latest --both
```

### 🤔 **Choose Where to Create Files**

When you run `npx ai-agent-hub@latest`, you'll see an interactive menu:

```
🤖 Where would you like to create AI Agent Hub files?

1. 🖥️  Claude Desktop
   → Create MCP servers globally in Claude Desktop configuration

2. 📁 Claude Code (in repo)
   → Create AI agents + MCP servers in current directory (.claude/agents/ + .mcp.json)

3. 🚀 Both
   → Create agents in repo + MCP servers in both repo and Claude Desktop

Please select an option (1-3):
```

### 🎯 **What Happens Next**

<details>
<summary><b>📁 In a Project Directory</b> (has `package.json` or `.git`)</summary>

```
✨ Installing AI Agent Hub...

🤖 AI Agent Personalities
   ✅ Installed 9 agents to .claude/agents/

⚙️  MCP Server Configuration
   ✅ Created .mcp.json with 5 servers
   ✅ Environment template created

🎉 Setup complete! Restart Claude to activate.
```

**Files created:**

```
your-project/
├── .claude/
│   ├── agents/           # 9 AI personalities
│   └── settings.local.json
├── .mcp.json            # MCP configuration
└── .env.example         # API key template
```

</details>

<details>
<summary><b>💻 With Claude Desktop</b></summary>

```
✨ Configuring Claude Desktop...

⚙️  Global Configuration
   ✅ Updated with 7 MCP servers
   ✅ All capabilities enabled

🎉 Setup complete! Restart Claude Desktop.
```

**Updates Claude Desktop config:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

</details>

<details>
<summary><b>🎮 Both Detected (Best Experience)</b></summary>

```
✨ Full Installation Mode

🤖 Project Setup
   ✅ Agents installed to .claude/agents/
   ✅ Created .mcp.json (5 servers)

💻 Desktop Setup
   ✅ Updated config (7 servers)

🎉 Maximum power unlocked!
```

</details>

---

## 📚 Usage Guide

### 🎮 **Command Reference**

| Command                                     | Description                    | When to Use                    |
| ------------------------------------------- | ------------------------------ | ------------------------------ |
| `npx ai-agent-hub@latest`                   | **Interactive file creation**  | First time setup (recommended) |
| `npx ai-agent-hub@latest --project-only`    | Create files in repo only      | Working on specific project    |
| `npx ai-agent-hub@latest --desktop-only`    | Create files in Claude Desktop only | Global Claude enhancement      |
| `npx ai-agent-hub@latest --both`            | Create files in both locations | Maximum functionality          |
| `npx ai-agent-hub@latest --list-agents`     | View all 9 agents             | See available personalities    |
| `npx ai-agent-hub@latest --list`            | Show configured servers        | Check current setup            |
| `npx ai-agent-hub@latest <server>`          | Add specific server            | Need one capability            |
| `npx ai-agent-hub@latest --remove <server>` | Remove a server                | Cleanup unwanted servers       |
| `npx ai-agent-hub@latest --help`            | Display help                   | See all commands               |

### 💡 **Pro Usage Examples**

#### 🎯 Using AI Agents in Claude

Once created, simply ask Claude to use specific agents:

```markdown
"Use the ai-ml-engineer agent to implement this RAG system"
"Have the sprint-prioritizer help plan our next sprint"  
"Get the code-quality-reviewer to audit this PR"
"Ask the whimsy-injector to make this UI delightful"
```

#### ⚡ Quick Server Management

```bash
# Add specific capabilities
npx ai-agent-hub@latest memory          # Add conversation memory
npx ai-agent-hub@latest playwright      # Add browser automation
npx ai-agent-hub@latest supabase        # Add database access

# Remove unwanted servers
npx ai-agent-hub@latest --remove docker

# Check what's configured
npx ai-agent-hub@latest --list
```

---

## 🔧 Configuration

### 🔐 **Environment Variables**

Some MCP servers need API keys. The tool:

- ✅ **Never overwrites** existing `.env` files
- 📋 Creates `.env.example` as a template
- 🔍 Reports missing variables clearly
- 📝 Provides setup instructions

<details>
<summary><b>Required API Keys</b></summary>

| Variable                | Required For    | How to Get                                         |
| ----------------------- | --------------- | -------------------------------------------------- |
| `GITHUB_TOKEN`          | GitHub server   | [Create token](https://github.com/settings/tokens) |
| `SUPABASE_ACCESS_TOKEN` | Supabase server | [Get from dashboard](https://app.supabase.com)     |
| `SUPABASE_PROJECT_REF`  | Supabase server | Your project reference                             |
| `BRAVE_API_KEY`         | Brave search    | [Get API key](https://brave.com/search/api/)       |

</details>

### 🎯 **Context-Aware Installation**

The tool intelligently adapts to your environment:

| Environment               | What Gets Created      | Why                                         |
| ------------------------- | ---------------------- | ------------------------------------------- |
| **Project + Claude Code** | Agents + 5 MCP servers | Excludes filesystem/github (native support) |
| **Claude Desktop Only**   | 7 MCP servers globally | Full desktop enhancement                    |
| **Both Detected**         | Everything optimized   | Best of both worlds                         |

### 🖥️ **Cross-Platform Support**

AI Agent Hub automatically detects your operating system and uses the correct Claude Desktop configuration paths:

| Operating System | Claude Desktop Config Path |
|------------------|----------------------------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

The tool works identically across all platforms - no OS-specific commands needed!

---

## 🛠️ Troubleshooting

<details>
<summary><b>💭 "Command not found"</b></summary>

Make sure you have Node.js installed:

```bash
node --version  # Should be 16+
```

</details>

<details>
<summary><b>🔄 "Agents not showing in Claude"</b></summary>

1. Restart Claude (Desktop or Code)
2. Check `.claude/settings.local.json` exists
3. Verify agent files in `.claude/agents/`
</details>

<details>
<summary><b>⚠️ "Missing environment variables"</b></summary>

1. Check the `.env.example` file
2. Copy to `.env` and add your keys
3. Never commit `.env` to git!
</details>

<details>
<summary><b>🚫 "No Claude installation detected"</b></summary>

- Install [Claude Desktop](https://claude.ai/download) or
- Run in a project directory (with `package.json`)
</details>

---

## 🌟 Features

### ✨ **Why AI Agent Hub?**

- **🚀 Zero Dependencies** - Installs instantly, no bloat
- **🎯 One Command** - No complex setup or configuration
- **🧠 Smart Detection** - Adapts to your environment automatically
- **🔒 Safe Operations** - Never overwrites your files
- **📦 No Installation** - Works directly with npx
- **🖥️ Cross-Platform** - Works on macOS, Windows, and Linux
- **🎭 9 Expert Agents** - Specialized personalities for every task
- **⚙️ 7+ MCP Servers** - Enhanced capabilities out of the box

### 🏆 **Perfect For**

- 👨‍💻 **Developers** wanting Claude superpowers instantly
- 🚀 **Teams** needing consistent AI assistance
- 🎨 **Designers** leveraging AI for rapid prototyping
- 📊 **Product Managers** planning sprints with AI
- 🔬 **Researchers** needing specialized AI expertise

---

## 🤝 Contributing

We love contributions! Here's how to help:

### 🆕 **Add a New MCP Server**

1. Edit `lib/mcp-templates.ts`
2. Add server configuration
3. Test: `npm run build && node dist/bin/cli.js`
4. Submit PR with description

### 🤖 **Create a New Agent**

1. Add `.md` file to `agents/`
2. Follow existing format with frontmatter
3. Test installation locally
4. Submit PR with use cases

### 🐛 **Report Issues**

Found a bug? [Open an issue](https://github.com/ArieGoldkin/ai-agent-hub/issues) with:

- Your environment (OS, Claude version)
- Command that failed
- Error message
- Expected behavior

---

## 📄 License

MIT © 2024 AI Agent Hub

---

<div align="center">
  
  ### 🌟 **Ready to Supercharge Claude?** 🌟
  
  ```bash
  npx ai-agent-hub@latest
  ```
  
  <sub>Built with ❤️ to make Claude even more powerful</sub>
  
  [Report Bug](https://github.com/ArieGoldkin/ai-agent-hub/issues) · [Request Feature](https://github.com/ArieGoldkin/ai-agent-hub/issues) · [Star on GitHub](https://github.com/ArieGoldkin/ai-agent-hub)
  
</div>

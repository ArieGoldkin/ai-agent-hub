# 🤖 AI Agent Hub - Supercharge Claude with AI Agents & MCP Servers

Instantly add 9 specialized AI agent personalities and powerful MCP server capabilities to Claude Desktop and Claude Code with a single command.

## ✨ What You Get

### 🎭 9 AI Agent Personalities (The Main Event!)
Specialized agents that transform how Claude assists you:
- **ai-ml-engineer** - AI/ML implementation expert for LLMs, computer vision
- **backend-system-architect** - System design and scaling specialist  
- **code-quality-reviewer** - Automated code review and best practices
- **frontend-ui-developer** - React/Vue/Angular and responsive design
- **rapid-ui-designer** - Quick prototyping and design systems
- **sprint-prioritizer** - Agile planning and feature prioritization
- **studio-coach** - Team coordination and peak performance
- **ux-researcher** - User research, testing, journey mapping
- **whimsy-injector** - Creative enhancement for delightful experiences

### ⚙️ Smart MCP Server Configuration
Context-aware server setup that adapts to your environment:
- **memory** - Persistent conversation memory
- **sequential-thinking** - Step-by-step reasoning
- **context7** - Advanced context management
- **playwright** - Browser automation
- **supabase** - Database integration
- **filesystem** - Local file operations (Claude Desktop only*)
- **github** - Repository access (Claude Desktop only*)

_*Claude Code has native filesystem and GitHub support, so we don't duplicate them_

## 🚀 Installation

```bash
npx ai-agent-hub
```

That's it! The installer will:
1. ✅ Install 9 AI agent personalities to `.claude/agents/`
2. ✅ Configure MCP servers based on your context
3. ✅ Set up environment variables safely
4. ✅ Create appropriate config files

## 📖 Usage Guide

### Default Installation (Recommended)
```bash
npx ai-agent-hub
```
This command will:
- Detect if you're in a project (has `package.json` or `.git`)
- Install agents to `.claude/agents/` if in a project
- Configure MCP servers appropriately:
  - **In a project**: Creates `.mcp.json` with 5 servers (excludes filesystem/github)
  - **Claude Desktop**: Updates global config with all 7 servers
  - **Both detected**: Configures both with context-aware defaults

### List Available Agents
```bash
npx ai-agent-hub --list-agents
```
Shows all 9 agent personalities with descriptions.

### List Configured Servers
```bash
npx ai-agent-hub --list
```
Shows which MCP servers are currently configured.

### Add Specific Server
```bash
npx ai-agent-hub memory
npx ai-agent-hub supabase
```
Add a single MCP server to your configuration.

### Remove Server
```bash
npx ai-agent-hub --remove memory
```
Remove a server from all configurations.

## 🎯 Context-Aware Installation

The tool intelligently adapts based on your environment:

### In a Project Directory
When you run the command in a directory with `package.json` or `.git`:
```
📁 Project detected

🤖 Installing AI Agent Personalities...
✅ Installed 9 AI agent personalities to .claude/agents/

⚙️ Configuring MCP Servers...
✅ Configured 5 MCP servers in .mcp.json
   (filesystem & github omitted - Claude Code has native support)
```

### With Claude Desktop Only
When Claude Desktop is installed but you're not in a project:
```
🖥️ Configuring Claude Desktop
✅ Updated Claude Desktop configuration with 7 servers
```

### Both Contexts
When both Claude Desktop and a project are detected:
```
📁 Project detected
✅ Installed agents to .claude/agents/
✅ Configured 5 servers in .mcp.json
✅ Updated Claude Desktop with all 7 servers
```

## 🔐 Environment Variables

Some MCP servers require API keys. The installer will:
1. Never overwrite your existing `.env` file
2. Create `.env` from template only if it doesn't exist
3. Report missing environment variables
4. Guide you on what needs to be added

Required API keys:
- `GITHUB_TOKEN` - For GitHub MCP server
- `SUPABASE_ACCESS_TOKEN` - For Supabase integration
- `SUPABASE_PROJECT_REF` - Your Supabase project reference

## 📁 What Gets Created

### In Project Mode
```
your-project/
├── .claude/
│   ├── agents/           # 9 AI agent personalities
│   │   ├── ai-ml-engineer.md
│   │   ├── backend-system-architect.md
│   │   └── ... (7 more agents)
│   └── settings.local.json
├── .mcp.json            # MCP server configuration
└── .env                 # API keys (if it didn't exist)
```

### Claude Desktop Config
Updates: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
Or equivalent on Windows/Linux

## 🔄 After Installation

1. **Restart Claude** - Either Claude Desktop or Claude Code
2. **Add API Keys** - Update `.env` with your tokens
3. **Start Using** - Agents are automatically available!

## 💡 Pro Tips

### Using AI Agents
Once installed, agents become available in Claude automatically. Just ask Claude to use a specific agent:
- "Use the ai-ml-engineer agent to help implement this ML feature"
- "Have the sprint-prioritizer help plan our next sprint"
- "Get the code-quality-reviewer to check this PR"

### MCP Server Benefits
- **memory** - Claude remembers context across conversations
- **sequential-thinking** - Better step-by-step problem solving
- **playwright** - Automate browser testing and scraping
- **supabase** - Direct database queries and operations

## 🛠️ Troubleshooting

### "No Claude installation detected"
- Install Claude Desktop from [claude.ai](https://claude.ai/download)
- Or run the command in a project directory for Claude Code

### Servers not showing in Claude
- Restart Claude after installation
- Check that `.mcp.json` was created (for projects)
- Verify Claude Desktop config was updated

### Missing environment variables
- Check the `.env` file for required keys
- Add your API tokens as instructed
- Never commit `.env` to version control!

## 📦 Zero Dependencies

This tool has zero runtime dependencies and minimal install dependencies:
- Installs instantly via NPX
- No global installations required
- No background processes
- Pure configuration management

## 🤝 Contributing

PRs welcome! To add new MCP servers:
1. Add to `lib/mcp-templates.ts`
2. Update context defaults if needed
3. Test with `npm run build && node dist/bin/cli.js`

## 📄 License

MIT

---

**Built with ❤️ to make Claude even more powerful**
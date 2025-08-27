/**
 * Help command - Shows usage information
 */

export function showHelp(): void {
  console.log(`
🤖 AI Agent Hub - AI Agents & MCP Server Configuration

Highlights:
  • 9 specialized AI agent personalities for Claude
  • 7+ MCP servers for enhanced capabilities
  • Zero dependencies, instant setup

Usage:
  ai-agent-hub              Interactive setup (asks where to install)
  ai-agent-hub --project-only   Install only to current project
  ai-agent-hub --desktop-only   Install only to Claude Desktop
  ai-agent-hub --both          Install to both project and desktop
  ai-agent-hub --list-agents  Show available AI agents
  ai-agent-hub --list       List configured servers
  ai-agent-hub <server>     Add a specific server
  ai-agent-hub --remove <server>  Remove a server
  ai-agent-hub session <cmd>  Manage agent collaboration sessions
  ai-agent-hub --help       Show this help

AI Agents (Installed to .claude/agents/):
  • ai-ml-engineer     - AI/ML implementation expert
  • backend-architect  - System design specialist
  • quality-reviewer   - Code review automation
  • frontend-developer - UI/UX implementation
  • ui-designer        - Quick prototyping
  • sprint-prioritizer - Agile planning
  • And 3 more specialized agents!

MCP Servers (Auto-configured based on context):
  memory              Persistent conversation memory
  sequential-thinking Step-by-step reasoning
  context7            Context management (Upstash)
  playwright          Browser automation
  supabase            Database integration
  filesystem          Local file operations (Desktop only*)
  github              Repository access (Desktop only*)
  docker              Container management
  postgres            PostgreSQL access
  brave-search        Web search
  
  * Claude Code has native filesystem and GitHub support

Session Commands:
  session start [name]    Start a new collaboration session
  session show            Display current session context
  session clear           Clear and archive current session
  session list            Show last 5 archived sessions
  session help            Show session command help

Examples:
  ai-agent-hub              # Interactive setup (asks where to install)
  ai-agent-hub --both       # Install everywhere (non-interactive)
  ai-agent-hub --project-only  # Project only (agents + MCP)
  ai-agent-hub --desktop-only  # Desktop only (MCP servers)
  ai-agent-hub --list-agents  # See all agents
  ai-agent-hub supabase     # Add Supabase server
  ai-agent-hub session start  # Start new session
`);
}
/**
 * Session Help Module
 * 
 * Provides help text for session commands
 */

export function showSessionHelp(): void {
  console.log(`
🔄 Session Management Commands

Usage:
  ai-agent-hub session <command> [options]

Commands:
  start [name]   Start a new session with optional name
  show           Display current session context
  clear          Clear current session (archives it first)
  list           Show last 5 archived sessions
  help           Show this help message

Examples:
  ai-agent-hub session start              # Start with auto-generated name
  ai-agent-hub session start project-x    # Start with custom name
  ai-agent-hub session show               # View current session
  ai-agent-hub session clear              # Clear and archive session
  ai-agent-hub session list               # View session history

What are Sessions?
  Sessions track agent collaboration and decision-making across your
  work. They enable agents to share context and make informed handoffs,
  creating a more intelligent and coordinated AI assistant experience.

Session Storage:
  Current: .claude/session-context.json
  Archive: .claude/session-archive.json (last 10 sessions)

Note:
  Sessions are automatically created when agents interact. Use these
  commands to manage sessions manually when needed.
`);
}
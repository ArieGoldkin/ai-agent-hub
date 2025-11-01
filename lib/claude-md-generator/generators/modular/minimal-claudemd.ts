/**
 * Minimal CLAUDE.md Generator
 *
 * Generates a lightweight CLAUDE.md that references modular instruction files
 * Reduces initial context load from ~5-6k tokens to ~1k tokens
 */

import { AgentMetadata, ExecutionMode } from '../../types.js';

/**
 * Generate minimal CLAUDE.md with dynamic loading instructions
 */
export function generateMinimalClaudeMd(
  agents: AgentMetadata[],
  mode: ExecutionMode = 'classic'
): string {
  const sections: string[] = [];

  // Frontmatter
  sections.push('---');
  sections.push('name: claude-main');
  sections.push('description: AI Agent Hub - Modular Intelligence System');
  sections.push('version: 3.4.2');
  sections.push('---\n');

  // Title
  sections.push('# 🚀 AI Agent Hub - Intelligent Orchestration\n');
  sections.push(`**Mode**: ${mode === 'squad' ? '⚡ Squad (Parallel)' : '📚 Classic (Sequential)'}\n`);

  // Core instruction
  sections.push('## 📋 Dynamic Instruction Loading\n');
  sections.push('This project uses a modular instruction system to optimize token usage.\n');
  sections.push('**IMPORTANT**: Load instructions dynamically based on the task:\n');

  // Instruction modules
  sections.push('### 📁 Available Instruction Modules\n');
  sections.push('| Module | Purpose | When to Load |');
  sections.push('|--------|---------|--------------|');
  sections.push('| `.claude/instructions/orchestration.md` | Routing & coordination | Complex tasks, multi-agent work |');
  sections.push('| `.claude/instructions/agents.md` | Agent capabilities | When invoking specific agents |');
  sections.push('| `.claude/instructions/context.md` | Context system | Session continuity, handoffs |');
  sections.push('| `.claude/instructions/workflows.md` | Workflow patterns | Multi-step projects |');
  sections.push('| `.claude/instructions/context-middleware.md` | **AUTO-LOADED** Context protocol | Always active for ALL agents |');
  sections.push('| `.claude/instructions/cli-integration.md` | CLI auto-detection | Claude Code CLI interactions |\n');

  // Quick start
  sections.push('## 🎯 Quick Start\n');
  sections.push('1. **Simple tasks**: Work directly without loading extra instructions');
  sections.push('2. **Agent work**: Read `.claude/instructions/agents.md` for capabilities');
  sections.push('3. **Complex projects**: Read `.claude/instructions/orchestration.md` for routing');
  sections.push('4. **Multi-session**: Read `.claude/instructions/context.md` for continuity');
  sections.push('5. **CLI usage**: Read `.claude/instructions/cli-integration.md` for auto-detection\n');

  // Agent trigger detection
  sections.push('## 🔍 Auto-Detection\n');
  sections.push('Check `.claude/context-triggers.md` for keyword-based agent activation.');
  sections.push('For semantic routing beyond keywords, load `.claude/instructions/orchestration.md`.\n');

  // Available agents (minimal)
  sections.push('## 👥 Available Agents\n');
  if (agents.length > 0) {
    agents.forEach(agent => {
      sections.push(`- **${agent.name}**`);
    });
  } else {
    sections.push('*9 specialized agents installed - load `.claude/instructions/agents.md` for details*');
  }
  sections.push('\n');

  // Context awareness (minimal)
  sections.push('## 🧠 Context Awareness (AUTOMATIC)\n');
  sections.push('- **ALL agents auto-load** `.claude/instructions/context-middleware.md`');
  sections.push('- Session data: `.claude/context/shared-context.json`');
  sections.push('- Context protocol is **mandatory** - agents read/write context automatically');
  sections.push('- For full context rules: Read `.claude/instructions/context.md`');
  sections.push('- No configuration needed - works out of the box\n');

  // MCP servers
  sections.push('## ⚙️ MCP Servers\n');
  sections.push('Configured in `.mcp.json` - includes memory, thinking, browsing, and more.\n');

  // Skills
  sections.push('## 📚 Claude Code Skills\n');
  sections.push('7 comprehensive skills available in `/skills/` directory:');
  sections.push('- **architecture-decision-record** - Document architectural decisions');
  sections.push('- **api-design-framework** - REST/GraphQL/gRPC API design');
  sections.push('- **testing-strategy-builder** - Comprehensive testing strategies');
  sections.push('- **code-review-playbook** - Structured code review process');
  sections.push('- **design-system-starter** - Design tokens & component architecture');
  sections.push('- **database-schema-designer** - SQL/NoSQL schema design');
  sections.push('- **security-checklist** - OWASP Top 10 security guidance');
  sections.push('\nClaude automatically discovers and uses these skills when relevant.\n');

  // Footer
  sections.push('---');
  sections.push('*💡 This minimal CLAUDE.md saves ~80% context tokens through dynamic loading*');

  return sections.join('\n');
}
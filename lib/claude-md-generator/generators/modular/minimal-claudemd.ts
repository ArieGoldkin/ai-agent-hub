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
  sections.push('version: 3.5.0');
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
  sections.push('Specialized knowledge modules installed in `/skills/` directory:\n');
  sections.push('| Skill | Use When |');
  sections.push('|-------|----------|');
  sections.push('| **architecture-decision-record** | Documenting architectural decisions (ADRs) |');
  sections.push('| **api-design-framework** | Designing REST/GraphQL/gRPC APIs |');
  sections.push('| **testing-strategy-builder** | Building test plans and coverage strategies |');
  sections.push('| **code-review-playbook** | Conducting code reviews with conventional comments |');
  sections.push('| **design-system-starter** | Creating design systems, tokens, components |');
  sections.push('| **database-schema-designer** | Designing SQL/NoSQL schemas and migrations |');
  sections.push('| **security-checklist** | Security audits, OWASP Top 10 compliance |');
  sections.push('| **evidence-verification** | Collecting quality evidence (v3.5.0) |');
  sections.push('| **quality-gates** | Complexity assessment and gate validation (v3.5.0) |');
  sections.push('');
  sections.push('**How it works:**');
  sections.push('- Skills use progressive disclosure (metadata → SKILL.md → bundled resources)');
  sections.push('- Includes templates, checklists, references, and examples');
  sections.push('- Load automatically when Claude detects relevant tasks');
  sections.push('- Location: Check `/skills/<skill-name>/SKILL.md` for details\n');

  // Production Features (v3.5.0)
  sections.push('## 🏭 Production Features (v3.5.0)\n');
  sections.push('### Evidence-Based Verification');
  sections.push('- **Proof over promises**: Exit codes, test results, build logs');
  sections.push('- **Quality standards**: Minimum → Production-Grade → Gold Standard');
  sections.push('- **Auto-recorded**: All agents record evidence in shared context');
  sections.push('- **No hallucinations**: Evidence proves completion, not claims\n');
  sections.push('### Quality Gates');
  sections.push('- **Complexity scoring**: 1-5 scale prevents overwhelming tasks');
  sections.push('- **Blocking thresholds**: >3 questions, missing deps, 3+ attempts');
  sections.push('- **Stuck detection**: Auto-escalate after 3 failed attempts');
  sections.push('- **Failure cascades**: Block dependent tasks when upstream fails\n');
  sections.push('### Auto-Scanning');
  sections.push('- **Security scans**: npm audit / pip-audit on every review');
  sections.push('- **Auto-trigger**: Code Quality Reviewer runs security checks');
  sections.push('- **Blocking**: Critical vulnerabilities block approval');
  sections.push('- **Fix commands**: Actionable remediation guidance\n');

  // Footer
  sections.push('---');
  sections.push('*💡 This minimal CLAUDE.md saves ~80% context tokens through dynamic loading*');

  return sections.join('\n');
}
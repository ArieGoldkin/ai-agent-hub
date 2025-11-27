/**
 * Minimal CLAUDE.md Generator
 *
 * Generates a lightweight CLAUDE.md that references modular instruction files
 * Reduces initial context load from ~5-6k tokens to ~1k tokens
 */

import { AgentMetadata, ExecutionMode } from '../../types.js';
import { VERSION, SKILL_COUNT, AGENT_COUNT } from '../../../version.js';

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
  sections.push(`version: ${VERSION}`);
  sections.push('---\n');

  // Title
  sections.push('# 🚀 AI Agent Hub - Intelligent Orchestration\n');
  sections.push(`**Mode**: ${mode === 'squad' ? '⚡ Squad (Parallel)' : '📚 Classic (Sequential)'}\n`);

  // Core instruction - DIRECTIVE LANGUAGE (Anthropic best practices)
  sections.push('## 📋 Modular Instruction System\n');
  sections.push('This project uses specialized instruction files to optimize tokens while maintaining agent capabilities.\n');
  sections.push('**YOU MUST** follow the agent activation protocol below for every task.\n');

  // Instruction modules - descriptive reference
  sections.push('### 📁 Available Instruction Files\n');
  sections.push('| File | Contains |');
  sections.push('|------|----------|');
  sections.push('| `.claude/instructions/orchestration.md` | Agent routing & coordination rules |');
  sections.push('| `.claude/instructions/agents.md` | Full agent capabilities & specializations |');
  sections.push('| `.claude/instructions/context.md` | Context persistence system details |');
  sections.push('| `.claude/instructions/workflows.md` | Multi-step project patterns |');
  sections.push('| `.claude/instructions/context-middleware.md` | Context protocol (load when using agents) |');
  sections.push('| `.claude/instructions/cli-integration.md` | Claude Code CLI behavior |');
  sections.push('| `.claude/instructions/super-design.md` | UI/frontend design workflow & tools |');

  // Add Squad mode files if in squad mode
  if (mode === 'squad') {
    sections.push('| `.claude/instructions/supervisor-rules.md` | Squad supervisor orchestration rules |');
    sections.push('| `.claude/instructions/squad-roster.md` | Agent assignments & capabilities |');
    sections.push('| `.claude/instructions/communication-protocol.md` | File-based messaging protocol |');
    sections.push('| `.claude/instructions/parallel-execution-rules.md` | Conflict prevention & locking |');
    sections.push('| `.claude/instructions/architecture-decisions.md` | Shared architectural context |');
  }

  sections.push('\n');

  // MANDATORY activation protocol (Anthropic pattern: directive + action-oriented)
  sections.push('## ⚡ MANDATORY: Agent Activation Protocol\n');
  sections.push('**BEFORE responding to ANY user task, YOU MUST execute this protocol:**\n');
  sections.push('### Step 1: Check for Agent Triggers');
  sections.push('Read `.claude/context-triggers.md` and check if the user\'s request contains keywords matching any agent.\n');
  sections.push('### Step 2: Activate Matching Agent(s)');
  sections.push('**IF keywords match** → Read `.claude/instructions/orchestration.md`, then **MUST READ** `.claude/agents/<agent-name>.md` to load the agent\'s full capabilities, protocols, and implementation requirements.');
  sections.push('**IF multi-domain task** (e.g., "build app", "full project") → Activate Studio Coach, then read `.claude/agents/studio-coach.md`.');
  sections.push('**IF no match** → Proceed with general capabilities, but remain alert for implicit domain signals.\n');
  sections.push('### Step 3: Load Context Protocol (When Using Agents)');
  sections.push('**WHEN agent is activated** → Read `.claude/instructions/context-middleware.md` for context management rules.');
  sections.push('**ALWAYS** record decisions, evidence, and actions to `.claude/context/shared-context.json`.\n');
  sections.push('### Examples of Trigger Matching');
  sections.push('- User says "design REST API" → **Backend System Architect** (keywords: API, REST, backend)');
  sections.push('  → Read `.claude/agents/backend-system-architect.md` for implementation protocols');
  sections.push('- User says "create React component" → **Frontend UI Developer** (keywords: React, component, UI)');
  sections.push('  → Read `.claude/agents/frontend-ui-developer.md` for component patterns');
  sections.push('- User says "build task manager app" → **Studio Coach** coordinates multiple agents (multi-domain)');
  sections.push('  → Read `.claude/agents/studio-coach.md` for orchestration rules\n');

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

  // Context protocol - MANDATORY (Anthropic pattern: "YOU MUST")
  sections.push('## 🧠 IMPORTANT: Context Protocol\n');
  sections.push('**WHEN working with activated agents, YOU MUST:**\n');
  sections.push('1. **Read** `.claude/instructions/context-middleware.md` before agent work begins');
  sections.push('2. **Record** all decisions, architectural choices, and evidence to `.claude/context/shared-context.json`');
  sections.push('3. **Check** existing context at session start to maintain continuity across conversations');
  sections.push('4. **Share** context between agents when coordinating multi-agent tasks\n');
  sections.push('**Context file location:** `.claude/context/shared-context.json`');
  sections.push('**Full protocol details:** Read `.claude/instructions/context.md` for advanced scenarios\n');

  // MCP servers
  sections.push('## ⚙️ MCP Servers\n');
  sections.push('**Installed (3 core servers):** ~7k tokens');
  sections.push('- **memory** - Conversation persistence across sessions');
  sections.push('- **sequential-thinking** - Advanced multi-step reasoning');
  sections.push('- **context7** - Library documentation lookup\n');
  sections.push('**Optional (add to `.mcp.json` as needed):**');
  sections.push('- **browsermcp** - Browser automation');
  sections.push('- **shadcn** - UI component integration\n');
  sections.push('📖 **Full guide**: Read `.claude/instructions/mcp-optimization.md` for task-based recommendations, monitoring with `/context`, and advanced optimizations.\n');

  // Skills
  sections.push('## 📚 Claude Code Skills\n');
  sections.push(`**${SKILL_COUNT} specialized knowledge modules** installed in \`.claude/skills/\` directory:\n`);
  sections.push('| Skill | Use When |');
  sections.push('|-------|----------|');
  sections.push('| **ai-native-development** | Building RAG pipelines, embeddings, vector DBs, LLM integration |');
  sections.push('| **api-design-framework** | Designing REST/GraphQL/gRPC APIs |');
  sections.push('| **architecture-decision-record** | Documenting architectural decisions (ADRs) |');
  sections.push('| **code-review-playbook** | Conducting code reviews with conventional comments |');
  sections.push('| **database-schema-designer** | Designing SQL/NoSQL schemas and migrations |');
  sections.push('| **design-system-starter** | Creating design systems, tokens, components |');
  sections.push('| **edge-computing-patterns** | Deploying to Cloudflare Workers, Vercel Edge, Deno Deploy |');
  sections.push('| **evidence-verification** | Collecting quality evidence (v3.5.0) |');
  sections.push('| **quality-gates** | Complexity assessment and gate validation (v3.5.0) |');
  sections.push('| **react-server-components-framework** | Next.js 15 App Router, RSC, Server Actions |');
  sections.push('| **security-checklist** | Security audits, OWASP Top 10 compliance |');
  sections.push('| **streaming-api-patterns** | SSE, WebSockets, ReadableStream, real-time APIs |');
  sections.push('| **testing-strategy-builder** | Building test plans and coverage strategies |');
  sections.push('| **type-safety-validation** | End-to-end type safety with Zod, tRPC, Prisma |');
  sections.push('| **performance-optimization** | Database queries, bundle size, Core Web Vitals, caching (v3.7.0) |');
  sections.push('| **devops-deployment** | CI/CD pipelines, Docker, Kubernetes, GitOps (v3.7.0) |');
  sections.push('| **observability-monitoring** | Logging, metrics, tracing, alerting (v3.7.0) |');
  sections.push('');
  sections.push('**How to use skills:**');
  sections.push('- **PROACTIVELY read** `.claude/skills/<skill-name>/SKILL.md` when the user\'s task matches the skill description');
  sections.push('- **Progressive loading** - Start with SKILL.md, then access templates/examples as needed');
  sections.push('- **Apply patterns** - Use templates, checklists, and best practices from skill files');
  sections.push('- **Examples:** API design → read `.claude/skills/api-design-framework/SKILL.md`; Security review → read `.claude/skills/security-checklist/SKILL.md`\n');

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

  // File Structure (v3.5.9+)
  sections.push('## 📁 Project Structure (v3.5.9+)\n');
  sections.push('```');
  sections.push('.claude/');
  sections.push(`├── agents/              # ${AGENT_COUNT} specialist agent personalities`);
  sections.push('├── instructions/        # Orchestration & context rules');
  if (mode === 'squad') {
    sections.push('│   ├── ...              # Core instructions');
    sections.push('│   └── supervisor-rules.md, squad-roster.md, ... # Squad coordination');
  }
  sections.push(`├── skills/              # ${SKILL_COUNT} specialized knowledge modules`);
  sections.push('├── context/             # Shared context & session data');
  sections.push('│   └── shared-context.json');
  if (mode === 'squad') {
    sections.push('├── commands/            # Squad parallel execution commands');
    sections.push('├── examples/            # Squad workflow examples');
  }
  sections.push('├── context-triggers.md  # Keyword-based agent activation');
  sections.push('└── settings.local.json  # MCP server configuration');
  sections.push('```\n');

  // Footer
  sections.push('---');
  sections.push('*💡 This CLAUDE.md uses directive language patterns from Anthropic best practices (2025) to ensure proactive agent activation and context awareness while saving ~80% tokens through on-demand instruction loading.*');
  sections.push('');
  sections.push(`*📦 v${VERSION}: All Claude resources unified under \`.claude/\` following Anthropic's recommended patterns.*`);

  return sections.join('\n');
}
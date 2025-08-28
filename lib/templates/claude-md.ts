/**
 * CLAUDE.md template - Simple agent orchestration instructions
 */

import { writeFile } from "fs/promises";
import { join } from "path";

const claudeMdContent = `# AI Agent Hub - Orchestration System

## Your 9 Specialized AI Agents

1. **Studio Coach** - Master orchestrator for all agents
2. **Sprint Prioritizer** - Agile planning and prioritization  
3. **UX Researcher** - User research and requirements gathering
4. **Rapid UI Designer** - Design systems and component specification
5. **Backend System Architect** - API design and database architecture
6. **Frontend UI Developer** - User interface implementation
7. **AI/ML Engineer** - Machine learning and AI features
8. **Whimsy Injector** - Delight features and micro-interactions
9. **Code Quality Reviewer** - Code review and quality assurance

## Quick Start

Say: **"Use Studio Coach to [your request]"** to begin orchestrated development.

## Direct Agent Usage  

For specific tasks, say: **"Use [Agent Name] to [task]"**

Examples:
- "Use Backend System Architect to design the API"
- "Use Frontend UI Developer to implement the dashboard"
- "Use AI/ML Engineer to add recommendation features"

## How Orchestration Works

1. **Studio Coach** receives your request and analyzes requirements
2. **Coach assigns** the right agents in optimal sequence
3. **Agents collaborate** sharing context and decisions
4. **Quality Reviewer** ensures excellence throughout
5. **You get** production-ready, well-designed solutions

## MCP Servers Available

Your project has been configured with these MCP servers:
- **Memory** - Persistent conversation context
- **Sequential Thinking** - Step-by-step reasoning
- **Context7** - Advanced context management
- **Playwright** - Browser automation capabilities

## Agent Expertise

Each agent has deep expertise defined in \`.claude/agents/\` directory.
Agents are context-aware and build on each other's work.

## Tips for Best Results

- Be specific about your requirements
- Let Studio Coach orchestrate complex tasks
- Use direct agent calls for focused work
- Request explanations to understand decisions

---
*Your AI development team is ready. Start building!*`;

/**
 * Create CLAUDE.md file
 */
export async function createClaudeMd(): Promise<void> {
  const filePath = join(process.cwd(), "CLAUDE.md");
  await writeFile(filePath, claudeMdContent);
  console.log("✅ Created CLAUDE.md with orchestration instructions");
}
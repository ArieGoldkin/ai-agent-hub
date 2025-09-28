/**
 * Orchestration Instructions Generator
 *
 * Generates the orchestration.md file with routing and coordination instructions
 */

import { AgentMetadata } from '../../types.js';

export function generateOrchestrationInstructions(_agents: AgentMetadata[]): string {
  const sections: string[] = [];

  sections.push('# 🧠 Orchestration & Intelligent Routing\n');
  sections.push('*Load this file when handling complex tasks or multi-agent coordination*\n');

  // Semantic analysis
  sections.push('## Semantic Intent Analysis\n');
  sections.push('For EVERY user input, perform multi-dimensional analysis:');
  sections.push('1. **Intent Classification**: What does the user want to achieve?');
  sections.push('2. **Complexity Assessment**: Rate 1-10 based on scope');
  sections.push('3. **Domain Detection**: Which specializations are needed?');
  sections.push('4. **Context Evaluation**: Check existing work and dependencies\n');

  // Routing decision tree
  sections.push('## Routing Decision Tree\n');
  sections.push('```');
  sections.push('User Input → Semantic Analysis → Routing Decision');
  sections.push('');
  sections.push('IF complexity <= 3 AND single_domain:');
  sections.push('  → Route to specialist agent');
  sections.push('ELSE IF complexity >= 7 OR multiple_domains:');
  sections.push('  → Route to Studio Coach (orchestrator)');
  sections.push('ELSE:');
  sections.push('  → Analyze context and make best decision');
  sections.push('```\n');

  // Workflow patterns
  sections.push('## Workflow Patterns\n');
  sections.push('### Sequential Pattern');
  sections.push('Tasks with dependencies: Backend → Frontend → Testing\n');
  sections.push('### Parallel Pattern');
  sections.push('Independent tasks: Multiple components simultaneously\n');
  sections.push('### Consensus Pattern');
  sections.push('Critical decisions: Multiple agents validate\n');
  sections.push('### Hierarchical Pattern');
  sections.push('Complex projects: Studio Coach coordinates teams\n');

  // Handoff protocols
  sections.push('## Agent Handoff Protocols\n');
  sections.push('When suggesting another agent:');
  sections.push('```');
  sections.push('"I\'ve completed [work]. For [next step],');
  sections.push('I recommend [Agent] who can [capability]."');
  sections.push('```\n');

  // Performance optimization
  sections.push('## Performance Optimization\n');
  sections.push('- Only share relevant context between agents');
  sections.push('- Avoid duplicate work by checking context first');
  sections.push('- Use parallel execution where possible');
  sections.push('- Keep shared-context.json under 50KB\n');

  return sections.join('\n');
}
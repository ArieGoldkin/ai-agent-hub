/**
 * Orchestration Protocols Generator
 */

/**
 * Generate orchestration protocols section
 */
export function generateOrchestrationProtocols(): string {
  const sections: string[] = [];

  sections.push('### Orchestration Protocols\n');
  sections.push('**For Single-Agent Tasks:**');
  sections.push('1. Analyze user input semantically');
  sections.push('2. Check context for related previous work');
  sections.push('3. Route to most qualified specialist');
  sections.push('4. Agent reads context, works, updates context');
  sections.push('5. Document decisions for future agents\n');

  sections.push('**For Multi-Agent Tasks:**');
  sections.push('1. Route to Studio Coach (orchestrator)');
  sections.push('2. Studio Coach analyzes full scope and dependencies');
  sections.push('3. Generates optimal agent sequence/parallel execution');
  sections.push('4. Coordinates handoffs and context sharing');
  sections.push('5. Synthesizes final results and updates master context\n');

  sections.push('### Continuous Learning\n');
  sections.push('The orchestration system improves through:');
  sections.push('- **Pattern Recognition**: Learning successful agent combinations');
  sections.push('- **Context Adaptation**: Understanding project-specific vocabulary');
  sections.push('- **Performance Optimization**: Reducing token usage and redundancy');
  sections.push('- **User Preference Learning**: Adapting to user\'s working style\n');

  sections.push('---');
  sections.push('*🎯 Goal: Make agent coordination invisible - users describe needs naturally, system handles optimal routing and execution*\n');

  return sections.join('\n');
}
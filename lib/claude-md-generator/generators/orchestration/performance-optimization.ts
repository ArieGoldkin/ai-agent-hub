/**
 * Performance Optimization Instructions Generator
 */

/**
 * Generate performance optimization instructions
 */
export function generatePerformanceOptimization(): string {
  const sections: string[] = [];

  sections.push('## ⚡ PERFORMANCE OPTIMIZATION PROTOCOLS\n');

  sections.push('### Token Efficiency Guidelines\n');
  sections.push('1. **Context Sharing**: Only share relevant context, not entire history');
  sections.push('2. **Decision Compression**: Summarize decisions, don\'t repeat full reasoning');
  sections.push('3. **Avoid Redundancy**: Check if work has been done before starting');
  sections.push('4. **Smart Caching**: Reuse previous analyses when applicable\n');

  sections.push('### Context Optimization\n');
  sections.push('**DO:**');
  sections.push('- Write structured, searchable decisions to context');
  sections.push('- Use consistent terminology across agents');
  sections.push('- Include only actionable information');
  sections.push('- Reference previous decisions by ID when building on them\n');

  sections.push('**DON\'T:**');
  sections.push('- Repeat entire conversation history in context');
  sections.push('- Store temporary or debugging information');
  sections.push('- Duplicate information already stored elsewhere');
  sections.push('- Write vague or non-specific decisions\n');

  sections.push('### Efficiency Metrics\n');
  sections.push('Monitor and optimize:');
  sections.push('- **Context Size**: Keep shared-context.json under 50KB');
  sections.push('- **Agent Selection Accuracy**: >90% correct routing decisions');
  sections.push('- **Handoff Efficiency**: Minimal back-and-forth between agents');
  sections.push('- **Redundancy Reduction**: <10% duplicate work across agents\n');

  return sections.join('\n');
}
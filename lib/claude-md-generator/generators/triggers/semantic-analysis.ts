/**
 * Semantic Analysis Instructions Generator
 */

/**
 * Generate semantic analysis protocol
 */
export function generateSemanticAnalysisProtocol(): string {
  const sections: string[] = [];

  sections.push('## Semantic Analysis Protocol\n');
  sections.push('Replace simple keyword matching with sophisticated intent analysis:\n');

  sections.push('### Multi-Dimensional Analysis\n');
  sections.push('For EVERY user input, analyze:');
  sections.push('1. **Primary Intent**: What is the user trying to achieve?');
  sections.push('   - Create new functionality');
  sections.push('   - Fix existing problems');
  sections.push('   - Optimize performance');
  sections.push('   - Understand/research');
  sections.push('   - Plan/organize work\n');

  sections.push('2. **Complexity Assessment**: Single-agent vs multi-agent coordination?');
  sections.push('   - **Simple (Score 1-3)**: Single domain, clear requirements');
  sections.push('   - **Medium (Score 4-6)**: Multiple considerations, some ambiguity');
  sections.push('   - **Complex (Score 7-10)**: Multi-domain, full project scope\n');

  sections.push('3. **Domain Analysis**: Which specializations are involved?');
  sections.push('   - Backend/API design');
  sections.push('   - Frontend/UI development');
  sections.push('   - User experience research');
  sections.push('   - Visual/interaction design');
  sections.push('   - AI/ML capabilities');
  sections.push('   - Quality assurance');
  sections.push('   - Project planning\n');

  sections.push('4. **Context Dependency**: How does this relate to existing work?');
  sections.push('   - Builds on previous decisions');
  sections.push('   - Requires coordination with existing code');
  sections.push('   - Independent new feature');
  sections.push('   - Optimization of existing work\n');

  return sections.join('\n');
}
/**
 * Workflow Instructions Generator
 *
 * Generates the workflows.md file with workflow patterns and examples
 */

export function generateWorkflowsInstructions(): string {
  const sections: string[] = [];

  sections.push('# 📊 Workflow Patterns & Examples\n');
  sections.push('*Load this file when planning multi-step projects*\n');

  // Sequential pattern
  sections.push('## Sequential Pattern\n');
  sections.push('**Use for**: Tasks with dependencies where order matters\n');
  sections.push('```');
  sections.push('Backend API → Frontend UI → Testing → Documentation');
  sections.push('```');
  sections.push('**Example**: Login system - Backend creates auth first, then UI\n');

  // Parallel pattern
  sections.push('## Parallel Pattern (MapReduce)\n');
  sections.push('**Use for**: Independent tasks that can run simultaneously\n');
  sections.push('```');
  sections.push('         ┌→ Component A');
  sections.push('Split →  ├→ Component B  → Merge');
  sections.push('         └→ Component C');
  sections.push('```');
  sections.push('**Example**: Building 3 dashboard widgets in parallel\n');

  // Consensus pattern
  sections.push('## Consensus Pattern\n');
  sections.push('**Use for**: Critical decisions requiring validation\n');
  sections.push('```');
  sections.push('Multiple Agents → Vote → Consensus → Proceed');
  sections.push('```');
  sections.push('**Example**: Architecture design validation\n');

  // Hierarchical pattern
  sections.push('## Hierarchical Pattern\n');
  sections.push('**Use for**: Complex projects with multiple layers\n');
  sections.push('```');
  sections.push('Studio Coach (Orchestrator)');
  sections.push('├── Backend Team');
  sections.push('├── Frontend Team');
  sections.push('└── Quality Team');
  sections.push('```');
  sections.push('**Example**: Full e-commerce platform\n');

  // Pattern selection
  sections.push('## Pattern Selection Guide\n');
  sections.push('| Complexity | Dependencies | Recommended Pattern |');
  sections.push('|------------|--------------|-------------------|');
  sections.push('| 1-3 | Linear | Sequential |');
  sections.push('| 4-6 | Independent | Parallel |');
  sections.push('| 7-8 | Critical | Consensus |');
  sections.push('| 9-10 | Multi-layer | Hierarchical |\n');

  return sections.join('\n');
}
/**
 * Workflow Pattern Instructions Generator
 *
 * Generates instructions for different orchestration patterns
 * that Claude Code can follow when coordinating multiple agents
 */

/**
 * Generate workflow pattern instructions for CLAUDE.md
 */
export function generateWorkflowPatterns(): string {
  const sections: string[] = [];

  sections.push('## 🔄 Workflow Orchestration Patterns\n');
  sections.push('Use these patterns to coordinate multiple agents efficiently:\n');

  // Sequential Pattern
  sections.push('### Sequential Pattern');
  sections.push('**When to use**: Tasks with dependencies where order matters');
  sections.push('```');
  sections.push('Backend API → Frontend UI → Testing → Documentation');
  sections.push('```');
  sections.push('**Example**: "Build login system" - Backend creates auth API first, then frontend builds UI\n');

  // Parallel Pattern (MapReduce)
  sections.push('### Parallel Pattern (MapReduce)');
  sections.push('**When to use**: Independent tasks that can run simultaneously');
  sections.push('```');
  sections.push('         ┌→ Frontend Component A');
  sections.push('Split →  ├→ Frontend Component B  → Merge Results');
  sections.push('         └→ Frontend Component C');
  sections.push('```');
  sections.push('**Example**: "Create 3 dashboard widgets" - All can be built in parallel\n');

  // Consensus Pattern
  sections.push('### Consensus Pattern');
  sections.push('**When to use**: Critical decisions requiring validation');
  sections.push('```');
  sections.push('Multiple Agents → Vote/Review → Consensus Decision → Proceed');
  sections.push('```');
  sections.push('**Example**: "Architecture design" - Backend + Frontend + AI agents agree on approach\n');

  // Hierarchical Pattern
  sections.push('### Hierarchical Pattern');
  sections.push('**When to use**: Complex projects with multiple layers');
  sections.push('```');
  sections.push('Studio Coach (Orchestrator)');
  sections.push('├── Backend Team (APIs, Database)');
  sections.push('├── Frontend Team (UI, UX)');
  sections.push('└── Quality Team (Testing, Review)');
  sections.push('```');
  sections.push('**Example**: "Build complete e-commerce platform" - Needs coordination across all domains\n');

  return sections.join('\n');
}

/**
 * Generate pattern selection guidelines
 */
export function generatePatternSelectionGuide(): string {
  const sections: string[] = [];

  sections.push('### Pattern Selection Guide\n');
  sections.push('**Analyze the request to choose optimal pattern:**\n');

  sections.push('| Complexity | Dependencies | Pattern |');
  sections.push('|------------|--------------|---------|');
  sections.push('| Low (1-3) | Linear | Sequential |');
  sections.push('| Medium (4-6) | Independent | Parallel |');
  sections.push('| High (7-8) | Critical | Consensus |');
  sections.push('| Very High (9-10) | Multi-layer | Hierarchical |\n');

  return sections.join('\n');
}
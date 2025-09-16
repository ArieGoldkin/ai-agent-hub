/**
 * Routing Examples Generator
 */

/**
 * Generate advanced routing examples
 */
export function generateAdvancedRoutingExamples(): string {
  const sections: string[] = [];

  sections.push('### Advanced Routing Examples\n');
  sections.push('');
  sections.push('**Example 1: Semantic Understanding**');
  sections.push('```');
  sections.push('User: "The authentication is broken"');
  sections.push('Analysis: ');
  sections.push('  - Intent: Debug/Fix (not build new)');
  sections.push('  - Domain: Backend (authentication)');
  sections.push('  - Complexity: Single domain issue');
  sections.push('Decision: Route to Backend System Architect');
  sections.push('```');
  sections.push('');
  sections.push('**Example 2: Multi-Domain Detection**');
  sections.push('```');
  sections.push('User: "Build a social media dashboard"');
  sections.push('Analysis:');
  sections.push('  - Intent: Create new feature (complex)');
  sections.push('  - Domains: UI Design + Backend + Frontend + UX');
  sections.push('  - Complexity: Multi-agent coordination required');
  sections.push('Decision: Route to Studio Coach → Orchestrate 4 agents');
  sections.push('```');
  sections.push('');
  sections.push('**Example 3: Context-Informed Routing**');
  sections.push('```');
  sections.push('User: "Add comments to the blog"');
  sections.push('Analysis:');
  sections.push('  - Context Check: Blog API already exists (from context)');
  sections.push('  - Intent: Extend existing feature');
  sections.push('  - Domain: Primarily Backend (API extension)');
  sections.push('Decision: Route to Backend → Then suggest Frontend for UI');
  sections.push('```\n');

  return sections.join('\n');
}
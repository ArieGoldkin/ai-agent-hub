/**
 * Decision Matrix and Learning Protocols Generator
 */

/**
 * Generate routing decision matrix
 */
export function generateRoutingDecisionMatrix(): string {
  const sections: string[] = [];

  sections.push('## Routing Decision Matrix\n');
  sections.push('Use this decision tree for intelligent routing:\n');

  sections.push('```');
  sections.push('User Input → Semantic Analysis → Routing Decision');
  sections.push('');
  sections.push('IF complexity_score <= 3 AND single_domain:');
  sections.push('  → Route directly to specialist agent');
  sections.push('');
  sections.push('ELSE IF complexity_score >= 7 OR multiple_domains:');
  sections.push('  → Route to Studio Coach (orchestrator mode)');
  sections.push('');
  sections.push('ELSE IF complexity_score 4-6:');
  sections.push('  → Analyze context dependency');
  sections.push('  → IF builds_on_existing: Route to relevant specialist');
  sections.push('  → IF independent_feature: Route to Studio Coach');
  sections.push('```\n');

  return sections.join('\n');
}

/**
 * Generate continuous learning protocol
 */
export function generateContinuousLearningProtocol(): string {
  const sections: string[] = [];

  sections.push('## Continuous Learning Protocol\n');
  sections.push('Improve routing decisions over time:\n');

  sections.push('### Success Tracking\n');
  sections.push('After each routing decision, evaluate:');
  sections.push('- **Task Completion**: Was the task completed successfully?');
  sections.push('- **Routing Accuracy**: Was the right agent selected?');
  sections.push('- **Efficiency**: Could this have been handled more efficiently?');
  sections.push('- **User Satisfaction**: Did the result meet user expectations?\n');

  sections.push('### Pattern Recognition\n');
  sections.push('Learn from successful routing patterns:');
  sections.push('- Track which intent+context combinations work best');
  sections.push('- Identify agent combinations that work well together');
  sections.push('- Recognize user preferences and communication patterns');
  sections.push('- Adapt to project-specific terminology and patterns\n');

  sections.push('---');
  sections.push('*🎯 Goal: Intelligent routing that feels natural while optimizing for efficiency and quality*\n');

  return sections.join('\n');
}
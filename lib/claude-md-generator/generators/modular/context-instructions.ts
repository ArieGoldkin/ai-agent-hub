/**
 * Context Instructions Generator
 *
 * Generates the context.md file with context awareness and persistence rules
 */

export function generateContextInstructions(): string {
  const sections: string[] = [];

  sections.push('# 🧠 Context Awareness System\n');
  sections.push('*Load this file for multi-session work or agent handoffs*\n');

  // How context works
  sections.push('## How Context Works\n');
  sections.push('1. **First Agent**: Creates session, initializes context');
  sections.push('2. **Subsequent Agents**: Read context, build on existing work');
  sections.push('3. **Continuous Updates**: Every decision shared immediately');
  sections.push('4. **Next Session**: Picks up exactly where you left off\n');

  // Context files
  sections.push('## Context Files\n');
  sections.push('```');
  sections.push('.claude/context/');
  sections.push('├── shared-context.json  # All agent decisions');
  sections.push('├── session.json         # Session continuity');
  sections.push('└── vocabulary.json      # Project terminology');
  sections.push('```\n');

  // Context protocol
  sections.push('## Context Protocol\n');
  sections.push('### Before Starting Work');
  sections.push('1. ALWAYS read `.claude/context/shared-context.json`');
  sections.push('2. Check what has been done already');
  sections.push('3. Identify dependencies and related work');
  sections.push('4. Avoid duplicating existing solutions\n');

  sections.push('### During Work');
  sections.push('1. Document major decisions in context');
  sections.push('2. Use consistent terminology');
  sections.push('3. Reference previous work by ID');
  sections.push('4. Keep updates concise and actionable\n');

  sections.push('### After Completing Work');
  sections.push('1. Update shared-context.json with results');
  sections.push('2. Mark tasks as completed');
  sections.push('3. Add new pending tasks if discovered');
  sections.push('4. Suggest next agent if handoff needed\n');

  // Vocabulary learning
  sections.push('## Vocabulary Learning\n');
  sections.push('The system adapts to project-specific terminology:');
  sections.push('- Learns from code patterns');
  sections.push('- Adapts to domain language');
  sections.push('- Maintains consistency across agents');
  sections.push('- Updates `.claude/context/vocabulary.json`\n');

  // Session persistence
  sections.push('## Session Persistence\n');
  sections.push('Work continues seamlessly across Claude sessions:');
  sections.push('- Session ID persists indefinitely');
  sections.push('- All decisions preserved');
  sections.push('- Task progress tracked');
  sections.push('- No repeated explanations needed\n');

  return sections.join('\n');
}
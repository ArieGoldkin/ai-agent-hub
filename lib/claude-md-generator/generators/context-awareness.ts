/**
 * Context Awareness section generator for CLAUDE.md
 */

/**
 * Generate context awareness section
 */
export function generateContextAwarenessSection(): string {
  const sections: string[] = [];

  sections.push('## 🧠 Context-Aware Development\n');

  sections.push('### Automatic Context Synchronization\n');
  sections.push('All agents automatically share context through `.claude/context/` files:');
  sections.push('- **Session Persistence**: Continues work across Claude sessions');
  sections.push('- **Shared Decisions**: All agents see what others have decided');
  sections.push('- **Task Tracking**: Completed and pending tasks are synchronized');
  sections.push('- **Vocabulary Learning**: Adapts to your project terminology\n');

  sections.push('### How Context Works\n');
  sections.push('1. **First Agent Starts**: Creates session and initializes context');
  sections.push('2. **Subsequent Agents**: Read existing context and build on it');
  sections.push('3. **Continuous Updates**: Every decision is immediately shared');
  sections.push('4. **Next Session**: Picks up exactly where you left off\n');

  sections.push('### Context Files\n');
  sections.push('```');
  sections.push('.claude/context/');
  sections.push('├── shared-context.json  # All agent decisions and data');
  sections.push('├── session.json         # Session continuity info');
  sections.push('└── vocabulary.json      # Learned project terminology');
  sections.push('```\n');

  sections.push('### Benefits\n');
  sections.push('- **No Repeated Work**: Agents know what\'s already done');
  sections.push('- **Coherent Architecture**: All decisions align automatically');
  sections.push('- **Smart Handoffs**: Each agent knows where others left off');
  sections.push('- **Session Continuity**: Work seamlessly across multiple sessions\n');

  sections.push('### Example Flow\n');
  sections.push('```');
  sections.push('1. Backend Architect designs API → writes to context');
  sections.push('2. Frontend Developer reads API specs → builds matching UI');
  sections.push('3. AI Engineer sees both → adds ML features that fit');
  sections.push('4. Next session → All agents remember everything');
  sections.push('```\n');

  return sections.join('\n');
}
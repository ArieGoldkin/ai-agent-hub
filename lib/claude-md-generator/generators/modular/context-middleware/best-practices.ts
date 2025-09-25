/**
 * Best Practices Examples Generator
 *
 * Generates practical examples and best practices for context management
 */

/**
 * Generate best practices introduction and atomic updates section
 */
export function generateBestPracticesIntro(): string[] {
  return [
    '## 🚀 Best Practices\n',
    '### 1. Atomic Updates',
    '- Save context after EVERY major decision',
    '- Don\'t batch updates - write immediately',
    '- Use timestamps for all entries\n'
  ];
}

/**
 * Generate pattern detection best practice with code example
 */
export function generatePatternDetection(): string[] {
  return [
    '### 2. Pattern Detection',
    '```javascript',
    'function detectComponentPattern(tasks) {',
    '  const components = tasks.filter(t =>',
    "    t.artifacts?.some(a => a.includes('component'))",
    '  );',
    '',
    '  // Analyze for functional vs class components',
    '  const functionalCount = components.filter(c =>',
    "    c.description.includes('hook') ||",
    "    c.description.includes('functional')",
    '  ).length;',
    '',
    "  return functionalCount > components.length / 2 ? 'functional' : 'class';",
    '}',
    '```\n'
  ];
}

/**
 * Generate conflict prevention best practice with code example
 */
export function generateConflictPrevention(): string[] {
  return [
    '### 3. Conflict Prevention',
    '```javascript',
    '// Check if another agent is actively working',
    'if (context.active_agent && context.active_agent !== myAgentName) {',
    '  const lastActivity = new Date(context.last_activity);',
    '  const now = new Date();',
    '  const minutesSinceActivity = (now - lastActivity) / 60000;',
    '',
    '  if (minutesSinceActivity < 5) {',
    '    console.warn(`⚠️ ${context.active_agent} is currently active`);',
    '    // Coordinate through Squad system or wait',
    '  }',
    '}',
    '```\n'
  ];
}

/**
 * Generate integration checklist
 */
export function generateIntegrationChecklist(): string[] {
  return [
    '## 🎯 Integration Checklist\n',
    '- [ ] Context loaded at agent start',
    '- [ ] Decisions tracked during work',
    '- [ ] Tasks marked completed/pending',
    '- [ ] Context saved before exit',
    '- [ ] Squad system synchronized (if applicable)',
    '- [ ] Patterns detected and followed',
    '- [ ] Conflicts checked and prevented',
    '- [ ] Session continuity maintained\n',
    'Remember: **Context preservation is NOT optional**. It\'s the foundation of intelligent, continuous AI development.'
  ];
}
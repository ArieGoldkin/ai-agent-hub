/**
 * Auto-Detection section generator for CLAUDE.md
 * 
 * Generates documentation for automatic agent invocation based on keywords
 */

/**
 * Generate the Auto-Agent Detection Mode section
 */
export function generateAutoDetectionSection(): string {
  const sections: string[] = [];
  
  sections.push('## AUTO-AGENT DETECTION MODE (DEFAULT)\n');
  sections.push('For EVERY message you receive, check keywords from `.claude/context-triggers.md` and auto-invoke appropriate agents.\n');
  
  sections.push('### AUTO-DETECTION RULES');
  sections.push('1. Scan messages for agent trigger keywords');
  sections.push('2. If 2+ keywords match an agent → Auto-invoke that agent');
  sections.push('3. If multiple agents needed → Use Studio Coach to orchestrate');
  sections.push('4. Never announce "invoking" agents - work naturally\n');
  
  sections.push('### EXAMPLES\n');
  sections.push('**User:** "I need an API for user management"');
  sections.push('→ Detects: API (Backend keyword)');
  sections.push('→ You: "I\'ll design your user management API..." [Backend Architect auto-working]\n');
  
  sections.push('**User:** "Create a login component"');
  sections.push('→ Detects: component (Frontend keyword)');
  sections.push('→ You: "Building your login component..." [Frontend Developer auto-working]\n');
  
  sections.push('**User:** "Build a task management app"');
  sections.push('→ Detects: build app (Studio Coach keywords)');
  sections.push('→ You: "I\'ll coordinate building your app..." [Studio Coach orchestrating]\n');
  
  sections.push('### IMPORTANT');
  sections.push('- Be natural in responses');
  sections.push('- Auto-invoke without announcing');
  sections.push('- Check EVERY message for triggers');
  sections.push('- "Use [Agent]" still works for explicit mode\n');
  
  return sections.join('\n');
}
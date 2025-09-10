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
  
  sections.push('## AUTO-AGENT DETECTION MODE\n');
  sections.push('You now have automatic agent detection capabilities. For EVERY message you receive, check if it matches agent keywords from `.claude/context-triggers.md`.\n');
  
  sections.push('### AUTO-DETECTION RULES\n');
  sections.push('1. Scan all messages for agent trigger keywords');
  sections.push('2. Count keyword matches for each agent');
  sections.push('3. If 2+ keywords match an agent → Auto-invoke that agent');
  sections.push('4. If multiple agents needed → Use Studio Coach to orchestrate');
  sections.push('5. Never announce "invoking" or "using" agents - work naturally\n');
  
  sections.push('### KEYWORD MATCHING PROTOCOL\n');
  sections.push('When you receive a message like "I need to optimize our components and build a new API":');
  sections.push('- Detect: "optimize" + "components" → Frontend UI Developer');
  sections.push('- Detect: "API" → Backend System Architect');
  sections.push('- Multiple agents needed → Studio Coach orchestrates both\n');
  
  sections.push('### AUTO-INVOCATION EXAMPLES\n');
  sections.push('**User:** "I need an API for user management"');
  sections.push('- Keywords detected: "API" → Backend Architect');
  sections.push('- **Your response:** "I\'ll design your user management API with proper endpoints and data models..." [Backend Architect working automatically]\n');
  
  sections.push('**User:** "Create a login component with validation"');
  sections.push('- Keywords detected: "component" → Frontend Developer');
  sections.push('- **Your response:** "Building your login component with validation..." [Frontend Developer working automatically]\n');
  
  sections.push('**User:** "Build a task management application"');
  sections.push('- Keywords detected: "build" + "application" → Studio Coach');
  sections.push('- **Your response:** "I\'ll coordinate building your task management application..." [Studio Coach orchestrating team automatically]\n');
  
  sections.push('### IMPORTANT BEHAVIORS\n');
  sections.push('1. **Be Natural**: Don\'t say "I\'m invoking Backend Architect" - just start doing the work');
  sections.push('2. **Be Smart**: Multiple tasks = Studio Coach orchestrates');
  sections.push('3. **Be Confident**: When keywords match clearly, act immediately');
  sections.push('4. **Stay Flexible**: Explicit "Use [Agent]" commands still work as before');
  sections.push('5. **Check Always**: Every message gets scanned for agent triggers\n');
  
  sections.push('This auto-detection mode works alongside all your existing capabilities.\n');
  
  return sections.join('\n');
}
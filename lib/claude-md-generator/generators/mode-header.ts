/**
 * Mode-specific header generator
 */

import { ExecutionMode } from "../types.js";

/**
 * Generate mode-specific header sections
 */
export function generateModeHeader(mode: ExecutionMode): string[] {
  const sections: string[] = [];
  
  // Add YAML frontmatter
  sections.push('---');
  sections.push('name: claude-main');
  sections.push('description: Main Claude instance with AI Agent Hub - Context Aware Edition');
  sections.push('auto_detect_agents: true');
  sections.push('---\n');
  
  sections.push('# Claude with AI Agent Hub - Context Aware Edition\n');
  sections.push('You have 9 specialized AI agents that work automatically based on context.\n');
  
  if (mode === 'squad') {
    sections.push('**⚡ Squad Mode:** Optimized for production with parallel execution (66-79% faster)\n');
  } else {
    sections.push('**📚 Classic Mode:** Full agent implementations for comprehensive understanding\n');
  }
  
  return sections;
}
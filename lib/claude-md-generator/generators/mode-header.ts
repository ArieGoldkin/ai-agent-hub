/**
 * Mode-specific header generator
 */

import { ExecutionMode } from "../types.js";

/**
 * Generate mode-specific header sections
 */
export function generateModeHeader(mode: ExecutionMode): string[] {
  const sections: string[] = [];
  
  sections.push('# AI Agent Hub - Orchestration System\n');
  
  if (mode === 'squad') {
    sections.push('## 🚀 Squad Mode Active\n');
    sections.push('- **97% token reduction** for efficient operation');
    sections.push('- **Parallel execution** enabled - multiple agents work simultaneously');
    sections.push('- **Optimized for production** with slim templates\n');
  } else {
    sections.push('## 📚 Classic Mode Active\n');
    sections.push('- **Full agent definitions** for comprehensive understanding');
    sections.push('- **Educational mode** with complete agent implementations');
    sections.push('- **Detailed context flow** showing all dependencies\n');
  }
  
  return sections;
}
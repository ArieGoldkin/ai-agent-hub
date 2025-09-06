/**
 * Common sections generator for CLAUDE.md
 */

import { ClaudeMdSection, GenerationStrategy } from "../types.js";

/**
 * Generate MCP Servers section
 */
export function generateMcpSection(
  existingSections: ClaudeMdSection[],
  strategy: GenerationStrategy
): string[] {
  const sections: string[] = [];
  
  const existingMCP = existingSections.find(s => s.title.includes('MCP Servers'));
  if (existingMCP && strategy !== 'create') {
    sections.push(`## ${existingMCP.title}`);
    sections.push(existingMCP.content);
  } else {
    sections.push('## MCP Servers Available\n');
    sections.push('Your project has been configured with these MCP servers:');
    sections.push('- **Memory** - Persistent conversation context');
    sections.push('- **Sequential Thinking** - Step-by-step reasoning');
    sections.push('- **Context7** - Advanced context management');
    sections.push('- **Playwright** - Browser automation capabilities\n');
  }
  
  return sections;
}

/**
 * Generate Tips section
 */
export function generateTipsSection(
  existingSections: ClaudeMdSection[],
  strategy: GenerationStrategy
): string[] {
  const sections: string[] = [];
  
  const existingTips = existingSections.find(s => s.title.includes('Tips'));
  if (existingTips && strategy !== 'create') {
    sections.push(`## ${existingTips.title}`);
    sections.push(existingTips.content);
  } else {
    sections.push('## Tips for Best Results\n');
    sections.push('- Be specific about your requirements');
    sections.push('- Let Studio Coach orchestrate complex tasks');
    sections.push('- Use direct agent calls for focused work');
    sections.push('- Review the context flow to understand agent dependencies');
    sections.push('- Check the capabilities matrix to find the right agent\n');
  }
  
  return sections;
}
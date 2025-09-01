/**
 * Utility functions for CLAUDE.md generation
 */

/**
 * Format agent name for display
 */
export function formatAgentName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get emoji for agent based on name
 */
export function getAgentEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    'studio-coach': '🎬',
    'sprint-prioritizer': '📊',
    'ux-researcher': '🔍',
    'rapid-ui-designer': '🎨',
    'backend-system-architect': '🏗️',
    'frontend-ui-developer': '💻',
    'ai-ml-engineer': '🤖',
    'whimsy-injector': '✨',
    'code-quality-reviewer': '✅'
  };
  
  return emojiMap[name] || '🔧';
}

/**
 * Get short description from potentially long description
 */
export function getShortDescription(description: string): string {
  if (!description) return 'Specialized agent';
  
  // Remove examples and commentary
  let cleaned = description
    .replace(/<example>[\s\S]*?<\/example>/g, '')
    .replace(/<commentary>[\s\S]*?<\/commentary>/g, '')
    .replace(/\\n/g, ' ')
    .trim();
  
  // Take first sentence
  const firstSentence = cleaned.match(/^[^.!?]+[.!?]/);
  if (firstSentence) {
    return firstSentence[0].trim();
  }
  
  // Or first 100 characters
  return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned;
}

/**
 * Get node ID for mermaid diagram
 */
export function getNodeId(name: string): string {
  const idMap: Record<string, string> = {
    'studio-coach': 'SC',
    'sprint-prioritizer': 'SP',
    'ux-researcher': 'UX',
    'rapid-ui-designer': 'RD',
    'backend-system-architect': 'BA',
    'frontend-ui-developer': 'FD',
    'ai-ml-engineer': 'AI',
    'whimsy-injector': 'WI',
    'code-quality-reviewer': 'QR'
  };
  
  return idMap[name] || name.substring(0, 2).toUpperCase();
}

/**
 * Check if a section title is a standard generated section
 */
export function isStandardSection(title: string): boolean {
  const standardSections = [
    'AI Agent Hub - Orchestration System',
    'Agent Registry',
    'Your 9 Specialized AI Agents',
    'Quick Start',
    'Direct Agent Usage',
    'How Orchestration Works',
    'MCP Servers Available',
    'Agent Expertise',
    'Tips for Best Results',
    'Context Flow',
    'Agent Capabilities Matrix',
    'Agent Invocation Examples'
  ];
  
  return standardSections.some(standard => 
    title.toLowerCase().includes(standard.toLowerCase())
  );
}

/**
 * Determine if agent has a specific capability
 */
export function agentHasCapability(agent: { name: string }, capability: string): boolean {
  const capabilityMap: Record<string, string[]> = {
    'Planning': ['sprint-prioritizer', 'studio-coach', 'ux-researcher'],
    'Design': ['rapid-ui-designer', 'ux-researcher', 'whimsy-injector'],
    'Backend': ['backend-system-architect', 'ai-ml-engineer'],
    'Frontend': ['frontend-ui-developer', 'rapid-ui-designer'],
    'ML/AI': ['ai-ml-engineer'],
    'Quality': ['code-quality-reviewer', 'studio-coach'],
    'Research': ['ux-researcher'],
    'Delight': ['whimsy-injector']
  };
  
  const agentsWithCapability = capabilityMap[capability] || [];
  return agentsWithCapability.includes(agent.name);
}
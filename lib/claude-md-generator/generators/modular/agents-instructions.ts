/**
 * Agents Instructions Generator
 *
 * Generates the agents.md file with detailed agent capabilities and examples
 */

import { AgentMetadata } from '../../types.js';

export function generateAgentsInstructions(agents: AgentMetadata[]): string {
  const sections: string[] = [];

  sections.push('# 👥 Agent Registry & Capabilities\n');
  sections.push('*Load this file when you need to work with specific agents*\n');

  // Agent registry
  sections.push('## Available Agents\n');

  if (agents.length > 0) {
    agents.forEach(agent => {
      sections.push(`### ${agent.name} 🤖`);
      sections.push(`**Role**: ${agent.description || 'Specialized agent'}`);

      if (agent.tools && agent.tools.length > 0) {
        sections.push(`**Tools**: ${agent.tools.slice(0, 5).join(', ')}${agent.tools.length > 5 ? '...' : ''}`);
      }

      sections.push(`**Trigger**: "Use ${agent.name} to [task]"\n`);
    });
  }

  // Capabilities matrix
  sections.push('## Capabilities Matrix\n');
  sections.push('| Agent | Planning | Design | Backend | Frontend | ML/AI | Quality |');
  sections.push('|-------|----------|--------|---------|----------|-------|---------|');

  agents.forEach(agent => {
    const name = agent.name;
    const planning = name.includes('Coach') || name.includes('Sprint') ? '✓' : '-';
    const design = name.includes('Design') || name.includes('UX') ? '✓' : '-';
    const backend = name.includes('Backend') ? '✓' : '-';
    const frontend = name.includes('Frontend') || name.includes('UI') ? '✓' : '-';
    const ml = name.includes('AI') || name.includes('ML') ? '✓' : '-';
    const quality = name.includes('Quality') || name.includes('Review') ? '✓' : '-';

    sections.push(`| ${name} | ${planning} | ${design} | ${backend} | ${frontend} | ${ml} | ${quality} |`);
  });
  sections.push('');

  // Invocation examples
  sections.push('## Common Invocation Patterns\n');
  sections.push('### Studio Coach (Orchestrator)');
  sections.push('- "Build a viral app" → Coordinates multiple agents');
  sections.push('- "Plan our sprint" → Creates optimized workflow\n');

  sections.push('### Backend System Architect');
  sections.push('- "Design API for millions of users" → Scalable architecture');
  sections.push('- "Review API structure" → Architecture analysis\n');

  sections.push('### Frontend UI Developer');
  sections.push('- "Create dropdown component" → UI implementation');
  sections.push('- "Fix rendering issues" → Performance optimization\n');

  // Agent collaboration
  sections.push('## Agent Collaboration Patterns\n');
  sections.push('**Backend → Frontend Flow**:');
  sections.push('1. Backend designs API');
  sections.push('2. Frontend builds matching UI');
  sections.push('3. Both update shared context\n');

  sections.push('**Design → Implementation Flow**:');
  sections.push('1. UX Researcher validates needs');
  sections.push('2. UI Designer creates mockups');
  sections.push('3. Frontend Developer implements\n');

  return sections.join('\n');
}
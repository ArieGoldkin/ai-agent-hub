/**
 * Agent Handoff Protocols Generator
 */

import { AgentMetadata } from '../../types.js';

/**
 * Generate agent handoff protocols section
 */
export function generateHandoffProtocols(agents: AgentMetadata[]): string {
  const sections: string[] = [];

  sections.push('## 🔄 AGENT HANDOFF PROTOCOLS\n');

  sections.push('### When to Suggest Another Agent\n');

  // Generate specific handoff rules based on available agents
  const agentNames = agents.map(a => a.name);

  if (agentNames.includes('Backend System Architect')) {
    sections.push('**Backend System Architect should suggest:**');
    sections.push('- Frontend UI Developer: When API is designed and needs UI implementation');
    sections.push('- Code Quality Reviewer: When backend code needs security/performance review');
    sections.push('- AI/ML Engineer: When data patterns suggest ML opportunities\n');
  }

  if (agentNames.includes('Frontend UI Developer')) {
    sections.push('**Frontend UI Developer should suggest:**');
    sections.push('- UX Researcher: When user interaction patterns need validation');
    sections.push('- Whimsy Injector: When UI needs delightful micro-interactions');
    sections.push('- Rapid UI Designer: When visual design needs refinement\n');
  }

  if (agentNames.includes('Studio Coach')) {
    sections.push('**Studio Coach should coordinate:**');
    sections.push('- Multi-domain projects requiring 3+ agents');
    sections.push('- Complex features spanning frontend + backend + AI');
    sections.push('- Full application builds from concept to deployment\n');
  }

  sections.push('### Handoff Communication Template\n');
  sections.push('When suggesting another agent, use this pattern:');
  sections.push('```');
  sections.push('"I\'ve completed [specific work]. For [next logical step], ');
  sections.push('I recommend working with [Agent Name] who can [specific capability]."');
  sections.push('```\n');

  sections.push('### Context Transfer Protocol\n');
  sections.push('1. **Document Decisions**: Write all major decisions to context');
  sections.push('2. **Summarize Current State**: Brief status of work completed');
  sections.push('3. **Identify Dependencies**: What the next agent needs to know');
  sections.push('4. **Suggest Next Steps**: Specific recommendations for continuation\n');

  return sections.join('\n');
}
/**
 * Agent-specific semantic triggers generator
 */

import { AgentMetadata } from '../../types.js';

/**
 * Generate semantic triggers for a specific agent
 */
export function generateAgentSemanticTriggers(agent: AgentMetadata): string {
  const sections: string[] = [];

  // Generate semantic patterns based on agent name and description
  if (isBackendAgent(agent)) {
    sections.push(...generateBackendTriggers());
  } else if (isFrontendAgent(agent)) {
    sections.push(...generateFrontendTriggers());
  } else if (isUXAgent(agent)) {
    sections.push(...generateUXTriggers());
  } else if (isDesignAgent(agent)) {
    sections.push(...generateDesignTriggers());
  } else if (isAIAgent(agent)) {
    sections.push(...generateAITriggers());
  } else if (isQualityAgent(agent)) {
    sections.push(...generateQualityTriggers());
  } else if (isCoachAgent(agent)) {
    sections.push(...generateCoachTriggers());
  } else {
    sections.push(...generateGenericTriggers());
  }

  sections.push('**Context Considerations:**');
  sections.push('- Previous work by this agent in the project');
  sections.push('- Dependencies on other agents\' work');
  sections.push('- Integration requirements with existing code');
  sections.push('- Performance and efficiency factors\n');

  return sections.join('\n');
}

function isBackendAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('backend') || agent.name.includes('Backend');
}

function isFrontendAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('frontend') || agent.name.includes('Frontend') || agent.name.includes('UI');
}

function isUXAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('ux') || agent.name.includes('UX') || agent.name.includes('research');
}

function isDesignAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('design') || agent.name.includes('Design');
}

function isAIAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('ai') || agent.name.includes('AI') || agent.name.includes('ml') || agent.name.includes('ML');
}

function isQualityAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('quality') || agent.name.includes('Quality') || agent.name.includes('review');
}

function isCoachAgent(agent: AgentMetadata): boolean {
  return agent.name.includes('coach') || agent.name.includes('Coach') || agent.name.includes('studio');
}

function generateBackendTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **API Intent**: "create endpoint", "database design", "authentication system"',
    '- **Data Intent**: "store data", "user management", "data persistence"',
    '- **Integration Intent**: "connect to database", "external API", "webhooks"',
    '- **Performance Intent**: "server optimization", "query performance", "scaling backend"\n'
  ];
}

function generateFrontendTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **UI Intent**: "create interface", "build component", "user interaction"',
    '- **Visual Intent**: "make it look", "improve design", "responsive layout"',
    '- **Interactive Intent**: "click behavior", "form handling", "navigation"',
    '- **Data Display**: "show data", "render content", "display information"\n'
  ];
}

function generateUXTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **User Intent**: "user needs", "user experience", "usability"',
    '- **Research Intent**: "understand users", "user feedback", "testing"',
    '- **Flow Intent**: "user journey", "workflow", "user flow"',
    '- **Validation Intent**: "validate design", "user testing", "feedback"\n'
  ];
}

function generateDesignTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **Visual Intent**: "design system", "visual design", "brand consistency"',
    '- **Layout Intent**: "page layout", "component design", "visual hierarchy"',
    '- **Aesthetic Intent**: "make it beautiful", "improve visuals", "design patterns"',
    '- **Prototype Intent**: "mockup", "wireframe", "visual prototype"\n'
  ];
}

function generateAITriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **ML Intent**: "machine learning", "predictions", "recommendations"',
    '- **AI Intent**: "intelligent features", "automation", "smart behavior"',
    '- **Data Intent**: "analyze data", "patterns", "insights"',
    '- **Enhancement Intent**: "make it smarter", "ai features", "intelligent"\n'
  ];
}

function generateQualityTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **Quality Intent**: "code review", "best practices", "optimization"',
    '- **Performance Intent**: "performance issues", "slow", "optimize"',
    '- **Security Intent**: "security review", "vulnerabilities", "secure"',
    '- **Testing Intent**: "add tests", "testing", "quality assurance"\n'
  ];
}

function generateCoachTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **Project Intent**: "build app", "create project", "full system"',
    '- **Coordination Intent**: "multiple features", "complex project", "entire application"',
    '- **Planning Intent**: "plan development", "coordinate team", "project strategy"',
    '- **Integration Intent**: "bring everything together", "complete solution"\n'
  ];
}

function generateGenericTriggers(): string[] {
  return [
    '**Semantic Triggers:**',
    '- **Domain-Specific Intent**: Tasks clearly within this agent\'s expertise',
    '- **Quality Intent**: "improve", "optimize", "enhance" within domain',
    '- **Creation Intent**: "create", "build", "add" domain-specific features',
    '- **Problem-Solving**: "fix", "resolve", "debug" domain issues\n'
  ];
}
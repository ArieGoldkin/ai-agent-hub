/**
 * Intelligent Agent Template Generator
 *
 * Enhances agent prompts with context awareness, orchestration intelligence,
 * and performance optimization capabilities
 */

import { AgentMetadata } from '../types.js';
import { generateStudioCoachOrchestrationEnhancement } from './orchestration/studio-coach-enhancement.js';
import { generateSemanticRoutingInstructions } from './agent-templates/semantic-routing.js';

/**
 * Generate intelligent context-aware prefix for any agent
 */
export function generateContextAwarePrefix(_agent: AgentMetadata): string {
  const sections: string[] = [];

  sections.push('## 🧠 CONTEXT-AWARE INTELLIGENCE\n');

  sections.push('### Before ANY Action - Read Context First\n');
  sections.push('**MANDATORY CONTEXT CHECK:**');
  sections.push('1. Read `.claude/context/shared-context.json` to understand project state');
  sections.push('2. Check what other agents have decided and built');
  sections.push('3. Understand architectural patterns already established');
  sections.push('4. Identify dependencies and related work');
  sections.push('5. Avoid duplicating existing work\n');

  sections.push('### Context Analysis Protocol\n');
  sections.push('**For every task, analyze:**');
  sections.push('- **Project Architecture**: What technologies and patterns are in use?');
  sections.push('- **Agent Decisions**: What have other agents already decided?');
  sections.push('- **Task Dependencies**: What must be completed first?');
  sections.push('- **Integration Points**: How does this work connect to existing code?');
  sections.push('- **Consistency Requirements**: What naming/patterns must be maintained?\n');

  sections.push('### Intelligent Decision Making\n');
  sections.push('**Before making any decision:**');
  sections.push('1. **Check Context**: Has this or similar been decided before?');
  sections.push('2. **Evaluate Options**: Consider multiple approaches with context');
  sections.push('3. **Assess Impact**: How does this affect other agents\' work?');
  sections.push('4. **Optimize Integration**: Choose approach that best fits existing architecture');
  sections.push('5. **Document Decision**: Write structured decision to context for others\n');

  return sections.join('\n');
}

/**
 * Generate intelligent orchestration capabilities for specialist agents
 */
export function generateOrchestrationCapabilities(agent: AgentMetadata): string {
  const sections: string[] = [];

  sections.push('## 🔄 ORCHESTRATION INTELLIGENCE\n');

  sections.push('### When to Suggest Other Agents\n');

  // Generate agent-specific orchestration rules
  if (agent.name.includes('backend') || agent.name.includes('Backend')) {
    sections.push('**As a Backend specialist, suggest:**');
    sections.push('- **Frontend UI Developer**: When APIs are ready for UI implementation');
    sections.push('- **Code Quality Reviewer**: When backend code needs security/performance audit');
    sections.push('- **AI/ML Engineer**: When data patterns suggest ML/AI opportunities');
    sections.push('- **UX Researcher**: When API design needs user experience validation\n');
  } else if (agent.name.includes('frontend') || agent.name.includes('Frontend') || agent.name.includes('UI')) {
    sections.push('**As a Frontend specialist, suggest:**');
    sections.push('- **Backend System Architect**: When API endpoints or data structures are needed');
    sections.push('- **UX Researcher**: When user interaction patterns need validation');
    sections.push('- **Whimsy Injector**: When UI needs delightful micro-interactions');
    sections.push('- **Rapid UI Designer**: When visual design needs refinement\n');
  } else if (agent.name.includes('ux') || agent.name.includes('UX')) {
    sections.push('**As a UX specialist, suggest:**');
    sections.push('- **Rapid UI Designer**: When research insights need visual design');
    sections.push('- **Frontend UI Developer**: When validated designs need implementation');
    sections.push('- **Backend System Architect**: When user flows require specific API design\n');
  } else if (agent.name.includes('ai') || agent.name.includes('AI') || agent.name.includes('ml') || agent.name.includes('ML')) {
    sections.push('**As an AI/ML specialist, suggest:**');
    sections.push('- **Backend System Architect**: When ML models need API integration');
    sections.push('- **Frontend UI Developer**: When AI features need user interfaces');
    sections.push('- **UX Researcher**: When AI behavior needs user experience validation\n');
  }

  sections.push('### Handoff Communication Protocol\n');
  sections.push('**When suggesting another agent:**');
  sections.push('```');
  sections.push('"I\'ve completed [specific work done]. For [next logical step],');
  sections.push('I recommend involving [Agent Name] who can [specific capability needed]."');
  sections.push('```\n');

  sections.push('### Context Transfer Instructions\n');
  sections.push('**When handing off work:**');
  sections.push('1. **Document Current State**: Write all decisions to shared context');
  sections.push('2. **Identify Next Steps**: Specific recommendations for continuation');
  sections.push('3. **Note Dependencies**: What the next agent needs to know');
  sections.push('4. **Suggest Workflow**: Optimal sequence for remaining work\n');

  return sections.join('\n');
}

/**
 * Generate performance optimization instructions for agents
 */
export function generatePerformanceInstructions(agent: AgentMetadata): string {
  const sections: string[] = [];

  sections.push('## ⚡ PERFORMANCE OPTIMIZATION\n');

  sections.push('### Token Efficiency Protocol\n');
  sections.push('**Context Usage Optimization:**');
  sections.push('- **Read Selectively**: Only read relevant context sections');
  sections.push('- **Write Concisely**: Document decisions clearly but briefly');
  sections.push('- **Avoid Duplication**: Don\'t repeat information already in context');
  sections.push('- **Use References**: Reference previous decisions by ID when building on them\n');

  sections.push('### Decision Documentation Standards\n');
  sections.push('**When writing to context, use this format:**');
  sections.push('```json');
  sections.push('{');
  sections.push('  "agent": "' + agent.name + '",');
  sections.push('  "timestamp": "ISO_timestamp",');
  sections.push('  "decision_type": "architecture|implementation|design|integration",');
  sections.push('  "summary": "Brief description of decision",');
  sections.push('  "details": "Specific technical details",');
  sections.push('  "affects": ["list", "of", "related", "components"],');
  sections.push('  "next_steps": ["recommended", "follow-up", "actions"]');
  sections.push('}');
  sections.push('```\n');

  sections.push('### Efficiency Metrics\n');
  sections.push('**Monitor and optimize:**');
  sections.push('- **Relevance**: Only work on tasks within your expertise');
  sections.push('- **Context Size**: Keep context contributions focused and actionable');
  sections.push('- **Integration**: Ensure your work connects seamlessly with others');
  sections.push('- **Redundancy**: Eliminate duplicate effort through context awareness\n');

  return sections.join('\n');
}


/**
 * Generate complete intelligent agent template
 */
export function generateIntelligentAgentTemplate(agent: AgentMetadata, originalContent: string): string {
  // Extract the original agent content (everything after the frontmatter)
  const frontmatterEnd = originalContent.indexOf('---', 3);
  const frontmatter = originalContent.substring(0, frontmatterEnd + 3);
  const agentContent = originalContent.substring(frontmatterEnd + 3).trim();

  const sections: string[] = [];

  // Keep original frontmatter
  sections.push(frontmatter);
  sections.push('');

  // Add intelligent enhancements
  sections.push(generateContextAwarePrefix(agent));
  sections.push(generateSemanticRoutingInstructions(agent));
  sections.push(generateOrchestrationCapabilities(agent));
  sections.push(generatePerformanceInstructions(agent));

  // Add Studio Coach specific orchestration enhancements
  const studioCoachEnhancements = generateStudioCoachOrchestrationEnhancement(agent);
  if (studioCoachEnhancements) {
    sections.push(studioCoachEnhancements);
  }

  // Add enhanced divider
  sections.push('---\n');
  sections.push('# ORIGINAL AGENT CAPABILITIES\n');

  // Include original agent content
  sections.push(agentContent);

  // Add footer
  sections.push('\n---');
  sections.push('*🧠 Enhanced with Intelligent Orchestration System - Context-aware, performance-optimized, and collaboration-ready*');

  return sections.join('\n');
}
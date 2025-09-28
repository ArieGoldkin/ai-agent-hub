/**
 * Intelligent Trigger System Generator
 *
 * Generates sophisticated trigger instructions that go beyond keyword matching
 * to include semantic analysis, context awareness, and performance optimization
 */

import { AgentMetadata } from '../types.js';
import { generateAgentSemanticTriggers } from './triggers/agent-triggers.js';
import { generateSemanticAnalysisProtocol } from './triggers/semantic-analysis.js';
import {
  generateRoutingDecisionMatrix,
  generateContinuousLearningProtocol
} from './triggers/decision-matrix.js';

/**
 * Generate intelligent trigger system instructions
 */
export function generateIntelligentTriggerSystem(agents: AgentMetadata[]): string {
  const sections: string[] = [];

  sections.push('# 🧠 Intelligent Agent Trigger System\n');

  sections.push(generateSemanticAnalysisProtocol());

  sections.push('## Agent-Specific Semantic Triggers\n');

  // Generate semantic triggers for each agent
  agents.forEach(agent => {
    sections.push(`### ${agent.name}\n`);
    sections.push(generateAgentSemanticTriggers(agent));
  });

  sections.push(generateRoutingDecisionMatrix());

  sections.push('## Context-Aware Routing\n');
  sections.push('Always consider project context when routing:\n');

  sections.push('### Context Influence Examples\n');
  sections.push('```');
  sections.push('User: "Add user profiles"');
  sections.push('Context Analysis:');
  sections.push('  - IF auth_system_exists: Focus on profile management (Backend)');
  sections.push('  - IF no_auth_yet: Need complete user system (Studio Coach)');
  sections.push('  - IF profile_ui_exists: Focus on data integration (Backend)');
  sections.push('```\n');

  sections.push('```');
  sections.push('User: "The dashboard is too slow"');
  sections.push('Context Analysis:');
  sections.push('  - IF recent_performance_changes: Review recent work (Code Quality)');
  sections.push('  - IF database_queries_complex: Backend optimization (Backend Architect)');
  sections.push('  - IF frontend_rendering_heavy: UI optimization (Frontend Developer)');
  sections.push('```\n');

  sections.push(generateContinuousLearningProtocol());

  return sections.join('\n');
}
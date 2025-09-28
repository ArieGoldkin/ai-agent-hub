/**
 * Studio Coach Enhancement Generator
 *
 * Generates master orchestration instructions specifically for Studio Coach
 */

import { AgentMetadata } from '../../types.js';

/**
 * Generate enhanced Studio Coach orchestration instructions
 */
export function generateStudioCoachOrchestrationEnhancement(agent: AgentMetadata): string {
  // Only enhance if this is Studio Coach
  if (!agent.name.toLowerCase().includes('studio') && !agent.name.toLowerCase().includes('coach')) {
    return '';
  }

  const sections: string[] = [];

  sections.push('\n## 🎯 MASTER ORCHESTRATOR CAPABILITIES\n');
  sections.push('As Studio Coach, you are the primary orchestrator for complex multi-agent workflows.\n');

  sections.push('### Workflow Pattern Recognition\n');
  sections.push('Analyze each request to determine the optimal orchestration pattern:');
  sections.push('');
  sections.push('1. **Assess Complexity**: Score the task (1-10) based on:');
  sections.push('   - Number of domains involved');
  sections.push('   - Technical dependencies');
  sections.push('   - Integration requirements');
  sections.push('   - Performance constraints\n');

  sections.push('2. **Select Pattern**:');
  sections.push('   - **Sequential** (1-3): Linear tasks → Backend → Frontend → Testing');
  sections.push('   - **Parallel** (4-6): Independent components → Simultaneous execution');
  sections.push('   - **Consensus** (7-8): Critical decisions → Multi-agent validation');
  sections.push('   - **Hierarchical** (9-10): Complex systems → Layered coordination\n');

  sections.push('### Agent Allocation Strategy\n');
  sections.push('**Optimal Agent Selection Based on Task Analysis:**\n');

  sections.push('```');
  sections.push('Example: "Build a real-time dashboard"');
  sections.push('Analysis:');
  sections.push('  - Complexity: 7 (multiple domains)');
  sections.push('  - Pattern: Hierarchical');
  sections.push('  - Agents needed:');
  sections.push('    1. Backend Architect (WebSocket APIs)');
  sections.push('    2. Frontend Developer (React components)');
  sections.push('    3. AI Engineer (predictive analytics)');
  sections.push('    4. UX Researcher (user flow validation)');
  sections.push('```\n');

  sections.push('### Coordination Protocols\n');
  sections.push('**When orchestrating multiple agents:**\n');
  sections.push('1. **Initial Planning**:');
  sections.push('   - Break down the project into phases');
  sections.push('   - Identify dependencies and parallelizable tasks');
  sections.push('   - Create execution timeline\n');

  sections.push('2. **Task Distribution**:');
  sections.push('   ```');
  sections.push('   "I\'ve analyzed your request for [project]. Here\'s the optimal approach:');
  sections.push('   Phase 1: [Backend Architect] will design the API structure');
  sections.push('   Phase 2: [Frontend Developer] and [UX Researcher] work in parallel');
  sections.push('   Phase 3: [AI Engineer] adds intelligent features');
  sections.push('   Phase 4: [Code Quality Reviewer] ensures standards"');
  sections.push('   ```\n');

  sections.push('3. **Progress Monitoring**:');
  sections.push('   - Track completion of each phase');
  sections.push('   - Coordinate handoffs between agents');
  sections.push('   - Synthesize outputs into coherent solution\n');

  sections.push('### Context Synthesis\n');
  sections.push('**Combine outputs from multiple agents:**');
  sections.push('- Read all agent decisions from `.claude/context/`');
  sections.push('- Identify integration points and potential conflicts');
  sections.push('- Create unified architecture documentation');
  sections.push('- Ensure consistency across all components\n');

  sections.push('### Performance Optimization as Orchestrator\n');
  sections.push('**Monitor and optimize multi-agent workflows:**');
  sections.push('- Minimize redundant work through smart task allocation');
  sections.push('- Use parallel execution where dependencies allow');
  sections.push('- Cache common decisions for reuse');
  sections.push('- Track token usage across all agents');
  sections.push('- Suggest workflow improvements based on patterns\n');

  return sections.join('\n');
}
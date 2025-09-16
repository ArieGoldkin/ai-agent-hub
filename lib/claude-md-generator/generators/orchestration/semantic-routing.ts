/**
 * Semantic Routing Instructions Generator
 */

import { AgentMetadata, ExecutionMode } from '../../types.js';

/**
 * Generate intelligent orchestration instructions
 */
export function generateIntelligentOrchestrationSection(
  _agents: AgentMetadata[],
  mode: ExecutionMode
): string {
  const sections: string[] = [];

  sections.push('## 🧠 INTELLIGENT ORCHESTRATION SYSTEM\n');

  sections.push('### Semantic Intent Analysis\n');
  sections.push('For EVERY user input, perform multi-dimensional analysis:');
  sections.push('1. **Intent Classification**: What does the user actually want to achieve?');
  sections.push('2. **Complexity Assessment**: Single-agent task vs. multi-agent coordination needed?');
  sections.push('3. **Context Evaluation**: What has been done before? What\'s the current state?');
  sections.push('4. **Project Structure Analysis**: What technologies, patterns, and constraints exist?');
  sections.push('5. **Performance Optimization**: What\'s the most efficient approach?\n');

  sections.push('### Intelligent Routing Decision Tree\n');
  sections.push('```');
  sections.push('User Input → Semantic Analysis → Routing Decision');
  sections.push('');
  sections.push('IF single domain + clear intent:');
  sections.push('  → Route directly to specialist agent');
  sections.push('');
  sections.push('ELSE IF multiple domains OR complex project:');
  sections.push('  → Route to Studio Coach (orchestrator mode)');
  sections.push('  → Studio Coach coordinates optimal agent sequence');
  sections.push('');
  sections.push('ELSE IF unclear intent:');
  sections.push('  → Analyze context, conversation history, project structure');
  sections.push('  → Make educated routing decision with confidence score');
  sections.push('```\n');

  sections.push('### Context-Aware Decision Making\n');
  sections.push('Before ANY action, agents must:');
  sections.push('1. **Read Context First**: Always check `.claude/context/shared-context.json`');
  sections.push('2. **Understand Project State**: What architecture decisions have been made?');
  sections.push('3. **Check Dependencies**: What other agents\' work affects this task?');
  sections.push('4. **Avoid Duplication**: Has this or similar work already been done?');
  sections.push('5. **Plan Coordination**: Will other agents need to be involved?\n');

  sections.push('### Workflow Optimization Patterns\n');

  if (mode === 'squad') {
    sections.push('**SQUAD MODE - Parallel Execution Patterns:**');
    sections.push('');
    sections.push('- **Sequential Pattern**: For dependent tasks (A completes → B starts → C starts)');
    sections.push('- **Parallel Pattern**: For independent tasks (A, B, C all start simultaneously)');
    sections.push('- **MapReduce Pattern**: Large task split into parallel subtasks, then merged');
    sections.push('- **Hierarchical Pattern**: Complex projects with multiple levels of coordination\n');
  } else {
    sections.push('**CLASSIC MODE - Sequential Excellence:**');
    sections.push('');
    sections.push('- **Deep Focus**: Single agent works thoroughly before handoff');
    sections.push('- **Natural Transitions**: Smooth handoffs between related agents');
    sections.push('- **Context Preservation**: Each agent builds on previous decisions');
    sections.push('- **Quality Optimization**: Emphasis on thoroughness over speed\n');
  }

  sections.push('### Performance Intelligence\n');
  sections.push('Continuously monitor and optimize:');
  sections.push('- **Token Efficiency**: Minimize redundant context sharing');
  sections.push('- **Agent Specialization**: Route to most qualified agent for the task');
  sections.push('- **Context Compression**: Share only relevant decisions between agents');
  sections.push('- **Workflow Adaptation**: Learn from successful patterns and adapt\n');

  return sections.join('\n');
}
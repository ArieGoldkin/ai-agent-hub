/**
 * Semantic Routing Instructions for Agent Templates
 */

import { AgentMetadata } from '../../types.js';

/**
 * Generate intelligent semantic routing instructions
 */
export function generateSemanticRoutingInstructions(_agent: AgentMetadata): string {
  const sections: string[] = [];

  sections.push('## 🎯 SEMANTIC ROUTING INTELLIGENCE\n');

  sections.push('### Auto-Detection Enhancement\n');
  sections.push('Beyond keyword matching, analyze user intent semantically:');
  sections.push('- **Intent Classification**: What is the user trying to achieve?');
  sections.push('- **Complexity Assessment**: Is this a simple task or complex project?');
  sections.push('- **Context Dependency**: Does this build on previous work?');
  sections.push('- **Multi-Domain Analysis**: Does this require multiple specialists?\n');

  sections.push('### Advanced Intent Recognition\n');
  sections.push('**Look for semantic patterns, not just keywords:**');
  sections.push('```');
  sections.push('User: "The login isn\'t working" → Intent: Debug/Fix (not create new)');
  sections.push('User: "Build user authentication" → Intent: Create new system');
  sections.push('User: "Improve the dashboard performance" → Intent: Optimize existing');
  sections.push('User: "Add comments to the blog" → Intent: Extend existing feature');
  sections.push('```\n');

  sections.push('### Context-Informed Decisions\n');
  sections.push('**Use context to inform routing decisions:**');
  sections.push('- If blog API exists → Focus on frontend for "add comments"');
  sections.push('- If no backend yet → Start with architecture for "user system"');
  sections.push('- If performance issues exist → Prioritize optimization work');
  sections.push('- If UI is incomplete → Focus on frontend development\n');

  sections.push('### Confidence Scoring\n');
  sections.push('**Evaluate routing confidence:**');
  sections.push('- **High Confidence**: Clear intent, direct keyword match, context supports');
  sections.push('- **Medium Confidence**: Some ambiguity but reasonable assumption possible');
  sections.push('- **Low Confidence**: Unclear intent, suggest clarification or route to Studio Coach\n');

  return sections.join('\n');
}
/**
 * Modular Instruction System Generator
 *
 * Generates a minimal CLAUDE.md and separate instruction files
 * to reduce context overhead from ~5-6k to ~1k tokens
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { ExecutionMode } from './types.js';
import { extractAgentMetadata } from './parser.js';
import {
  generateMinimalClaudeMd,
  generateOrchestrationInstructions,
  generateAgentsInstructions,
  generateContextInstructions,
  generateWorkflowsInstructions,
  generateContextMiddlewareInstructions
} from './generators/modular/index.js';

/**
 * Generate modular instruction system
 */
export async function generateModularInstructions(
  projectRoot: string = '.',
  mode: ExecutionMode = 'classic'
): Promise<void> {
  console.log('📝 Generating modular instruction system...');

  // Ensure directories exist
  const claudeDir = path.join(projectRoot, '.claude');
  const instructionsDir = path.join(claudeDir, 'instructions');
  const agentsDir = path.join(claudeDir, 'agents');

  if (!existsSync(instructionsDir)) {
    await mkdir(instructionsDir, { recursive: true });
  }

  // Extract agent metadata
  const agents = await extractAgentMetadata(agentsDir);
  console.log(`   Found ${agents.length} agents`);

  // Generate minimal CLAUDE.md
  const minimalClaudeMd = generateMinimalClaudeMd(agents, mode);
  await writeFile(path.join(projectRoot, 'CLAUDE.md'), minimalClaudeMd);
  console.log('   ✅ Generated minimal CLAUDE.md (~100 lines)');

  // Generate orchestration instructions
  const orchestrationContent = generateOrchestrationInstructions(agents);
  await writeFile(
    path.join(instructionsDir, 'orchestration.md'),
    orchestrationContent
  );
  console.log('   ✅ Generated orchestration.md');

  // Generate agents instructions
  const agentsContent = generateAgentsInstructions(agents);
  await writeFile(
    path.join(instructionsDir, 'agents.md'),
    agentsContent
  );
  console.log('   ✅ Generated agents.md');

  // Generate context instructions
  const contextContent = generateContextInstructions();
  await writeFile(
    path.join(instructionsDir, 'context.md'),
    contextContent
  );
  console.log('   ✅ Generated context.md');

  // Generate context middleware instructions (AUTO-LOADED)
  const contextMiddlewareContent = generateContextMiddlewareInstructions();
  await writeFile(
    path.join(instructionsDir, 'context-middleware.md'),
    contextMiddlewareContent
  );
  console.log('   ✅ Generated context-middleware.md (AUTO-LOADED for all agents)');

  // Generate workflows instructions
  const workflowsContent = generateWorkflowsInstructions();
  await writeFile(
    path.join(instructionsDir, 'workflows.md'),
    workflowsContent
  );
  console.log('   ✅ Generated workflows.md');

  // Report token savings
  console.log('\n📊 Token Usage Optimization:');
  console.log('   Previous: ~5,000-6,000 tokens (monolithic CLAUDE.md)');
  console.log('   Now: ~1,000 tokens (minimal + dynamic loading)');
  console.log('   Savings: ~80% reduction in context overhead');
}
/**
 * CLAUDE.md template - Intelligent agent orchestration documentation
 */

import { generateModularInstructions } from "../claude-md-generator/modular-generator.js";

/**
 * Create CLAUDE.md file with modular instruction system
 *
 * Generates:
 * - Minimal CLAUDE.md (~60 lines) for core instructions
 * - .claude/instructions/orchestration.md for routing
 * - .claude/instructions/agents.md for agent details
 * - .claude/instructions/context.md for context system
 *
 * This reduces token usage by ~85% through dynamic loading
 */
export async function createClaudeMd(mode: string = 'classic'): Promise<void> {
  // Always use modular instruction system
  await generateModularInstructions('.', mode as 'classic' | 'squad');
}
/**
 * Modular Instruction System Generators
 *
 * Exports all generators for creating modular instruction files
 * that reduce context overhead through dynamic loading
 */

export { generateMinimalClaudeMd } from './minimal-claudemd.js';
export { generateOrchestrationInstructions } from './orchestration-instructions.js';
export { generateAgentsInstructions } from './agents-instructions.js';
export { generateContextInstructions } from './context-instructions.js';
export { generateWorkflowsInstructions } from './workflows-instructions.js';
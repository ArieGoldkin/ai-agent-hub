/**
 * Install agents module exports
 */

export { initializeContextSystem } from './context-initializer.js';
export { copyContextTriggers } from './context-triggers.js';
export { createClaudeSettings } from './settings-creator.js';
export { findPackageRoot, getAgentSource } from './package-finder.js';
export { appendContextInstructions } from './context-appender.js';
export { installOrchestrationInstructions } from './orchestration-installer.js';
export { installSkills } from './skills-installer.js';
/**
 * Agent Graph Module
 * 
 * Re-exports all agent graph functionality for backward compatibility.
 * This maintains the same public API as the original agent-graph.ts file.
 */

// Type definitions
export type { AgentRelationship, AgentNode } from './types.js';

// Agent node definitions
export { agentNodes } from './nodes.js';

// Relationship definitions
export { handoffRelationships } from './relationships.js';

// Routing functions
export { getNextAgents, getParallelAgents } from './routing.js';

// Validation functions
export { detectCircularDependencies } from './validation.js';
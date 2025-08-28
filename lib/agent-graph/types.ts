/**
 * Agent Graph Type Definitions
 * 
 * TypeScript interfaces for agent relationships and nodes
 * used in collaborative workflow management.
 */

export interface AgentRelationship {
  from: string;
  to: string;
  contextRequired: string[];
  contextOptional?: string[];
  triggerConditions: string[];
  parallel?: boolean;
}

export interface AgentNode {
  id: string;
  role: string;
  dependencies: {
    required: string[];
    optional: string[];
  };
  outputs: string[];
  canRunParallel: boolean;
}
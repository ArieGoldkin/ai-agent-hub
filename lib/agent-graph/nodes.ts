/**
 * Agent Node Definitions
 * 
 * Agent nodes with their capabilities, dependencies, and parallel execution settings.
 */

import { AgentNode } from './types.js';

/**
 * Agent nodes with their capabilities and dependencies
 */
export const agentNodes: Record<string, AgentNode> = {
  "studio-coach": {
    id: "studio-coach",
    role: "orchestrator",
    dependencies: { required: [], optional: [] },
    outputs: ["session_goals", "agent_assignments", "workflow_plan"],
    canRunParallel: false,
  },
  "ux-researcher": {
    id: "ux-researcher",
    role: "research",
    dependencies: {
      required: ["session_goals"],
      optional: ["market_data", "user_feedback"],
    },
    outputs: ["user_personas", "journey_maps", "requirements"],
    canRunParallel: true,
  },
  "sprint-prioritizer": {
    id: "sprint-prioritizer",
    role: "planning",
    dependencies: {
      required: ["requirements"],
      optional: ["velocity_data", "team_capacity"],
    },
    outputs: ["sprint_plan", "priorities", "deadlines"],
    canRunParallel: false,
  },
  "rapid-ui-designer": {
    id: "rapid-ui-designer",
    role: "design",
    dependencies: {
      required: ["requirements", "user_personas"],
      optional: ["brand_guidelines", "existing_components"],
    },
    outputs: ["design_system", "mockups", "component_specs"],
    canRunParallel: true,
  },
  "backend-system-architect": {
    id: "backend-system-architect",
    role: "architecture",
    dependencies: {
      required: ["requirements", "priorities"],
      optional: ["existing_architecture", "scalability_needs"],
    },
    outputs: ["api_contracts", "database_schema", "architecture_decisions"],
    canRunParallel: true,
  },
  "frontend-ui-developer": {
    id: "frontend-ui-developer",
    role: "implementation",
    dependencies: {
      required: ["api_contracts", "design_system"],
      optional: ["component_library", "state_patterns"],
    },
    outputs: ["components", "integration_code", "ui_state"],
    canRunParallel: false,
  },
  "ai-ml-engineer": {
    id: "ai-ml-engineer",
    role: "ml-implementation",
    dependencies: {
      required: ["api_contracts", "requirements"],
      optional: ["training_data", "model_constraints"],
    },
    outputs: ["ml_endpoints", "model_specs", "inference_api"],
    canRunParallel: true,
  },
  "whimsy-injector": {
    id: "whimsy-injector",
    role: "enhancement",
    dependencies: {
      required: ["components"],
      optional: ["brand_voice", "delight_patterns"],
    },
    outputs: ["micro_interactions", "delightful_features", "animations"],
    canRunParallel: true,
  },
  "code-quality-reviewer": {
    id: "code-quality-reviewer",
    role: "validation",
    dependencies: {
      required: ["*"], // Reads from all
      optional: [],
    },
    outputs: ["quality_report", "improvements", "validation_status"],
    canRunParallel: false,
  },
};
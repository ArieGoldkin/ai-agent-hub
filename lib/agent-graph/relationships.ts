/**
 * Agent Relationship Definitions
 * 
 * Handoff patterns and trigger conditions for agent collaboration.
 */

import { AgentRelationship } from './types.js';

/**
 * Common handoff relationships between agents
 */
export const handoffRelationships: AgentRelationship[] = [
  // Initial orchestration
  {
    from: "studio-coach",
    to: "ux-researcher",
    contextRequired: ["session_goals", "target_users"],
    contextOptional: ["existing_research"],
    triggerConditions: ["session_started", "research_needed"],
    parallel: true,
  },
  {
    from: "studio-coach",
    to: "sprint-prioritizer",
    contextRequired: ["session_goals", "timeline"],
    triggerConditions: ["planning_phase"],
    parallel: true,
  },
  
  // Research to Design/Architecture
  {
    from: "ux-researcher",
    to: "rapid-ui-designer",
    contextRequired: ["user_personas", "journey_maps"],
    contextOptional: ["competitor_analysis"],
    triggerConditions: ["research_complete"],
    parallel: true,
  },
  {
    from: "ux-researcher",
    to: "backend-system-architect",
    contextRequired: ["requirements", "user_flows"],
    triggerConditions: ["requirements_defined"],
    parallel: true,
  },
  
  // Design to Implementation
  {
    from: "rapid-ui-designer",
    to: "frontend-ui-developer",
    contextRequired: ["design_system", "component_specs"],
    contextOptional: ["interaction_patterns"],
    triggerConditions: ["design_approved"],
  },
  
  // Architecture to Implementation
  {
    from: "backend-system-architect",
    to: "frontend-ui-developer",
    contextRequired: ["api_contracts"],
    contextOptional: ["websocket_events", "error_codes"],
    triggerConditions: ["api_designed"],
  },
  {
    from: "backend-system-architect",
    to: "ai-ml-engineer",
    contextRequired: ["ml_requirements", "api_contracts"],
    triggerConditions: ["ml_features_needed"],
    parallel: true,
  },
  
  // Implementation to Enhancement
  {
    from: "frontend-ui-developer",
    to: "whimsy-injector",
    contextRequired: ["components", "ui_state"],
    triggerConditions: ["ui_complete"],
    parallel: true,
  },
  
  // Everything to Quality Review
  {
    from: "*",
    to: "code-quality-reviewer",
    contextRequired: ["implementation_complete"],
    triggerConditions: ["review_requested", "milestone_reached"],
  },
  
  // Quality feedback loop
  {
    from: "code-quality-reviewer",
    to: "studio-coach",
    contextRequired: ["quality_report", "action_items"],
    triggerConditions: ["review_complete"],
  },
];
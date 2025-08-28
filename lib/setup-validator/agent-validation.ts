/**
 * Agent Installation Validation
 *
 * Validates that all required AI agent files are installed correctly
 */

import { existsSync, readdirSync } from "fs";
import { ValidationResult } from "./types.js";

/**
 * Validate agent installation
 */
export async function validateAgentInstallation(): Promise<ValidationResult> {
  const agentDir = ".claude/agents";

  if (!existsSync(agentDir)) {
    return {
      component: "Agent Installation",
      status: "error",
      message: "Agent directory not found",
      details: ["Run: ai-agent-hub --both to install agents"]
    };
  }

  const agentFiles = readdirSync(agentDir).filter(f => f.endsWith(".md"));
  const expectedAgents = [
    "ai-ml-engineer.md",
    "backend-system-architect.md",
    "code-quality-reviewer.md",
    "frontend-ui-developer.md",
    "rapid-ui-designer.md",
    "sprint-prioritizer.md",
    "studio-coach.md",
    "ux-researcher.md",
    "whimsy-injector.md"
  ];

  const missingAgents = expectedAgents.filter(
    agent => !agentFiles.includes(agent)
  );

  if (missingAgents.length === 0) {
    return {
      component: "Agent Installation",
      status: "success",
      message: `All 9 agents installed correctly (${agentFiles.length} files)`
    };
  } else if (missingAgents.length < 3) {
    return {
      component: "Agent Installation",
      status: "warning",
      message: `${missingAgents.length} agents missing`,
      details: [`Missing: ${missingAgents.join(", ")}`]
    };
  } else {
    return {
      component: "Agent Installation",
      status: "error",
      message: `${missingAgents.length} agents missing - incomplete installation`,
      details: [`Missing: ${missingAgents.join(", ")}`]
    };
  }
}


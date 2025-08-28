/**
 * Claude Code Integration Validation
 *
 * Validates Claude Code settings and integration
 */

import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { ValidationResult } from "./types.js";

/**
 * Validate Claude Code integration
 */
export async function validateClaudeCodeIntegration(): Promise<ValidationResult> {
  const settingsPath = ".claude/settings.local.json";

  if (!existsSync(settingsPath)) {
    return {
      component: "Claude Code Integration",
      status: "error",
      message: "Claude Code settings missing",
      details: ["Run: ai-agent-hub --both to create settings"]
    };
  }

  try {
    const settings = JSON.parse(await readFile(settingsPath, "utf-8"));

    if (settings.enableAllProjectMcpServers === true) {
      return {
        component: "Claude Code Integration",
        status: "success",
        message: "Claude Code integration configured"
      };
    } else {
      return {
        component: "Claude Code Integration",
        status: "warning",
        message: "MCP servers may not be enabled",
        details: ["enableAllProjectMcpServers should be true"]
      };
    }
  } catch (error) {
    return {
      component: "Claude Code Integration",
      status: "error",
      message: "Invalid settings configuration",
      details: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
}


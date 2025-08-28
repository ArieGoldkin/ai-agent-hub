/**
 * Session Infrastructure Validation
 *
 * Validates session files, templates, and infrastructure
 */

import { existsSync, readdirSync } from "fs";
import { ValidationResult } from "./types.js";

/**
 * Validate session infrastructure
 */
export async function validateSessionInfrastructure(): Promise<ValidationResult> {
  const requiredFiles = [
    ".claude/session-context.json",
    ".claude/session-archive.json",
    ".claude/session-templates"
  ];

  const missingFiles: string[] = [];
  const details: string[] = [];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      missingFiles.push(file);
    }
  }

  // Check session templates specifically
  if (existsSync(".claude/session-templates")) {
    const templates = readdirSync(".claude/session-templates").filter(f =>
      f.endsWith(".json")
    );
    if (templates.length === 0) {
      details.push("No session templates found");
    } else {
      details.push(`${templates.length} session templates available`);
    }
  }

  if (missingFiles.length === 0) {
    return {
      component: "Session Infrastructure",
      status: "success",
      message: "Session infrastructure complete",
      details
    };
  } else {
    return {
      component: "Session Infrastructure",
      status: "warning",
      message: `${missingFiles.length} infrastructure files missing`,
      details: [`Missing: ${missingFiles.join(", ")}`, ...details]
    };
  }
}


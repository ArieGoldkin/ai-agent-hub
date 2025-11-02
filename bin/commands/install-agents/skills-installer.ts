/**
 * Skills installer
 * Installs comprehensive Claude Code skills to enhance agent capabilities
 */

import { existsSync } from "fs";
import { cp } from "fs/promises";
import { join } from "path";

/**
 * Install skills directory with all 7 comprehensive skills
 */
export async function installSkills(packageRoot: string): Promise<void> {
  const sourceDir = join(packageRoot, "skills");
  const targetDir = "skills";

  try {
    // Check if skills already exist
    if (existsSync(targetDir)) {
      console.log("✅ Skills directory already installed");
      return;
    }

    // Check if source directory exists
    if (!existsSync(sourceDir)) {
      console.log("   Skills not found in package (optional feature)");
      return;
    }

    // Copy entire skills directory recursively
    await cp(sourceDir, targetDir, { recursive: true });

    console.log("✅ Installed 7 comprehensive Claude Code skills:");
    console.log("   • architecture-decision-record - Document architectural decisions");
    console.log("   • api-design-framework - REST/GraphQL/gRPC API design");
    console.log("   • testing-strategy-builder - Comprehensive testing strategies");
    console.log("   • code-review-playbook - Structured code review process");
    console.log("   • design-system-starter - Design tokens & component architecture");
    console.log("   • database-schema-designer - SQL/NoSQL schema design");
    console.log("   • security-checklist - OWASP Top 10 security guidance");

  } catch (error) {
    // Skills are optional - don't fail installation
    console.log("   Skills installation skipped (optional feature)");
    console.error("   Error:", error instanceof Error ? error.message : error);
  }
}

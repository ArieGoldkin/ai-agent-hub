/**
 * Skills installer
 * Installs comprehensive Claude Code skills to enhance agent capabilities
 */

import { existsSync } from "fs";
import { cp } from "fs/promises";
import { join } from "path";

/**
 * Install skills directory with all 19 comprehensive skills
 */
export async function installSkills(packageRoot: string): Promise<void> {
  const sourceDir = join(packageRoot, "skills");
  const targetDir = ".claude/skills";

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

    console.log("✅ Installed 19 comprehensive Claude Code skills:");
    console.log("   • ai-native-development - RAG, embeddings, vector DBs & LLM integration");
    console.log("   • api-design-framework - REST/GraphQL/gRPC API design patterns");
    console.log("   • architecture-decision-record - Document architectural decisions (ADR)");
    console.log("   • brainstorming - Transform rough ideas into fully-formed designs");
    console.log("   • code-review-playbook - Structured code review process");
    console.log("   • database-schema-designer - SQL/NoSQL schema design & optimization");
    console.log("   • design-system-starter - Design tokens & component architecture");
    console.log("   • devops-deployment - CI/CD, Docker, Kubernetes & GitOps patterns");
    console.log("   • edge-computing-patterns - Cloudflare Workers, Vercel Edge deployment");
    console.log("   • evidence-verification - Evidence-based task completion");
    console.log("   • observability-monitoring - Logging, metrics, tracing & alerting");
    console.log("   • performance-optimization - Full-stack performance tuning");
    console.log("   • prototype-to-production - Convert prototypes to React/TypeScript components");
    console.log("   • quality-gates - Task complexity assessment & risk management");
    console.log("   • react-server-components-framework - Next.js 15 App Router & RSC");
    console.log("   • security-checklist - OWASP Top 10 security guidance");
    console.log("   • streaming-api-patterns - SSE, WebSockets & real-time streaming");
    console.log("   • testing-strategy-builder - Comprehensive testing strategies");
    console.log("   • type-safety-validation - End-to-end type safety with Zod & tRPC");

  } catch (error) {
    // Skills are optional - don't fail installation
    console.log("   Skills installation skipped (optional feature)");
    console.error("   Error:", error instanceof Error ? error.message : error);
  }
}

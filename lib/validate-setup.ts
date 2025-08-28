/**
 * Simplified Setup Validator
 *
 * Basic validation for installation health check
 */

import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import { validateDesktopSetup } from "./claude-desktop-setup.js";
import { checkRequiredEnvVars } from "./env-handler.js";
import { fileExists } from "./file-ops.js";

export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validate the complete setup
 */
export async function validateSetup(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // Check .claude directory exists
  if (!existsSync(".claude")) {
    results.push({ valid: false, message: "❌ .claude directory not found" });
    return results;
  }

  // Check agents directory
  const agentsPath = ".claude/agents";
  if (!existsSync(agentsPath)) {
    results.push({ valid: false, message: "❌ Agents directory not found" });
  } else {
    try {
      const files = await readdir(agentsPath);
      const agentFiles = files.filter(f => f.endsWith(".md"));
      if (agentFiles.length >= 9) {
        results.push({
          valid: true,
          message: `✅ ${agentFiles.length} agents installed`
        });
      } else {
        results.push({
          valid: false,
          message: `⚠️ Only ${agentFiles.length} agents found (expected 9)`
        });
      }
    } catch (error) {
      results.push({
        valid: false,
        message: "❌ Could not read agents directory"
      });
    }
  }

  // Check session files
  if (existsSync(".claude/session-context.json")) {
    results.push({ valid: true, message: "✅ Session system ready" });
  } else {
    results.push({
      valid: false,
      message: "⚠️ Session system not initialized"
    });
  }

  // Check MCP configuration
  if (existsSync(".mcp.json")) {
    results.push({ valid: true, message: "✅ MCP servers configured" });
  } else {
    results.push({ valid: false, message: "⚠️ MCP servers not configured" });
  }

  // Check CLAUDE.md
  if (existsSync("CLAUDE.md")) {
    results.push({
      valid: true,
      message: "✅ Orchestration instructions present"
    });
  } else {
    results.push({ valid: false, message: "⚠️ CLAUDE.md not found" });
  }

  // Check trigger file
  if (existsSync("START_SESSION.md")) {
    results.push({ valid: true, message: "✅ Session trigger ready" });
  } else {
    results.push({
      valid: true,
      message: "ℹ️ Run 'ai-agent-hub session' to start"
    });
  }

  // Check environment configuration
  if (fileExists(".env")) {
    const envStatus = checkRequiredEnvVars();
    if (envStatus.missing.length === 0) {
      results.push({
        valid: true,
        message: "✅ Environment variables configured"
      });
    } else {
      results.push({
        valid: false,
        message: `⚠️ Missing environment variables: ${envStatus.missing.join(", ")}`
      });
      if (envStatus.optional.length > 0) {
        results.push({
          valid: true,
          message: `ℹ️ Optional variables not set: ${envStatus.optional.join(", ")}`
        });
      }
    }
  } else {
    results.push({
      valid: false,
      message: "⚠️ .env file not found (required for API integrations)"
    });
  }

  // Check Claude Desktop installation (optional but recommended)
  console.log("\n🖥️  Checking Claude Desktop...");
  const desktopStatus = await validateDesktopSetup();
  
  if (desktopStatus.hasMCP && desktopStatus.hasAgents) {
    results.push({ 
      valid: true, 
      message: `✅ Claude Desktop configured (${desktopStatus.platform})` 
    });
  } else if (desktopStatus.hasMCP || desktopStatus.hasAgents) {
    results.push({ 
      valid: true, 
      message: `⚠️ Claude Desktop partially configured (${desktopStatus.platform})` 
    });
  } else {
    results.push({ 
      valid: true, 
      message: `ℹ️ Claude Desktop not configured (${desktopStatus.platform})` 
    });
  }

  return results;
}

/**
 * Display validation results
 */
export function displayResults(results: ValidationResult[]): void {
  console.log("\n🔍 Installation Health Check\n");

  for (const result of results) {
    console.log(result.message);
  }

  const allValid = results.every(r => r.valid || r.message.startsWith("ℹ️"));

  console.log("");
  if (allValid) {
    console.log("✨ Installation is healthy!");
    console.log("   Run 'ai-agent-hub session' to start orchestration");
  } else {
    console.log("⚠️ Some issues detected");
    console.log("   Run 'npx ai-agent-hub' to complete setup");
  }
}

/**
 * Session Operations
 * 
 * Core session command implementations
 */

import { ContextManager } from "../../../lib/context-manager.js";
import { archiveSession } from "./archive.js";
import { formatSessionDisplay } from "./display.js";
import { generateSessionName, getDuration, formatDate } from "./utils.js";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import * as readline from 'readline';

/**
 * Start a new session with optional name and request
 */
export async function startSession(manager: ContextManager, name?: string): Promise<void> {
  try {
    // Generate session name if not provided
    const sessionName = name || generateSessionName();
    
    // Archive current session if exists
    const currentContext = await manager.getContext();
    if (currentContext) {
      await archiveSession(currentContext);
    }
    
    // Initialize new session
    await manager.initSession(sessionName);
    
    // Prompt for user request
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log("\n🚀 AI Agent Orchestration Session");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("What would you like to create?");
    console.log("(e.g., 'Create a login form with email/password validation')");
    console.log("");
    
    const userRequest = await new Promise<string>((resolve) => {
      rl.question("> ", (answer) => {
        rl.close();
        resolve(answer);
      });
    });
    
    if (!userRequest.trim()) {
      console.log("❌ No request provided. Session started but no trigger created.");
      return;
    }
    
    // Store user request as initial decision
    await manager.addDecision({
      type: 'continue',
      agentName: 'user',
      timestamp: new Date(),
      reason: `User request: ${userRequest}`,
      confidence: 1.0,
      context: { userRequest }
    });
    
    // Create/update START_SESSION.md trigger file
    const triggerPath = "START_SESSION.md";
    const triggerContent = `# Start AI Agent Session

## Your Request
${userRequest}

## Session Information
- Session ID: ${sessionName}
- Started: ${new Date().toISOString()}
- Status: Ready for orchestration

## Instructions for Claude
This session has been initialized with the above request.
Please read CLAUDE.md for orchestration instructions and begin implementing the request using the agent workflow.

### Next Steps:
1. Use Studio Coach to analyze the request
2. Follow the orchestration workflow in CLAUDE.md
3. Update session-context.json as you progress
4. Implement the solution using appropriate agents

---
*This file triggers AI agent orchestration*
`;
    
    await writeFile(triggerPath, triggerContent);
    
    console.log("");
    console.log(`✅ Session started: ${sessionName}`);
    console.log(`📝 Request: ${userRequest}`);
    console.log(`📋 Trigger created: START_SESSION.md`);
    console.log(`🔄 Session context: .claude/session-context.json`);
    console.log("");
    console.log("💡 Claude will now orchestrate agents to implement your request");
    console.log("   Open this project in Claude Code to begin!");
  } catch (error) {
    console.error("❌ Failed to start session:", error);
  }
}

/**
 * Display current session context
 */
export async function showSession(manager: ContextManager): Promise<void> {
  try {
    const context = await manager.getContext();
    
    if (!context) {
      console.log("📊 No active session");
      console.log("   Start a new session with: ai-agent-hub session start");
      return;
    }
    
    console.log(formatSessionDisplay(context));
  } catch (error) {
    console.error("❌ Failed to show session:", error);
  }
}

/**
 * Clear current session
 */
export async function clearSession(manager: ContextManager): Promise<void> {
  try {
    const context = await manager.getContext();
    
    if (!context) {
      console.log("📊 No active session to clear");
      return;
    }
    
    // Archive before clearing
    await archiveSession(context);
    
    // Clear the session
    await manager.clearSession();
    
    console.log(`✅ Session cleared: ${context.sessionId}`);
    console.log("   Previous session has been archived");
  } catch (error) {
    console.error("❌ Failed to clear session:", error);
  }
}

/**
 * List archived sessions
 */
export async function listSessions(): Promise<void> {
  try {
    const archivePath = join(process.cwd(), ".claude", "session-archive.json");
    
    if (!existsSync(archivePath)) {
      console.log("📊 No archived sessions found");
      console.log("   Sessions are archived when cleared or replaced");
      return;
    }
    
    const content = await readFile(archivePath, "utf-8");
    const archives = JSON.parse(content);
    
    if (!archives || archives.length === 0) {
      console.log("📊 No archived sessions found");
      return;
    }
    
    console.log("\n📊 Recent Sessions (last 5):");
    
    const recent = archives.slice(-5).reverse();
    for (const session of recent) {
      console.log(`\n   ${session.sessionId}`);
      console.log(`     Started: ${formatDate(new Date(session.startTime))}`);
      console.log(`     Duration: ${getDuration(session.startTime, session.lastUpdated)}`);
      
      if (session.agents) {
        const agentCount = Object.keys(session.agents).length;
        console.log(`     Agents: ${agentCount}`);
      }
      
      if (session.decisionHistory) {
        console.log(`     Decisions: ${session.decisionHistory.length}`);
      }
    }
    
    console.log();
  } catch (error) {
    console.error("❌ Failed to list sessions:", error);
  }
}


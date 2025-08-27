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
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Start a new session with optional name
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
    
    console.log(`✅ Started new session: ${sessionName}`);
    console.log(`   Path: .claude/session-context.json`);
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


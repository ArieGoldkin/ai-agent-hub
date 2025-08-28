/**
 * Session Start Command
 * 
 * Simplified session starter that creates orchestration triggers
 */

import { ContextManager } from "../../lib/context-manager.js";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import * as readline from 'readline';

/**
 * Generate a simple session name with timestamp
 */
function generateSessionName(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `session_${date}_${time}`;
}

/**
 * Start a new orchestration session
 */
export async function startSession(name?: string): Promise<void> {
  try {
    const sessionName = name || generateSessionName();
    const manager = new ContextManager();
    
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
      console.log("❌ No request provided. Session cancelled.");
      return;
    }
    
    // Store user request in session
    await manager.addDecision({
      type: 'continue',
      agentName: 'user',
      timestamp: new Date(),
      reason: `User request: ${userRequest}`,
      confidence: 1.0,
      context: { userRequest }
    });
    
    // Create START_SESSION.md trigger file
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
    
    await writeFile("START_SESSION.md", triggerContent);
    
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
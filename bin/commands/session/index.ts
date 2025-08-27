/**
 * Session Command Module - Main Handler
 * 
 * Routes session subcommands to appropriate functions
 */

import { ContextManager } from "../../../lib/context-manager.js";
import { showSessionHelp } from "../session-help.js";
import { startSession, showSession, clearSession, listSessions } from "./operations.js";

/**
 * Main session command handler
 */
export async function handleSessionCommand(
  subcommand: string | undefined, 
  args: string[]
): Promise<void> {
  const manager = new ContextManager();
  
  switch (subcommand) {
    case "start":
      await startSession(manager, args[0]);
      break;
      
    case "show":
      await showSession(manager);
      break;
      
    case "clear":
      await clearSession(manager);
      break;
      
    case "list":
      await listSessions();
      break;
      
    case "help":
    case undefined:
      showSessionHelp();
      break;
      
    default:
      console.error(`❌ Unknown session command: ${subcommand}`);
      console.log("Use 'ai-agent-hub session help' for available commands");
      break;
  }
}
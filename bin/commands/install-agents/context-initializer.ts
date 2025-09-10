/**
 * Context system initializer
 */

import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

/**
 * Initialize the structured context system
 */
export async function initializeContextSystem(mode: string): Promise<void> {
  const contextDir = '.claude/context';
  
  try {
    // Create context directory
    if (!existsSync(contextDir)) {
      await mkdir(contextDir, { recursive: true });
    }
    
    // Initialize shared context if it doesn't exist
    const contextFile = join(contextDir, 'shared-context.json');
    if (!existsSync(contextFile)) {
      const initial = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        session_id: `session-${Date.now()}`,
        mode: mode,
        agent_decisions: {},
        tasks_completed: [],
        tasks_pending: []
      };
      
      await writeFile(contextFile, JSON.stringify(initial, null, 2));
      console.log('✅ Initialized structured context system');
    }
  } catch {
    // Context system is optional enhancement - don't fail installation
    console.log('   Context system initialization skipped (optional feature)');
  }
}
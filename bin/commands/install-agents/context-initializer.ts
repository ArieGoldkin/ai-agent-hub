/**
 * Context system initializer
 */

import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { SessionPersistence } from "../../../lib/context/session-persistence.js";
import { VocabularyLearning } from "../../../lib/context/vocabulary-learning.js";

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

    // Check for existing session
    const sessionManager = new SessionPersistence();
    const existingSession = sessionManager.loadSession();

    if (existingSession) {
      console.log('\n' + sessionManager.getSummary());
    } else {
      // Create new session
      sessionManager.createSession();
    }

    // Show vocabulary learning status if it exists
    const vocabularyLearner = new VocabularyLearning();
    const vocabulary = vocabularyLearner.loadVocabulary();
    if (vocabulary.recent_agents.length > 0 || Object.keys(vocabulary.word_frequency).length > 0) {
      console.log(vocabularyLearner.getSummary());
    }

    // Initialize shared context if it doesn't exist
    const contextFile = join(contextDir, 'shared-context.json');
    if (!existsSync(contextFile)) {
      const initial = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        session_id: existingSession?.session_id || `session-${Date.now()}`,
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
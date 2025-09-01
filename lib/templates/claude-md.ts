/**
 * CLAUDE.md template - Intelligent agent orchestration documentation
 */

import { createOrUpdateClaudeMd } from "../claude-md-generator/index.js";

/**
 * Create or update CLAUDE.md file with intelligent generation
 * 
 * This now uses the agent properties for each phase:
 * - Extraction phase: Parse agent metadata properties from .md files
 * - Analysis phase: Understand relationships and dependencies
 * - Generation phase: Create rich documentation using all properties
 */
export async function createClaudeMd(): Promise<void> {
  await createOrUpdateClaudeMd();
}
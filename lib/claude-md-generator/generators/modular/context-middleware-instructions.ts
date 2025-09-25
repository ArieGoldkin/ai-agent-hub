/**
 * Context Middleware Instructions Generator
 *
 * Generates auto-loaded context management instructions that ALL agents must follow
 * Ensures session persistence and cross-agent knowledge sharing
 */

import {
  generateProtocolIntroduction,
  generateBeforeProtocol,
  generateDuringProtocol,
  generateAfterProtocol,
  generateErrorProtocol,
  generateContextStructure,
  generateBestPracticesIntro,
  generatePatternDetection,
  generateConflictPrevention,
  generateIntegrationChecklist
} from './context-middleware/index.js';

/**
 * Generate complete context middleware instructions
 */
export function generateContextMiddlewareInstructions(): string {
  const sections: string[] = [];

  // Introduction and protocol overview
  sections.push(...generateProtocolIntroduction());

  // Core protocol sections
  sections.push(...generateBeforeProtocol());
  sections.push(...generateDuringProtocol());
  sections.push(...generateAfterProtocol());
  sections.push(...generateErrorProtocol());

  // TypeScript interface definition
  sections.push(...generateContextStructure());

  // Best practices with examples
  sections.push(...generateBestPracticesIntro());
  sections.push(...generatePatternDetection());
  sections.push(...generateConflictPrevention());

  // Final checklist and conclusion
  sections.push(...generateIntegrationChecklist());

  return sections.join('\n');
}
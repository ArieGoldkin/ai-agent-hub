/**
 * Type definitions for CLAUDE.md generator
 */

/**
 * Agent metadata structure extracted from frontmatter
 */
export interface AgentMetadata {
  name: string;
  description: string;
  tools?: string[];
  model?: string;
  color?: string;
  context_aware?: boolean;
  orchestrator?: boolean;
  manages?: string[];
  reads_from?: string[];
  writes_to?: string[];
  depends_on?: string[];
  provides_context?: string[];
}

/**
 * CLAUDE.md generation strategy
 */
export type GenerationStrategy = 'create' | 'update' | 'merge';

/**
 * CLAUDE.md section structure
 */
export interface ClaudeMdSection {
  title: string;
  content: string;
  isCustom: boolean;  // User-added content
}
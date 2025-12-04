/**
 * Centralized Version Management
 *
 * Single source of truth for version information across the entire package.
 * Import this module instead of hardcoding version strings.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the current package version from package.json
 * This is the single source of truth for version information.
 */
export function getVersion(): string {
  try {
    // Navigate from dist/lib/ to package root
    const packageJsonPath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  } catch {
    // Fallback for development or if package.json is not found
    return '3.7.2';
  }
}

/**
 * Current version - exported for convenience
 * Use this when you need a string constant (e.g., in templates)
 */
export const VERSION = getVersion();

/**
 * Valid execution modes
 */
export const VALID_MODES = ['classic', 'squad', 'auto'] as const;
export type ExecutionMode = typeof VALID_MODES[number];

/**
 * Package metadata
 */
export const PACKAGE_NAME = 'ai-agent-hub';

/**
 * Agent counts for documentation
 */
export const AGENT_COUNT = 10;
export const SKILL_COUNT = 19; // 15 base + 3 v3.7.0 (performance, devops, observability) + 1 v3.7.1 (prototype-to-production)

/**
 * Model tiers for Opus 4.5 optimization
 */
export const MODEL_TIERS = {
  OPUS: 'claude-opus-4-5-20251101',      // Complex reasoning, orchestration
  SONNET: 'claude-sonnet-4-5-20250929',  // Day-to-day implementation
  HAIKU: 'claude-haiku-3-5-20241022',    // Simple edits, cost optimization
} as const;

/**
 * Token budgets for different contexts
 */
export const TOKEN_BUDGETS = {
  SUPERVISOR: 12000,    // Extended reasoning for orchestration
  AGENT: 6000,          // Standard agent work
  SIMPLE_TASK: 3000,    // Quick edits with Haiku
  SESSION_MAX: 150000,  // Total session budget
  WARN_THRESHOLD: 0.75, // 75% - warning
  COMPRESS_THRESHOLD: 0.80, // 80% - auto-compress
  BLOCK_THRESHOLD: 0.85,    // 85% - block operations
} as const;

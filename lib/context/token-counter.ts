/**
 * Token Counter for Context Management
 * Provides accurate token estimation for Claude models
 * @version 3.7.0
 */

export const MODEL_TOKEN_LIMITS = {
  opus: 200000,
  sonnet: 200000,
  haiku: 200000
} as const;

export type ModelType = keyof typeof MODEL_TOKEN_LIMITS;

/**
 * Check if content appears to be JSON
 */
export function isJsonContent(text: string): boolean {
  const trimmed = text.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
         (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

/**
 * Check if content appears to be code
 */
export function isCodeContent(text: string): boolean {
  const codePatterns = [
    /function\s+\w+\s*\(/,     // function declarations
    /const\s+\w+\s*=/,         // const declarations
    /let\s+\w+\s*=/,           // let declarations
    /import\s+.*from/,         // imports
    /export\s+(default\s+)?/,  // exports
    /class\s+\w+/,             // class declarations
    /=>\s*\{/,                 // arrow functions
    /\)\s*:\s*\w+/,            // TypeScript type annotations
  ];
  return codePatterns.some(pattern => pattern.test(text));
}

/**
 * Count tokens in text using tiktoken-inspired algorithm
 *
 * Claude tokenization characteristics:
 * - Average 4 characters per token for English text
 * - Common words are single tokens
 * - Code has higher token density
 * - JSON structure adds overhead
 */
export function countTokens(text: string): number {
  if (!text || text.length === 0) return 0;

  const charCount = text.length;
  const baseEstimate = Math.ceil(charCount / 4);

  // JSON overhead
  if (isJsonContent(text)) {
    const structuralChars = (text.match(/[{}\[\]:,]/g) || []).length;
    return baseEstimate + Math.ceil(structuralChars * 0.3);
  }

  // Code has higher token density (~3 chars per token)
  if (isCodeContent(text)) {
    return Math.ceil(charCount / 3);
  }

  // Natural language estimation
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const newlineCount = (text.match(/\n/g) || []).length;
  const wordEstimate = Math.ceil(wordCount * 1.3);
  const structureBonus = Math.ceil(newlineCount * 0.1);

  // Weighted average with 10% safety margin
  return Math.ceil(
    (baseEstimate * 0.4 + wordEstimate * 0.5 + structureBonus * 0.1) * 1.1
  );
}

/**
 * Get token limit for a model
 */
export function getTokenLimit(model: ModelType): number {
  return MODEL_TOKEN_LIMITS[model];
}

/**
 * Token counting thresholds
 */
export const THRESHOLDS = {
  WARN: 0.75,      // 75% - warn user
  COMPRESS: 0.80,  // 80% - auto-compress
  BLOCK: 0.85      // 85% - block operations
} as const;

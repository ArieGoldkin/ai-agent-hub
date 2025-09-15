/**
 * Simple vocabulary learning for AI Agent Hub
 * Learns project-specific keywords for better agent selection
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';

export interface LearnedVocabulary {
  version: string;
  updated_at: string;

  // Which words map to which agents (learned from usage)
  agent_keywords: {
    [agentName: string]: string[];
  };

  // Recent agent usage (for context continuity)
  recent_agents: string[];

  // Simple word frequency to learn importance
  word_frequency: {
    [word: string]: number;
  };
}

export class VocabularyLearning {
  private vocabularyFile = '.claude/context/learned-vocabulary.json';
  private maxRecentAgents = 5;

  // Common words to ignore
  private commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'need', 'want', 'please', 'help'
  ]);

  /**
   * Load vocabulary or create new one
   */
  loadVocabulary(): LearnedVocabulary {
    if (!existsSync(this.vocabularyFile)) {
      return this.createEmptyVocabulary();
    }

    try {
      const content = readFileSync(this.vocabularyFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      return this.createEmptyVocabulary();
    }
  }

  /**
   * Save vocabulary to disk
   */
  saveVocabulary(vocabulary: LearnedVocabulary): void {
    vocabulary.updated_at = new Date().toISOString();
    writeFileSync(this.vocabularyFile, JSON.stringify(vocabulary, null, 2));
  }

  /**
   * Learn from an agent invocation
   */
  learnFromUsage(userInput: string, agentUsed: string): void {
    const vocabulary = this.loadVocabulary();

    // Update recent agents
    vocabulary.recent_agents = vocabulary.recent_agents.filter(a => a !== agentUsed);
    vocabulary.recent_agents.unshift(agentUsed);
    if (vocabulary.recent_agents.length > this.maxRecentAgents) {
      vocabulary.recent_agents = vocabulary.recent_agents.slice(0, this.maxRecentAgents);
    }

    // Extract meaningful words from input
    const words = this.extractMeaningfulWords(userInput);

    // Associate these words with the agent
    if (!vocabulary.agent_keywords[agentUsed]) {
      vocabulary.agent_keywords[agentUsed] = [];
    }

    words.forEach(word => {
      // Update word frequency
      vocabulary.word_frequency[word] = (vocabulary.word_frequency[word] || 0) + 1;

      // Add to agent keywords if frequent enough (seen 3+ times)
      if (vocabulary.word_frequency[word] >= 3) {
        if (!vocabulary.agent_keywords[agentUsed].includes(word)) {
          vocabulary.agent_keywords[agentUsed].push(word);
        }
      }
    });

    this.saveVocabulary(vocabulary);
  }

  /**
   * Get enhanced keywords for an agent (base + learned)
   */
  getEnhancedKeywords(agentName: string, baseKeywords: string[]): string[] {
    const vocabulary = this.loadVocabulary();
    const learnedKeywords = vocabulary.agent_keywords[agentName] || [];

    // Combine base and learned keywords
    const combined = new Set([...baseKeywords, ...learnedKeywords]);
    return Array.from(combined);
  }

  /**
   * Get the most recently used agent (for context continuity)
   */
  getLastAgent(): string | null {
    const vocabulary = this.loadVocabulary();
    return vocabulary.recent_agents[0] || null;
  }

  /**
   * Check if we should prefer a recent agent for continuity
   */
  shouldPreferAgent(agentName: string): boolean {
    const vocabulary = this.loadVocabulary();
    // Prefer if it was used in the last 3 interactions
    return vocabulary.recent_agents.slice(0, 3).includes(agentName);
  }

  /**
   * Extract meaningful words from user input
   */
  private extractMeaningfulWords(input: string): string[] {
    return input
      .toLowerCase()
      .split(/\s+/)
      .filter(word => {
        // Keep if: not common, longer than 2 chars, only letters
        return !this.commonWords.has(word) &&
               word.length > 2 &&
               /^[a-z]+$/.test(word);
      });
  }

  /**
   * Create empty vocabulary structure
   */
  private createEmptyVocabulary(): LearnedVocabulary {
    return {
      version: '1.0.0',
      updated_at: new Date().toISOString(),
      agent_keywords: {},
      recent_agents: [],
      word_frequency: {}
    };
  }

  /**
   * Get a summary of learned vocabulary
   */
  getSummary(): string {
    const vocabulary = this.loadVocabulary();
    const agentCount = Object.keys(vocabulary.agent_keywords).length;
    const wordCount = Object.keys(vocabulary.word_frequency).length;

    return `📚 Vocabulary Learning Status:
- Learned keywords for ${agentCount} agents
- Tracked ${wordCount} unique words
- Recent agents: ${vocabulary.recent_agents.slice(0, 3).join(', ') || 'none'}`;
  }
}
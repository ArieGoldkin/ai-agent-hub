/**
 * Context Manager for AI Agent Hub
 * Handles reading and writing structured context with simple file locking
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';
import { SharedContext, CURRENT_SCHEMA_VERSION, SCHEMA_VERSIONS } from './types.js';

export class ContextManager {
  private contextDir = '.claude/context';
  private contextFile = 'shared-context.json';
  private lockFile = '.lock';
  private archiveDir = '.claude/context/archive';

  // Rotation configuration (v3.5.1)
  private readonly ROTATION_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours
  private readonly MAX_EVIDENCE_AGE_MS = 3 * 60 * 60 * 1000; // 3 hours

  // Token budget configuration (v3.7.0 - Model-aware)
  private readonly MODEL_TOKEN_LIMITS = {
    'opus': 200000,    // claude-opus-4-5-20251101
    'sonnet': 200000,  // claude-sonnet-4-5-20250929
    'haiku': 200000,   // claude-haiku-3-5-20241022
  } as const;
  private currentModel: 'opus' | 'sonnet' | 'haiku' = 'sonnet';
  private readonly WARN_THRESHOLD = 0.75; // 75% - warn user
  private readonly COMPRESS_THRESHOLD = 0.80; // 80% - auto-compress
  private readonly BLOCK_THRESHOLD = 0.85; // 85% - block operations

  // Lock configuration (v3.7.0 - Enhanced locking)
  private readonly LOCK_TIMEOUT_MS = 30000; // 30 seconds max lock wait
  private readonly LOCK_RETRY_INTERVAL_MS = 50; // 50ms between retries
  private readonly STALE_LOCK_THRESHOLD_MS = 60000; // 1 minute = stale lock

  constructor() {
    this.ensureContextDirectory();
    this.ensureArchiveDirectory();
  }
  
  private ensureContextDirectory(): void {
    if (!existsSync(this.contextDir)) {
      mkdirSync(this.contextDir, { recursive: true });
      this.initializeContext();
    }
  }

  private ensureArchiveDirectory(): void {
    if (!existsSync(this.archiveDir)) {
      mkdirSync(this.archiveDir, { recursive: true });
    }
  }
  
  private initializeContext(): void {
    const initial: SharedContext = {
      version: '1.0.0',
      schema_version: CURRENT_SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      session_id: this.generateSessionId(),
      model_tier: this.currentModel,
      token_metrics: {
        last_count: 0,
        last_percentage: 0,
        last_checked: new Date().toISOString(),
        peak_usage: 0,
        compressions_performed: 0
      },
      agent_decisions: {},
      tasks_completed: [],
      tasks_pending: []
    };

    this.writeContext(initial);
  }
  
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  
  readContext(): SharedContext {
    const path = join(this.contextDir, this.contextFile);

    if (!existsSync(path)) {
      this.initializeContext();
    }

    try {
      const content = readFileSync(path, 'utf-8');
      let context = JSON.parse(content) as SharedContext;

      // Check if migration is needed (v3.7.0)
      if (this.needsMigration(context)) {
        context = this.migrateContext(context);
        this.writeContext(context);
        console.log(`✅ Context migrated to schema version ${CURRENT_SCHEMA_VERSION}`);
      }

      return context;
    } catch (error) {
      console.error('Error reading context:', error);
      this.initializeContext();
      return this.readContext();
    }
  }

  /**
   * Check if context needs migration to current schema (v3.7.0)
   */
  private needsMigration(context: SharedContext): boolean {
    return context.schema_version !== CURRENT_SCHEMA_VERSION;
  }

  /**
   * Migrate context to current schema version (v3.7.0)
   * Performs incremental migrations through version history
   */
  private migrateContext(context: SharedContext): SharedContext {
    const currentVersion = context.schema_version || '1.0.0';
    const versions = Object.keys(SCHEMA_VERSIONS) as string[];
    const currentIndex = versions.indexOf(currentVersion);

    if (currentIndex === -1) {
      // Unknown version, migrate from beginning
      console.log(`⚠️ Unknown schema version ${currentVersion}, performing full migration`);
      return this.migrateFromVersion(context, '1.0.0');
    }

    // Apply migrations incrementally
    let migrated = { ...context };
    for (let i = currentIndex + 1; i < versions.length; i++) {
      const toVersion = versions[i];
      migrated = this.applyMigration(migrated, toVersion);
      console.log(`   Migrated to schema ${toVersion}`);
    }

    return migrated;
  }

  /**
   * Migrate from a specific version to current (v3.7.0)
   */
  private migrateFromVersion(context: SharedContext, fromVersion: string): SharedContext {
    const versions = Object.keys(SCHEMA_VERSIONS) as string[];
    const startIndex = versions.indexOf(fromVersion);

    let migrated = { ...context };
    for (let i = startIndex + 1; i < versions.length; i++) {
      const toVersion = versions[i];
      migrated = this.applyMigration(migrated, toVersion);
    }

    return migrated;
  }

  /**
   * Apply a single migration step (v3.7.0)
   */
  private applyMigration(context: SharedContext, toVersion: string): SharedContext {
    const migrated = { ...context };

    switch (toVersion) {
      case '1.1.0':
        // Added quality_evidence
        if (!migrated.quality_evidence) {
          migrated.quality_evidence = { last_updated: new Date().toISOString() };
        }
        break;

      case '1.2.0':
        // Added quality_gates and attempt_tracking
        if (!migrated.quality_gates) {
          migrated.quality_gates = [];
        }
        if (!migrated.attempt_tracking) {
          migrated.attempt_tracking = {};
        }
        break;

      case '1.3.0':
        // Added orchestration_state
        if (!migrated.orchestration_state) {
          migrated.orchestration_state = {
            routing_history: [],
            project_intelligence: {
              architecture_patterns: [],
              technology_stack: [],
              established_conventions: {},
              learned_vocabulary: {},
              agent_specializations: {}
            },
            performance_analytics: {
              token_usage_by_agent: {},
              average_task_completion_time: 0,
              agent_collaboration_frequency: {},
              successful_routing_patterns: []
            }
          };
        }
        break;

      case '2.0.0':
        // Added schema_version, model_tier, token_metrics
        if (!migrated.model_tier) {
          migrated.model_tier = 'sonnet'; // Default
        }
        if (!migrated.token_metrics) {
          migrated.token_metrics = {
            last_count: 0,
            last_percentage: 0,
            last_checked: new Date().toISOString(),
            peak_usage: 0,
            compressions_performed: 0
          };
        }
        break;
    }

    migrated.schema_version = toVersion;
    return migrated;
  }

  /**
   * Get schema version information (v3.7.0)
   */
  getSchemaInfo(): {
    current: string;
    contextVersion: string;
    needsMigration: boolean;
    availableVersions: string[];
  } {
    const context = this.readContext();
    return {
      current: CURRENT_SCHEMA_VERSION,
      contextVersion: context.schema_version || '1.0.0',
      needsMigration: this.needsMigration(context),
      availableVersions: Object.keys(SCHEMA_VERSIONS)
    };
  }
  
  writeContext(context: SharedContext): void {
    const path = join(this.contextDir, this.contextFile);
    const lockPath = join(this.contextDir, this.lockFile);

    context.timestamp = new Date().toISOString();

    // Check token budget (v3.5.1)
    const budgetStatus = this.checkTokenBudget(context);

    if (budgetStatus.status === 'block') {
      console.error(budgetStatus.message);
      throw new Error('Context token limit exceeded. Please compress or rotate context.');
    }

    if (budgetStatus.status === 'compress') {
      console.log(budgetStatus.message);
      this.compressContext(context);
      // Re-check after compression
      const afterCompress = this.checkTokenBudget(context);
      console.log(`   After compression: ${afterCompress.message}`);
    }

    if (budgetStatus.status === 'warn') {
      console.log(budgetStatus.message);
    }

    // Check for context rotation (v3.5.1)
    if (this.shouldRotateContext(context)) {
      this.rotateContext(context);
    }

    try {
      // Enhanced file lock mechanism (v3.7.0)
      const acquired = this.acquireLock(lockPath);

      if (!acquired) {
        throw new Error('Failed to acquire context lock. Another process may be writing.');
      }

      try {
        // Write context
        writeFileSync(path, JSON.stringify(context, null, 2));
      } finally {
        // Always release lock, even on error
        this.releaseLock(lockPath);
      }
    } catch (error) {
      console.error('Error writing context:', error);
      throw error;
    }
  }
  
  updateAgentDecision(agentName: string, decision: {
    type?: string;
    description?: string;
    data?: unknown;
  }): void {
    const context = this.readContext();
    
    if (!context.agent_decisions[agentName]) {
      context.agent_decisions[agentName] = {
        timestamp: new Date().toISOString(),
        decisions: []
      };
    }
    
    context.agent_decisions[agentName].decisions.push({
      type: decision.type || 'general',
      description: decision.description || '',
      data: decision.data || {}
    });
    
    context.agent_decisions[agentName].timestamp = new Date().toISOString();
    
    this.writeContext(context);
  }
  
  addApiEndpoint(endpoint: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description: string;
    request_schema?: unknown;
    response_schema?: unknown;
    authentication?: boolean;
  }): void {
    const context = this.readContext();
    
    if (!context.api_design) {
      context.api_design = { endpoints: [] };
    }
    
    context.api_design.endpoints.push(endpoint);
    this.writeContext(context);
  }
  
  addUIComponent(component: {
    name: string;
    type: 'page' | 'component' | 'layout' | 'widget';
    props?: Record<string, unknown>;
    children?: string[];
    api_dependencies?: string[];
    state_management?: string;
  }): void {
    const context = this.readContext();
    
    if (!context.ui_components) {
      context.ui_components = [];
    }
    
    context.ui_components.push(component);
    this.writeContext(context);
  }
  
  addSharedType(name: string, definition: unknown, source: string): void {
    const context = this.readContext();

    if (!context.shared_types) {
      context.shared_types = {};
    }

    context.shared_types[name] = {
      definition,
      used_by: [source],
      source
    };

    this.writeContext(context);
  }

  /**
   * Record test evidence
   * @param evidence Test execution results
   */
  recordTestEvidence(evidence: {
    executed: boolean;
    command?: string;
    exit_code?: number;
    passed?: number;
    failed?: number;
    skipped?: number;
    coverage_percent?: number;
    duration_seconds?: number;
    evidence_file?: string;
  }): void {
    const context = this.readContext();

    if (!context.quality_evidence) {
      context.quality_evidence = {
        last_updated: new Date().toISOString()
      };
    }

    context.quality_evidence.tests = {
      ...evidence,
      timestamp: new Date().toISOString()
    };

    context.quality_evidence.last_updated = new Date().toISOString();
    this.updateQualityStandard(context);
    this.writeContext(context);
  }

  /**
   * Record build evidence
   * @param evidence Build execution results
   */
  recordBuildEvidence(evidence: {
    executed: boolean;
    command?: string;
    exit_code?: number;
    errors?: number;
    warnings?: number;
    artifacts?: Array<{ file: string; size_kb: number }>;
    duration_seconds?: number;
    evidence_file?: string;
  }): void {
    const context = this.readContext();

    if (!context.quality_evidence) {
      context.quality_evidence = {
        last_updated: new Date().toISOString()
      };
    }

    context.quality_evidence.build = {
      ...evidence,
      timestamp: new Date().toISOString()
    };

    context.quality_evidence.last_updated = new Date().toISOString();
    this.updateQualityStandard(context);
    this.writeContext(context);
  }

  /**
   * Record linter evidence
   * @param evidence Linter execution results
   */
  recordLinterEvidence(evidence: {
    executed: boolean;
    tool?: string;
    command?: string;
    exit_code?: number;
    errors?: number;
    warnings?: number;
  }): void {
    const context = this.readContext();

    if (!context.quality_evidence) {
      context.quality_evidence = {
        last_updated: new Date().toISOString()
      };
    }

    context.quality_evidence.linter = {
      ...evidence,
      timestamp: new Date().toISOString()
    };

    context.quality_evidence.last_updated = new Date().toISOString();
    this.updateQualityStandard(context);
    this.writeContext(context);
  }

  /**
   * Record type checker evidence
   * @param evidence Type checker execution results
   */
  recordTypeCheckerEvidence(evidence: {
    executed: boolean;
    tool?: string;
    command?: string;
    exit_code?: number;
    errors?: number;
  }): void {
    const context = this.readContext();

    if (!context.quality_evidence) {
      context.quality_evidence = {
        last_updated: new Date().toISOString()
      };
    }

    context.quality_evidence.type_checker = {
      ...evidence,
      timestamp: new Date().toISOString()
    };

    context.quality_evidence.last_updated = new Date().toISOString();
    this.updateQualityStandard(context);
    this.writeContext(context);
  }

  /**
   * Check if an evidence check passed
   */
  private checkPassed(check?: { executed?: boolean; exit_code?: number }): boolean {
    return Boolean(check?.executed && check?.exit_code === 0);
  }

  /**
   * Check if evidence meets Gold Standard requirements
   */
  private meetsGoldStandard(evidence: NonNullable<SharedContext['quality_evidence']>): boolean {
    const testsPassed = this.checkPassed(evidence.tests);
    const highCoverage = (evidence.tests?.coverage_percent ?? 0) >= 80;
    const noLinterWarnings = (evidence.linter?.warnings ?? 0) === 0;

    return (
      testsPassed &&
      highCoverage &&
      this.checkPassed(evidence.build) &&
      this.checkPassed(evidence.linter) &&
      noLinterWarnings &&
      this.checkPassed(evidence.type_checker)
    );
  }

  /**
   * Check if evidence meets Production Grade requirements
   */
  private meetsProductionGrade(evidence: NonNullable<SharedContext['quality_evidence']>): boolean {
    const testsPassed = this.checkPassed(evidence.tests);
    const goodCoverage = (evidence.tests?.coverage_percent ?? 0) >= 70;

    return (
      testsPassed &&
      goodCoverage &&
      this.checkPassed(evidence.build) &&
      this.checkPassed(evidence.linter) &&
      this.checkPassed(evidence.type_checker)
    );
  }

  /**
   * Check if evidence meets Minimum requirements (at least one check passed)
   */
  private meetsMinimum(evidence: NonNullable<SharedContext['quality_evidence']>): boolean {
    return (
      this.checkPassed(evidence.tests) ||
      this.checkPassed(evidence.build) ||
      this.checkPassed(evidence.linter)
    );
  }

  /**
   * Update quality standard assessment based on collected evidence
   */
  private updateQualityStandard(context: SharedContext): void {
    if (!context.quality_evidence) return;

    const evidence = context.quality_evidence;

    if (this.meetsGoldStandard(evidence)) {
      evidence.quality_standard_met = 'gold-standard';
      evidence.all_checks_passed = true;
    } else if (this.meetsProductionGrade(evidence)) {
      evidence.quality_standard_met = 'production-grade';
      evidence.all_checks_passed = true;
    } else if (this.meetsMinimum(evidence)) {
      evidence.quality_standard_met = 'minimum';
      evidence.all_checks_passed = false;
    } else {
      evidence.quality_standard_met = undefined;
      evidence.all_checks_passed = false;
    }
  }

  /**
   * Get current quality evidence
   */
  getQualityEvidence(): SharedContext['quality_evidence'] {
    const context = this.readContext();
    return context.quality_evidence;
  }

  /**
   * Check if evidence exists for task completion
   */
  hasEvidence(): boolean {
    const context = this.readContext();
    const evidence = context.quality_evidence;

    if (!evidence) return false;

    // At least one verification type must be executed
    return !!(
      evidence.tests?.executed ||
      evidence.build?.executed ||
      evidence.linter?.executed ||
      evidence.type_checker?.executed
    );
  }

  /**
   * Record a quality gate check
   * @param gateCheck Quality gate check result
   */
  recordGateCheck(gateCheck: {
    task_id: string;
    timestamp: string;
    complexity_score: number;
    gate_status: 'pass' | 'warning' | 'blocked';
    critical_questions_count: number;
    unanswered_questions: number;
    dependencies_blocked: number;
    attempt_count: number;
    can_proceed: boolean;
    blocking_reasons?: string[];
    assumptions?: string[];
  }): void {
    const context = this.readContext();

    if (!context.quality_gates) {
      context.quality_gates = [];
    }

    context.quality_gates.push(gateCheck);
    this.writeContext(context);
  }

  /**
   * Track an attempt at a task
   * @param taskId Task identifier
   * @param attempt Attempt details
   */
  trackAttempt(taskId: string, attempt: {
    timestamp: string;
    approach: string;
    outcome: 'success' | 'failed';
    failure_reason?: string;
    learnings?: string;
  }): void {
    const context = this.readContext();

    if (!context.attempt_tracking) {
      context.attempt_tracking = {};
    }

    if (!context.attempt_tracking[taskId]) {
      context.attempt_tracking[taskId] = {
        attempts: [],
        first_attempt: attempt.timestamp
      };
    }

    context.attempt_tracking[taskId].attempts.push(attempt);
    this.writeContext(context);
  }

  /**
   * Get attempt count for a task
   * @param taskId Task identifier
   * @returns Number of attempts
   */
  getAttemptCount(taskId: string): number {
    const context = this.readContext();

    if (!context.attempt_tracking || !context.attempt_tracking[taskId]) {
      return 0;
    }

    return context.attempt_tracking[taskId].attempts.length;
  }

  /**
   * Get latest gate check for a task
   * @param taskId Task identifier
   * @returns Latest gate check or undefined
   */
  getLatestGateCheck(taskId: string): any {
    const context = this.readContext();

    if (!context.quality_gates) {
      return undefined;
    }

    const gateChecks = context.quality_gates.filter(g => g.task_id === taskId);
    if (gateChecks.length === 0) {
      return undefined;
    }

    // Return most recent
    return gateChecks[gateChecks.length - 1];
  }

  /**
   * Set the current model for token limit calculations (v3.7.0)
   * @param model The model tier to use for token limits
   */
  setModel(model: 'opus' | 'sonnet' | 'haiku'): void {
    this.currentModel = model;
  }

  /**
   * Get current token limit based on selected model (v3.7.0)
   */
  private getTokenLimit(): number {
    return this.MODEL_TOKEN_LIMITS[this.currentModel];
  }

  /**
   * Count tokens in text (v3.7.0 - Improved accuracy)
   * Uses tiktoken-inspired algorithm for Claude models
   *
   * Claude tokenization characteristics:
   * - Average 4 characters per token for English text
   * - Common words are single tokens
   * - Code has higher token density (more tokens per character)
   * - JSON structure adds overhead
   * - Whitespace is generally preserved in tokens
   */
  private countTokens(text: string): number {
    if (!text || text.length === 0) {
      return 0;
    }

    // Base character count estimation
    // Claude uses ~4 chars per token for English, ~3 for code
    const charCount = text.length;
    const baseEstimate = Math.ceil(charCount / 4);

    // Detect content type for adjusted estimation
    const isJson = this.isJsonContent(text);
    const isCode = this.isCodeContent(text);

    // JSON overhead: structural characters ({}, [], :, ,) add tokens
    if (isJson) {
      const structuralChars = (text.match(/[{}\[\]:,]/g) || []).length;
      const jsonOverhead = Math.ceil(structuralChars * 0.3); // ~30% of structural chars become tokens
      return baseEstimate + jsonOverhead;
    }

    // Code has higher token density
    if (isCode) {
      // Code averages ~3 chars per token due to operators, brackets, etc.
      return Math.ceil(charCount / 3);
    }

    // Additional adjustments for accuracy
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const newlineCount = (text.match(/\n/g) || []).length;

    // Word-based estimate (more accurate for natural language)
    const wordEstimate = Math.ceil(wordCount * 1.3);

    // Newlines typically don't add tokens but indicate structure
    const structureBonus = Math.ceil(newlineCount * 0.1);

    // Use weighted average of estimates for better accuracy
    const combinedEstimate = Math.ceil(
      baseEstimate * 0.4 +     // Character-based
      wordEstimate * 0.5 +     // Word-based
      structureBonus * 0.1     // Structure adjustment
    );

    // Apply 10% safety margin for edge cases
    return Math.ceil(combinedEstimate * 1.1);
  }

  /**
   * Check if content appears to be JSON (v3.7.0)
   */
  private isJsonContent(text: string): boolean {
    const trimmed = text.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  }

  /**
   * Check if content appears to be code (v3.7.0)
   */
  private isCodeContent(text: string): boolean {
    // Look for common code patterns
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
   * Count total tokens in context (v3.7.0)
   * Estimates context size with content-aware counting
   */
  private countContextTokens(context: SharedContext): number {
    // JSON.stringify with formatting for accurate representation
    const jsonString = JSON.stringify(context, null, 2);
    return this.countTokens(jsonString);
  }

  /**
   * Get detailed token breakdown by section (v3.7.0)
   * Useful for identifying what's consuming context budget
   */
  getTokenBreakdown(): Map<string, number> {
    const context = this.readContext();
    const breakdown = new Map<string, number>();

    // Count tokens for each major section
    const sections: (keyof SharedContext)[] = [
      'agent_decisions',
      'api_design',
      'ui_components',
      'shared_types',
      'quality_evidence',
      'quality_gates',
      'attempt_tracking',
      'tasks_completed',
      'tasks_pending'
    ];

    for (const section of sections) {
      if (context[section]) {
        const sectionJson = JSON.stringify(context[section], null, 2);
        breakdown.set(section, this.countTokens(sectionJson));
      }
    }

    // Calculate overhead (metadata, structure)
    const totalCounted = Array.from(breakdown.values()).reduce((a, b) => a + b, 0);
    const actualTotal = this.countContextTokens(context);
    breakdown.set('_overhead', Math.max(0, actualTotal - totalCounted));

    return breakdown;
  }

  /**
   * Check token budget status (v3.7.0)
   * Implements 80% rule with model-aware limits
   */
  checkTokenBudget(context?: SharedContext): {
    status: 'ok' | 'warn' | 'compress' | 'block';
    usage: number;
    tokens: number;
    limit: number;
    model: string;
    message: string;
    breakdown?: Map<string, number>;
  } {
    const ctx = context || this.readContext();
    const tokens = this.countContextTokens(ctx);
    const limit = this.getTokenLimit();
    const percentage = tokens / limit;

    const baseResult = {
      tokens,
      limit,
      model: this.currentModel,
      usage: percentage
    };

    if (percentage >= this.BLOCK_THRESHOLD) {
      return {
        ...baseResult,
        status: 'block',
        message: `❌ Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${limit.toLocaleString()}). Context too large - operation blocked. Please run context rotation or cleanup.`,
        breakdown: this.getTokenBreakdown()
      };
    }

    if (percentage >= this.COMPRESS_THRESHOLD) {
      return {
        ...baseResult,
        status: 'compress',
        message: `⚠️  Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${limit.toLocaleString()}). Auto-compressing context...`,
        breakdown: this.getTokenBreakdown()
      };
    }

    if (percentage >= this.WARN_THRESHOLD) {
      return {
        ...baseResult,
        status: 'warn',
        message: `⚠️  Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${limit.toLocaleString()}). Approaching context limit.`
      };
    }

    return {
      ...baseResult,
      status: 'ok',
      message: `Token usage: ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${limit.toLocaleString()})`
    };
  }

  /**
   * Compress context by removing old data (v3.5.1)
   * Called automatically when token usage exceeds 80%
   */
  private compressContext(context: SharedContext): void {
    console.log('🗜️  Compressing context to reduce token usage...');

    // 1. Rotate old evidence (already handled by rotation)
    if (this.shouldRotateContext(context)) {
      this.rotateContext(context);
    }

    // 2. Trim quality gates (keep only recent 5)
    if (context.quality_gates && context.quality_gates.length > 5) {
      const removed = context.quality_gates.length - 5;
      context.quality_gates = context.quality_gates.slice(-5);
      console.log(`   Trimmed ${removed} old quality gate checks`);
    }

    // 3. Trim attempt tracking (keep only last 3 attempts per task)
    if (context.attempt_tracking) {
      let trimmed = 0;
      Object.keys(context.attempt_tracking).forEach(taskId => {
        const attempts = context.attempt_tracking![taskId].attempts;
        if (attempts.length > 3) {
          trimmed += attempts.length - 3;
          context.attempt_tracking![taskId].attempts = attempts.slice(-3);
        }
      });
      if (trimmed > 0) {
        console.log(`   Trimmed ${trimmed} old attempt records`);
      }
    }

    // 4. Trim agent decisions (keep only recent 10 per agent)
    if (context.agent_decisions) {
      let trimmed = 0;
      Object.keys(context.agent_decisions).forEach(agentName => {
        const decisions = context.agent_decisions[agentName].decisions;
        if (decisions.length > 10) {
          trimmed += decisions.length - 10;
          context.agent_decisions[agentName].decisions = decisions.slice(-10);
        }
      });
      if (trimmed > 0) {
        console.log(`   Trimmed ${trimmed} old agent decisions`);
      }
    }

    console.log('✅ Context compression complete');
  }

  /**
   * Check if context rotation is needed (v3.5.1)
   * Rotates every 3 hours to prevent unbounded evidence growth
   */
  private shouldRotateContext(context: SharedContext): boolean {
    if (!context.quality_evidence?.last_updated) {
      return false;
    }

    const lastUpdate = new Date(context.quality_evidence.last_updated).getTime();
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;

    return timeSinceLastUpdate >= this.ROTATION_INTERVAL_MS;
  }

  /**
   * Rotate context by archiving old evidence (v3.5.1)
   * Keeps active context lean while preserving history
   * Expected savings: ~2,000-3,000 tokens in long sessions
   */
  private rotateContext(context: SharedContext): void {
    if (!context.quality_evidence) {
      return;
    }

    // Archive current evidence
    this.archiveEvidence(context.quality_evidence);

    // Clear old evidence but preserve structure
    context.quality_evidence = {
      last_updated: new Date().toISOString()
    };

    // Note: Don't clear quality_gates or attempt_tracking
    // Those are used for decision making, not just evidence
  }

  /**
   * Archive evidence to timestamped file (v3.5.1)
   */
  private archiveEvidence(evidence: SharedContext['quality_evidence']): void {
    if (!evidence) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveFile = `evidence-${timestamp}.json`;
    const archivePath = join(this.archiveDir, archiveFile);

    const archiveData = {
      archived_at: new Date().toISOString(),
      evidence
    };

    try {
      writeFileSync(archivePath, JSON.stringify(archiveData, null, 2));
      console.log(`✅ Evidence archived: ${archiveFile}`);
    } catch (error) {
      console.error('⚠️ Failed to archive evidence:', error);
      // Don't throw - archival failure shouldn't block operations
    }
  }

  /**
   * Get archived evidence files (v3.5.1)
   * @returns Array of archive file paths, sorted by date (newest first)
   */
  getArchivedEvidence(): string[] {
    try {
      const files = readdirSync(this.archiveDir)
        .filter((f: string) => f.startsWith('evidence-') && f.endsWith('.json'))
        .sort()
        .reverse();

      return files.map((f: string) => join(this.archiveDir, f));
    } catch (error) {
      console.error('⚠️ Failed to list archived evidence:', error);
      return [];
    }
  }

  /**
   * Read specific archived evidence file (v3.5.1)
   */
  readArchivedEvidence(archivePath: string): any {
    try {
      const content = readFileSync(archivePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('⚠️ Failed to read archived evidence:', error);
      return null;
    }
  }

  /**
   * Non-blocking sleep using busy wait (v3.7.0)
   * For short durations only - use for lock retry intervals
   */
  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait - acceptable for short durations
    }
  }

  // Lock file metadata type is inlined in methods for simplicity

  /**
   * Acquire a file lock with timeout and stale lock detection (v3.7.0)
   * Returns true if lock acquired, false if timed out
   */
  private acquireLock(lockPath: string): boolean {
    const startTime = Date.now();

    while (Date.now() - startTime < this.LOCK_TIMEOUT_MS) {
      // Check if lock exists
      if (existsSync(lockPath)) {
        // Check if lock is stale
        if (this.isLockStale(lockPath)) {
          console.warn('⚠️ Removing stale lock file');
          this.forceReleaseLock(lockPath);
        } else {
          // Lock is held by another process, wait and retry
          this.sleep(this.LOCK_RETRY_INTERVAL_MS);
          continue;
        }
      }

      // Try to acquire lock atomically
      try {
        const lockData: { pid: number; timestamp: string; hostname?: string } = {
          pid: process.pid,
          timestamp: new Date().toISOString(),
          hostname: process.env.HOSTNAME || 'unknown'
        };

        // Use 'wx' flag for exclusive creation (atomic)
        writeFileSync(lockPath, JSON.stringify(lockData), { flag: 'wx' });
        return true;
      } catch (error: any) {
        if (error.code === 'EEXIST') {
          // Lock was created by another process between check and write
          this.sleep(this.LOCK_RETRY_INTERVAL_MS);
          continue;
        }
        throw error;
      }
    }

    // Timed out waiting for lock
    console.error(`❌ Lock acquisition timed out after ${this.LOCK_TIMEOUT_MS}ms`);
    return false;
  }

  /**
   * Release a file lock (v3.7.0)
   */
  private releaseLock(lockPath: string): void {
    try {
      if (existsSync(lockPath)) {
        // Verify we own the lock before releasing
        const lockData = this.readLockData(lockPath);
        if (lockData && lockData.pid === process.pid) {
          unlinkSync(lockPath);
        } else {
          console.warn('⚠️ Attempted to release lock owned by another process');
        }
      }
    } catch (error) {
      console.error('⚠️ Error releasing lock:', error);
      // Don't throw - lock release errors shouldn't crash the app
    }
  }

  /**
   * Force release a lock (for stale locks) (v3.7.0)
   */
  private forceReleaseLock(lockPath: string): void {
    try {
      if (existsSync(lockPath)) {
        unlinkSync(lockPath);
      }
    } catch (error) {
      console.error('⚠️ Error force releasing lock:', error);
    }
  }

  /**
   * Check if a lock is stale (v3.7.0)
   * A lock is stale if:
   * - It's older than STALE_LOCK_THRESHOLD_MS
   * - OR the owning process no longer exists
   */
  private isLockStale(lockPath: string): boolean {
    try {
      const lockData = this.readLockData(lockPath);
      if (!lockData) return true;

      // Check age
      const lockAge = Date.now() - new Date(lockData.timestamp).getTime();
      if (lockAge > this.STALE_LOCK_THRESHOLD_MS) {
        return true;
      }

      // Check if process exists (only works for same host)
      if (lockData.pid) {
        try {
          // process.kill with signal 0 checks if process exists
          process.kill(lockData.pid, 0);
          return false; // Process exists, lock is valid
        } catch {
          return true; // Process doesn't exist, lock is stale
        }
      }

      return false;
    } catch {
      return true; // Can't read lock, assume stale
    }
  }

  /**
   * Read lock file data (v3.7.0)
   */
  private readLockData(lockPath: string): { pid: number; timestamp: string; hostname?: string } | null {
    try {
      const content = readFileSync(lockPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Get lock status for debugging (v3.7.0)
   */
  getLockStatus(): {
    isLocked: boolean;
    lockData: { pid: number; timestamp: string; hostname?: string } | null;
    isStale: boolean;
  } {
    const lockPath = join(this.contextDir, this.lockFile);
    const isLocked = existsSync(lockPath);

    if (!isLocked) {
      return { isLocked: false, lockData: null, isStale: false };
    }

    const lockData = this.readLockData(lockPath);
    const isStale = this.isLockStale(lockPath);

    return { isLocked, lockData, isStale };
  }
}
/**
 * Context Manager for AI Agent Hub
 * Handles reading and writing structured context with simple file locking
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';
import { SharedContext } from './types.js';

export class ContextManager {
  private contextDir = '.claude/context';
  private contextFile = 'shared-context.json';
  private lockFile = '.lock';
  private archiveDir = '.claude/context/archive';

  // Rotation configuration (v3.5.1)
  private readonly ROTATION_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours
  private readonly MAX_EVIDENCE_AGE_MS = 3 * 60 * 60 * 1000; // 3 hours

  // Token budget configuration (v3.5.1)
  private readonly TOKEN_LIMIT = 200000; // Anthropic Sonnet 4.5 limit
  private readonly WARN_THRESHOLD = 0.75; // 75% - warn user
  private readonly COMPRESS_THRESHOLD = 0.80; // 80% - auto-compress
  private readonly BLOCK_THRESHOLD = 0.85; // 85% - block operations

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
      timestamp: new Date().toISOString(),
      session_id: this.generateSessionId(),
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
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading context:', error);
      this.initializeContext();
      return this.readContext();
    }
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
      // Simple file lock mechanism
      let attempts = 0;
      while (existsSync(lockPath) && attempts < 10) {
        // Wait for lock to be released
        this.sleep(100);
        attempts++;
      }

      // Acquire lock
      writeFileSync(lockPath, process.pid.toString());

      // Write context
      writeFileSync(path, JSON.stringify(context, null, 2));

      // Release lock
      if (existsSync(lockPath)) {
        unlinkSync(lockPath);
      }
    } catch (error) {
      console.error('Error writing context:', error);
      // Try to clean up lock file
      if (existsSync(lockPath)) {
        try {
          unlinkSync(lockPath);
        } catch {
          // Ignore cleanup errors
        }
      }
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
   * Update quality standard assessment based on collected evidence
   */
  private updateQualityStandard(context: SharedContext): void {
    if (!context.quality_evidence) return;

    const evidence = context.quality_evidence;

    // Check for Gold Standard
    const isGoldStandard =
      evidence.tests?.executed &&
      evidence.tests?.exit_code === 0 &&
      (evidence.tests?.coverage_percent ?? 0) >= 80 &&
      evidence.build?.executed &&
      evidence.build?.exit_code === 0 &&
      evidence.linter?.executed &&
      evidence.linter?.exit_code === 0 &&
      (evidence.linter?.warnings ?? 0) === 0 &&
      evidence.type_checker?.executed &&
      evidence.type_checker?.exit_code === 0;

    // Check for Production Grade
    const isProductionGrade =
      evidence.tests?.executed &&
      evidence.tests?.exit_code === 0 &&
      (evidence.tests?.coverage_percent ?? 0) >= 70 &&
      evidence.build?.executed &&
      evidence.build?.exit_code === 0 &&
      evidence.linter?.executed &&
      evidence.linter?.exit_code === 0 &&
      evidence.type_checker?.executed &&
      evidence.type_checker?.exit_code === 0;

    // Check for Minimum
    const isMinimum =
      (evidence.tests?.executed && evidence.tests?.exit_code === 0) ||
      (evidence.build?.executed && evidence.build?.exit_code === 0) ||
      (evidence.linter?.executed && evidence.linter?.exit_code === 0);

    if (isGoldStandard) {
      evidence.quality_standard_met = 'gold-standard';
      evidence.all_checks_passed = true;
    } else if (isProductionGrade) {
      evidence.quality_standard_met = 'production-grade';
      evidence.all_checks_passed = true;
    } else if (isMinimum) {
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
   * Count tokens in text (v3.5.1)
   * Uses conservative estimation: 4 tokens/line or 1.3 tokens/word
   */
  private countTokens(text: string): number {
    const lines = text.split('\n').length;
    const words = text.split(/\s+/).length;

    // Use whichever gives higher estimate (conservative approach)
    const byLines = lines * 4;
    const byWords = Math.ceil(words * 1.3);

    return Math.max(byLines, byWords);
  }

  /**
   * Count total tokens in context (v3.5.1)
   * Estimates context size for budget enforcement
   */
  private countContextTokens(context: SharedContext): number {
    return this.countTokens(JSON.stringify(context, null, 2));
  }

  /**
   * Check token budget status (v3.5.1)
   * Implements 80% rule (research-validated best practice)
   */
  checkTokenBudget(context?: SharedContext): {
    status: 'ok' | 'warn' | 'compress' | 'block';
    usage: number;
    tokens: number;
    limit: number;
    message: string;
  } {
    const ctx = context || this.readContext();
    const tokens = this.countContextTokens(ctx);
    const percentage = tokens / this.TOKEN_LIMIT;

    if (percentage >= this.BLOCK_THRESHOLD) {
      return {
        status: 'block',
        usage: percentage,
        tokens,
        limit: this.TOKEN_LIMIT,
        message: `❌ Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${this.TOKEN_LIMIT.toLocaleString()}). Context too large - operation blocked. Please run context rotation or cleanup.`
      };
    }

    if (percentage >= this.COMPRESS_THRESHOLD) {
      return {
        status: 'compress',
        usage: percentage,
        tokens,
        limit: this.TOKEN_LIMIT,
        message: `⚠️  Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${this.TOKEN_LIMIT.toLocaleString()}). Auto-compressing context...`
      };
    }

    if (percentage >= this.WARN_THRESHOLD) {
      return {
        status: 'warn',
        usage: percentage,
        tokens,
        limit: this.TOKEN_LIMIT,
        message: `⚠️  Token usage at ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${this.TOKEN_LIMIT.toLocaleString()}). Approaching context limit.`
      };
    }

    return {
      status: 'ok',
      usage: percentage,
      tokens,
      limit: this.TOKEN_LIMIT,
      message: `Token usage: ${(percentage * 100).toFixed(1)}% (${tokens.toLocaleString()}/${this.TOKEN_LIMIT.toLocaleString()})`
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

  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }
}
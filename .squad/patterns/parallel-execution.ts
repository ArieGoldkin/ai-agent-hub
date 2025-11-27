/**
 * Parallel Execution Patterns
 *
 * Reference implementation for quality gates and parallel agent coordination.
 * See parallel-execution-rules.md for rules.
 *
 * @version 3.7.0
 */

// =============================================================================
// TYPES
// =============================================================================

interface Task {
  id: string;
  agent: string;
  task: string;
  dependencies?: string[];
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked';
  blocker_reason?: string;
}

interface GateResult {
  taskId: string;
  status: 'pass' | 'warning' | 'blocked';
  blockingReasons?: string[];
}

interface TaskEvidence {
  tests?: { executed: boolean; exit_code: number };
  build?: { executed: boolean; exit_code: number };
  linter?: { executed: boolean; exit_code: number };
  quality_standard_met?: string;
}

// =============================================================================
// GATE CHECK FUNCTIONS
// =============================================================================

/**
 * Validate quality gates before parallel phase
 * MUST run before starting any parallel execution
 */
export function validateParallelPhase(tasks: Task[]): {
  canProceed: boolean;
  blockedTasks: GateResult[];
  warnings: GateResult[];
} {
  const gateResults = tasks.map(task => validateQualityGate(task));
  const blockedTasks = gateResults.filter(r => r.status === 'blocked');
  const warnings = gateResults.filter(r => r.status === 'warning');

  if (blockedTasks.length > 0) {
    console.log(`⛔ PARALLEL PHASE BLOCKED`);
    console.log(`Blocked: ${blockedTasks.map(t => t.taskId).join(', ')}`);
    return { canProceed: false, blockedTasks, warnings };
  }

  console.log(`✅ All quality gates passed - starting parallel phase`);
  return { canProceed: true, blockedTasks: [], warnings };
}

function validateQualityGate(task: Task): GateResult {
  // Implement gate validation logic
  return { taskId: task.id, status: 'pass' };
}

// =============================================================================
// STUCK DETECTION
// =============================================================================

/**
 * Check agent progress and detect stuck agents
 * Call after each agent reports progress
 */
export function checkAgentProgress(
  context: { trackAttempt: Function; getAttemptCount: Function },
  agentId: string,
  taskId: string,
  status: string,
  errorMessage?: string
): 'OK' | 'STUCK' | 'ESCALATED' {
  if (status !== 'failed' && status !== 'error') {
    return 'OK';
  }

  context.trackAttempt(taskId, {
    timestamp: new Date().toISOString(),
    outcome: 'failed',
    failure_reason: errorMessage
  });

  const attemptCount = context.getAttemptCount(taskId);

  if (attemptCount >= 3) {
    console.log(`🚨 Agent ${agentId} stuck on ${taskId} after ${attemptCount} attempts`);
    return 'ESCALATED';
  }

  return 'STUCK';
}

// =============================================================================
// CASCADE DETECTION
// =============================================================================

/**
 * Detect and block cascading failures
 * Prevents dependent agents from wasting cycles
 */
export function checkFailureCascade(
  allTasks: Task[],
  failedTaskId: string
): Task[] {
  const dependentTasks = allTasks.filter(t =>
    t.dependencies?.includes(failedTaskId)
  );

  if (dependentTasks.length === 0) return [];

  console.log(`⚠️ CASCADE: ${dependentTasks.length} tasks blocked by ${failedTaskId}`);

  dependentTasks.forEach(task => {
    task.status = 'blocked';
    task.blocker_reason = `Upstream dependency ${failedTaskId} failed`;
  });

  // Recursively check for further cascades
  let allBlocked = [...dependentTasks];
  for (const task of dependentTasks) {
    const cascaded = checkFailureCascade(allTasks, task.id);
    allBlocked = [...allBlocked, ...cascaded];
  }

  return allBlocked;
}

// =============================================================================
// SYNC POINT VALIDATION
// =============================================================================

/**
 * Check if evidence shows at least one passing check
 */
function hasPassingEvidence(evidence: TaskEvidence): boolean {
  const testsPass = evidence.tests?.executed && evidence.tests?.exit_code === 0;
  const buildPass = evidence.build?.executed && evidence.build?.exit_code === 0;
  const linterPass = evidence.linter?.executed && evidence.linter?.exit_code === 0;
  return Boolean(testsPass || buildPass || linterPass);
}

/**
 * Validate a single task's evidence
 */
function validateTaskEvidence(
  task: { id: string; evidence?: TaskEvidence }
): { task: string; reason: string } | null {
  if (!task.evidence) {
    return { task: task.id, reason: 'No evidence collected' };
  }
  if (!hasPassingEvidence(task.evidence)) {
    return { task: task.id, reason: 'Evidence shows failures' };
  }
  return null;
}

/**
 * Validate sync point before proceeding to next phase
 * Requires evidence for all completed tasks
 */
export function validateSyncPoint(
  completedTasks: { id: string; evidence?: TaskEvidence }[]
): { canProceed: boolean; failures: { task: string; reason: string }[] } {
  const failures = completedTasks
    .map(validateTaskEvidence)
    .filter((f): f is { task: string; reason: string } => f !== null);

  if (failures.length > 0) {
    console.log(`❌ SYNC POINT FAILED`);
    failures.forEach(f => console.log(`  ${f.task}: ${f.reason}`));
    return { canProceed: false, failures };
  }

  console.log(`✅ SYNC POINT PASSED - All evidence verified`);
  return { canProceed: true, failures: [] };
}

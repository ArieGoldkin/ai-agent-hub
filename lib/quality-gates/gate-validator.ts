/**
 * Quality Gate Validator
 * Validates tasks against quality gates to prevent wasted work
 */

import type { SharedContext } from '../context/types.js';
import type {
  GateCheck,
  GateValidationResult,
  GateStatus,
  ComplexityLevel,
  ComplexityAssessment
} from './types.js';

export class QualityGateValidator {

  /**
   * Validate a gate check against quality gate rules
   * @param gateCheck The gate check to validate
   * @returns Validation result with status and recommendations
   */
  validateGate(gateCheck: GateCheck): GateValidationResult {
    const blockingReasons: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let escalationRequired = false;
    let escalateTo: 'user' | 'studio-coach' | undefined;

    // Rule 1: Check for too many unanswered critical questions
    if (gateCheck.unansweredQuestionsCount > 3) {
      blockingReasons.push(
        `${gateCheck.unansweredQuestionsCount} critical questions unanswered (max 3)`
      );
      recommendations.push('Clarify requirements before proceeding');
      escalationRequired = true;
      escalateTo = 'user';
    } else if (gateCheck.unansweredQuestionsCount >= 1 && gateCheck.unansweredQuestionsCount <= 2) {
      warnings.push(`${gateCheck.unansweredQuestionsCount} critical questions unanswered - proceed with documented assumptions`);
      recommendations.push('Document assumptions for unknown requirements');
    }

    // Rule 2: Check for blocked dependencies
    if (gateCheck.blockedDependenciesCount > 0) {
      blockingReasons.push(
        `${gateCheck.blockedDependenciesCount} dependencies not ready`
      );
      const blockedDeps = gateCheck.dependencies
        .filter(d => d.isBlocker && d.status !== 'ready')
        .map(d => d.name);
      recommendations.push(`Wait for dependencies to be ready: ${blockedDeps.join(', ')}`);
      escalationRequired = true;
      escalateTo = 'studio-coach';
    }

    // Rule 3: Check for stuck (3+ failed attempts)
    if (gateCheck.attemptCount >= 3) {
      blockingReasons.push(
        `Task stuck after ${gateCheck.attemptCount} attempts`
      );
      recommendations.push('Different approach or human guidance needed');
      escalationRequired = true;
      escalateTo = 'user';
    } else if (gateCheck.attemptCount >= 1 && gateCheck.attemptCount <= 2) {
      warnings.push(`${gateCheck.attemptCount} failed attempts - try alternative approach`);
      recommendations.push('Document what did not work and try different strategy');
    }

    // Rule 4: Check for high complexity without breakdown
    if (gateCheck.complexity.needsBreakdown) {
      blockingReasons.push(
        `Complexity Level ${gateCheck.complexity.level} requires breakdown into subtasks`
      );
      recommendations.push('Break down into Level 1-3 subtasks before proceeding');
    }

    // Rule 5: Check for moderate complexity (warning)
    if (gateCheck.complexity.level === 3 && blockingReasons.length === 0) {
      warnings.push('Moderate complexity (Level 3) - verify approach and plan checkpoints');
      recommendations.push('Create checkpoint plan to verify progress incrementally');
    }

    // Rule 6: Check for evidence failure
    // This is checked separately via context.quality_evidence, but note it here
    recommendations.push('Collect evidence (tests, build, linter) before marking complete');

    // Determine final status
    let status: GateStatus;
    if (blockingReasons.length > 0) {
      status = 'blocked';
    } else if (warnings.length > 0) {
      status = 'warning';
    } else {
      status = 'pass';
    }

    return {
      status,
      canProceed: status !== 'blocked',
      blockingReasons,
      warnings,
      recommendations,
      escalationRequired,
      escalateTo
    };
  }

  /**
   * Assess task complexity on a 1-5 scale
   * @param metrics Task metrics for complexity calculation
   * @returns Complexity assessment
   */
  assessComplexity(metrics: {
    linesOfCode?: number;
    estimatedHours?: number;
    fileCount?: number;
    dependencyCount?: number;
    unknownCount?: number;
  }): ComplexityAssessment {
    const {
      linesOfCode = 0,
      estimatedHours = 0,
      fileCount = 1,
      dependencyCount = 0,
      unknownCount = 0
    } = metrics;

    // Score each dimension (1-5)
    const locScore = this.scoreByLOC(linesOfCode);
    const timeScore = this.scoreByTime(estimatedHours);
    const fileScore = this.scoreByFiles(fileCount);
    const depScore = this.scoreByDependencies(dependencyCount);
    const unknownScore = this.scoreByUnknowns(unknownCount);

    // Calculate average
    const totalScore = locScore + timeScore + fileScore + depScore + unknownScore;
    const avgScore = totalScore / 5;

    // Map average to complexity level
    let level: ComplexityLevel;
    if (avgScore <= 1.4) level = 1;
    else if (avgScore <= 2.4) level = 2;
    else if (avgScore <= 3.4) level = 3;
    else if (avgScore <= 4.4) level = 4;
    else level = 5;

    const needsBreakdown = level >= 4;

    // Generate rationale
    const rationale = this.generateComplexityRationale(level, metrics);

    return {
      level,
      linesOfCode,
      estimatedHours,
      fileCount,
      dependencyCount,
      unknownCount,
      crossCuttingScore: fileScore, // Simplification
      riskScore: unknownScore, // Simplification
      needsBreakdown,
      rationale
    };
  }

  /**
   * Check if a specific evidence check passed
   */
  private checkPassed(check?: { executed?: boolean; exit_code?: number }): boolean {
    return Boolean(check?.executed && check?.exit_code === 0);
  }

  /**
   * Check if evidence exists and passes for task completion
   * @param context Shared context with evidence
   * @returns True if evidence shows passing checks
   */
  checkEvidence(context: SharedContext): boolean {
    const evidence = context.quality_evidence;
    if (!evidence) return false;

    // At least one check must have been executed and passed
    return (
      this.checkPassed(evidence.tests) ||
      this.checkPassed(evidence.build) ||
      this.checkPassed(evidence.linter) ||
      this.checkPassed(evidence.type_checker)
    );
  }

  /**
   * Determine if task should be escalated based on gate check
   * @param gateCheck The gate check to evaluate
   * @returns True if escalation needed
   */
  shouldEscalate(gateCheck: GateCheck): boolean {
    // Escalate if stuck (3+ attempts)
    if (gateCheck.attemptCount >= 3) {
      return true;
    }

    // Escalate if too many unanswered questions
    if (gateCheck.unansweredQuestionsCount > 3) {
      return true;
    }

    // Escalate if blocked by dependencies
    if (gateCheck.blockedDependenciesCount > 0) {
      return true;
    }

    return false;
  }

  // Private helper methods for complexity scoring

  private scoreByLOC(loc: number): number {
    if (loc < 50) return 1;
    if (loc < 200) return 2;
    if (loc < 500) return 3;
    if (loc < 1500) return 4;
    return 5;
  }

  private scoreByTime(hours: number): number {
    if (hours < 0.5) return 1;
    if (hours < 2) return 2;
    if (hours < 8) return 3;
    if (hours < 24) return 4;
    return 5;
  }

  private scoreByFiles(files: number): number {
    if (files <= 1) return 1;
    if (files <= 3) return 2;
    if (files <= 10) return 3;
    if (files <= 25) return 4;
    return 5;
  }

  private scoreByDependencies(deps: number): number {
    if (deps === 0) return 1;
    if (deps === 1) return 2;
    if (deps <= 3) return 3;
    if (deps <= 6) return 4;
    return 5;
  }

  private scoreByUnknowns(unknowns: number): number {
    if (unknowns === 0) return 1;
    if (unknowns <= 2) return 2;
    if (unknowns <= 5) return 3;
    if (unknowns <= 10) return 4;
    return 5;
  }

  private generateComplexityRationale(level: ComplexityLevel, metrics: {
    linesOfCode?: number;
    estimatedHours?: number;
    fileCount?: number;
    dependencyCount?: number;
    unknownCount?: number;
  }): string {
    const parts: string[] = [];

    if (metrics.linesOfCode) {
      parts.push(`${metrics.linesOfCode} lines`);
    }

    if (metrics.estimatedHours) {
      parts.push(`~${metrics.estimatedHours}h estimated`);
    }

    if (metrics.fileCount) {
      parts.push(`${metrics.fileCount} files`);
    }

    if (metrics.dependencyCount) {
      parts.push(`${metrics.dependencyCount} dependencies`);
    }

    if (metrics.unknownCount) {
      parts.push(`${metrics.unknownCount} unknowns`);
    }

    const description = parts.join(', ');

    const levelDescriptions = {
      1: 'Trivial',
      2: 'Simple',
      3: 'Moderate',
      4: 'Complex',
      5: 'Very Complex'
    };

    return `Level ${level} (${levelDescriptions[level]}): ${description}`;
  }
}

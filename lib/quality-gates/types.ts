/**
 * Quality Gates types for production-grade task validation
 */

export type ComplexityLevel = 1 | 2 | 3 | 4 | 5;

export type GateStatus = 'pass' | 'warning' | 'blocked';

export interface ComplexityAssessment {
  level: ComplexityLevel;
  linesOfCode: number;
  estimatedHours: number;
  fileCount: number;
  dependencyCount: number;
  unknownCount: number;
  crossCuttingScore: number;
  riskScore: number;
  needsBreakdown: boolean;
  rationale: string;
}

export interface CriticalQuestion {
  question: string;
  answered: boolean;
  answer?: string;
  category: 'functional' | 'technical' | 'other';
}

export interface TaskDependency {
  name: string;
  type: 'task' | 'api' | 'database' | 'service' | 'config';
  status: 'ready' | 'in_progress' | 'not_started';
  isBlocker: boolean;
}

export interface AttemptHistory {
  timestamp: string;
  approach: string;
  outcome: 'success' | 'failed';
  failureReason?: string;
  learnings?: string;
}

export interface GateCheck {
  taskId: string;
  taskDescription: string;
  timestamp: string;
  complexity: ComplexityAssessment;
  criticalQuestions: CriticalQuestion[];
  unansweredQuestionsCount: number;
  dependencies: TaskDependency[];
  blockedDependenciesCount: number;
  attemptHistory: AttemptHistory[];
  attemptCount: number;
  gateStatus: GateStatus;
  canProceed: boolean;
  blockingReasons: string[];
  warnings: string[];
  assumptions: Array<{
    assumption: string;
    risk: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
}

export interface GateValidationResult {
  status: GateStatus;
  canProceed: boolean;
  blockingReasons: string[];
  warnings: string[];
  recommendations: string[];
  escalationRequired: boolean;
  escalateTo?: 'user' | 'studio-coach' | string;
}

export interface RequirementsCheck {
  taskId: string;
  timestamp: string;
  criticalRequirementsComplete: number;
  importantRequirementsComplete: number;
  optionalRequirementsComplete: number;
  unansweredCriticalQuestions: number;
  completenessStatus: 'complete' | 'mostly_complete' | 'incomplete';
  canProceed: boolean;
  assumptions: string[];
}

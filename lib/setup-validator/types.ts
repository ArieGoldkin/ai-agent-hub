/**
 * Setup Validation Types
 *
 * Shared interfaces and types for setup validation system
 */

export interface ValidationResult {
  component: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string[];
}

export interface SetupValidation {
  isHealthy: boolean;
  score: number; // 0-100
  results: ValidationResult[];
  recommendations: string[];
}


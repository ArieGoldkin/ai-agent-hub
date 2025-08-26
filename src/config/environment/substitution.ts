/**
 * Environment variable substitution service
 * Handles substitution of environment variables in configuration templates
 */

import type { 
  EnvironmentSubstitution,
  ValidationResult,
} from '../../types/config.js';

/**
 * Environment variable substitution implementation
 */
export class EnvironmentSubstitutionService implements EnvironmentSubstitution {
  private readonly variablePattern = /\$\{([A-Z_][A-Z0-9_]*)\}/g;

  substitute(template: string, env: Record<string, string> = process.env as Record<string, string>): string {
    return template.replace(this.variablePattern, (_match, varName: string) => {
      const value = env[varName];
      if (value === undefined) {
        throw new Error(`Environment variable ${varName} is not defined`);
      }
      return value;
    });
  }

  extractVariables(template: string): string[] {
    const variables: string[] = [];
    let match;
    
    // Reset regex state
    this.variablePattern.lastIndex = 0;
    
    while ((match = this.variablePattern.exec(template)) !== null) {
      if (match[1] && !variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  }

  validate(template: string, env: Record<string, string> = process.env as Record<string, string>): ValidationResult<string> {
    try {
      const result = this.substitute(template, env);
      return {
        valid: true,
        data: result,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{
          path: 'template',
          message: error instanceof Error ? error.message : 'Environment substitution failed',
          value: template,
        }],
      };
    }
  }

  /**
   * Recursively substitute environment variables in an object
   */
  substituteInObject(obj: Record<string, unknown>, env: Record<string, string>): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        try {
          obj[key] = this.substitute(obj[key], env);
        } catch {
          // Leave original value if substitution fails - this is expected for some values
          // In production, this would use a proper logger
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.substituteInObject(obj[key] as Record<string, unknown>, env);
      }
    }
  }
}

// Export singleton instance
export const envSubstitution = new EnvironmentSubstitutionService();
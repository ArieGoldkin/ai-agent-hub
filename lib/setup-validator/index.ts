/**
 * Setup Validation System
 * 
 * Comprehensive validation orchestrator for AI Agent Hub installation
 */

import { validateAgentInstallation } from "./agent-validation.js";
import { validateSessionInfrastructure } from "./session-validation.js";
import { validateMCPConfiguration } from "./mcp-validation.js";
import { validateEnvironmentConfiguration } from "./env-validation.js";
import { validateClaudeCodeIntegration } from "./claude-validation.js";
import { SetupValidation, ValidationResult } from "./types.js";

/**
 * Comprehensive setup validation
 */
export async function validateCompleteSetup(): Promise<SetupValidation> {
  const results: ValidationResult[] = [];
  const recommendations: string[] = [];
  
  // Check agent installation
  const agentValidation = await validateAgentInstallation();
  results.push(agentValidation);
  
  // Check session infrastructure
  const sessionValidation = await validateSessionInfrastructure();
  results.push(sessionValidation);
  
  // Check MCP server configuration
  const mcpValidation = await validateMCPConfiguration();
  results.push(mcpValidation);
  
  // Check environment configuration
  const envValidation = await validateEnvironmentConfiguration();
  results.push(envValidation);
  
  // Check Claude Code integration
  const claudeValidation = await validateClaudeCodeIntegration();
  results.push(claudeValidation);
  
  // Calculate overall score
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  const score = Math.round(
    (successCount * 100 + warningCount * 60 + errorCount * 0) / results.length
  );
  
  const isHealthy = errorCount === 0 && successCount >= results.length * 0.8;
  
  // Generate recommendations
  if (errorCount > 0) {
    recommendations.push("Fix critical errors before using the system");
  }
  
  if (warningCount > 0) {
    recommendations.push("Address warnings for optimal functionality");
  }
  
  if (score < 100) {
    recommendations.push("Run 'ai-agent-hub --both' to ensure complete setup");
  }
  
  return {
    isHealthy,
    score,
    results,
    recommendations
  };
}

// Re-export types and display functionality for backward compatibility
export { ValidationResult, SetupValidation } from "./types.js";
export { displayValidationResults } from "./display.js";

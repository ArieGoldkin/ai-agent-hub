/**
 * Validation Results Display
 *
 * Formatting and display utilities for validation results
 */

import { SetupValidation } from "./types.js";

/**
 * Display validation results in a user-friendly format
 */
export function displayValidationResults(validation: SetupValidation): void {
  console.log("🏥 AI Agent Hub Health Check");
  console.log("=============================");
  console.log(
    `Overall Score: ${validation.score}/100 ${getScoreEmoji(validation.score)}`
  );
  console.log(
    `Status: ${validation.isHealthy ? "✅ Healthy" : "⚠️  Needs Attention"}\n`
  );

  // Group results by status
  const errors = validation.results.filter(r => r.status === "error");
  const warnings = validation.results.filter(r => r.status === "warning");
  const successes = validation.results.filter(r => r.status === "success");

  if (errors.length > 0) {
    console.log("🚨 Critical Issues:");
    errors.forEach(result => {
      console.log(`   ❌ ${result.component}: ${result.message}`);
      if (result.details) {
        result.details.forEach(detail => console.log(`      → ${detail}`));
      }
    });
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  Warnings:");
    warnings.forEach(result => {
      console.log(`   ⚠️  ${result.component}: ${result.message}`);
      if (result.details) {
        result.details.forEach(detail => console.log(`      → ${detail}`));
      }
    });
    console.log("");
  }

  if (successes.length > 0) {
    console.log("✅ Working Correctly:");
    successes.forEach(result => {
      console.log(`   ✅ ${result.component}: ${result.message}`);
    });
    console.log("");
  }

  if (validation.recommendations.length > 0) {
    console.log("💡 Recommendations:");
    validation.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
  }
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "🎉";
  if (score >= 70) return "👍";
  if (score >= 50) return "⚠️";
  return "🚨";
}


/**
 * Environment Configuration Validation
 *
 * Validates environment variables and configuration
 */

import { validateEnvironmentSetup } from "../env-handler.js";
import { ValidationResult } from "./types.js";

/**
 * Validate environment configuration
 */
export async function validateEnvironmentConfiguration(): Promise<ValidationResult> {
  const envValidation = await validateEnvironmentSetup();

  if (envValidation.isValid) {
    return {
      component: "Environment Configuration",
      status: "success",
      message: "Environment fully configured"
    };
  } else if (envValidation.required.length > 0) {
    return {
      component: "Environment Configuration",
      status: "warning",
      message: `${envValidation.required.length} critical variables need setup`,
      details: envValidation.required
    };
  } else {
    return {
      component: "Environment Configuration",
      status: "warning",
      message: "Optional environment variables available",
      details: envValidation.optional
    };
  }
}


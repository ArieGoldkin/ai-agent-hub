/**
 * CLI Validation - Configuration and environment validation helpers
 */

import { access, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { constants } from "node:fs";
// Removed dependency on config system to avoid schema loading issues during setup

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface EnvironmentCheck {
  name: string;
  required: boolean;
  check: () => Promise<boolean>;
  errorMessage: string;
  warningMessage?: string;
}

/**
 * Validate the environment prerequisites
 */
export async function validateEnvironment(): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const checks: EnvironmentCheck[] = [
    {
      name: "Node.js Version",
      required: true,
      check: async () => {
        const version = process.version;
        const majorVersion = version.slice(1).split(".")[0];
        const major = parseInt(majorVersion ?? "0");
        return major >= 20;
      },
      errorMessage: `Node.js version ${process.version} is not supported. Requires >= 20.0.0`
    },
    {
      name: "Working Directory Access",
      required: true,
      check: async () => {
        try {
          const cwd = process.cwd();
          if (!cwd) return false;
          await access(cwd, constants.R_OK | constants.W_OK);
          return true;
        } catch {
          return false;
        }
      },
      errorMessage: "Cannot read/write in current working directory"
    },
    {
      name: "Project Root Detection",
      required: false,
      check: async () => {
        try {
          // Look for package.json to confirm we're in a valid project
          await access(
            resolve(process.cwd() ?? ".", "package.json"),
            constants.R_OK
          );
          return true;
        } catch {
          return false;
        }
      },
      errorMessage: "Not in a valid AI Agent Hub project directory",
      warningMessage:
        "Not in a project directory. Some features may not work correctly."
    },
    {
      name: "Configuration Directory",
      required: false,
      check: async () => {
        try {
          const configDir = resolve(process.cwd() ?? ".", "src", "config");
          const stats = await stat(configDir);
          return stats.isDirectory();
        } catch {
          return false;
        }
      },
      errorMessage: "Configuration directory not found",
      warningMessage:
        "Configuration directory not found. Run setup to initialize."
    }
  ];

  for (const check of checks) {
    try {
      const passed = await check.check();
      if (!passed) {
        if (check.required) {
          errors.push(check.errorMessage);
        } else if (check.warningMessage) {
          warnings.push(check.warningMessage);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${check.name} check failed: ${message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a basic configuration object structure
 */
export async function validateConfiguration(
  config: Record<string, unknown>
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Basic structure validation
    if (!config || typeof config !== "object") {
      errors.push("Configuration must be an object");
      return { valid: false, errors, warnings };
    }

    // Additional CLI-specific validations
    const serverCount = Object.keys(config).length;
    if (serverCount === 0) {
      warnings.push(
        "No servers configured. Gateway will start but no tools will be available."
      );
    }

    // Basic validation for each server configuration
    for (const [serverId, serverConfig] of Object.entries(config)) {
      if (!serverConfig) {
        errors.push(`Server ${serverId} has no configuration`);
        continue;
      }

      // Validate server ID format
      if (!/^[a-z][a-z0-9-]*$/.test(serverId)) {
        errors.push(`Invalid server ID format: ${serverId}`);
      }

      // Check basic structure
      if (typeof serverConfig !== "object") {
        errors.push(`Server ${serverId} configuration must be an object`);
      }
    }
  } catch (error) {
    errors.push(
      `Configuration validation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate file access and permissions
 */
export async function validateFileAccess(
  filePath: string
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const resolvedPath = resolve(filePath);

    // Check if file exists and is readable
    await access(resolvedPath, constants.R_OK);

    // Check if it's actually a file (not a directory)
    const stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      errors.push(`Path ${filePath} is not a file`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      errors.push(`File ${filePath} does not exist`);
    } else if ((error as NodeJS.ErrnoException).code === "EACCES") {
      errors.push(`Permission denied accessing ${filePath}`);
    } else {
      errors.push(
        `Cannot access ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate directory access and permissions
 */
export async function validateDirectoryAccess(
  dirPath: string
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const resolvedPath = resolve(dirPath);

    // Check if directory exists and is accessible
    await access(resolvedPath, constants.R_OK | constants.W_OK);

    // Check if it's actually a directory
    const stats = await stat(resolvedPath);
    if (!stats.isDirectory()) {
      errors.push(`Path ${dirPath} is not a directory`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      errors.push(`Directory ${dirPath} does not exist`);
    } else if ((error as NodeJS.ErrnoException).code === "EACCES") {
      errors.push(`Permission denied accessing ${dirPath}`);
    } else {
      errors.push(
        `Cannot access ${dirPath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

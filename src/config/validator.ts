/**
 * Configuration validation module using Ajv JSON Schema validator
 */

import Ajv, { type JSONSchemaType, type ErrorObject } from 'ajv';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { 
  ProfileConfig, 
  ServerRegistry, 
  ValidationResult, 
  ValidationError 
} from '../types/config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Ajv with strict mode and all errors
const ajv = new Ajv({
  strict: false, // Set to false to avoid unknown format errors
  allErrors: true,
  verbose: true,
  discriminator: true,
});

// Load JSON schemas
const PROFILE_SCHEMA_PATH = join(__dirname, 'schemas', 'default-profile.schema.json');
const REGISTRY_SCHEMA_PATH = join(__dirname, 'schemas', 'server-registry.schema.json');

let profileSchema: object;
let registrySchema: object;

try {
  profileSchema = JSON.parse(readFileSync(PROFILE_SCHEMA_PATH, 'utf-8'));
  registrySchema = JSON.parse(readFileSync(REGISTRY_SCHEMA_PATH, 'utf-8'));
} catch (error) {
  throw new Error(`Failed to load JSON schemas: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Compile validators
const validateProfile = ajv.compile(profileSchema as JSONSchemaType<ProfileConfig>);
const validateRegistry = ajv.compile(registrySchema as JSONSchemaType<ServerRegistry>);

/**
 * Convert Ajv errors to our ValidationError format
 */
function convertAjvErrors(errors: ErrorObject[]): ValidationError[] {
  return errors.map((error) => ({
    path: error.instancePath || error.schemaPath,
    message: error.message || 'Validation failed',
    value: error.data,
  }));
}

/**
 * Validate a profile configuration against the JSON schema
 */
export function validateProfileConfig(config: unknown): ValidationResult<ProfileConfig> {
  const valid = validateProfile(config);
  
  if (valid) {
    return {
      valid: true,
      data: config as ProfileConfig,
    };
  }

  return {
    valid: false,
    errors: validateProfile.errors ? convertAjvErrors(validateProfile.errors) : [],
  };
}

/**
 * Validate a server registry against the JSON schema
 */
export function validateServerRegistry(config: unknown): ValidationResult<ServerRegistry> {
  const valid = validateRegistry(config);
  
  if (valid) {
    return {
      valid: true,
      data: config as ServerRegistry,
    };
  }

  return {
    valid: false,
    errors: validateRegistry.errors ? convertAjvErrors(validateRegistry.errors) : [],
  };
}

/**
 * Type guard for ProfileConfig with validation
 */
export function isValidProfileConfig(obj: unknown): obj is ProfileConfig {
  const result = validateProfileConfig(obj);
  return result.valid && result.data !== undefined;
}

/**
 * Type guard for ServerRegistry with validation
 */
export function isValidServerRegistry(obj: unknown): obj is ServerRegistry {
  const result = validateServerRegistry(obj);
  return result.valid && result.data !== undefined;
}

/**
 * Validate and assert ProfileConfig type
 * @throws {Error} If validation fails
 */
export function assertValidProfileConfig(obj: unknown): asserts obj is ProfileConfig {
  const result = validateProfileConfig(obj);
  if (!result.valid) {
    const errorMessages = result.errors?.map(e => `${e.path}: ${e.message}`).join(', ') || 'Unknown validation error';
    throw new Error(`Invalid profile configuration: ${errorMessages}`);
  }
}

/**
 * Validate and assert ServerRegistry type
 * @throws {Error} If validation fails
 */
export function assertValidServerRegistry(obj: unknown): asserts obj is ServerRegistry {
  const result = validateServerRegistry(obj);
  if (!result.valid) {
    const errorMessages = result.errors?.map(e => `${e.path}: ${e.message}`).join(', ') || 'Unknown validation error';
    throw new Error(`Invalid server registry: ${errorMessages}`);
  }
}

/**
 * Validate server ID format
 */
export function validateServerId(serverId: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(serverId);
}

/**
 * Validate tool name format
 */
export function validateToolName(toolName: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(toolName);
}

/**
 * Validate environment variable name format
 */
export function validateEnvironmentVariableName(varName: string): boolean {
  return /^[A-Z][A-Z0-9_]*$/.test(varName);
}

/**
 * Validate npm package name format
 */
export function validateNpmPackageName(packageName: string): boolean {
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(packageName);
}

/**
 * Validate semver version format
 */
export function validateVersion(version: string): boolean {
  return /^(\^|~|>=|>|<|<=|=)?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$|^latest$|^beta$|^alpha$/.test(version);
}

/**
 * Format validation errors for user display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'No validation errors';
  }

  if (errors.length === 1) {
    const error = errors[0];
    return `Validation error at ${error?.path || 'root'}: ${error?.message || 'Unknown error'}`;
  }

  const formatted = errors
    .map((error, index) => `  ${index + 1}. ${error?.path || 'root'}: ${error?.message || 'Unknown error'}`)
    .join('\n');

  return `Validation errors:\n${formatted}`;
}

/**
 * Create a detailed validation report
 */
export function createValidationReport<T>(
  result: ValidationResult<T>,
  configType: 'profile' | 'registry'
): string {
  if (result.valid) {
    return `✓ ${configType} configuration is valid`;
  }

  const errorCount = result.errors?.length || 0;
  const header = `✗ ${configType} configuration has ${errorCount} error${errorCount === 1 ? '' : 's'}:`;
  const errors = result.errors ? formatValidationErrors(result.errors) : 'Unknown validation errors';
  
  return `${header}\n${errors}`;
}

/**
 * Batch validate multiple configurations
 */
export function validateConfigurations(configs: {
  profile?: unknown;
  registry?: unknown;
}): {
  profile?: ValidationResult<ProfileConfig>;
  registry?: ValidationResult<ServerRegistry>;
  allValid: boolean;
} {
  const results: {
    profile?: ValidationResult<ProfileConfig>;
    registry?: ValidationResult<ServerRegistry>;
    allValid: boolean;
  } = { allValid: true };

  if (configs.profile !== undefined) {
    results.profile = validateProfileConfig(configs.profile);
    if (!results.profile.valid) {
      results.allValid = false;
    }
  }

  if (configs.registry !== undefined) {
    results.registry = validateServerRegistry(configs.registry);
    if (!results.registry.valid) {
      results.allValid = false;
    }
  }

  return results;
}
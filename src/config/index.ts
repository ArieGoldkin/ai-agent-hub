/**
 * Configuration system exports
 */

// Core configuration types
export type * from '../types/config.js';

// Configuration loading and building
export {
  ConfigurationLoader,
  ConfigurationBuilder,
  EnvironmentSubstitutionService,
  loadDefaultConfiguration,
  loadConfiguration,
  validateEnvironmentVariables,
  configLoader,
  envSubstitution,
} from './loader.js';

// Validation utilities
export {
  validateProfileConfig,
  validateServerRegistry,
  isValidProfileConfig,
  isValidServerRegistry,
  assertValidProfileConfig,
  assertValidServerRegistry,
  validateServerId,
  validateToolName,
  validateEnvironmentVariableName,
  validateNpmPackageName,
  validateVersion,
  formatValidationErrors,
  createValidationReport,
  validateConfigurations,
} from './validator.js';

// Bundled server definitions
export {
  BUNDLED_SERVERS,
  SERVER_CATEGORIES,
  BUNDLED_REGISTRY,
  getCoreServers,
  getOptionalServers,
  getServerById,
  getServersByCapability,
  getServersByTransport,
  getServersByCategory,
  getAllServerIds,
  getAllCapabilities,
  isValidServerId,
  validateServerConfiguration,
  getRequiredEnvironmentVariables,
  getAllRequiredEnvironmentVariables,
} from './servers/index.js';
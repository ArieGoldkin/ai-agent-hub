/**
 * Configuration loader with JSON parsing, schema validation, and environment variable substitution
 * Main orchestrator that delegates to specialized services
 */

import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { 
  ProfileConfig, 
  ServerRegistry, 
  ConfigLoader,
  RuntimeConfig,
  ConfigOverride
} from '../types/config.js';

import { 
  validateProfileConfig, 
  validateServerRegistry,
  assertValidProfileConfig,
  assertValidServerRegistry 
} from './validator.js';

// Re-export services for backwards compatibility
export { EnvironmentSubstitutionService, envSubstitution } from './environment/substitution.js';
export { ConfigurationBuilder } from './builder/configuration-builder.js';

import { ConfigurationBuilder } from './builder/configuration-builder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Default paths
const DEFAULT_PROFILE_PATH = join(__dirname, 'default-profile.json');
const DEFAULT_REGISTRY_PATH = join(__dirname, 'server-registry.json');

/**
 * Configuration loader implementation
 */
export class ConfigurationLoader implements ConfigLoader {
  async loadProfile(path?: string): Promise<ProfileConfig> {
    const profilePath = path ? resolve(path) : DEFAULT_PROFILE_PATH;
    
    try {
      const content = readFileSync(profilePath, 'utf-8');
      const rawConfig = JSON.parse(content);
      
      // Validate before returning
      assertValidProfileConfig(rawConfig);
      
      return rawConfig;
    } catch (error) {
      throw new Error(`Failed to load profile from ${profilePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async loadRegistry(path?: string): Promise<ServerRegistry> {
    const registryPath = path ? resolve(path) : DEFAULT_REGISTRY_PATH;
    
    try {
      const content = readFileSync(registryPath, 'utf-8');
      const rawConfig = JSON.parse(content);
      
      // Validate before returning
      assertValidServerRegistry(rawConfig);
      
      return rawConfig;
    } catch (error) {
      throw new Error(`Failed to load registry from ${registryPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateProfile(config: unknown): ProfileConfig {
    const result = validateProfileConfig(config);
    if (!result.valid || !result.data) {
      const errorMessages = result.errors?.map(e => `${e.path}: ${e.message}`).join(', ') || 'Unknown validation error';
      throw new Error(`Invalid profile configuration: ${errorMessages}`);
    }
    return result.data;
  }

  validateRegistry(config: unknown): ServerRegistry {
    const result = validateServerRegistry(config);
    if (!result.valid || !result.data) {
      const errorMessages = result.errors?.map(e => `${e.path}: ${e.message}`).join(', ') || 'Unknown validation error';
      throw new Error(`Invalid server registry: ${errorMessages}`);
    }
    return result.data;
  }
}

/**
 * Load configuration with default paths and validation
 */
export async function loadDefaultConfiguration(): Promise<RuntimeConfig> {
  const builder = new ConfigurationBuilder();
  return await builder.build();
}

/**
 * Load configuration with custom paths
 */
export async function loadConfiguration(options: {
  profilePath?: string;
  registryPath?: string;
  overrides?: ConfigOverride;
  environment?: Record<string, string>;
}): Promise<RuntimeConfig> {
  const builder = new ConfigurationBuilder();

  if (options.profilePath) {
    builder.fromProfile(options.profilePath);
  }

  if (options.registryPath) {
    builder.fromRegistry(options.registryPath);
  }

  if (options.overrides) {
    builder.withOverrides(options.overrides);
  }

  if (options.environment) {
    builder.withEnvironment(options.environment);
  }

  return await builder.build();
}

/**
 * Validate environment variables for given configuration
 */
export function validateEnvironmentVariables(config: RuntimeConfig): {
  valid: boolean;
  missing: string[];
  invalid: string[];
} {
  const missing: string[] = [];
  const invalid: string[] = [];

  // Check all active servers
  for (const [serverId, serverConfig] of Object.entries(config.activeServers)) {
    if (serverConfig.security?.environmentVariables) {
      for (const varName of serverConfig.security.environmentVariables) {
        const value = serverConfig.resolvedEnvironmentVariables[varName] || process.env[varName];
        
        if (!value) {
          missing.push(`${serverId}.${varName}`);
        } else if (typeof value !== 'string' || value.trim() === '') {
          invalid.push(`${serverId}.${varName}`);
        }
      }
    }
  }

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

// Export singleton instances
export const configLoader = new ConfigurationLoader();
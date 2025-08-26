/**
 * Configuration builder for creating runtime configurations
 */

import type { 
  ProfileConfig, 
  ServerRegistry, 
  ConfigLoader,
  RuntimeConfig,
  ResolvedServerConfig,
  EnvironmentSubstitution,
  DeepPartial,
  ConfigOverride
} from '../../types/config.js';

import { ConfigurationLoader } from '../loader.js';
import { EnvironmentSubstitutionService } from '../environment/substitution.js';
import { getServerById } from '../servers/index.js';

/**
 * Configuration builder for creating runtime configurations
 */
export class ConfigurationBuilder {
  private profilePath?: string;
  private registryPath?: string;
  private overrides: ConfigOverride = {};
  private environment: Record<string, string> = process.env as Record<string, string>;
  private readonly loader: ConfigLoader;
  private readonly envSubstitution: EnvironmentSubstitution;

  constructor() {
    this.loader = new ConfigurationLoader();
    this.envSubstitution = new EnvironmentSubstitutionService();
  }

  fromProfile(path: string): ConfigurationBuilder {
    this.profilePath = path;
    return this;
  }

  fromRegistry(path: string): ConfigurationBuilder {
    this.registryPath = path;
    return this;
  }

  withOverrides(overrides: ConfigOverride): ConfigurationBuilder {
    this.overrides = deepMerge(this.overrides, overrides);
    return this;
  }

  withEnvironment(env: Record<string, string>): ConfigurationBuilder {
    this.environment = { ...this.environment, ...env };
    return this;
  }

  async build(): Promise<RuntimeConfig> {
    // Load base configurations
    const profile = await this.loader.loadProfile(this.profilePath);
    const registry = await this.loader.loadRegistry(this.registryPath);

    // Apply overrides
    const mergedProfile = deepMerge(profile, this.overrides);

    // Resolve environment variables
    const resolvedProfile = this.resolveEnvironmentVariables(mergedProfile);

    // Create runtime configuration
    const runtimeConfig: RuntimeConfig = {
      ...resolvedProfile,
      resolvedProjectRoot: this.resolveProjectRoot(resolvedProfile.system.projectRoot),
      activeServers: this.resolveActiveServers(resolvedProfile, registry),
    };

    return runtimeConfig;
  }

  private resolveEnvironmentVariables(config: ProfileConfig): ProfileConfig {
    const resolved: ProfileConfig = JSON.parse(JSON.stringify(config));
    
    // Recursively substitute environment variables in all string values
    (this.envSubstitution as EnvironmentSubstitutionService).substituteInObject(resolved as unknown as Record<string, unknown>, this.environment);
    
    return resolved;
  }

  private resolveProjectRoot(projectRoot: string): string {
    try {
      return this.envSubstitution.substitute(projectRoot, this.environment);
    } catch (error) {
      throw new Error(`Failed to resolve PROJECT_ROOT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private resolveActiveServers(profile: ProfileConfig, registry: ServerRegistry): Record<string, ResolvedServerConfig> {
    const activeServers: Record<string, ResolvedServerConfig> = {};

    // Process enabled servers
    for (const [serverId, enabledConfig] of Object.entries(profile.servers.enabled)) {
      if (!enabledConfig.enabled) continue;

      // Get server definition from registry or bundled servers
      const serverDef = registry.servers[serverId] || getServerById(serverId);
      if (!serverDef) {
        // Skip servers not found in registry - this is expected for some configurations
        continue;
      }

      // Resolve configuration
      const resolvedConfig = deepMerge(
        serverDef.defaultConfig || {},
        enabledConfig.config || {}
      );

      // Resolve environment variables
      const resolvedEnvVars = { ...enabledConfig.environmentVariables };
      
      // Determine enabled tools
      const enabledTools = new Set<string>();
      if (serverDef.tools) {
        for (const tool of serverDef.tools) {
          const toolOverride = enabledConfig.toolOverrides?.[tool.name];
          const isEnabled = toolOverride?.enabled !== false; // Default to enabled unless explicitly disabled
          if (isEnabled) {
            enabledTools.add(tool.name);
          }
        }
      }

      activeServers[serverId] = {
        ...serverDef,
        enabled: true,
        resolvedConfig,
        resolvedEnvironmentVariables: resolvedEnvVars,
        enabledTools,
      };
    }

    return activeServers;
  }
}

/**
 * Deep merge two objects
 */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target } as T;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue !== undefined) {
      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}
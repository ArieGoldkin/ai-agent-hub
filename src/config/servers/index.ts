/**
 * Server definitions and utilities
 * Re-exports all server definitions and provides utility functions
 */

import type { 
  ServerDefinition, 
  ServerRegistry, 
  CategoryDefinition,
  Capability,
  TransportType 
} from '../../types/config.js';

// Import server definitions
export * from './core-servers.js';
export * from './optional-servers.js';

import { CORE_SERVERS, CORE_SERVER_IDS } from './core-servers.js';
import { OPTIONAL_SERVERS, OPTIONAL_SERVER_IDS } from './optional-servers.js';

// Combined bundled servers
export const BUNDLED_SERVERS: Record<string, ServerDefinition> = {
  ...CORE_SERVERS,
  ...OPTIONAL_SERVERS,
} as const;

// Server categories
export const SERVER_CATEGORIES: Record<string, CategoryDefinition> = {
  core: {
    name: 'Core Servers',
    description: 'Essential servers that are always enabled for basic functionality',
    servers: CORE_SERVER_IDS,
  },
  optional: {
    name: 'Optional Servers', 
    description: 'Additional servers that can be enabled based on feature requirements',
    servers: OPTIONAL_SERVER_IDS,
  },
};

// Create complete registry from bundled servers
export const BUNDLED_REGISTRY: ServerRegistry = {
  servers: BUNDLED_SERVERS,
  categories: SERVER_CATEGORIES,
};

// Utility functions for server management
export function getCoreServers(): ServerDefinition[] {
  const coreCategory = SERVER_CATEGORIES['core'];
  if (!coreCategory) return [];
  return coreCategory.servers
    .map((id: string) => BUNDLED_SERVERS[id])
    .filter((server): server is ServerDefinition => server !== undefined);
}

export function getOptionalServers(): ServerDefinition[] {
  const optionalCategory = SERVER_CATEGORIES['optional'];
  if (!optionalCategory) return [];
  return optionalCategory.servers
    .map((id: string) => BUNDLED_SERVERS[id])
    .filter((server): server is ServerDefinition => server !== undefined);
}

export function getServerById(serverId: string): ServerDefinition | undefined {
  return BUNDLED_SERVERS[serverId];
}

export function getServersByCapability(capability: Capability): ServerDefinition[] {
  return Object.values(BUNDLED_SERVERS).filter(server =>
    server.capabilities.includes(capability)
  );
}

export function getServersByTransport(transport: TransportType): ServerDefinition[] {
  return Object.values(BUNDLED_SERVERS).filter(server =>
    server.transport === transport
  );
}

export function getServersByCategory(category: string): ServerDefinition[] {
  return Object.values(BUNDLED_SERVERS).filter(server =>
    server.category === category
  );
}

export function getAllServerIds(): string[] {
  return Object.keys(BUNDLED_SERVERS);
}

export function getAllCapabilities(): Capability[] {
  const capabilities = new Set<Capability>();
  Object.values(BUNDLED_SERVERS).forEach(server => {
    server.capabilities.forEach(cap => capabilities.add(cap));
  });
  return Array.from(capabilities);
}

// Server validation helpers
export function isValidServerId(serverId: string): serverId is keyof typeof BUNDLED_SERVERS {
  return serverId in BUNDLED_SERVERS;
}

export function validateServerConfiguration(serverId: string, config: Record<string, unknown>): boolean {
  const server = getServerById(serverId);
  if (!server) return false;

  // Basic validation - check if config keys match default config structure
  if (server.defaultConfig) {
    const defaultKeys = Object.keys(server.defaultConfig);
    
    // Allow config to have additional keys, but check for type compatibility on known keys
    return defaultKeys.every(key => {
      if (!(key in config)) return true; // Optional keys
      const defaultValue = server.defaultConfig![key];
      const configValue = config[key];
      return typeof defaultValue === typeof configValue;
    });
  }

  return true;
}

// Environment variable requirements
export function getRequiredEnvironmentVariables(): Record<string, string[]> {
  const requirements: Record<string, string[]> = {};
  
  Object.entries(BUNDLED_SERVERS).forEach(([serverId, server]) => {
    if (server.security?.environmentVariables && server.security.environmentVariables.length > 0) {
      requirements[serverId] = server.security.environmentVariables;
    }
  });

  return requirements;
}

export function getAllRequiredEnvironmentVariables(): string[] {
  const allVars = new Set<string>();
  
  Object.values(BUNDLED_SERVERS).forEach(server => {
    if (server.security?.environmentVariables) {
      server.security.environmentVariables.forEach(variable => allVars.add(variable));
    }
  });

  return Array.from(allVars);
}
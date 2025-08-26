/**
 * TypeScript type definitions for AI Agent Hub configuration system
 */

/* eslint-disable no-unused-vars */

// Core configuration types
export interface ProfileConfig {
  profile: {
    name: string;
    version: string;
    description: string;
  };
  system: SystemConfig;
  servers: ServersConfig;
  security?: SecurityConfig;
  features?: FeaturesConfig;
}

export interface SystemConfig {
  projectRoot: string;
  memoryBackend: 'sqlite' | 'postgresql' | 'hybrid';
  contextDirectory: string;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  enableAuditLog?: boolean;
}

export interface ServersConfig {
  enabled: Record<string, EnabledServerConfig>;
  disabled?: string[];
}

export interface EnabledServerConfig {
  enabled: boolean;
  config?: Record<string, unknown>;
  environmentVariables?: Record<string, string>;
  toolOverrides?: Record<string, ToolOverride>;
}

export interface ToolOverride {
  enabled: boolean;
  security?: SecurityLevel;
}

export interface SecurityConfig {
  authMode?: AuthMode;
  requireAuthentication?: boolean;
  sandboxMode?: boolean;
  allowedOrigins?: string[];
  rateLimiting?: {
    enabled: boolean;
    requestsPerMinute?: number;
  };
}

export interface FeaturesConfig {
  enableBrowserAutomation?: boolean;
  enableDocumentationSearch?: boolean;
  enableSequentialThinking?: boolean;
  enableGitHubIntegration?: boolean;
}

// Server registry types
export interface ServerRegistry {
  servers: Record<string, ServerDefinition>;
  categories: Record<string, CategoryDefinition>;
}

export interface ServerDefinition {
  name: string;
  description: string;
  package: string;
  version?: string;
  transport: TransportType;
  capabilities: Capability[];
  tools?: ToolDefinition[];
  security?: ServerSecurity;
  defaultConfig?: Record<string, unknown>;
  category: string;
}

export interface CategoryDefinition {
  name: string;
  description: string;
  servers: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  security?: SecurityLevel;
}

export interface ServerSecurity {
  sandboxed?: boolean;
  requiresAuth?: boolean;
  permissions?: Permission[];
  environmentVariables?: string[];
}

// Enums and type unions
export type TransportType = 'stdio' | 'http';

export type AuthMode = 'none' | 'oauth2' | 'jwt' | 'api-key';

export type SecurityLevel = 'none' | 'sandboxed' | 'authenticated' | 'restricted';

export type Capability = 
  | 'filesystem' 
  | 'git' 
  | 'github' 
  | 'browser' 
  | 'documentation' 
  | 'reasoning' 
  | 'analysis' 
  | 'code-generation' 
  | 'testing';

export type Permission = 
  | 'read' 
  | 'write' 
  | 'execute' 
  | 'network' 
  | 'filesystem' 
  | 'git' 
  | 'github';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// Configuration loading and validation types
export interface ConfigLoader {
  loadProfile(path?: string): Promise<ProfileConfig>;
  loadRegistry(path?: string): Promise<ServerRegistry>;
  validateProfile(config: unknown): ProfileConfig;
  validateRegistry(config: unknown): ServerRegistry;
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: unknown;
}

// Runtime configuration types
export interface RuntimeConfig extends ProfileConfig {
  resolvedProjectRoot: string;
  activeServers: Record<string, ResolvedServerConfig>;
}

export interface ResolvedServerConfig extends ServerDefinition {
  enabled: boolean;
  resolvedConfig: Record<string, unknown>;
  resolvedEnvironmentVariables: Record<string, string>;
  enabledTools: Set<string>;
}

// Environment variable substitution
export interface EnvironmentSubstitution {
  substitute(template: string, env?: Record<string, string>): string;
  extractVariables(template: string): string[];
  validate(template: string, env?: Record<string, string>): ValidationResult<string>;
}

// Configuration defaults
export const DEFAULT_PROFILE_PATH = 'src/config/default-profile.json';
export const DEFAULT_REGISTRY_PATH = 'src/config/server-registry.json';
export const DEFAULT_LOG_LEVEL: LogLevel = 'info';
export const DEFAULT_CONTEXT_DIRECTORY = '.agent-context';
export const DEFAULT_MEMORY_BACKEND: SystemConfig['memoryBackend'] = 'sqlite';

// Type guards
export function isProfileConfig(obj: unknown): obj is ProfileConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'profile' in obj &&
    'system' in obj &&
    'servers' in obj
  );
}

export function isServerRegistry(obj: unknown): obj is ServerRegistry {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'servers' in obj &&
    'categories' in obj
  );
}

export function isValidTransportType(transport: string): transport is TransportType {
  return transport === 'stdio' || transport === 'http';
}

export function isValidSecurityLevel(level: string): level is SecurityLevel {
  return ['none', 'sandboxed', 'authenticated', 'restricted'].includes(level);
}

export function isValidCapability(capability: string): capability is Capability {
  return [
    'filesystem',
    'git', 
    'github',
    'browser',
    'documentation',
    'reasoning',
    'analysis',
    'code-generation',
    'testing'
  ].includes(capability);
}

// Utility types for configuration merging
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ConfigOverride = DeepPartial<ProfileConfig>;

// Configuration builder interface
export interface ConfigBuilder {
  fromProfile(path: string): ConfigBuilder;
  fromRegistry(path: string): ConfigBuilder;
  withOverrides(overrides: ConfigOverride): ConfigBuilder;
  withEnvironment(env: Record<string, string>): ConfigBuilder;
  build(): Promise<RuntimeConfig>;
}
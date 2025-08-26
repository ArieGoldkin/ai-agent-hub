/**
 * Server Registry Utility Functions
 */

import type { ServerDefinition, ServerCombination } from "./types.js";
import { SERVER_REGISTRY } from "./definitions.js";
import { SERVER_CATEGORIES, SERVER_COMBINATIONS } from "./categories.js";

/**
 * Get server definition by name
 */
export function getServerDefinition(
  serverName: string
): ServerDefinition | undefined {
  return SERVER_REGISTRY[serverName];
}

/**
 * Get all servers in a category
 */
export function getServersByCategory(
  category: keyof typeof SERVER_CATEGORIES
): ServerDefinition[] {
  return SERVER_CATEGORIES[category].servers
    .map(serverName => SERVER_REGISTRY[serverName])
    .filter(Boolean);
}

/**
 * Get all available server names
 */
export function getAllServerNames(): string[] {
  return Object.keys(SERVER_REGISTRY);
}

/**
 * Get servers that require specific environment variables
 */
export function getServersRequiringEnv(envVar: string): ServerDefinition[] {
  return Object.values(SERVER_REGISTRY).filter(
    server =>
      server.requiredEnv.includes(envVar) || server.optionalEnv.includes(envVar)
  );
}

/**
 * Validate server name exists in registry
 */
export function isValidServerName(serverName: string): boolean {
  return serverName in SERVER_REGISTRY;
}

/**
 * Get server combination by name
 */
export function getServerCombination(
  combinationName: string
): ServerCombination | undefined {
  return SERVER_COMBINATIONS[
    combinationName as keyof typeof SERVER_COMBINATIONS
  ];
}

/**
 * Get all available combinations
 */
export function getAllCombinations(): Array<{
  name: string;
  combination: ServerCombination;
}> {
  return Object.entries(SERVER_COMBINATIONS).map(([name, combination]) => ({
    name,
    combination
  }));
}
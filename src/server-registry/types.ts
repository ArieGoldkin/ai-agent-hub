/**
 * Server Registry Type Definitions
 */

export interface ServerDefinition {
  name: string;
  package: string;
  description: string;
  category: "core" | "dev-tools" | "ai" | "optional";
  requiredEnv: string[];
  optionalEnv: string[];
  defaultArgs: string[];
  defaultEnv: Record<string, string>;
  capabilities: string[];
  version?: string;
  runner?: "npx" | "uvx";
}

export interface ServerCategory {
  name: string;
  description: string;
  servers: string[];
}

export interface ServerCombination {
  name: string;
  description: string;
  servers: string[];
  requiredEnv: string[];
}
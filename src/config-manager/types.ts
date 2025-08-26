/**
 * Type definitions for Unified Configuration Manager
 */

import type { ProjectInfo } from "../claude-code-config/index.js";

export type ConfigType = "desktop" | "code";

export interface ConfigTarget {
  type: ConfigType;
  name: string;
  path: string;
  exists: boolean;
  available: boolean;
}

export interface ServerLocation {
  serverId: string;
  configType: ConfigType;
  configPath: string;
}

export interface UnifiedConfigState {
  targets: ConfigTarget[];
  servers: {
    desktop: string[];
    code: string[];
    all: ServerLocation[];
  };
  projectInfo: ProjectInfo;
}

export interface RemovalResult {
  desktop?: {
    removed: string[];
    errors?: string[];
  };
  code?: {
    removed: string[];
    errors?: string[];
  };
}
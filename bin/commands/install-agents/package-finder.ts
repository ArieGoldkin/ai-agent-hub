/**
 * Package root finder utilities
 */

import { existsSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Find the package root directory containing agents
 */
export async function findPackageRoot(currentDir: string): Promise<string> {
  const possiblePaths = [
    currentDir,
    join(currentDir, "../.."),
    join(currentDir, "../../.."),
  ];
  
  for (const path of possiblePaths) {
    const agentsPath = join(path, "agents");
    if (existsSync(agentsPath)) {
      const files = readdirSync(agentsPath);
      if (files.some(f => f.endsWith('.md'))) {
        return path;
      }
    }
  }
  
  throw new Error("Cannot locate ai-agent-hub package with agents");
}

/**
 * Determine agent source based on mode
 */
export function getAgentSource(packageRoot: string, mode: string): { agentsPath: string; sourceDescription: string } {
  if (mode === 'squad') {
    const squadTemplatesPath = join(packageRoot, ".squad", "templates");
    if (existsSync(squadTemplatesPath)) {
      return {
        agentsPath: squadTemplatesPath,
        sourceDescription: "slim squad templates (97% token reduction)"
      };
    }
    console.log("⚠️  Squad templates not found, falling back to classic agents");
  }
  
  return {
    agentsPath: join(packageRoot, "agents"),
    sourceDescription: mode === 'squad' ? "classic agents" : "classic full agents"
  };
}
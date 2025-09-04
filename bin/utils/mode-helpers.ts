/**
 * Helper functions for mode operations
 */

import fs from "fs";
import path from "path";

/**
 * Copy directory recursively
 */
export function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Convert classic workflow to squad tasks
 */
export function convertToSquadTasks(classicWorkflow: string): string[] {
  const tasks: string[] = [];
  
  // Parse classic workflow into Squad-compatible tasks
  const lines = classicWorkflow.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    // Convert common patterns to Squad tasks
    if (line.includes('create') || line.includes('build')) {
      tasks.push(`[frontend-ui-developer] ${line}`);
    } else if (line.includes('api') || line.includes('database')) {
      tasks.push(`[backend-system-architect] ${line}`);
    } else if (line.includes('test') || line.includes('review')) {
      tasks.push(`[code-quality-reviewer] ${line}`);
    } else if (line.includes('design') || line.includes('ui')) {
      tasks.push(`[rapid-ui-designer] ${line}`);
    } else if (line.includes('research') || line.includes('user')) {
      tasks.push(`[ux-researcher] ${line}`);
    } else if (line.includes('ai') || line.includes('ml')) {
      tasks.push(`[ai-ml-engineer] ${line}`);
    } else {
      tasks.push(`[studio-coach] Coordinate: ${line}`);
    }
  }
  
  return tasks;
}

/**
 * Estimate token cost for a given workflow
 */
export function estimateTokenCost(workflow: string, mode: string): { tokens: number; estimatedCost: number } {
  // Rough estimation based on workflow length and mode
  const baseTokens = workflow.length * 0.75; // Rough character to token ratio
  
  let multiplier = 1;
  if (mode === 'classic') {
    multiplier = 10; // Classic uses full agent prompts
  } else if (mode === 'squad') {
    multiplier = 1; // Squad uses slim templates (97% reduction)
  }
  
  const totalTokens = Math.round(baseTokens * multiplier);
  const estimatedCost = (totalTokens / 1000) * 0.01; // Rough cost estimation
  
  return {
    tokens: totalTokens,
    estimatedCost
  };
}
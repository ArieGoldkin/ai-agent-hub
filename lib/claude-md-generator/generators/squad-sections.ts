/**
 * Squad mode specific sections generator
 */

import { existsSync } from "fs";

/**
 * Generate Squad mode specific sections
 */
export function generateSquadSections(): string[] {
  const sections: string[] = [];
  
  // Parallel Execution Commands
  if (existsSync('.claude/commands')) {
    sections.push('## Parallel Execution Commands\n');
    sections.push('Squad mode provides special commands for parallel agent execution:\n');
    sections.push('- **`/allocate-tasks-parallel`** - Intelligently distribute tasks to multiple agents');
    sections.push('- **`/start-parallel`** - Launch parallel agent execution with conflict prevention');
    sections.push('- **`/sync-parallel`** - Synchronize results from parallel agents\n');
    sections.push('Use these commands when you have multiple independent tasks that can run simultaneously.\n');
  }
  
  // File Ownership & Conflict Prevention
  if (existsSync('.claude/parallel-execution-rules.md')) {
    sections.push('## File Ownership & Conflict Prevention\n');
    sections.push('Squad mode uses intelligent file ownership to prevent conflicts during parallel execution:\n');
    sections.push('- **Frontend files** → frontend-ui-developer (exclusive)');
    sections.push('- **Backend files** → backend-system-architect (exclusive)');
    sections.push('- **ML/AI files** → ai-ml-engineer (exclusive)');
    sections.push('- **Shared files** → Sequential access with merge strategies');
    sections.push('- **Config files** → Protected with validation gates\n');
  }
  
  // Squad Roster Information
  if (existsSync('.claude/squad-roster.md')) {
    sections.push('## Squad Instance Allocation\n');
    sections.push('Agents can run multiple instances for true parallel execution:');
    sections.push('- **Studio Coach**: 1 instance (supervisor)');
    sections.push('- **Frontend UI Developer**: 2 instances (parallel component work)');
    sections.push('- **Backend System Architect**: 1 instance');
    sections.push('- **AI/ML Engineer**: 1 instance');
    sections.push('- **Support agents**: 1 instance each\n');
  }
  
  return sections;
}
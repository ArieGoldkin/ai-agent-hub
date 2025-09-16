/**
 * Simple session persistence for AI Agent Hub
 * Tracks project progress between Claude sessions
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';

export interface SessionInfo {
  session_id: string;
  created_at: string;
  last_updated: string;
  project_name?: string;
  last_agent?: string;
  tasks_completed: number;
  current_task?: string;
  files_modified: string[];
}

export class SessionPersistence {
  private sessionFile = '.claude/context/session.json';

  /**
   * Load existing session or return null
   */
  loadSession(): SessionInfo | null {
    if (!existsSync(this.sessionFile)) {
      return null;
    }

    try {
      const content = readFileSync(this.sessionFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Save current session state
   */
  saveSession(session: SessionInfo): void {
    session.last_updated = new Date().toISOString();
    writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
  }

  /**
   * Create a new session
   */
  createSession(projectName?: string): SessionInfo {
    const session: SessionInfo = {
      session_id: `session-${Date.now()}`,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      project_name: projectName,
      tasks_completed: 0,
      files_modified: []
    };

    this.saveSession(session);
    return session;
  }

  /**
   * Update session with agent activity
   */
  updateActivity(agent: string, task?: string, files?: string[]): void {
    let session = this.loadSession();

    if (!session) {
      session = this.createSession();
    }

    session.last_agent = agent;
    if (task) {
      session.current_task = task;
    }
    if (files && files.length > 0) {
      // Add unique files only
      files.forEach(file => {
        if (!session.files_modified.includes(file)) {
          session.files_modified.push(file);
        }
      });
    }

    this.saveSession(session);
  }

  /**
   * Mark a task as completed
   */
  completeTask(): void {
    const session = this.loadSession();
    if (session) {
      session.tasks_completed++;
      session.current_task = undefined;
      this.saveSession(session);
    }
  }

  /**
   * Get a summary of the current session
   */
  getSummary(): string {
    const session = this.loadSession();

    if (!session) {
      return 'No active session. Starting fresh!';
    }

    const timeSinceUpdate = Date.now() - new Date(session.last_updated).getTime();
    const hoursAgo = Math.floor(timeSinceUpdate / (1000 * 60 * 60));

    let summary = `📊 Continuing session from ${hoursAgo > 0 ? `${hoursAgo} hours ago` : 'recently'}\n`;
    if (session.project_name) {
      summary += `Project: ${session.project_name}\n`;
    }
    if (session.last_agent) {
      summary += `Last active: ${session.last_agent}\n`;
    }
    summary += `Progress: ${session.tasks_completed} tasks completed\n`;
    if (session.files_modified.length > 0) {
      summary += `Files touched: ${session.files_modified.length}`;
    }

    return summary;
  }
}
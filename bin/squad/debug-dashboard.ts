#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { DebugMode } from './debug-mode.js';
import { FileLockManager } from './file-lock.js';
import { DashboardRenderers } from '../../lib/squad/debug-dashboard/renderers.js';

export class DebugDashboard {
  private debugMode: DebugMode;
  private lockManager: FileLockManager;
  private dashboardPath: string;
  private updateInterval?: NodeJS.Timeout;

  constructor() {
    this.debugMode = DebugMode.getInstance();
    this.lockManager = new FileLockManager();
    this.dashboardPath = path.join(
      this.debugMode.getDebugDir(),
      'dashboard.md'
    );
  }

  async start(intervalMs: number = 5000): Promise<void> {
    if (!this.debugMode.isEnabled()) return;
    
    await this.update();
    
    this.updateInterval = setInterval(async () => {
      await this.update().catch(console.error);
    }, intervalMs);
  }

  async stop(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    await this.update();
  }

  private async update(): Promise<void> {
    const session = this.debugMode.getSession();
    if (!session) return;
    
    const dashboard = await this.generateDashboard();
    await fs.writeFile(this.dashboardPath, dashboard);
  }

  private async generateDashboard(): Promise<string> {
    const session = this.debugMode.getSession();
    if (!session) return '## No debug session active';
    
    const agents = Array.from(session.agents.values()).sort((a, b) => 
      a.agentNumber - b.agentNumber
    );
    
    const locks = await this.lockManager.getCurrentLocks();
    const waitingAgents = this.lockManager.getWaitingAgents();
    
    let md = DashboardRenderers.renderHeader(session);
    md += DashboardRenderers.renderAgentTable(agents);
    md += DashboardRenderers.renderFileLocks(locks, waitingAgents);
    md += DashboardRenderers.renderTokenUsage(session);
    md += DashboardRenderers.renderFileOperations(session);
    md += DashboardRenderers.renderErrors(agents);
    md += DashboardRenderers.renderDebugCommands(session);
    
    return md;
  }
}
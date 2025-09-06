#!/usr/bin/env node

import { DebugMode } from './debug-mode.js';
import { SessionAnalyzer } from '../../lib/squad/debug-commands/analyzer.js';
import { SessionReplay } from '../../lib/squad/debug-commands/replay.js';
import { SessionExport } from '../../lib/squad/debug-commands/export.js';

export class DebugCommands {
  private debugMode: DebugMode;
  private analyzer: SessionAnalyzer;
  private replay: SessionReplay;
  private export: SessionExport;

  constructor() {
    this.debugMode = DebugMode.getInstance();
    this.analyzer = new SessionAnalyzer();
    this.replay = new SessionReplay();
    this.export = new SessionExport();
  }

  async analyzeLastFailure(): Promise<void> {
    const sessions = await this.export.listSessions();
    if (sessions.length === 0) {
      console.log('No debug sessions found');
      return;
    }

    const lastSession = sessions[sessions.length - 1];
    await this.analyzeSession(lastSession);
  }

  async analyzeSession(sessionId: string): Promise<void> {
    const session = await this.debugMode.loadSession(sessionId);
    if (!session) {
      console.log(`Session ${sessionId} not found`);
      return;
    }

    this.analyzer.printAnalysis(session, sessionId);
  }

  async saveSnapshot(label?: string): Promise<void> {
    const session = this.debugMode.getSession();
    if (!session) {
      console.log('No active debug session');
      return;
    }

    await this.export.saveSnapshot(session, label);
  }

  async compareOutcomes(sessionId: string, expectedFile: string): Promise<void> {
    const session = await this.debugMode.loadSession(sessionId);
    if (!session) {
      console.log(`Session ${sessionId} not found`);
      return;
    }

    await this.export.compareOutcomes(session, sessionId, expectedFile);
  }

  async replaySession(sessionId: string): Promise<void> {
    const session = await this.debugMode.loadSession(sessionId);
    if (!session) {
      console.log(`Session ${sessionId} not found`);
      return;
    }

    await this.replay.replaySession(session, sessionId);
  }

  async exportSession(sessionId: string, format: 'json' | 'csv' = 'json'): Promise<void> {
    const session = await this.debugMode.loadSession(sessionId);
    if (!session) {
      console.log(`Session ${sessionId} not found`);
      return;
    }

    await this.export.exportSession(session, sessionId, format);
  }
}
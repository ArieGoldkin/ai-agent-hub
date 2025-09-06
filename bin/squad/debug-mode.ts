#!/usr/bin/env node

import { SessionManager } from '../../lib/squad/debug-mode/session-manager.js';
import { 
  DebugConfig, 
  DebugSession, 
  AgentStatus, 
  FileOperation 
} from '../../lib/squad/debug-mode/types.js';

export { DebugConfig, DebugSession, AgentStatus, FileOperation };

export class DebugMode {
  private static instance: DebugMode;
  private sessionManager: SessionManager;
  private config: DebugConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.sessionManager = new SessionManager(this.config);
  }

  static getInstance(): DebugMode {
    if (!DebugMode.instance) {
      DebugMode.instance = new DebugMode();
    }
    return DebugMode.instance;
  }

  private loadConfig(): DebugConfig {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return {
      enabled: false,
      sequential: false,
      verboseLogging: false,
      saveContext: false,
      tokenTracking: false,
      sessionId: timestamp,
      debugDir: `.squad/debug/${timestamp}`
    };
  }

  async initialize(options: Partial<DebugConfig>): Promise<void> {
    this.config = { ...this.config, ...options };
    this.sessionManager = new SessionManager(this.config);
    await this.sessionManager.initialize();
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  isSequential(): boolean {
    return this.config.sequential;
  }

  getSessionId(): string {
    return this.config.sessionId;
  }

  getDebugDir(): string {
    return this.config.debugDir;
  }

  registerAgent(id: string, agentNumber: number): void {
    this.sessionManager.registerAgent(id, agentNumber);
  }

  updateAgentStatus(id: string, update: Partial<AgentStatus>): void {
    this.sessionManager.updateAgentStatus(id, update);
  }

  recordFileOperation(operation: FileOperation): void {
    this.sessionManager.recordFileOperation(operation);
  }

  updateTokenUsage(tokens: number, agentId?: string): void {
    this.sessionManager.updateTokenUsage(tokens, agentId);
  }

  async saveSession(): Promise<void> {
    await this.sessionManager.saveSession();
  }

  async loadSession(sessionId: string): Promise<DebugSession | null> {
    return this.sessionManager.loadSession(sessionId);
  }

  getSession(): DebugSession | undefined {
    return this.sessionManager.getSession();
  }
}
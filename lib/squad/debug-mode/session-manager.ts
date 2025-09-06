import * as fs from 'fs/promises';
import * as path from 'path';
import { DebugConfig, DebugSession, AgentStatus, FileOperation } from './types.js';

export class SessionManager {
  private session?: DebugSession;
  private config: DebugConfig;

  constructor(config: DebugConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.config.enabled) {
      await fs.mkdir(this.config.debugDir, { recursive: true });
      
      this.session = {
        config: this.config,
        agents: new Map(),
        fileOperations: [],
        tokenUsage: {
          total: 0,
          budget: 50000,
          rate: 0
        },
        startTime: new Date()
      };
      
      await this.saveConfig();
    }
  }

  private async saveConfig(): Promise<void> {
    if (!this.session) return;
    
    const configPath = path.join(this.config.debugDir, 'config.json');
    await fs.writeFile(
      configPath,
      JSON.stringify(this.config, null, 2)
    );
  }

  registerAgent(id: string, agentNumber: number): void {
    if (!this.session) return;
    
    this.session.agents.set(id, {
      id,
      agentNumber,
      status: 'pending',
      tokensUsed: 0,
      filesModified: [],
      currentOperation: 'Initializing'
    });
  }

  updateAgentStatus(id: string, update: Partial<AgentStatus>): void {
    if (!this.session) return;
    
    const agent = this.session.agents.get(id);
    if (agent) {
      Object.assign(agent, update);
    }
  }

  recordFileOperation(operation: FileOperation): void {
    if (!this.session) return;
    this.session.fileOperations.push(operation);
  }

  updateTokenUsage(tokens: number, agentId?: string): void {
    if (!this.session) return;
    
    this.session.tokenUsage.total += tokens;
    
    if (agentId) {
      const agent = this.session.agents.get(agentId);
      if (agent) {
        agent.tokensUsed += tokens;
      }
    }
    
    const elapsedSeconds = (Date.now() - this.session.startTime.getTime()) / 1000;
    if (elapsedSeconds > 0) {
      this.session.tokenUsage.rate = this.session.tokenUsage.total / elapsedSeconds;
    }
  }

  async saveSession(): Promise<void> {
    if (!this.session) return;
    
    const sessionPath = path.join(this.config.debugDir, 'session.json');
    const sessionData = {
      ...this.session,
      agents: Array.from(this.session.agents.entries()),
      endTime: new Date()
    };
    
    await fs.writeFile(
      sessionPath,
      JSON.stringify(sessionData, null, 2)
    );
  }

  async loadSession(sessionId: string): Promise<DebugSession | null> {
    try {
      const sessionPath = path.join('.squad/debug', sessionId, 'session.json');
      const data = await fs.readFile(sessionPath, 'utf-8');
      const sessionData = JSON.parse(data);
      
      sessionData.agents = new Map(sessionData.agents);
      return sessionData;
    } catch {
      return null;
    }
  }

  getSession(): DebugSession | undefined {
    return this.session;
  }

  getConfig(): DebugConfig {
    return this.config;
  }
}
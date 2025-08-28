/**
 * Enhanced Context Manager with robust error handling, JSON corruption recovery,
 * automatic backups, size limits (100KB), session expiry (24h), and safe fallbacks.
 */
import { writeFile, readFile, mkdir, copyFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { randomUUID } from "crypto";
import type { SessionContext, AgentContext, DecisionRecord, SerializedSessionContext } from "./types/context.js";

const MAX_CONTEXT_SIZE = 100 * 1024; // 100KB limit
const SESSION_EXPIRY_HOURS = 24;
const BACKUP_SUFFIX = '.backup';

export class ContextManager {
  private contextPath: string;
  private sessionContext: SessionContext | null = null;

  constructor(basePath: string = process.cwd()) {
    this.contextPath = join(basePath, ".claude", "session-context.json");
  }

  async initSession(sessionId?: string): Promise<void> {
    const id = sessionId || randomUUID();
    this.sessionContext = {
      sessionId: id, startTime: new Date(), lastUpdated: new Date(),
      agents: new Map(), decisionHistory: [], metadata: {},
    };
    await this.persist();
    console.log(`Session initialized: ${id}`);
  }

  // Validation and utility helpers
  private validateContext(data: any): boolean {
    return data && typeof data.sessionId === 'string' && typeof data.startTime === 'string' &&
           typeof data.lastUpdated === 'string' && typeof data.agents === 'object' && 
           Array.isArray(data.decisionHistory);
  }
  private isSessionExpired(context: SessionContext): boolean {
    return new Date() > new Date(context.startTime.getTime() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
  }
  private async createBackup(): Promise<void> {
    if (existsSync(this.contextPath)) {
      try { await copyFile(this.contextPath, this.contextPath + BACKUP_SUFFIX); }
      catch (error) { console.warn('Failed to create backup:', error); }
    }
  }
  private checkSizeLimit(content: string): boolean {
    const size = Buffer.byteLength(content, 'utf8');
    if (size > MAX_CONTEXT_SIZE) {
      console.warn(`Context size (${size} bytes) exceeds limit (${MAX_CONTEXT_SIZE} bytes)`);
      return false;
    }
    return true;
  }
  async getContext(): Promise<SessionContext | null> {
    if (!this.sessionContext) await this.load();
    if (this.sessionContext && this.isSessionExpired(this.sessionContext)) {
      console.warn('Session expired, clearing context');
      await this.clearSession();
      return null;
    }
    return this.sessionContext;
  }

  async addAgentContext(agentName: string, context: Omit<AgentContext, 'agentName' | 'timestamp'>): Promise<void> {
    if (!this.sessionContext) await this.initSession();
    const agentContext: AgentContext = { agentName, timestamp: new Date(), ...context };
    const agentContexts = this.sessionContext!.agents.get(agentName) || [];
    agentContexts.push(agentContext);
    this.sessionContext!.agents.set(agentName, agentContexts);
    this.sessionContext!.lastUpdated = new Date();
    if (context.decisions) this.sessionContext!.decisionHistory.push(...context.decisions);
    await this.persist();
  }

  async getContextForAgent(agentName: string): Promise<AgentContext[]> {
    if (!this.sessionContext) await this.load();
    return this.sessionContext?.agents.get(agentName) || [];
  }

  async clearSession(): Promise<void> {
    this.sessionContext = null;
    if (existsSync(this.contextPath)) {
      try {
        await writeFile(this.contextPath, JSON.stringify(null, null, 2));
        console.log("Session cleared");
      } catch (error) { console.error("Failed to clear session:", error); }
    }
  }

  async addDecision(decision: DecisionRecord): Promise<void> {
    if (!this.sessionContext) await this.initSession();
    this.sessionContext!.decisionHistory.push(decision);
    this.sessionContext!.lastUpdated = new Date();
    await this.persist();
  }

  async getDecisionHistory(): Promise<DecisionRecord[]> {
    if (!this.sessionContext) await this.load();
    return this.sessionContext?.decisionHistory || [];
  }

  // Enhanced persistence with error handling
  private async persist(): Promise<void> {
    if (!this.sessionContext) return;
    try {
      const content = JSON.stringify(this.serialize(this.sessionContext), null, 2);
      if (!this.checkSizeLimit(content)) throw new Error('Context size exceeds limit');
      const dir = dirname(this.contextPath);
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      await this.createBackup();
      await writeFile(this.contextPath, content);
    } catch (error) {
      console.error("Failed to persist context:", error);
      await this.restoreFromBackup();
    }
  }

  private async restoreFromBackup(): Promise<void> {
    const backupPath = this.contextPath + BACKUP_SUFFIX;
    if (existsSync(backupPath)) {
      try {
        await copyFile(backupPath, this.contextPath);
        console.log('Restored context from backup');
      } catch (error) { console.error('Failed to restore from backup:', error); }
    }
  }

  // Load with corruption handling and recovery
  private async load(): Promise<void> {
    if (!existsSync(this.contextPath)) return;
    try {
      const content = await readFile(this.contextPath, "utf-8");
      if (!content || content.trim() === '' || content.trim() === 'null') return;
      let parsed: SerializedSessionContext | null;
      try {
        parsed = JSON.parse(content);
      } catch (jsonError) {
        console.warn('JSON corruption detected, attempting backup restore');
        await this.restoreFromBackup();
        const backupPath = this.contextPath + BACKUP_SUFFIX;
        if (existsSync(backupPath)) {
          const backupContent = await readFile(backupPath, "utf-8");
          parsed = JSON.parse(backupContent);
        } else { throw jsonError; }
      }
      if (parsed && this.validateContext(parsed)) {
        this.sessionContext = this.deserialize(parsed);
      } else { console.warn('Invalid context data structure, ignoring'); }
    } catch (error) {
      console.error("Failed to load context:", error);
      this.sessionContext = null; // Graceful fallback
    }
  }

  // Serialize/Deserialize helpers
  private serialize(context: SessionContext): SerializedSessionContext {
    const agents: Record<string, AgentContext[]> = {};
    context.agents.forEach((value, key) => { agents[key] = value; });
    return {
      sessionId: context.sessionId,
      startTime: context.startTime.toISOString(),
      lastUpdated: context.lastUpdated.toISOString(),
      agents,
      decisionHistory: context.decisionHistory,
      metadata: context.metadata,
    };
  }

  private deserialize(serialized: SerializedSessionContext): SessionContext {
    const agents = new Map<string, AgentContext[]>();
    Object.entries(serialized.agents).forEach(([key, value]) => {
      agents.set(key, value.map(ac => ({ ...ac, timestamp: new Date(ac.timestamp) })));
    });
    return {
      sessionId: serialized.sessionId,
      startTime: new Date(serialized.startTime),
      lastUpdated: new Date(serialized.lastUpdated),
      agents,
      decisionHistory: serialized.decisionHistory.map(dr => ({ ...dr, timestamp: new Date(dr.timestamp) })),
      metadata: serialized.metadata,
    };
  }
}
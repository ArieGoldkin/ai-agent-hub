/**
 * Context Manager
 * 
 * Manages shared context between AI agents, enabling informed
 * handoffs and collaborative decision-making.
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { randomUUID } from "crypto";
import type {
  SessionContext,
  AgentContext,
  DecisionRecord,
  SerializedSessionContext,
} from "./types/context.js";

/**
 * Context Manager class for managing agent session context
 */
export class ContextManager {
  private contextPath: string;
  private sessionContext: SessionContext | null = null;

  constructor(basePath: string = process.cwd()) {
    this.contextPath = join(basePath, ".claude", "session-context.json");
  }

  /**
   * Initialize a new session with unique ID
   */
  async initSession(sessionId?: string): Promise<void> {
    const id = sessionId || randomUUID();
    
    this.sessionContext = {
      sessionId: id,
      startTime: new Date(),
      lastUpdated: new Date(),
      agents: new Map(),
      decisionHistory: [],
      metadata: {},
    };

    await this.persist();
    console.log(`Session initialized: ${id}`);
  }

  /**
   * Get the current session context
   */
  async getContext(): Promise<SessionContext | null> {
    if (!this.sessionContext) {
      await this.load();
    }
    return this.sessionContext;
  }

  /**
   * Add context from a specific agent
   */
  async addAgentContext(agentName: string, context: Omit<AgentContext, 'agentName' | 'timestamp'>): Promise<void> {
    if (!this.sessionContext) {
      await this.initSession();
    }

    const agentContext: AgentContext = {
      agentName,
      timestamp: new Date(),
      ...context,
    };

    const agentContexts = this.sessionContext!.agents.get(agentName) || [];
    agentContexts.push(agentContext);
    this.sessionContext!.agents.set(agentName, agentContexts);
    
    this.sessionContext!.lastUpdated = new Date();

    if (context.decisions) {
      this.sessionContext!.decisionHistory.push(...context.decisions);
    }

    await this.persist();
  }

  /**
   * Get all context entries for a specific agent
   */
  async getContextForAgent(agentName: string): Promise<AgentContext[]> {
    if (!this.sessionContext) {
      await this.load();
    }

    if (!this.sessionContext) {
      return [];
    }

    return this.sessionContext.agents.get(agentName) || [];
  }

  /**
   * Clear the current session
   */
  async clearSession(): Promise<void> {
    this.sessionContext = null;
    
    if (existsSync(this.contextPath)) {
      try {
        await writeFile(this.contextPath, JSON.stringify(null, null, 2));
        console.log("Session cleared");
      } catch (error) {
        console.error("Failed to clear session:", error);
      }
    }
  }

  /**
   * Add a decision record to the history
   */
  async addDecision(decision: DecisionRecord): Promise<void> {
    if (!this.sessionContext) {
      await this.initSession();
    }

    this.sessionContext!.decisionHistory.push(decision);
    this.sessionContext!.lastUpdated = new Date();
    
    await this.persist();
  }

  /**
   * Get decision history for analysis
   */
  async getDecisionHistory(): Promise<DecisionRecord[]> {
    if (!this.sessionContext) {
      await this.load();
    }

    return this.sessionContext?.decisionHistory || [];
  }

  /**
   * Persist context to disk
   */
  private async persist(): Promise<void> {
    if (!this.sessionContext) {
      return;
    }

    const serialized = this.serialize(this.sessionContext);
    
    const dir = dirname(this.contextPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    try {
      await writeFile(this.contextPath, JSON.stringify(serialized, null, 2));
    } catch (error) {
      console.error("Failed to persist context:", error);
    }
  }

  /**
   * Load context from disk
   */
  private async load(): Promise<void> {
    if (!existsSync(this.contextPath)) {
      return;
    }

    try {
      const content = await readFile(this.contextPath, "utf-8");
      const parsed: SerializedSessionContext | null = JSON.parse(content);
      
      if (parsed) {
        this.sessionContext = this.deserialize(parsed);
      }
    } catch (error) {
      console.error("Failed to load context:", error);
    }
  }

  /**
   * Serialize SessionContext for storage
   */
  private serialize(context: SessionContext): SerializedSessionContext {
    const agents: Record<string, AgentContext[]> = {};
    
    context.agents.forEach((value, key) => {
      agents[key] = value;
    });

    return {
      sessionId: context.sessionId,
      startTime: context.startTime.toISOString(),
      lastUpdated: context.lastUpdated.toISOString(),
      agents,
      decisionHistory: context.decisionHistory,
      metadata: context.metadata,
    };
  }

  /**
   * Deserialize stored context
   */
  private deserialize(serialized: SerializedSessionContext): SessionContext {
    const agents = new Map<string, AgentContext[]>();
    
    Object.entries(serialized.agents).forEach(([key, value]) => {
      agents.set(key, value.map(ac => ({
        ...ac,
        timestamp: new Date(ac.timestamp),
      })));
    });

    return {
      sessionId: serialized.sessionId,
      startTime: new Date(serialized.startTime),
      lastUpdated: new Date(serialized.lastUpdated),
      agents,
      decisionHistory: serialized.decisionHistory.map(dr => ({
        ...dr,
        timestamp: new Date(dr.timestamp),
      })),
      metadata: serialized.metadata,
    };
  }
}
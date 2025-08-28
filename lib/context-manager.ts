/**
 * Simplified Context Manager
 *
 * Manages session context for agent orchestration
 */

import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { randomUUID } from "crypto";
import type { SessionContext, DecisionRecord } from "./types/context.js";

export class ContextManager {
  private contextPath: string;
  private sessionContext: SessionContext | null = null;

  constructor(basePath: string = process.cwd()) {
    this.contextPath = join(basePath, ".claude", "session-context.json");
  }

  async initSession(sessionId?: string): Promise<void> {
    const id = sessionId || randomUUID();
    this.sessionContext = {
      sessionId: id,
      startTime: new Date(),
      lastUpdated: new Date(),
      agents: new Map(),
      decisionHistory: [],
      metadata: {}
    };
    await this.persist();
    console.log(`Session initialized: ${id}`);
  }

  async getContext(): Promise<SessionContext | null> {
    if (!this.sessionContext) {
      await this.load();
    }
    return this.sessionContext;
  }

  async addDecision(decision: DecisionRecord): Promise<void> {
    if (!this.sessionContext) {
      await this.initSession();
    }
    this.sessionContext!.decisionHistory.push(decision);
    this.sessionContext!.lastUpdated = new Date();
    await this.persist();
  }

  private async persist(): Promise<void> {
    if (!this.sessionContext) return;

    try {
      const dir = dirname(this.contextPath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      const serialized = {
        sessionId: this.sessionContext.sessionId,
        startTime: this.sessionContext.startTime.toISOString(),
        lastUpdated: this.sessionContext.lastUpdated.toISOString(),
        agents: Object.fromEntries(this.sessionContext.agents),
        decisionHistory: this.sessionContext.decisionHistory,
        metadata: this.sessionContext.metadata
      };

      await writeFile(this.contextPath, JSON.stringify(serialized, null, 2));
    } catch (error) {
      console.error("Failed to persist context:", error);
    }
  }

  private async load(): Promise<void> {
    if (!existsSync(this.contextPath)) {
      return;
    }

    try {
      const content = await readFile(this.contextPath, "utf-8");
      const data = JSON.parse(content);

      if (data && data.sessionId) {
        this.sessionContext = {
          sessionId: data.sessionId,
          startTime: new Date(data.startTime),
          lastUpdated: new Date(data.lastUpdated),
          agents: new Map(Object.entries(data.agents || {})),
          decisionHistory: data.decisionHistory || [],
          metadata: data.metadata || {}
        };
      }
    } catch (error) {
      console.error("Failed to load context:", error);
    }
  }
}

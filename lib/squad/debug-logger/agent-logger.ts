import * as fs from 'fs/promises';
import * as path from 'path';
import { DebugMode } from '../../../bin/squad/debug-mode.js';

export class AgentLogger {
  private debugMode: DebugMode;

  constructor(debugMode: DebugMode) {
    this.debugMode = debugMode;
  }

  async logStart(agentId: string, context: Record<string, unknown>): Promise<void> {
    this.debugMode.updateAgentStatus(agentId, {
      status: 'running',
      startTime: new Date(),
      currentOperation: 'Starting'
    });
    
    if (this.debugMode.getSession()?.config.saveContext) {
      const contextPath = path.join(
        this.debugMode.getDebugDir(),
        `context-${agentId}.json`
      );
      await fs.writeFile(contextPath, JSON.stringify(context, null, 2));
    }
  }

  async logComplete(agentId: string, result: Record<string, unknown>): Promise<void> {
    this.debugMode.updateAgentStatus(agentId, {
      status: 'complete',
      endTime: new Date(),
      currentOperation: 'Complete'
    });
    
    if (this.debugMode.getSession()?.config.saveContext) {
      const resultPath = path.join(
        this.debugMode.getDebugDir(),
        `result-${agentId}.json`
      );
      await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
    }
  }

  logError(agentId: string, error: Error | unknown): { message: string; stack?: string } {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    this.debugMode.updateAgentStatus(agentId, {
      status: 'failed',
      endTime: new Date(),
      currentOperation: 'Failed',
      error: errorMessage
    });
    
    return { message: errorMessage, stack: errorStack };
  }

  logTokenUsage(agentId: string, tokens: number): void {
    this.debugMode.updateTokenUsage(tokens, agentId);
  }
}
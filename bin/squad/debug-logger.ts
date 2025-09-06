#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { DebugMode } from './debug-mode.js';
import { AgentLogger } from '../../lib/squad/debug-logger/agent-logger.js';
import { LogLevel, LogEntry, FileOperationParams } from '../../lib/squad/debug-logger/types.js';
import { LoggerMethods } from '../../lib/squad/debug-logger/logger-methods.js';

export { LogLevel };

export class DebugLogger {
  private static instance: DebugLogger;
  private logPath?: string;
  private writeStream?: fs.FileHandle;
  private debugMode: DebugMode;
  private agentLogger: AgentLogger;
  private buffer: LogEntry[] = [];
  private flushInterval?: NodeJS.Timeout;

  private constructor() {
    this.debugMode = DebugMode.getInstance();
    this.agentLogger = new AgentLogger(this.debugMode);
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  async initialize(): Promise<void> {
    if (!this.debugMode.isEnabled()) return;
    
    const debugDir = this.debugMode.getDebugDir();
    this.logPath = path.join(debugDir, 'execution-trace.log');
    
    await fs.mkdir(debugDir, { recursive: true });
    this.writeStream = await fs.open(this.logPath, 'a');
    
    this.flushInterval = setInterval(() => {
      this.flush().catch(console.error);
    }, 1000);
    
    await this.log(LogLevel.INFO, 'SYSTEM', 'Debug logging initialized', {
      sessionId: this.debugMode.getSessionId(),
      debugDir
    });
  }

  async log(
    level: LogLevel,
    agentId: string,
    operation: string,
    details?: string | Record<string, unknown>
  ): Promise<void> {
    if (!this.debugMode.isEnabled()) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      agentId,
      operation,
      details: typeof details === 'object' ? JSON.stringify(details) : (details || ''),
      metadata: typeof details === 'object' ? details : undefined
    };
    
    this.buffer.push(entry);
    
    if (level === LogLevel.ERROR) {
      await this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (!this.writeStream || this.buffer.length === 0) return;
    
    const entries = this.buffer.splice(0);
    const content = entries.map(e => LoggerMethods.formatLogEntry(e)).join('');
    
    try {
      await this.writeStream.write(content);
    } catch (error) {
      console.error('Failed to write to debug log:', error);
    }
  }

  async logFileOperation(params: FileOperationParams): Promise<void> {
    await LoggerMethods.logFileOperation(params, this.debugMode, this.log.bind(this));
  }

  async logAgentStart(agentId: string, context: Record<string, unknown>): Promise<void> {
    await LoggerMethods.logAgentStart(agentId, context, this.agentLogger, this.log.bind(this));
  }

  async logAgentComplete(agentId: string, result: Record<string, unknown>): Promise<void> {
    await LoggerMethods.logAgentComplete(agentId, result, this.agentLogger, this.log.bind(this));
  }

  async logAgentError(agentId: string, error: Error | unknown): Promise<void> {
    await LoggerMethods.logAgentError(agentId, error, this.agentLogger, this.log.bind(this));
  }

  async logTokenUsage(agentId: string, tokens: number, operation: string): Promise<void> {
    await LoggerMethods.logTokenUsage({
      agentId,
      tokens,
      operation,
      agentLogger: this.agentLogger,
      debugMode: this.debugMode
    }, this.log.bind(this));
  }

  async close(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    await this.flush();
    
    if (this.writeStream) {
      await this.writeStream.close();
    }
    
    await this.debugMode.saveSession();
  }

  getTailCommand(): string {
    return this.logPath ? `tail -f ${this.logPath}` : '';
  }
}
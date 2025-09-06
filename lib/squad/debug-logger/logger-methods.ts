import { LogLevel, LogEntry, FileOperationParams } from './types.js';
import { FileOperations } from './file-operations.js';
import { AgentLogger } from './agent-logger.js';
import { DebugMode } from '../../../bin/squad/debug-mode.js';

export class LoggerMethods {
  static async logFileOperation(
    params: FileOperationParams,
    debugMode: DebugMode,
    logFn: (level: LogLevel, agentId: string, operation: string, details?: Record<string, unknown>) => Promise<void>
  ): Promise<void> {
    const fileOp = FileOperations.createFileOperation(params);
    debugMode.recordFileOperation(fileOp);
    
    await logFn(
      params.success ? LogLevel.DEBUG : LogLevel.WARN,
      params.agentId,
      `FILE_${params.operation.toUpperCase()}`,
      {
        filepath: params.filepath,
        success: params.success,
        duration: `${params.duration}ms`,
        beforeHash: fileOp.beforeHash,
        afterHash: fileOp.afterHash
      }
    );
  }

  static async logAgentStart(
    agentId: string,
    context: Record<string, unknown>,
    agentLogger: AgentLogger,
    logFn: (level: LogLevel, agentId: string, operation: string, details?: Record<string, unknown>) => Promise<void>
  ): Promise<void> {
    await agentLogger.logStart(agentId, context);
    await logFn(LogLevel.INFO, agentId, 'AGENT_START', context);
  }

  static async logAgentComplete(
    agentId: string,
    result: Record<string, unknown>,
    agentLogger: AgentLogger,
    logFn: (level: LogLevel, agentId: string, operation: string, details?: Record<string, unknown>) => Promise<void>
  ): Promise<void> {
    await agentLogger.logComplete(agentId, result);
    await logFn(LogLevel.INFO, agentId, 'AGENT_COMPLETE', result);
  }

  static async logAgentError(
    agentId: string,
    error: Error | unknown,
    agentLogger: AgentLogger,
    logFn: (level: LogLevel, agentId: string, operation: string, details?: Record<string, unknown>) => Promise<void>
  ): Promise<void> {
    const errorInfo = agentLogger.logError(agentId, error);
    await logFn(LogLevel.ERROR, agentId, 'AGENT_ERROR', errorInfo);
  }

  static async logTokenUsage(params: {
    agentId: string;
    tokens: number;
    operation: string;
    agentLogger: AgentLogger;
    debugMode: DebugMode;
  }, logFn: (level: LogLevel, agentId: string, operation: string, details?: Record<string, unknown>) => Promise<void>): Promise<void> {
    params.agentLogger.logTokenUsage(params.agentId, params.tokens);
    await logFn(LogLevel.TRACE, params.agentId, 'TOKEN_USAGE', {
      tokens: params.tokens,
      operation: params.operation,
      total: params.debugMode.getSession()?.tokenUsage.total
    });
  }

  static formatLogEntry(entry: LogEntry): string {
    const agentPart = entry.agentId ? `[${entry.agentId}]` : '';
    return `[${entry.timestamp}] [${entry.level}] ${agentPart} [${entry.operation}] ${entry.details}\n`;
  }
}
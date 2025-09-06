export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  agentId?: string;
  operation: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface FileOperationParams {
  agentId: string;
  operation: 'read' | 'write' | 'lock' | 'unlock';
  filepath: string;
  success: boolean;
  duration: number;
  beforeContent?: string;
  afterContent?: string;
}
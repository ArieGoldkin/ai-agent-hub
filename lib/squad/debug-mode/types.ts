export interface DebugConfig {
  enabled: boolean;
  sequential: boolean;
  verboseLogging: boolean;
  saveContext: boolean;
  tokenTracking: boolean;
  sessionId: string;
  debugDir: string;
}

export interface AgentStatus {
  id: string;
  agentNumber: number;
  status: 'pending' | 'running' | 'waiting' | 'complete' | 'failed';
  tokensUsed: number;
  filesModified: string[];
  currentOperation: string;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface FileOperation {
  timestamp: Date;
  agentId: string;
  operation: 'read' | 'write' | 'lock' | 'unlock';
  filepath: string;
  beforeHash?: string;
  afterHash?: string;
  success: boolean;
  duration: number;
}

export interface TokenUsage {
  total: number;
  budget: number;
  rate: number;
}

export interface DebugSession {
  config: DebugConfig;
  agents: Map<string, AgentStatus>;
  fileOperations: FileOperation[];
  tokenUsage: TokenUsage;
  startTime: Date;
  endTime?: Date;
}
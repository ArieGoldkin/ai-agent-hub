export interface LockInfo {
  agentId: number;
  timestamp: string;
  operation: 'read' | 'write';
  filepath: string;
}

export interface LockStatus {
  locked: boolean;
  agentId?: number;
  age?: number;
}

export interface DeadlockInfo {
  hasDeadlock: boolean;
  agents?: number[];
}
/**
 * Context Manager for AI Agent Hub
 * Handles reading and writing structured context with simple file locking
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { SharedContext } from './types.js';

export class ContextManager {
  private contextDir = '.claude/context';
  private contextFile = 'shared-context.json';
  private lockFile = '.lock';
  
  constructor() {
    this.ensureContextDirectory();
  }
  
  private ensureContextDirectory(): void {
    if (!existsSync(this.contextDir)) {
      mkdirSync(this.contextDir, { recursive: true });
      this.initializeContext();
    }
  }
  
  private initializeContext(): void {
    const initial: SharedContext = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      session_id: this.generateSessionId(),
      agent_decisions: {},
      tasks_completed: [],
      tasks_pending: []
    };
    
    this.writeContext(initial);
  }
  
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  
  readContext(): SharedContext {
    const path = join(this.contextDir, this.contextFile);
    
    if (!existsSync(path)) {
      this.initializeContext();
    }
    
    try {
      const content = readFileSync(path, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading context:', error);
      this.initializeContext();
      return this.readContext();
    }
  }
  
  writeContext(context: SharedContext): void {
    const path = join(this.contextDir, this.contextFile);
    const lockPath = join(this.contextDir, this.lockFile);
    
    context.timestamp = new Date().toISOString();
    
    try {
      // Simple file lock mechanism
      let attempts = 0;
      while (existsSync(lockPath) && attempts < 10) {
        // Wait for lock to be released
        this.sleep(100);
        attempts++;
      }
      
      // Acquire lock
      writeFileSync(lockPath, process.pid.toString());
      
      // Write context
      writeFileSync(path, JSON.stringify(context, null, 2));
      
      // Release lock
      if (existsSync(lockPath)) {
        unlinkSync(lockPath);
      }
    } catch (error) {
      console.error('Error writing context:', error);
      // Try to clean up lock file
      if (existsSync(lockPath)) {
        try {
          unlinkSync(lockPath);
        } catch {
          // Ignore cleanup errors
        }
      }
      throw error;
    }
  }
  
  updateAgentDecision(agentName: string, decision: {
    type?: string;
    description?: string;
    data?: unknown;
  }): void {
    const context = this.readContext();
    
    if (!context.agent_decisions[agentName]) {
      context.agent_decisions[agentName] = {
        timestamp: new Date().toISOString(),
        decisions: []
      };
    }
    
    context.agent_decisions[agentName].decisions.push({
      type: decision.type || 'general',
      description: decision.description || '',
      data: decision.data || {}
    });
    
    context.agent_decisions[agentName].timestamp = new Date().toISOString();
    
    this.writeContext(context);
  }
  
  addApiEndpoint(endpoint: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description: string;
    request_schema?: unknown;
    response_schema?: unknown;
    authentication?: boolean;
  }): void {
    const context = this.readContext();
    
    if (!context.api_design) {
      context.api_design = { endpoints: [] };
    }
    
    context.api_design.endpoints.push(endpoint);
    this.writeContext(context);
  }
  
  addUIComponent(component: {
    name: string;
    type: 'page' | 'component' | 'layout' | 'widget';
    props?: Record<string, unknown>;
    children?: string[];
    api_dependencies?: string[];
    state_management?: string;
  }): void {
    const context = this.readContext();
    
    if (!context.ui_components) {
      context.ui_components = [];
    }
    
    context.ui_components.push(component);
    this.writeContext(context);
  }
  
  addSharedType(name: string, definition: unknown, source: string): void {
    const context = this.readContext();
    
    if (!context.shared_types) {
      context.shared_types = {};
    }
    
    context.shared_types[name] = {
      definition,
      used_by: [source],
      source
    };
    
    this.writeContext(context);
  }
  
  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }
}
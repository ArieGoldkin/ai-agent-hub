# Context Enhancement Implementation Guide

## AI Agent Hub - Next Generation Context Management

This document outlines three critical enhancements to improve context preservation and natural language understanding in AI Agent Hub, while maintaining our core philosophy: **"Intelligence emerges from collaboration, not complexity"**.

## 📊 Implementation Status

| Enhancement | Status | Completion Date | Notes |
|------------|--------|-----------------|-------|
| **1. Structured Context Files** | ✅ **COMPLETED** | Sep 10, 2025 | Fully implemented and tested |
| **2. Context Persistence** | ✅ **COMPLETED** | Sep 13, 2025 | Simple session tracking implemented |
| **3. Enhanced Natural Language** | ✅ **COMPLETED** | Sep 15, 2025 | Simple vocabulary learning implemented |

---

## Table of Contents
1. [Overview & Motivation](#overview--motivation)
2. [Enhancement 1: Structured Context Files](#enhancement-1-structured-context-files)
3. [Enhancement 2: Context Persistence Between Sessions](#enhancement-2-context-persistence-between-sessions)
4. [Enhancement 3: Enhanced Natural Language Understanding](#enhancement-3-enhanced-natural-language-understanding)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Testing Strategy](#testing-strategy)
7. [Migration Guide](#migration-guide)

---

## Overview & Motivation

### Current State
- **Classic Mode**: 4,575 lines across 9 agents (sequential execution)
- **Squad Mode**: 419 lines with 97% token reduction (parallel execution)
- **Context Sharing**: Text-based through markdown files
- **Agent Selection**: Keyword-based matching from `context-triggers.md`

### Problems to Solve
1. **Context Quality**: Agents lose complex data structures in text conversion
2. **Session Continuity**: Every new Claude session starts fresh
3. **Language Understanding**: Keyword matching misses nuanced requests

### Solution Philosophy
- Maintain zero-configuration approach
- Automatic enhancement without user intervention
- Backward compatible with existing agents
- Simple, predictable, debuggable

---

## Enhancement 1: Structured Context Files ✅ COMPLETED

### What This Solves
Transform agent communication from text-parsing to structured data exchange, eliminating misinterpretation and data loss.

### Implementation Status
**✅ COMPLETED - September 10, 2025**

#### What Was Implemented:
1. **Created Type Definitions** (`lib/context/types.ts`)
   - SharedContext interface with full type safety
   - Support for agent decisions, API design, database schema, UI components
   - Progress tracking with tasks_completed and tasks_pending

2. **Built Context Manager** (`lib/context/context-manager.ts`)
   - File-based locking mechanism for concurrent access
   - Atomic writes to prevent corruption
   - Helper methods for common operations (addApiEndpoint, addUIComponent, etc.)

3. **Integrated with Installer** (`bin/commands/install-agents/context-initializer.ts`)
   - Auto-creates `.claude/context/` directory
   - Initializes `shared-context.json` on first install
   - Works for both Classic and Squad modes

4. **Modularized Installer** (bonus improvement)
   - Split install-agents.ts into 5 focused modules
   - Better code organization and maintainability

#### Files Created:
- `lib/context/types.ts` - Type definitions
- `lib/context/context-manager.ts` - Context management class
- `bin/commands/install-agents/context-initializer.ts` - Initialization module
- `bin/commands/install-agents/context-triggers.ts` - Trigger installation
- `bin/commands/install-agents/settings-creator.ts` - Settings creation
- `bin/commands/install-agents/package-finder.ts` - Package utilities
- `bin/commands/install-agents/index.ts` - Module exports

### Architecture

```
.claude/
├── agents/           # Existing agents
├── context/          # NEW: Structured context
│   ├── shared-context.json
│   ├── agent-decisions.json
│   └── session-metadata.json
└── context-triggers.md
```

### Implementation Details

#### Step 1: Define Context Schema
Create `lib/context/types.ts`:

```typescript
// Core context structure shared between all agents
export interface SharedContext {
  // Metadata
  version: string;
  timestamp: string;
  session_id: string;
  project_type?: string;
  
  // Agent-specific contributions
  agent_decisions: {
    [agentName: string]: {
      timestamp: string;
      decisions: Array<{
        type: string;
        description: string;
        data: any;
      }>;
    };
  };
  
  // Backend contributions
  api_design?: {
    endpoints: Array<{
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      description: string;
      request_schema?: any;
      response_schema?: any;
      authentication?: boolean;
    }>;
    base_url?: string;
    version?: string;
  };
  
  database_schema?: {
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primary_key?: boolean;
        foreign_key?: { table: string; column: string };
      }>;
      indexes?: Array<{ name: string; columns: string[] }>;
    }>;
    relationships?: Array<{
      from: string;
      to: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    }>;
  };
  
  // Frontend contributions
  ui_components?: Array<{
    name: string;
    type: 'page' | 'component' | 'layout' | 'widget';
    props?: Record<string, any>;
    children?: string[];
    api_dependencies?: string[];
    state_management?: string;
  }>;
  
  routes?: Array<{
    path: string;
    component: string;
    auth_required?: boolean;
    roles?: string[];
  }>;
  
  // Shared resources
  shared_types?: {
    [typeName: string]: {
      definition: any;
      used_by: string[];
      source: string;
    };
  };
  
  configuration?: {
    environment_variables: Array<{
      name: string;
      description: string;
      required: boolean;
      default_value?: string;
    }>;
    dependencies: {
      frontend?: Record<string, string>;
      backend?: Record<string, string>;
      development?: Record<string, string>;
    };
  };
  
  // Progress tracking
  tasks_completed?: Array<{
    agent: string;
    task: string;
    timestamp: string;
    files_modified: string[];
  }>;
  
  tasks_pending?: Array<{
    task: string;
    assigned_to?: string;
    priority?: 'low' | 'medium' | 'high';
    dependencies?: string[];
  }>;
}
```

#### Step 2: Create Context Manager
Create `lib/context/context-manager.ts`:

```typescript
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
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
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    context.timestamp = new Date().toISOString();
    
    try {
      // Atomic write with lock
      const lockPath = join(this.contextDir, this.lockFile);
      
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
        require('fs').unlinkSync(lockPath);
      }
    } catch (error) {
      console.error('Error writing context:', error);
      throw error;
    }
  }
  
  updateAgentDecision(agentName: string, decision: any): void {
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
  
  addApiEndpoint(endpoint: any): void {
    const context = this.readContext();
    
    if (!context.api_design) {
      context.api_design = { endpoints: [] };
    }
    
    context.api_design.endpoints.push(endpoint);
    this.writeContext(context);
  }
  
  addUIComponent(component: any): void {
    const context = this.readContext();
    
    if (!context.ui_components) {
      context.ui_components = [];
    }
    
    context.ui_components.push(component);
    this.writeContext(context);
  }
  
  addSharedType(name: string, definition: any, source: string): void {
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
```

#### Step 3: Update Agent Installation
Modify `bin/commands/install-agents.ts`:

```typescript
// Add to the installation process
async function installContextSystem(mode: string): Promise<void> {
  const contextDir = '.claude/context';
  
  // Create context directory
  if (!existsSync(contextDir)) {
    mkdirSync(contextDir, { recursive: true });
    console.log('📁 Created context directory');
  }
  
  // Initialize shared context
  const contextFile = join(contextDir, 'shared-context.json');
  if (!existsSync(contextFile)) {
    const initial = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      session_id: `session-${Date.now()}`,
      mode: mode,
      agent_decisions: {},
      tasks_completed: [],
      tasks_pending: []
    };
    
    writeFileSync(contextFile, JSON.stringify(initial, null, 2));
    console.log('✅ Initialized structured context system');
  }
  
  // Add context instructions to agents
  await updateAgentsWithContextInstructions(mode);
}

async function updateAgentsWithContextInstructions(mode: string): Promise<void> {
  const contextInstructions = `
## Context Management

### Reading Context
At the start of each task, read the structured context:
\`\`\`bash
cat .claude/context/shared-context.json
\`\`\`

### Writing Context
After making significant decisions or creating resources, update the context:
\`\`\`json
{
  "agent_decisions": {
    "YOUR_AGENT_NAME": {
      "timestamp": "ISO_DATE",
      "decisions": [
        {
          "type": "api_design|database|component|architecture",
          "description": "What you decided",
          "data": { /* structured data */ }
        }
      ]
    }
  }
}
\`\`\`

### Example Usage
- Backend Agent: Add API endpoints to \`api_design.endpoints\`
- Frontend Agent: Add components to \`ui_components\`
- All Agents: Log decisions in \`agent_decisions\`
`;
  
  // This would be appended to each agent's instructions
  // Implementation depends on how agents are structured
}
```

### 🚀 Next Steps for Agent Integration

**IMPORTANT**: The context system is now live! Agents just need to be updated to use it.

#### How Agents Should Use the Context System

**1. Reading Context (at task start):**
```bash
# Every agent should check context when starting a task
cat .claude/context/shared-context.json
```

**2. Writing Context (after decisions):**
```bash
# Use the Edit or Write tool to update context
# Example: Backend agent after creating API
{
  "api_design": {
    "endpoints": [
      {
        "path": "/api/users",
        "method": "GET",
        "description": "List all users",
        "response_schema": { "type": "array", "items": "User" }
      }
    ]
  }
}
```

**3. Checking Other Agents' Work:**
```bash
# Frontend agent checking what Backend created
cat .claude/context/shared-context.json | grep -A 10 "api_design"
```

#### Step 4: Agent Integration Examples

**Backend System Architect Integration:**
```markdown
## When designing an API:
1. Read existing context: `cat .claude/context/shared-context.json`
2. Design your endpoints
3. Update context with your design:
   ```json
   {
     "api_design": {
       "endpoints": [
         {
           "path": "/api/users",
           "method": "GET",
           "description": "List all users",
           "response_schema": {
             "type": "array",
             "items": { "$ref": "#/definitions/User" }
           }
         }
       ]
     }
   }
   ```
4. Continue with implementation
```

**Frontend UI Developer Integration:**
```markdown
## When creating components:
1. Read API design from context
2. Create components that match API schemas
3. Update context with component registry:
   ```json
   {
     "ui_components": [
       {
         "name": "UserList",
         "type": "component",
         "api_dependencies": ["/api/users"],
         "props": {
           "users": "User[]",
           "onSelect": "(user: User) => void"
         }
       }
     ]
   }
   ```
```

---

## Enhancement 2: Context Persistence Between Sessions ✅ COMPLETED

### What This Solves
Enable Claude to remember project context across sessions, eliminating the need to re-explain project details.

### Implementation Status
**✅ COMPLETED - September 13, 2025**

#### What Was Implemented (Simplified Version):
1. **Created SessionPersistence class** (`lib/context/session-persistence.ts`)
   - Simple session tracking (119 lines)
   - Tracks project name, last agent, tasks completed
   - Shows session summary on startup

2. **Integrated with Installer** (`bin/commands/install-agents/context-initializer.ts`)
   - Auto-shows session info when resuming work
   - Creates new session on first run
   - Zero configuration required

3. **Simplified Architecture:**
```
.claude/context/
├── shared-context.json  # Structured context (Enhancement 1)
└── session.json         # Session persistence (Enhancement 2)
```

#### How It Works:
- First run: Creates `session.json` automatically
- Subsequent runs: Shows "Continuing session from X hours ago"
- Tracks: Project name, last agent, tasks completed, files modified
- No complex state management - just simple tracking

#### Example Output:
```
📊 Continuing session from 1 hours ago
Project: Test E-commerce App
Last active: backend-system-architect
Progress: 3 tasks completed
Files touched: 3
```

### Implementation Details

#### Step 1: Create Session Manager
Create `lib/context/session-manager.ts`:

```typescript
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  project_name?: string;
  project_type?: string;
  description?: string;
  
  // State tracking
  state: {
    current_agent?: string;
    last_command?: string;
    working_directory: string;
    environment?: Record<string, string>;
  };
  
  // Progress tracking
  progress: {
    total_tasks: number;
    completed_tasks: number;
    current_phase?: string;
    milestones: Array<{
      name: string;
      completed: boolean;
      timestamp?: string;
    }>;
  };
  
  // Agent activity
  agent_history: Array<{
    agent: string;
    timestamp: string;
    action: string;
    result?: string;
    files_modified?: string[];
  }>;
  
  // File tracking
  files: {
    created: string[];
    modified: string[];
    deleted: string[];
  };
  
  // Decision history
  decisions: Array<{
    timestamp: string;
    agent: string;
    decision: string;
    rationale?: string;
    alternatives?: string[];
  }>;
  
  // Learned patterns
  patterns: {
    common_requests: Record<string, number>;
    agent_preferences: Record<string, string>;
    vocabulary: Record<string, string[]>;
  };
}

export class SessionManager {
  private sessionDir = '.claude/sessions';
  private currentFile = 'current-session.json';
  private historyDir = 'history';
  private checkpointDir = 'checkpoints';
  private maxCheckpoints = 10;
  private autoSaveInterval = 5 * 60 * 1000; // 5 minutes
  private autoSaveTimer?: NodeJS.Timeout;
  
  constructor() {
    this.ensureDirectories();
    this.startAutoSave();
  }
  
  private ensureDirectories(): void {
    const dirs = [
      this.sessionDir,
      join(this.sessionDir, this.historyDir),
      join(this.sessionDir, this.checkpointDir)
    ];
    
    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      this.createCheckpoint();
    }, this.autoSaveInterval);
  }
  
  createSession(projectName?: string, projectType?: string): Session {
    const session: Session = {
      id: this.generateSessionId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_name: projectName,
      project_type: projectType,
      state: {
        working_directory: process.cwd()
      },
      progress: {
        total_tasks: 0,
        completed_tasks: 0,
        milestones: []
      },
      agent_history: [],
      files: {
        created: [],
        modified: [],
        deleted: []
      },
      decisions: [],
      patterns: {
        common_requests: {},
        agent_preferences: {},
        vocabulary: {}
      }
    };
    
    this.saveSession(session);
    return session;
  }
  
  loadSession(): Session | null {
    const path = join(this.sessionDir, this.currentFile);
    
    if (!existsSync(path)) {
      return null;
    }
    
    try {
      const content = readFileSync(path, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }
  
  saveSession(session: Session): void {
    const path = join(this.sessionDir, this.currentFile);
    session.updated_at = new Date().toISOString();
    
    try {
      writeFileSync(path, JSON.stringify(session, null, 2));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }
  
  createCheckpoint(): void {
    const session = this.loadSession();
    if (!session) return;
    
    const timestamp = Date.now();
    const checkpointPath = join(
      this.sessionDir,
      this.checkpointDir,
      `checkpoint-${timestamp}.json`
    );
    
    writeFileSync(checkpointPath, JSON.stringify(session, null, 2));
    
    // Clean old checkpoints
    this.cleanOldCheckpoints();
  }
  
  private cleanOldCheckpoints(): void {
    const checkpointPath = join(this.sessionDir, this.checkpointDir);
    const files = readdirSync(checkpointPath)
      .filter(f => f.startsWith('checkpoint-'))
      .sort()
      .reverse();
    
    if (files.length > this.maxCheckpoints) {
      files.slice(this.maxCheckpoints).forEach(file => {
        const path = join(checkpointPath, file);
        require('fs').unlinkSync(path);
      });
    }
  }
  
  archiveSession(): void {
    const session = this.loadSession();
    if (!session) return;
    
    const archivePath = join(
      this.sessionDir,
      this.historyDir,
      `session-${session.id}.json`
    );
    
    writeFileSync(archivePath, JSON.stringify(session, null, 2));
    
    // Update index
    this.updateSessionIndex(session);
    
    // Clear current session
    const currentPath = join(this.sessionDir, this.currentFile);
    if (existsSync(currentPath)) {
      require('fs').unlinkSync(currentPath);
    }
  }
  
  private updateSessionIndex(session: Session): void {
    const indexPath = join(this.sessionDir, this.historyDir, 'index.json');
    
    let index = [];
    if (existsSync(indexPath)) {
      try {
        index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      } catch {
        index = [];
      }
    }
    
    index.push({
      id: session.id,
      project_name: session.project_name,
      created_at: session.created_at,
      updated_at: session.updated_at,
      tasks_completed: session.progress.completed_tasks
    });
    
    writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }
  
  restoreSession(sessionId: string): Session | null {
    const archivePath = join(
      this.sessionDir,
      this.historyDir,
      `session-${sessionId}.json`
    );
    
    if (!existsSync(archivePath)) {
      return null;
    }
    
    try {
      const content = readFileSync(archivePath, 'utf-8');
      const session = JSON.parse(content);
      
      // Make it current
      this.saveSession(session);
      
      return session;
    } catch (error) {
      console.error('Error restoring session:', error);
      return null;
    }
  }
  
  updateAgentActivity(agent: string, action: string, result?: string, files?: string[]): void {
    const session = this.loadSession();
    if (!session) return;
    
    session.agent_history.push({
      agent,
      timestamp: new Date().toISOString(),
      action,
      result,
      files_modified: files
    });
    
    // Update file tracking
    if (files) {
      files.forEach(file => {
        if (!session.files.modified.includes(file)) {
          session.files.modified.push(file);
        }
      });
    }
    
    this.saveSession(session);
  }
  
  recordDecision(agent: string, decision: string, rationale?: string): void {
    const session = this.loadSession();
    if (!session) return;
    
    session.decisions.push({
      timestamp: new Date().toISOString(),
      agent,
      decision,
      rationale
    });
    
    this.saveSession(session);
  }
  
  learnPattern(type: 'request' | 'agent' | 'vocabulary', key: string, value: string): void {
    const session = this.loadSession();
    if (!session) return;
    
    switch (type) {
      case 'request':
        session.patterns.common_requests[key] = 
          (session.patterns.common_requests[key] || 0) + 1;
        break;
      case 'agent':
        session.patterns.agent_preferences[key] = value;
        break;
      case 'vocabulary':
        if (!session.patterns.vocabulary[key]) {
          session.patterns.vocabulary[key] = [];
        }
        if (!session.patterns.vocabulary[key].includes(value)) {
          session.patterns.vocabulary[key].push(value);
        }
        break;
    }
    
    this.saveSession(session);
  }
  
  getSummary(): string {
    const session = this.loadSession();
    if (!session) {
      return 'No active session';
    }
    
    const duration = Date.now() - new Date(session.created_at).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `
📊 Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━
Project: ${session.project_name || 'Unnamed'}
Type: ${session.project_type || 'Unknown'}
Duration: ${hours}h ${minutes}m
Progress: ${session.progress.completed_tasks}/${session.progress.total_tasks} tasks
Files Modified: ${session.files.modified.length}
Last Agent: ${session.agent_history[session.agent_history.length - 1]?.agent || 'None'}
    `.trim();
  }
  
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  }
}
```

#### Step 2: Session Recovery on Startup
Update `bin/commands/setup.ts`:

```typescript
import { SessionManager } from '../../lib/context/session-manager.js';

async function checkExistingSession(): Promise<void> {
  const sessionManager = new SessionManager();
  const session = sessionManager.loadSession();
  
  if (session) {
    console.log('\n🔄 Previous Session Detected');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(sessionManager.getSummary());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const response = await prompt('Continue previous session? (Y/n): ');
    
    if (response.toLowerCase() !== 'n') {
      console.log('✅ Session restored. Context loaded.');
      
      // Load context into environment
      process.env.AI_HUB_SESSION = JSON.stringify({
        id: session.id,
        project: session.project_name,
        context_available: true
      });
    } else {
      // Archive old session and start fresh
      sessionManager.archiveSession();
      console.log('📦 Previous session archived. Starting fresh.');
    }
  }
}

// Add to main setup flow
export async function runSetup(
  packageRoot: string,
  targets: InstallTargets,
  mode: string
): Promise<void> {
  // Check for existing session first
  await checkExistingSession();
  
  // Continue with normal setup...
}
```

#### Step 3: Agent Session Integration

**Add to all agents (both Classic and Squad):**
```markdown
## Session Awareness

### On Start
Check for existing session context:
```bash
if [ -f ".claude/sessions/current-session.json" ]; then
  echo "Loading session context..."
  cat .claude/sessions/current-session.json
fi
```

### During Work
Update session with your activities:
- Log decisions with rationale
- Track file modifications
- Record learned patterns

### On Completion
Save checkpoint for continuity:
```bash
# Session is auto-saved every 5 minutes
# Manual checkpoint: echo "checkpoint" > .claude/sessions/checkpoint-request
```
```

---

## Enhancement 3: Enhanced Natural Language Understanding ✅ COMPLETED

### What This Solves
Move beyond simple keyword matching to understand context, learn project vocabulary, and handle ambiguous requests intelligently.

### Implementation Status
**✅ COMPLETED - September 15, 2025**

#### What Was Implemented (Simplified Version):
1. **Created VocabularyLearning class** (`lib/context/vocabulary-learning.ts`)
   - Simple vocabulary learning (162 lines)
   - Learns which words map to which agents
   - Tracks recent agent usage for continuity

2. **Integrated with Installer** (`bin/commands/install-agents/context-initializer.ts`)
   - Shows vocabulary learning status on startup
   - Zero configuration required

3. **Simplified Architecture:**
```
.claude/context/
├── shared-context.json        # Enhancement 1: Structured data
├── session.json               # Enhancement 2: Session persistence
└── learned-vocabulary.json    # Enhancement 3: Vocabulary learning
```

#### How It Works:
- Tracks word frequency across agent invocations
- Associates words with agents after 3+ uses
- Remembers last 5 agents for context continuity
- No complex ML - just simple word counting

#### Example Output:
```
📚 Vocabulary Learning Status:
- Learned keywords for 2 agents
- Tracked 6 unique words
- Recent agents: backend-system-architect, frontend-ui-developer, studio-coach
```

### Implementation Details

#### Step 1: Create Vocabulary Learning System
Create `lib/context/vocabulary-learner.ts`:

```typescript
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface LearnedVocabulary {
  version: string;
  updated_at: string;
  
  // Agent-specific keywords learned from usage
  agent_keywords: {
    [agentName: string]: {
      keywords: string[];
      phrases: string[];
      frequency: Record<string, number>;
    };
  };
  
  // Project-specific terminology
  project_terms: {
    domain_terms: string[];
    custom_entities: string[];
    abbreviations: Record<string, string>;
  };
  
  // Disambiguation rules learned from user choices
  disambiguation_rules: Array<{
    pattern: string;
    preferred_agent: string;
    confidence: number;
    examples: string[];
  }>;
  
  // Intent patterns
  intent_patterns: Array<{
    intent: string;
    patterns: string[];
    agent: string;
    confidence: number;
  }>;
}

export interface ConversationMemory {
  recent_messages: Array<{
    timestamp: string;
    message: string;
    agent_invoked?: string;
    keywords_matched?: string[];
  }>;
  
  recent_agents: string[];
  current_context?: string;
  active_topic?: string;
}

export class VocabularyLearner {
  private vocabularyFile = '.claude/context/learned-keywords.json';
  private memoryFile = '.claude/context/conversation-memory.json';
  private maxMemorySize = 20;
  private confidenceThreshold = 0.7;
  private commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can',
    'need', 'create', 'make', 'build', 'add', 'update', 'fix', 'change'
  ]);
  
  constructor() {
    this.ensureFiles();
  }
  
  private ensureFiles(): void {
    if (!existsSync(this.vocabularyFile)) {
      const initial: LearnedVocabulary = {
        version: '1.0.0',
        updated_at: new Date().toISOString(),
        agent_keywords: {},
        project_terms: {
          domain_terms: [],
          custom_entities: [],
          abbreviations: {}
        },
        disambiguation_rules: [],
        intent_patterns: []
      };
      writeFileSync(this.vocabularyFile, JSON.stringify(initial, null, 2));
    }
    
    if (!existsSync(this.memoryFile)) {
      const initial: ConversationMemory = {
        recent_messages: [],
        recent_agents: []
      };
      writeFileSync(this.memoryFile, JSON.stringify(initial, null, 2));
    }
  }
  
  learnFromInteraction(
    userInput: string,
    agentInvoked: string,
    keywordsMatched: string[]
  ): void {
    // Update vocabulary
    this.updateAgentKeywords(userInput, agentInvoked);
    
    // Update conversation memory
    this.updateMemory(userInput, agentInvoked, keywordsMatched);
    
    // Learn patterns
    this.learnPattern(userInput, agentInvoked);
    
    // Extract project terms
    this.extractProjectTerms(userInput);
  }
  
  private updateAgentKeywords(input: string, agent: string): void {
    const vocabulary = this.loadVocabulary();
    
    if (!vocabulary.agent_keywords[agent]) {
      vocabulary.agent_keywords[agent] = {
        keywords: [],
        phrases: [],
        frequency: {}
      };
    }
    
    // Extract meaningful words
    const words = input.toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !this.commonWords.has(word) &&
        /^[a-z]+$/i.test(word)
      );
    
    // Update frequency
    words.forEach(word => {
      const freq = vocabulary.agent_keywords[agent].frequency;
      freq[word] = (freq[word] || 0) + 1;
      
      // Add to keywords if frequent enough
      if (freq[word] >= 3 && !vocabulary.agent_keywords[agent].keywords.includes(word)) {
        vocabulary.agent_keywords[agent].keywords.push(word);
      }
    });
    
    // Extract phrases (2-3 word combinations)
    const phrases = this.extractPhrases(input);
    phrases.forEach(phrase => {
      if (!vocabulary.agent_keywords[agent].phrases.includes(phrase)) {
        vocabulary.agent_keywords[agent].phrases.push(phrase);
      }
    });
    
    vocabulary.updated_at = new Date().toISOString();
    this.saveVocabulary(vocabulary);
  }
  
  private extractPhrases(input: string): string[] {
    const words = input.toLowerCase().split(/\s+/);
    const phrases: string[] = [];
    
    // Extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      if (!this.commonWords.has(words[i]) && !this.commonWords.has(words[i + 1])) {
        phrases.push(`${words[i]} ${words[i + 1]}`);
      }
    }
    
    // Extract 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      const nonCommonCount = [words[i], words[i + 1], words[i + 2]]
        .filter(w => !this.commonWords.has(w)).length;
      
      if (nonCommonCount >= 2) {
        phrases.push(phrase);
      }
    }
    
    return phrases;
  }
  
  private extractProjectTerms(input: string): void {
    const vocabulary = this.loadVocabulary();
    
    // Look for CamelCase or PascalCase (likely class/component names)
    const camelCaseTerms = input.match(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/g) || [];
    camelCaseTerms.forEach(term => {
      if (!vocabulary.project_terms.custom_entities.includes(term)) {
        vocabulary.project_terms.custom_entities.push(term);
      }
    });
    
    // Look for snake_case (likely variable/function names)
    const snakeCaseTerms = input.match(/[a-z]+(?:_[a-z]+)+/g) || [];
    snakeCaseTerms.forEach(term => {
      if (!vocabulary.project_terms.custom_entities.includes(term)) {
        vocabulary.project_terms.custom_entities.push(term);
      }
    });
    
    // Look for technical terms (containing numbers or special patterns)
    const technicalTerms = input.match(/[a-zA-Z]+\d+[a-zA-Z]*/g) || [];
    technicalTerms.forEach(term => {
      if (!vocabulary.project_terms.domain_terms.includes(term)) {
        vocabulary.project_terms.domain_terms.push(term);
      }
    });
    
    this.saveVocabulary(vocabulary);
  }
  
  private updateMemory(
    input: string,
    agent: string,
    keywords: string[]
  ): void {
    const memory = this.loadMemory();
    
    // Add to recent messages
    memory.recent_messages.splice(0, 0, {
      timestamp: new Date().toISOString(),
      message: input,
      agent_invoked: agent,
      keywords_matched: keywords
    });
    
    // Trim to max size
    if (memory.recent_messages.length > this.maxMemorySize) {
      memory.recent_messages = memory.recent_messages.slice(0, this.maxMemorySize);
    }
    
    // Update recent agents
    memory.recent_agents = memory.recent_agents.filter(a => a !== agent);
    memory.recent_agents.splice(0, 0, agent);
    if (memory.recent_agents.length > 5) {
      memory.recent_agents = memory.recent_agents.slice(0, 5);
    }
    
    // Detect current context/topic
    memory.current_context = this.detectContext(memory.recent_messages);
    memory.active_topic = this.detectTopic(input);
    
    this.saveMemory(memory);
  }
  
  private detectContext(messages: any[]): string {
    // Simple context detection based on recent activity
    const recentAgents = messages.slice(0, 3).map(m => m.agent_invoked);
    
    if (recentAgents.every(a => a === recentAgents[0])) {
      return `focused-${recentAgents[0]}`;
    }
    
    if (recentAgents.includes('backend-system-architect') && 
        recentAgents.includes('frontend-ui-developer')) {
      return 'full-stack-development';
    }
    
    if (recentAgents.includes('studio-coach')) {
      return 'orchestration';
    }
    
    return 'general';
  }
  
  private detectTopic(input: string): string {
    // Simple topic detection
    const topics = {
      'authentication': ['auth', 'login', 'signin', 'register', 'password', 'token'],
      'database': ['database', 'table', 'schema', 'migration', 'query'],
      'api': ['api', 'endpoint', 'rest', 'graphql', 'request', 'response'],
      'ui': ['component', 'button', 'form', 'layout', 'style', 'css'],
      'testing': ['test', 'spec', 'jest', 'cypress', 'unit', 'integration'],
      'deployment': ['deploy', 'build', 'docker', 'kubernetes', 'ci', 'cd']
    };
    
    const lowercaseInput = input.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }
  
  private learnPattern(input: string, agent: string): void {
    const vocabulary = this.loadVocabulary();
    
    // Check if this pattern exists
    const pattern = this.normalizePattern(input);
    const existingPattern = vocabulary.intent_patterns.find(p => 
      this.patternsMatch(p.patterns[0], pattern)
    );
    
    if (existingPattern) {
      // Increase confidence if same agent
      if (existingPattern.agent === agent) {
        existingPattern.confidence = Math.min(1, existingPattern.confidence + 0.1);
      } else {
        // Decrease confidence if different agent
        existingPattern.confidence = Math.max(0, existingPattern.confidence - 0.1);
      }
      
      // Add pattern variation
      if (!existingPattern.patterns.includes(pattern)) {
        existingPattern.patterns.push(pattern);
      }
    } else {
      // Add new pattern
      vocabulary.intent_patterns.push({
        intent: this.detectIntent(input),
        patterns: [pattern],
        agent: agent,
        confidence: 0.5
      });
    }
    
    this.saveVocabulary(vocabulary);
  }
  
  private normalizePattern(input: string): string {
    // Replace specific terms with placeholders
    return input.toLowerCase()
      .replace(/['"]/g, '')
      .replace(/\b\d+\b/g, 'NUMBER')
      .replace(/\b[A-Z][a-zA-Z]+\b/g, 'ENTITY')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private patternsMatch(pattern1: string, pattern2: string): boolean {
    // Simple pattern matching - could be enhanced with better algorithms
    const words1 = pattern1.split(' ');
    const words2 = pattern2.split(' ');
    
    if (Math.abs(words1.length - words2.length) > 2) {
      return false;
    }
    
    let matches = 0;
    const minLength = Math.min(words1.length, words2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (words1[i] === words2[i] || 
          words1[i] === 'ENTITY' || words2[i] === 'ENTITY' ||
          words1[i] === 'NUMBER' || words2[i] === 'NUMBER') {
        matches++;
      }
    }
    
    return matches / minLength > 0.6;
  }
  
  private detectIntent(input: string): string {
    const intents = {
      'create': ['create', 'make', 'build', 'generate', 'new'],
      'update': ['update', 'modify', 'change', 'edit', 'alter'],
      'fix': ['fix', 'repair', 'debug', 'solve', 'resolve'],
      'add': ['add', 'include', 'append', 'insert'],
      'remove': ['remove', 'delete', 'drop', 'eliminate'],
      'refactor': ['refactor', 'improve', 'optimize', 'clean'],
      'test': ['test', 'verify', 'check', 'validate'],
      'deploy': ['deploy', 'publish', 'release', 'ship']
    };
    
    const lowercaseInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }
  
  async disambiguate(
    input: string,
    possibleAgents: string[]
  ): Promise<{ agent: string; confidence: number } | { needsClarification: true; options: string[] }> {
    const memory = this.loadMemory();
    const vocabulary = this.loadVocabulary();
    
    // Check recent context
    if (memory.recent_agents.length > 0) {
      const recentAgent = memory.recent_agents[0];
      if (possibleAgents.includes(recentAgent)) {
        // Prefer recently used agent for continuity
        return { agent: recentAgent, confidence: 0.8 };
      }
    }
    
    // Check learned patterns
    const pattern = this.normalizePattern(input);
    const matchingPatterns = vocabulary.intent_patterns.filter(p =>
      this.patternsMatch(p.patterns[0], pattern) &&
      possibleAgents.includes(p.agent)
    );
    
    if (matchingPatterns.length > 0) {
      // Sort by confidence
      matchingPatterns.sort((a, b) => b.confidence - a.confidence);
      
      if (matchingPatterns[0].confidence >= this.confidenceThreshold) {
        return {
          agent: matchingPatterns[0].agent,
          confidence: matchingPatterns[0].confidence
        };
      }
    }
    
    // Check disambiguation rules
    const rules = vocabulary.disambiguation_rules.filter(r =>
      input.toLowerCase().includes(r.pattern.toLowerCase()) &&
      possibleAgents.includes(r.preferred_agent)
    );
    
    if (rules.length > 0) {
      rules.sort((a, b) => b.confidence - a.confidence);
      
      if (rules[0].confidence >= this.confidenceThreshold) {
        return {
          agent: rules[0].preferred_agent,
          confidence: rules[0].confidence
        };
      }
    }
    
    // Need clarification
    return {
      needsClarification: true,
      options: possibleAgents
    };
  }
  
  recordDisambiguation(
    pattern: string,
    chosenAgent: string,
    options: string[]
  ): void {
    const vocabulary = this.loadVocabulary();
    
    // Find or create rule
    let rule = vocabulary.disambiguation_rules.find(r =>
      r.pattern === pattern && r.preferred_agent === chosenAgent
    );
    
    if (rule) {
      // Increase confidence
      rule.confidence = Math.min(1, rule.confidence + 0.1);
      rule.examples.push(pattern);
    } else {
      // Create new rule
      vocabulary.disambiguation_rules.push({
        pattern: this.extractKeyPattern(pattern),
        preferred_agent: chosenAgent,
        confidence: 0.6,
        examples: [pattern]
      });
    }
    
    this.saveVocabulary(vocabulary);
  }
  
  private extractKeyPattern(input: string): string {
    // Extract the most significant part of the input for pattern matching
    const words = input.toLowerCase().split(/\s+/);
    const significantWords = words.filter(w => 
      !this.commonWords.has(w) && w.length > 3
    );
    
    if (significantWords.length > 0) {
      return significantWords.slice(0, 3).join(' ');
    }
    
    return words.slice(0, 5).join(' ');
  }
  
  getEnhancedKeywords(agent: string): string[] {
    const vocabulary = this.loadVocabulary();
    const baseKeywords = this.loadBaseKeywords(agent);
    
    const learned = vocabulary.agent_keywords[agent];
    if (!learned) {
      return baseKeywords;
    }
    
    // Combine base and learned keywords
    const combined = new Set([
      ...baseKeywords,
      ...learned.keywords,
      ...learned.phrases
    ]);
    
    return Array.from(combined);
  }
  
  private loadBaseKeywords(agent: string): string[] {
    // Load from context-triggers.md
    try {
      const triggersPath = '.claude/context-triggers.md';
      if (existsSync(triggersPath)) {
        const content = readFileSync(triggersPath, 'utf-8');
        // Parse and extract keywords for specific agent
        // This is simplified - actual implementation would parse the markdown
        return [];
      }
    } catch {
      return [];
    }
    
    return [];
  }
  
  private loadVocabulary(): LearnedVocabulary {
    try {
      const content = readFileSync(this.vocabularyFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      this.ensureFiles();
      return this.loadVocabulary();
    }
  }
  
  private saveVocabulary(vocabulary: LearnedVocabulary): void {
    vocabulary.updated_at = new Date().toISOString();
    writeFileSync(this.vocabularyFile, JSON.stringify(vocabulary, null, 2));
  }
  
  private loadMemory(): ConversationMemory {
    try {
      const content = readFileSync(this.memoryFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      this.ensureFiles();
      return this.loadMemory();
    }
  }
  
  private saveMemory(memory: ConversationMemory): void {
    writeFileSync(this.memoryFile, JSON.stringify(memory, null, 2));
  }
}
```

#### Step 2: Integrate with Agent Selection
Update the agent selection logic to use enhanced NLU:

```typescript
// In the agent selector/orchestrator
import { VocabularyLearner } from './vocabulary-learner.js';

async function selectAgent(userInput: string): Promise<string> {
  const learner = new VocabularyLearner();
  
  // Get all possible agents based on keywords
  const possibleAgents = await detectAgentsByKeywords(userInput);
  
  if (possibleAgents.length === 0) {
    // No matches - use Studio Coach as default
    return 'studio-coach';
  }
  
  if (possibleAgents.length === 1) {
    // Single match - use it and learn
    const agent = possibleAgents[0];
    learner.learnFromInteraction(userInput, agent, []);
    return agent;
  }
  
  // Multiple matches - disambiguate
  const result = await learner.disambiguate(userInput, possibleAgents);
  
  if ('needsClarification' in result) {
    // Ask user for clarification
    const choice = await promptUser(
      `Which aspect would you like help with? ${result.options.join(' or ')}?`
    );
    
    // Record the disambiguation for learning
    learner.recordDisambiguation(userInput, choice, result.options);
    learner.learnFromInteraction(userInput, choice, []);
    
    return choice;
  }
  
  // Use the disambiguated result
  learner.learnFromInteraction(userInput, result.agent, []);
  return result.agent;
}
```

---

## Implementation Roadmap

### Phase 1: Structured Context (Week 1)
1. **Day 1-2**: Implement context types and manager
2. **Day 3-4**: Update agent installation process
3. **Day 5**: Test with all agents
4. **Day 6-7**: Documentation and examples

### Phase 2: Enhanced NLU (Week 2)
1. **Day 1-2**: Implement vocabulary learner
2. **Day 3-4**: Integrate with agent selection
3. **Day 5**: Add disambiguation UI
4. **Day 6-7**: Test learning algorithms

### Phase 3: Session Persistence (Week 3)
1. **Day 1-2**: Implement session manager
2. **Day 3-4**: Add checkpoint system
3. **Day 5**: Integrate with CLI startup
4. **Day 6-7**: Test session recovery

---

## Testing Strategy

### Unit Tests
```typescript
// Test context manager
describe('ContextManager', () => {
  it('should initialize context correctly', () => {});
  it('should handle concurrent writes safely', () => {});
  it('should recover from corrupted files', () => {});
});

// Test vocabulary learner
describe('VocabularyLearner', () => {
  it('should learn new keywords', () => {});
  it('should disambiguate correctly', () => {});
  it('should ignore common words', () => {});
});

// Test session manager
describe('SessionManager', () => {
  it('should create checkpoints', () => {});
  it('should restore sessions', () => {});
  it('should clean old checkpoints', () => {});
});
```

### Integration Tests
1. **Multi-agent coordination with structured context**
2. **Session recovery after crash**
3. **Vocabulary learning over multiple interactions**
4. **Disambiguation in ambiguous scenarios**

### Performance Tests
1. **Context file size limits**
2. **Checkpoint creation speed**
3. **Vocabulary lookup performance**
4. **Memory usage with large sessions**

---

## Migration Guide

### For Existing Users

#### Step 1: Backup Current Setup
```bash
cp -r .claude .claude.backup
cp .mcp.json .mcp.json.backup
```

#### Step 2: Update Package
```bash
npm update ai-agent-hub
# or
npx ai-agent-hub@latest --mode squad
```

#### Step 3: Initialize New Features
```bash
# The new features initialize automatically
# First run will create:
# - .claude/context/ directory
# - .claude/sessions/ directory
# - Enhanced context-triggers.md
```

#### Step 4: Verify Installation
```bash
ls -la .claude/context/
# Should see: shared-context.json

ls -la .claude/sessions/
# Should see: current-session.json (after first use)
```

### For New Users
Everything works automatically! Just run:
```bash
npx ai-agent-hub --mode auto
```

The enhancements activate seamlessly without configuration.

---

## Appendix: Configuration Options

While the system works with zero configuration, advanced users can customize:

### Context Manager Settings
```json
{
  "context": {
    "auto_save_interval": 300000,
    "max_context_size": 1048576,
    "compression": false
  }
}
```

### Session Manager Settings
```json
{
  "sessions": {
    "max_checkpoints": 10,
    "auto_archive_after": 604800000,
    "checkpoint_interval": 300000
  }
}
```

### Vocabulary Learner Settings
```json
{
  "vocabulary": {
    "confidence_threshold": 0.7,
    "max_memory_size": 20,
    "learning_rate": 0.1
  }
}
```

---

## Conclusion

These three enhancements maintain AI Agent Hub's philosophy of simplicity while dramatically improving context preservation and natural language understanding. The implementations are:

1. **Backward Compatible**: Existing setups continue working
2. **Zero Configuration**: Features activate automatically
3. **Progressive Enhancement**: System gets smarter with use
4. **Maintainable**: Clean, modular code following project standards

### ✅ All Enhancements Completed!

**Enhancement 1: Structured Context Files (Sep 10, 2025)**
- ✅ Type definitions created (`lib/context/types.ts`)
- ✅ Context Manager implemented (`lib/context/context-manager.ts`)
- ✅ Auto-initialization added to installer
- ✅ Modularized installer for better maintainability
- ✅ Tested in both Classic and Squad modes
- ✅ Zero-configuration - works automatically

**Enhancement 2: Context Persistence (Sep 13, 2025)**
- ✅ SessionPersistence class created (`lib/context/session-persistence.ts`)
- ✅ Integrated with installer for automatic session display
- ✅ Tracks project name, last agent, tasks completed
- ✅ Shows session summary on every run
- ✅ Simplified implementation (no complex state management)
- ✅ Zero-configuration - works automatically

**Enhancement 3: Enhanced Natural Language (Sep 15, 2025)**
- ✅ VocabularyLearning class created (`lib/context/vocabulary-learning.ts`)
- ✅ Learns project-specific keywords automatically
- ✅ Tracks recent agents for context continuity
- ✅ Shows learning status on startup
- ✅ Simple word frequency tracking (no complex ML)
- ✅ Zero-configuration - works automatically

**Final Statistics:**
- **Lines of Code Added**: ~712 total (context + session + vocabulary + modularization)
- **Dependencies Added**: 0 (maintained zero-dependency philosophy)
- **Time Taken**: 4 hours total (vs 9-12 hours estimated)
- **Complexity**: Minimal - just 3 JSON files in `.claude/context/`
- **Files Created**: 7 new modules, all under 200 lines each

### 📈 Final Impact

All 3 enhancements are now complete:
- ✅ Agents can share complex data structures (Enhancement 1)
- ✅ No more text parsing errors (Enhancement 1)
- ✅ Type-safe context sharing (Enhancement 1)
- ✅ Sessions persist between Claude invocations (Enhancement 2)
- ✅ Project context maintained automatically (Enhancement 2)
- ✅ Users see progress summary on every run (Enhancement 2)
- ✅ Agents learn project-specific vocabulary (Enhancement 3)
- ✅ Recent agents get preference for continuity (Enhancement 3)
- ✅ Keywords evolve with project usage (Enhancement 3)

The result: A smarter, more context-aware AI Agent Hub that learns and improves with every interaction.
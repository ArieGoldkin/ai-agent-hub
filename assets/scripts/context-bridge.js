#!/usr/bin/env node

/**
 * Context Bridge - Synchronizes Squad markdown files with JSON context
 * Automatically runs when project is generated via npx ai-agent-hub
 */

const fs = require('fs');
const path = require('path');

// Try to load chokidar, but handle gracefully if not available
let chokidar;
try {
  chokidar = require('chokidar');
} catch (error) {
  console.warn('⚠️  Warning: chokidar not found. File watching disabled.');
  console.log('   To enable file watching, run: npm install chokidar');
  chokidar = null;
}

class ContextBridge {
  constructor() {
    this.contextPath = path.join(process.cwd(), '.claude/context/shared-context.json');
    this.squadPath = path.join(process.cwd(), '.squad/sessions');
    this.lockFile = path.join(process.cwd(), '.claude/context/.lock');
    this.isWatching = false;
  }

  /**
   * Initialize the context bridge
   */
  async init() {
    console.log('🌉 Context Bridge: Initializing Squad-to-Context synchronization...');

    // Ensure directories exist
    this.ensureDirectories();

    // Initial sync
    await this.syncSquadToContext();

    // Start watching for changes
    if (!process.env.CI && !process.env.NO_WATCH) {
      this.startWatching();
    }
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [
      path.dirname(this.contextPath),
      this.squadPath
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Acquire lock for context file operations
   */
  async acquireLock(retries = 5) {
    for (let i = 0; i < retries; i++) {
      try {
        if (!fs.existsSync(this.lockFile)) {
          fs.writeFileSync(this.lockFile, process.pid.toString());
          return true;
        }

        // Check if lock is stale (older than 10 seconds)
        const stats = fs.statSync(this.lockFile);
        const age = Date.now() - stats.mtimeMs;
        if (age > 10000) {
          fs.unlinkSync(this.lockFile);
          fs.writeFileSync(this.lockFile, process.pid.toString());
          return true;
        }

        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, i)));
      } catch (error) {
        console.warn(`⚠️ Lock acquisition attempt ${i + 1} failed:`, error.message);
      }
    }
    return false;
  }

  /**
   * Release lock
   */
  releaseLock() {
    try {
      if (fs.existsSync(this.lockFile)) {
        const pid = fs.readFileSync(this.lockFile, 'utf8');
        if (pid === process.pid.toString()) {
          fs.unlinkSync(this.lockFile);
        }
      }
    } catch (error) {
      // Silent fail - lock cleanup is best effort
    }
  }

  /**
   * Load context with proper locking
   */
  async loadContext() {
    if (!await this.acquireLock()) {
      throw new Error('Could not acquire context lock');
    }

    try {
      if (!fs.existsSync(this.contextPath)) {
        const defaultContext = {
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          session_id: `session-${Date.now()}`,
          mode: fs.existsSync(this.squadPath) ? "squad" : "classic",
          agent_decisions: {},
          tasks_completed: [],
          tasks_pending: [],
          codebase_patterns: {},
          squad_sync: {
            last_sync: null,
            synced_files: []
          }
        };
        fs.writeFileSync(this.contextPath, JSON.stringify(defaultContext, null, 2));
        return defaultContext;
      }

      return JSON.parse(fs.readFileSync(this.contextPath, 'utf8'));
    } finally {
      this.releaseLock();
    }
  }

  /**
   * Save context with proper locking
   */
  async saveContext(context) {
    if (!await this.acquireLock()) {
      throw new Error('Could not acquire context lock');
    }

    try {
      context.timestamp = new Date().toISOString();
      fs.writeFileSync(this.contextPath, JSON.stringify(context, null, 2));
    } finally {
      this.releaseLock();
    }
  }

  /**
   * Parse Squad markdown file for decisions
   */
  parseSquadMarkdown(content, filename) {
    const decisions = [];
    const lines = content.split('\n');

    // Extract agent name from filename (e.g., role-comm-frontend-ui-developer.md)
    const agentMatch = filename.match(/role-comm-(.+)\.md$/);
    const agentName = agentMatch ? agentMatch[1] : 'unknown';

    let currentSection = null;
    let currentDecision = null;

    for (const line of lines) {
      // Look for decision markers
      if (line.includes('## Decision:') || line.includes('## Action:')) {
        if (currentDecision) {
          decisions.push(currentDecision);
        }
        currentDecision = {
          timestamp: new Date().toISOString(),
          decision: line.replace(/##\s*(Decision|Action):?\s*/i, '').trim(),
          rationale: '',
          impact: ''
        };
      } else if (line.includes('## Rationale:') || line.includes('## Reasoning:')) {
        currentSection = 'rationale';
      } else if (line.includes('## Impact:') || line.includes('## Outcome:')) {
        currentSection = 'impact';
      } else if (currentDecision && currentSection && line.trim()) {
        // Add content to current section
        if (currentSection === 'rationale') {
          currentDecision.rationale += (currentDecision.rationale ? '\n' : '') + line.trim();
        } else if (currentSection === 'impact') {
          currentDecision.impact += (currentDecision.impact ? '\n' : '') + line.trim();
        }
      }

      // Also look for task completions
      if (line.includes('✅') || line.includes('[x]') || line.includes('COMPLETE')) {
        const taskMatch = line.match(/(?:✅|\[x\]|COMPLETE[D]?):?\s*(.+)/i);
        if (taskMatch) {
          decisions.push({
            timestamp: new Date().toISOString(),
            decision: `Completed: ${taskMatch[1].trim()}`,
            rationale: 'Task marked as complete in Squad communication',
            impact: 'Task removed from pending list'
          });
        }
      }
    }

    if (currentDecision) {
      decisions.push(currentDecision);
    }

    return { agentName, decisions };
  }

  /**
   * Sync Squad files to context
   */
  async syncSquadToContext() {
    try {
      let context = await this.loadContext();

      if (!fs.existsSync(this.squadPath)) {
        console.log('📋 No Squad directory found - running in Classic mode');
        return;
      }

      const squadFiles = fs.readdirSync(this.squadPath)
        .filter(f => f.startsWith('role-comm-') && f.endsWith('.md'));

      let updatedCount = 0;

      for (const file of squadFiles) {
        const filepath = path.join(this.squadPath, file);
        const content = fs.readFileSync(filepath, 'utf8');
        const { agentName, decisions } = this.parseSquadMarkdown(content, file);

        if (decisions.length > 0) {
          // Merge decisions (avoid duplicates based on content)
          if (!context.agent_decisions[agentName]) {
            context.agent_decisions[agentName] = [];
          }

          const existingDecisions = context.agent_decisions[agentName]
            .map(d => d.decision);

          const newDecisions = decisions.filter(d =>
            !existingDecisions.includes(d.decision)
          );

          if (newDecisions.length > 0) {
            context.agent_decisions[agentName].push(...newDecisions);
            updatedCount += newDecisions.length;
          }
        }

        // Track synced files
        if (!context.squad_sync.synced_files.includes(file)) {
          context.squad_sync.synced_files.push(file);
        }
      }

      if (updatedCount > 0) {
        context.squad_sync.last_sync = new Date().toISOString();

        // Detect patterns from updated context
        context = await this.detectPatterns(context);

        await this.saveContext(context);
        console.log(`✅ Synced ${updatedCount} new decisions from Squad to Context`);
      }

    } catch (error) {
      console.error('❌ Error syncing Squad to Context:', error.message);
    }
  }

  /**
   * Start watching Squad files for changes
   */
  startWatching() {
    if (this.isWatching) return;

    // Skip if chokidar is not available
    if (!chokidar) {
      console.log('⏭️  Skipping file watching (chokidar not installed)');
      return;
    }

    console.log('👀 Watching Squad files for changes...');

    const watcher = chokidar.watch(path.join(this.squadPath, 'role-comm-*.md'), {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
      }
    });

    watcher
      .on('add', (filepath) => {
        console.log(`📝 New Squad file: ${path.basename(filepath)}`);
        this.syncSquadToContext();
      })
      .on('change', (filepath) => {
        console.log(`📝 Squad file updated: ${path.basename(filepath)}`);
        this.syncSquadToContext();
      })
      .on('error', error => {
        console.error('❌ Watcher error:', error);
      });

    this.isWatching = true;

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Context Bridge...');
      watcher.close();
      this.releaseLock();
      process.exit(0);
    });
  }

  /**
   * Detect codebase patterns from completed tasks and decisions
   */
  async detectPatterns(context) {
    const patterns = {
      component_style: null,
      state_management: null,
      api_pattern: null,
      testing_framework: null,
      styling: null,
      build_tool: null,
      package_manager: null
    };

    // Combine all sources of information
    const allDecisions = context.agent_decisions
      ? Object.values(context.agent_decisions).flat()
      : [];

    const allArtifacts = context.tasks_completed
      .flatMap(task => task.artifacts || []);

    const decisionText = allDecisions
      .map(d => `${d.decision} ${d.rationale || ''}`)
      .join(' ')
      .toLowerCase();

    // Detect component style
    const componentPatterns = {
      'functional': ['hook', 'usestate', 'useeffect', 'functional component', 'arrow function'],
      'class': ['class component', 'extends component', 'componentdidmount', 'this.state']
    };

    for (const [style, keywords] of Object.entries(componentPatterns)) {
      if (keywords.some(kw => decisionText.includes(kw))) {
        patterns.component_style = style;
        break;
      }
    }

    // Detect state management
    const stateKeywords = {
      'redux': ['redux', 'store', 'reducer', 'dispatch', 'action', 'thunk'],
      'context': ['context', 'provider', 'usecontext', 'createcontext'],
      'zustand': ['zustand', 'create', 'usestore'],
      'mobx': ['mobx', 'observable', 'observer', 'makeobservable'],
      'recoil': ['recoil', 'atom', 'selector', 'useRecoilState'],
      'jotai': ['jotai', 'atom', 'useAtom']
    };

    for (const [lib, keywords] of Object.entries(stateKeywords)) {
      const score = keywords.filter(kw => decisionText.includes(kw)).length;
      if (score >= 2) {
        patterns.state_management = lib;
        break;
      }
    }

    // Detect API patterns
    const apiPatterns = {
      'REST': ['rest', 'restful', 'get', 'post', 'put', 'delete', 'fetch', 'axios'],
      'GraphQL': ['graphql', 'query', 'mutation', 'apollo', 'resolver', 'schema'],
      'tRPC': ['trpc', 'procedure', 'router', 'createtrpcclient'],
      'WebSocket': ['websocket', 'socket.io', 'ws', 'realtime', 'emit']
    };

    for (const [pattern, keywords] of Object.entries(apiPatterns)) {
      const score = keywords.filter(kw => decisionText.includes(kw)).length;
      if (score >= 2) {
        patterns.api_pattern = pattern;
        break;
      }
    }

    // Detect testing framework
    const testFrameworks = {
      'jest': ['jest', 'describe', 'it(', 'expect', 'tomatchsnapshot'],
      'vitest': ['vitest', 'vi.', 'import.meta.vitest'],
      'mocha': ['mocha', 'describe', 'it(', 'chai', 'should'],
      'cypress': ['cypress', 'cy.', 'e2e', 'integration test'],
      'playwright': ['playwright', 'page.', 'browser.', 'locator']
    };

    for (const [framework, keywords] of Object.entries(testFrameworks)) {
      if (keywords.some(kw => decisionText.includes(kw))) {
        patterns.testing_framework = framework;
        break;
      }
    }

    // Detect styling approach
    const stylingApproaches = {
      'tailwind': ['tailwind', 'tw-', 'className="flex', 'className="grid'],
      'styled-components': ['styled-components', 'styled.', 'css`', 'styled('],
      'css-modules': ['.module.css', '.module.scss', 'styles.', 'classes.'],
      'emotion': ['emotion', '@emotion', 'css={', 'styled.'],
      'sass': ['sass', 'scss', '.scss', '@import', '@mixin']
    };

    for (const [approach, keywords] of Object.entries(stylingApproaches)) {
      if (keywords.some(kw => decisionText.includes(kw) ||
        allArtifacts.some(f => f.includes(kw)))) {
        patterns.styling = approach;
        break;
      }
    }

    // Detect build tool
    const buildTools = {
      'vite': ['vite', 'vite.config', 'vitejs'],
      'webpack': ['webpack', 'webpack.config', 'webpackdevserver'],
      'next': ['next.js', 'nextjs', 'next.config', 'getserversideprops'],
      'create-react-app': ['create-react-app', 'cra', 'react-scripts'],
      'parcel': ['parcel', 'parcel-bundler'],
      'rollup': ['rollup', 'rollup.config']
    };

    for (const [tool, keywords] of Object.entries(buildTools)) {
      if (keywords.some(kw => decisionText.includes(kw) ||
        allArtifacts.some(f => f.includes(kw)))) {
        patterns.build_tool = tool;
        break;
      }
    }

    // Detect package manager
    if (decisionText.includes('pnpm') || allArtifacts.some(f => f.includes('pnpm-lock'))) {
      patterns.package_manager = 'pnpm';
    } else if (decisionText.includes('yarn') || allArtifacts.some(f => f.includes('yarn.lock'))) {
      patterns.package_manager = 'yarn';
    } else if (decisionText.includes('npm') || allArtifacts.some(f => f.includes('package-lock'))) {
      patterns.package_manager = 'npm';
    } else if (decisionText.includes('bun')) {
      patterns.package_manager = 'bun';
    }

    // Only update non-null patterns
    const detectedPatterns = Object.entries(patterns)
      .filter(([_, value]) => value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (Object.keys(detectedPatterns).length > 0) {
      context.codebase_patterns = { ...context.codebase_patterns, ...detectedPatterns };
      console.log('🔍 Detected patterns:', detectedPatterns);
    }

    return context;
  }
}

// Auto-run if executed directly
if (require.main === module) {
  const bridge = new ContextBridge();
  bridge.init().catch(console.error);
}

module.exports = ContextBridge;
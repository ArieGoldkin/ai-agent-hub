/**
 * Context Bridge Initialization
 * Copies and sets up the context bridge for Squad mode projects
 */

import fs from 'fs';
import path from 'path';

/**
 * Initialize the context bridge for Squad mode
 */
export async function initializeContextBridge(__dirname: string): Promise<void> {
  try {
    // Source path for the context bridge script
    const sourcePath = path.join(__dirname, '../../assets/scripts/context-bridge.js');

    // Target path in the current project
    const targetDir = path.join(process.cwd(), '.claude/scripts');
    const targetPath = path.join(targetDir, 'context-bridge.js');

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy the context bridge script
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);

      // Make the script executable
      fs.chmodSync(targetPath, '755');

      console.log('   ✅ Context bridge installed');

      // Add package.json script entry if not present
      await updatePackageJsonScripts();

      // Create initial context file if it doesn't exist
      await ensureContextFile();

      console.log('   ✅ Context synchronization enabled');
    } else {
      console.warn('   ⚠️  Context bridge script not found in assets');
    }
  } catch (error) {
    console.error('   ❌ Failed to initialize context bridge:', error);
  }
}

/**
 * Update package.json with context bridge scripts
 */
async function updatePackageJsonScripts(): Promise<void> {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    // Create a minimal package.json if it doesn't exist
    const minimalPackageJson = {
      name: 'ai-agent-project',
      version: '1.0.0',
      private: true,
      scripts: {
        'context:sync': 'node .claude/scripts/context-bridge.js',
        'context:watch': 'node .claude/scripts/context-bridge.js --watch'
      },
      dependencies: {
        'chokidar': '^3.6.0'
      }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(minimalPackageJson, null, 2));
    console.log('   ✅ Created package.json with context scripts');
  } else {
    // Update existing package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Add dependencies if they don't exist
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    if (!packageJson.dependencies.chokidar) {
      packageJson.dependencies.chokidar = '^3.6.0';
    }

    // Add context scripts if they don't exist
    if (!packageJson.scripts['context:sync']) {
      packageJson.scripts['context:sync'] = 'node .claude/scripts/context-bridge.js';
      packageJson.scripts['context:watch'] = 'node .claude/scripts/context-bridge.js --watch';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('   ✅ Added context scripts to package.json');
    }
  }
}

/**
 * Ensure the context file exists with proper structure
 */
async function ensureContextFile(): Promise<void> {
  const contextPath = path.join(process.cwd(), '.claude/context/shared-context.json');
  const contextDir = path.dirname(contextPath);

  // Ensure directory exists
  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  // Create context file if it doesn't exist
  if (!fs.existsSync(contextPath)) {
    const initialContext = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      session_id: `session-${Date.now()}`,
      mode: 'squad',
      agent_decisions: {},
      tasks_completed: [],
      tasks_pending: [],
      codebase_patterns: {},
      squad_sync: {
        last_sync: null,
        synced_files: []
      }
    };

    fs.writeFileSync(contextPath, JSON.stringify(initialContext, null, 2));
    console.log('   ✅ Initialized shared context file');
  }
}
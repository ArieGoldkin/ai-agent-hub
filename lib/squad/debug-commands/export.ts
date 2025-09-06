import * as fs from 'fs/promises';
import * as path from 'path';
import { DebugSession, AgentStatus } from '../debug-mode/types.js';

export class SessionExport {
  async exportSession(
    session: DebugSession,
    sessionId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<void> {
    const exportPath = path.join(session.config.debugDir, `export.${format}`);

    if (format === 'json') {
      await fs.writeFile(exportPath, JSON.stringify(session, null, 2));
    } else {
      let csv = 'timestamp,agent,operation,file,success,duration\n';
      for (const op of session.fileOperations) {
        csv += `${op.timestamp},${op.agentId},${op.operation},${op.filepath},${op.success},${op.duration}\n`;
      }
      await fs.writeFile(exportPath, csv);
    }

    console.log(`✅ Session exported to: ${exportPath}`);
  }

  async saveSnapshot(session: DebugSession, label?: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotName = label ? `snapshot-${label}-${timestamp}` : `snapshot-${timestamp}`;
    const snapshotPath = path.join(session.config.debugDir, `${snapshotName}.json`);

    const snapshot = {
      timestamp: new Date(),
      label,
      session: {
        ...session,
        agents: Array.from(session.agents.entries())
      }
    };

    await fs.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));
    console.log(`✅ Snapshot saved: ${snapshotPath}`);
  }

  async compareOutcomes(
    session: DebugSession,
    sessionId: string,
    expectedFile: string
  ): Promise<void> {
    const expected = JSON.parse(await fs.readFile(expectedFile, 'utf-8'));
    
    console.log('\n🔍 Outcome Comparison');
    console.log('─'.repeat(50));

    const actualAgents = Array.from(session.agents.values());
    const expectedAgents = expected.agents || [];

    console.log('\nAgent Completions:');
    for (const expectedAgent of expectedAgents) {
      const actual = actualAgents.find((a: AgentStatus) => a.id === expectedAgent.id);
      if (!actual) {
        console.log(`  ❌ ${expectedAgent.id}: Missing`);
      } else if (actual.status !== expectedAgent.expectedStatus) {
        console.log(`  ❌ ${expectedAgent.id}: Expected ${expectedAgent.expectedStatus}, got ${actual.status}`);
      } else {
        console.log(`  ✅ ${expectedAgent.id}: Matched`);
      }
    }

    if (expected.files) {
      console.log('\nFile Modifications:');
      for (const expectedFile of expected.files) {
        const ops = session.fileOperations
          .filter(op => op.filepath === expectedFile.path && op.operation === 'write');
        
        if (ops.length === 0) {
          console.log(`  ❌ ${expectedFile.path}: Not modified`);
        } else {
          const lastOp = ops[ops.length - 1];
          if (expectedFile.hash && lastOp.afterHash !== expectedFile.hash) {
            console.log(`  ❌ ${expectedFile.path}: Hash mismatch`);
          } else {
            console.log(`  ✅ ${expectedFile.path}: Modified as expected`);
          }
        }
      }
    }
  }

  async listSessions(): Promise<string[]> {
    try {
      const debugDir = '.squad/debug';
      const entries = await fs.readdir(debugDir);
      return entries.filter(e => e.match(/^\d{4}-\d{2}-\d{2}/));
    } catch {
      return [];
    }
  }
}
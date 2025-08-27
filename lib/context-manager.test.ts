/**
 * Context Manager Tests
 * 
 * Simple test suite for the context management system.
 * Run with: node dist/lib/context-manager.test.js
 */

import { ContextManager } from "./context-manager.js";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const testDir = join(tmpdir(), `context-test-${randomUUID()}`);

/**
 * Test runner
 */
async function runTests() {
  console.log("Running Context Manager Tests...\n");
  
  let passed = 0;
  let failed = 0;

  const tests = [
    testInitSession,
    testAddAgentContext,
    testGetContextForAgent,
    testMultipleAgents,
    testDecisionHistory,
    testClearSession,
    testPersistence,
  ];

  for (const test of tests) {
    try {
      await test();
      console.log(`✓ ${test.name}`);
      passed++;
    } catch (error) {
      console.error(`✗ ${test.name}: ${error}`);
      failed++;
    }
  }

  cleanup();
  
  console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

/**
 * Test session initialization
 */
async function testInitSession() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-1");
  
  const context = await manager.getContext();
  if (!context || context.sessionId !== "test-session-1") {
    throw new Error("Session not initialized properly");
  }
}

/**
 * Test adding agent context
 */
async function testAddAgentContext() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-2");
  
  await manager.addAgentContext("test-agent", {
    context: {
      summary: "Test context",
      findings: ["Finding 1", "Finding 2"],
      recommendations: ["Recommendation 1"],
    },
    confidence: 0.85,
  });
  
  const context = await manager.getContext();
  if (!context || !context.agents.has("test-agent")) {
    throw new Error("Agent context not added");
  }
  
  const agentContexts = context.agents.get("test-agent");
  if (!agentContexts || agentContexts.length !== 1) {
    throw new Error("Agent context not stored correctly");
  }
  
  if (agentContexts[0].context.summary !== "Test context") {
    throw new Error("Agent context data mismatch");
  }
}

/**
 * Test retrieving context for specific agent
 */
async function testGetContextForAgent() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-3");
  
  await manager.addAgentContext("agent-1", {
    context: { summary: "Context 1" },
  });
  
  await manager.addAgentContext("agent-1", {
    context: { summary: "Context 2" },
  });
  
  const agentContexts = await manager.getContextForAgent("agent-1");
  
  if (agentContexts.length !== 2) {
    throw new Error(`Expected 2 contexts, got ${agentContexts.length}`);
  }
  
  if (agentContexts[1].context.summary !== "Context 2") {
    throw new Error("Context retrieval order incorrect");
  }
}

/**
 * Test multiple agents sharing context
 */
async function testMultipleAgents() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-4");
  
  await manager.addAgentContext("agent-a", {
    context: { summary: "Agent A context" },
  });
  
  await manager.addAgentContext("agent-b", {
    context: { summary: "Agent B context" },
  });
  
  await manager.addAgentContext("agent-c", {
    context: { summary: "Agent C context" },
  });
  
  const context = await manager.getContext();
  if (!context || context.agents.size !== 3) {
    throw new Error(`Expected 3 agents, got ${context?.agents.size || 0}`);
  }
  
  const agentAContext = await manager.getContextForAgent("agent-a");
  const agentBContext = await manager.getContextForAgent("agent-b");
  
  if (agentAContext[0].context.summary === agentBContext[0].context.summary) {
    throw new Error("Agent contexts are not isolated");
  }
}

/**
 * Test decision history tracking
 */
async function testDecisionHistory() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-5");
  
  const decision = {
    type: 'handoff' as const,
    agentName: "agent-1",
    timestamp: new Date(),
    reason: "Specialized knowledge required",
    confidence: 0.9,
    targetAgent: "agent-2",
  };
  
  await manager.addDecision(decision);
  
  const history = await manager.getDecisionHistory();
  if (history.length !== 1) {
    throw new Error("Decision not recorded");
  }
  
  if (history[0].targetAgent !== "agent-2") {
    throw new Error("Decision data mismatch");
  }
}

/**
 * Test session clearing
 */
async function testClearSession() {
  const manager = new ContextManager(testDir);
  await manager.initSession("test-session-6");
  
  await manager.addAgentContext("test-agent", {
    context: { summary: "To be cleared" },
  });
  
  await manager.clearSession();
  
  const context = await manager.getContext();
  if (context !== null) {
    throw new Error("Session not cleared");
  }
}

/**
 * Test persistence across instances
 */
async function testPersistence() {
  const manager1 = new ContextManager(testDir);
  await manager1.initSession("persistent-session");
  
  await manager1.addAgentContext("persistent-agent", {
    context: {
      summary: "Persistent context",
      data: { key: "value" },
    },
  });
  
  const manager2 = new ContextManager(testDir);
  const context = await manager2.getContext();
  
  if (!context || context.sessionId !== "persistent-session") {
    throw new Error("Context not persisted");
  }
  
  const agentContexts = await manager2.getContextForAgent("persistent-agent");
  if (agentContexts[0].context.summary !== "Persistent context") {
    throw new Error("Persisted context data mismatch");
  }
}

/**
 * Clean up test directory
 */
function cleanup() {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
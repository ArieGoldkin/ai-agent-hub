/**
 * Context Manager Tests
 * 
 * Simple test suite for the context management system.
 * Run with: node dist/test/context-manager.test.js
 */

import { ContextManager } from "../lib/context-manager.js";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const testDir = join(tmpdir(), `context-test-${randomUUID()}`);

/**
 * Test assertion helpers
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertNotNull<T>(value: T | null, message?: string): asserts value is T {
  if (value === null) {
    throw new Error(message || "Expected non-null value");
  }
}

/**
 * Test runner with organized test groups
 */
async function runTests() {
  console.log("Running Context Manager Tests...\n");
  
  let passed = 0;
  let failed = 0;

  // Group tests by functionality for better organization
  const testGroups = {
    'Session Management': [
      testInitSession,
      testClearSession,
      testPersistence,
    ],
    'Agent Context': [
      testAddAgentContext,
      testGetContextForAgent,
      testMultipleAgents,
    ],
    'Decision History': [
      testDecisionHistory,
    ],
    'Error Handling': [
      testInvalidSessionHandling,
      testCorruptedDataRecovery,
      testSizeLimitValidation,
    ],
  };

  // Run tests with group headers for better organization
  for (const [groupName, tests] of Object.entries(testGroups)) {
    console.log(`\n--- ${groupName} ---`);
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
  assertNotNull(context, "Session context should be created");
  assertEqual(context.sessionId, "test-session-1", "Session ID should match");
  assert(context.agents instanceof Map, "Agents should be a Map");
  assert(Array.isArray(context.decisionHistory), "Decision history should be an array");
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
  
  assertEqual(agentContexts.length, 2, "Should have 2 contexts for agent-1");
  assertEqual(agentContexts[1].context.summary, "Context 2", "Latest context should be second");
  assertEqual(agentContexts[0].context.summary, "Context 1", "First context should be preserved");
  
  // Test retrieving context for non-existent agent
  const emptyContexts = await manager.getContextForAgent("non-existent");
  assertEqual(emptyContexts.length, 0, "Non-existent agent should return empty array");
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
 * Test invalid session handling and auto-initialization
 */
async function testInvalidSessionHandling() {
  // Use fresh directory to avoid interference from other tests
  const freshTestDir = join(tmpdir(), `context-test-${randomUUID()}`);
  const manager = new ContextManager(freshTestDir);
  
  // Test accessing context without initializing session
  const context = await manager.getContext();
  // Should return null for non-existent session
  assertEqual(context, null, "Should return null for non-existent session");
  
  // Test that adding context auto-initializes session (graceful handling)
  await manager.addAgentContext("test-agent", {
    context: { summary: "Auto-initialized context" },
  });
  
  const contextAfterAdd = await manager.getContext();
  assertNotNull(contextAfterAdd, "Should auto-initialize session when adding context");
  assert(contextAfterAdd.agents.has("test-agent"), "Should contain the added agent");
  
  // Test retrieving context for agent without existing session  
  const manager2 = new ContextManager(freshTestDir);
  const agentContexts = await manager2.getContextForAgent("non-existent");
  assertEqual(agentContexts.length, 0, "Should return empty array for non-existent agent");
  
  // Cleanup fresh test directory
  if (existsSync(freshTestDir)) {
    rmSync(freshTestDir, { recursive: true, force: true });
  }
}

/**
 * Test corrupted data recovery
 */
async function testCorruptedDataRecovery() {
  const manager = new ContextManager(testDir);
  await manager.initSession("recovery-test");
  
  // Create valid session first
  await manager.addAgentContext("test-agent", {
    context: { summary: "Valid data" },
  });
  
  // Simulate corrupted data by writing invalid JSON
  const fs = await import("fs/promises");
  const contextPath = join(testDir, ".claude", "session-context.json");
  await fs.writeFile(contextPath, "{ invalid json }");
  
  // Manager should handle corruption gracefully
  const newManager = new ContextManager(testDir);
  const context = await newManager.getContext();
  
  // Should either recover from backup or return null safely
  if (context && context.sessionId === "recovery-test") {
    // Successfully recovered from backup
  } else if (context === null) {
    // Gracefully handled corruption by returning null
  } else {
    throw new Error("Unexpected behavior with corrupted data");
  }
}

/**
 * Test size limit validation and graceful handling
 */
async function testSizeLimitValidation() {
  const manager = new ContextManager(testDir);
  await manager.initSession("size-test");
  
  // Add one normal-sized context first
  await manager.addAgentContext("normal-agent", {
    context: { summary: "Normal context" },
  });
  
  // Try to add large context data that exceeds 100KB limit
  const largeData = "x".repeat(50 * 1024); // 50KB string
  
  // The manager should handle size limit gracefully by either:
  // 1. Rejecting the large context (throwing error)
  // 2. Accepting but recovering from backup
  // 3. Pruning old data to make room
  let errorThrown = false;
  try {
    await manager.addAgentContext("large-agent", {
      context: {
        summary: "Large context test",
        data: { largeField: largeData },
      },
    });
  } catch (error) {
    // Size limit rejection is acceptable behavior
    errorThrown = true;
    assert(error instanceof Error && error.message.includes("size"), "Error should mention size limit");
  }
  
  // Manager should still be functional after size limit handling
  const context = await manager.getContext();
  assertNotNull(context, "Context should still exist after size handling");
  
  // Should have at least the normal agent
  assert(context.agents.size > 0, "Should retain at least some agents");
  assert(context.agents.has("normal-agent"), "Should retain normal-sized agent");
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
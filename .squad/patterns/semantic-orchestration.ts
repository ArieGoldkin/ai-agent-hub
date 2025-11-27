/**
 * Semantic Orchestration Patterns for Opus 4.5
 *
 * Reference implementation for extended thinking in multi-agent coordination.
 * See supervisor-rules.md for when to apply these patterns.
 *
 * @version 3.7.0
 */

import Anthropic from '@anthropic-ai/sdk';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface SemanticTaskAnalysis {
  primaryDomain: string;
  secondaryDomains: string[];
  complexityLevel: 1 | 2 | 3 | 4 | 5;
  suggestedAgents: AgentRecommendation[];
  dependencies: InferredDependency[];
  risks: IdentifiedRisk[];
}

interface AgentRecommendation {
  agent: string;
  confidence: number; // 0-1
  reasoning: string;
  suggestedModel: 'opus' | 'sonnet' | 'haiku';
}

interface SemanticConflict {
  type: 'domain_overlap' | 'data_contention' | 'timing' | 'resource' | 'logical';
  severity: 'critical' | 'high' | 'medium' | 'low';
  agents: string[];
  description: string;
  resolution: string;
}

interface DependencyResolution {
  executionOrder: string[][]; // Parallel groups in sequence
  criticalPath: string[];
  optimizations: string[];
  risks: string[];
}

// =============================================================================
// MODEL TIER CONFIGURATION
// =============================================================================

export const ORCHESTRATION_MODEL_TIERS = {
  OPUS: {
    model: 'claude-opus-4-5-20251101',
    useCases: ['task_decomposition', 'conflict_resolution', 'phase_transition', 'error_recovery', '3+_agents'],
    thinkingBudget: { min: 4000, max: 10000 }
  },
  SONNET: {
    model: 'claude-sonnet-4-5-20250929',
    useCases: ['task_allocation', 'progress_check', 'quality_gate', '1-2_agents'],
    thinkingBudget: { min: 1024, max: 4000 }
  },
  HAIKU: {
    model: 'claude-haiku-3-5-20241022',
    useCases: ['lock_check', 'status_aggregation', 'message_routing'],
    thinkingBudget: null
  }
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Analyze task semantically using extended thinking
 * Use when: Task allocation involves 3+ agents or complex requirements
 */
export async function analyzeTaskSemantics(
  task: string,
  codebaseContext: string,
  availableAgents: { name: string; capabilities: string[] }[]
): Promise<SemanticTaskAnalysis> {
  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 12000,
    thinking: { type: 'enabled', budget_tokens: 6000 },
    messages: [{
      role: 'user',
      content: `Analyze task for semantic orchestration:
Task: ${task}
Context: ${codebaseContext}
Agents: ${availableAgents.map(a => `${a.name}: ${a.capabilities.join(', ')}`).join('\n')}

Provide: primaryDomain, secondaryDomains, complexityLevel (1-5), agentRecommendations, inferredDependencies, risks`
    }]
  });

  return parseSemanticAnalysis(response);
}

/**
 * Select optimal agent with confidence scoring
 * Factors: domain match (40%), capability (30%), load (10%), history (20%)
 */
export function selectOptimalAgent(
  task: SemanticTaskAnalysis,
  agents: { name: string; primaryDomain: string; capabilities: string[]; currentLoad: number; maxLoad: number }[]
): AgentRecommendation[] {
  return agents.map(agent => {
    const domainMatch = task.primaryDomain === agent.primaryDomain ? 1 : 0.5;
    const capabilityMatch = task.suggestedAgents.find(a => a.agent === agent.name)?.confidence || 0.3;
    const loadFactor = 1 - (agent.currentLoad / agent.maxLoad);
    const confidence = domainMatch * 0.4 + capabilityMatch * 0.3 + loadFactor * 0.1 + 0.2;

    return {
      agent: agent.name,
      confidence,
      reasoning: `Domain: ${domainMatch}, Cap: ${capabilityMatch}, Load: ${loadFactor}`,
      suggestedModel: task.complexityLevel >= 4 ? 'opus' : task.complexityLevel >= 2 ? 'sonnet' : 'haiku'
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

/**
 * Detect semantic conflicts between parallel task assignments
 * Use when: Multiple agents working simultaneously
 */
export async function detectSemanticConflicts(
  assignments: { agent: string; instruction: string; files: string[] }[]
): Promise<SemanticConflict[]> {
  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 10000,
    thinking: { type: 'enabled', budget_tokens: 5000 },
    messages: [{
      role: 'user',
      content: `Analyze for conflicts:
${assignments.map(a => `Agent: ${a.agent}, Task: ${a.instruction}, Files: ${a.files.join(', ')}`).join('\n')}

Identify: domain_overlap, data_contention, timing, resource, logical conflicts with severity and resolution.`
    }]
  });

  return parseConflictAnalysis(response);
}

/**
 * Resolve dependencies including implicit ones
 * Use when: Dependencies have circular or ambiguous relationships
 */
export async function resolveDependencies(
  tasks: { id: string; description: string }[],
  explicitDeps: Map<string, string[]>,
  codebaseContext: string
): Promise<DependencyResolution> {
  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 12000,
    thinking: { type: 'enabled', budget_tokens: 8000 },
    messages: [{
      role: 'user',
      content: `Resolve dependencies:
${tasks.map(t => `${t.id}: ${t.description} (deps: ${explicitDeps.get(t.id)?.join(', ') || 'none'})`).join('\n')}
Context: ${codebaseContext}

Determine: executionOrder (parallel groups), criticalPath, optimizations, risks.`
    }]
  });

  return parseDependencyResolution(response);
}

/**
 * Evaluate if safe to transition between phases
 * Use when: Completing a workflow phase
 */
export async function evaluatePhaseTransition(
  currentPhase: string,
  completedTasks: { description: string; status: string }[],
  pendingTasks: { description: string; status: string }[]
): Promise<{ canProceed: boolean; required: string[]; deferrable: string[]; risks: string[] }> {
  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 8000,
    thinking: { type: 'enabled', budget_tokens: 4000 },
    messages: [{
      role: 'user',
      content: `Evaluate phase transition from ${currentPhase}:
Completed: ${completedTasks.map(t => t.description).join(', ')}
Pending: ${pendingTasks.map(t => t.description).join(', ')}

Determine: canProceed, requiredTasks, deferrableTasks, risks.`
    }]
  });

  return parseTransitionDecision(response);
}

/**
 * Select model tier based on operation type and context
 */
export function selectOrchestrationModel(
  operation: string,
  agentCount: number,
  complexity: number
): typeof ORCHESTRATION_MODEL_TIERS.OPUS | typeof ORCHESTRATION_MODEL_TIERS.SONNET | typeof ORCHESTRATION_MODEL_TIERS.HAIKU {
  const criticalOps = ['task_decomposition', 'conflict_resolution', 'phase_transition', 'error_recovery'];

  if (criticalOps.includes(operation) || agentCount >= 3 || complexity >= 4) {
    return ORCHESTRATION_MODEL_TIERS.OPUS;
  }
  if (['task_allocation', 'progress_check', 'quality_gate'].includes(operation)) {
    return ORCHESTRATION_MODEL_TIERS.SONNET;
  }
  return ORCHESTRATION_MODEL_TIERS.HAIKU;
}

// =============================================================================
// CACHING & OPTIMIZATION
// =============================================================================

const semanticCache = new Map<string, SemanticTaskAnalysis>();

export async function getCachedSemanticAnalysis(
  taskHash: string,
  analysisFn: () => Promise<SemanticTaskAnalysis>
): Promise<SemanticTaskAnalysis> {
  if (semanticCache.has(taskHash)) return semanticCache.get(taskHash)!;
  const analysis = await analysisFn();
  semanticCache.set(taskHash, analysis);
  return analysis;
}

// =============================================================================
// PARSERS (implement based on response format)
// =============================================================================

function parseSemanticAnalysis(response: any): SemanticTaskAnalysis {
  // Parse thinking + text blocks from response.content
  const textBlock = response.content.find((b: any) => b.type === 'text');
  return JSON.parse(textBlock?.text || '{}');
}

function parseConflictAnalysis(response: any): SemanticConflict[] {
  const textBlock = response.content.find((b: any) => b.type === 'text');
  return JSON.parse(textBlock?.text || '[]');
}

function parseDependencyResolution(response: any): DependencyResolution {
  const textBlock = response.content.find((b: any) => b.type === 'text');
  return JSON.parse(textBlock?.text || '{}');
}

function parseTransitionDecision(response: any): any {
  const textBlock = response.content.find((b: any) => b.type === 'text');
  return JSON.parse(textBlock?.text || '{}');
}

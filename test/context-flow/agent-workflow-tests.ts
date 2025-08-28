/**
 * Agent Workflow Tests Module
 * 
 * Main orchestrator for agent workflow simulation and context accumulation tests.
 */

// Main orchestrator for agent workflow tests
import { 
  testUXResearchPhase,
  testBackendArchitecturePhase,
  testFrontendImplementationPhase,
  testCodeQualityPhase
} from "./workflow-phase-tests.js";
import { 
  validateAgentHandoffChain,
  testWorkflowTiming
} from "./workflow-validation-tests.js";

// Re-export phase tests
export {
  testUXResearchPhase,
  testBackendArchitecturePhase,
  testFrontendImplementationPhase,
  testCodeQualityPhase,
  validateAgentHandoffChain,
  testWorkflowTiming
};
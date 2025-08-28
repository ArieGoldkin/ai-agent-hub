/**
 * Performance Analysis Display
 * 
 * Display formatting for performance metrics
 */

import { 
  drawProgressBar,
  formatDuration,
  formatTime
} from "../../../lib/context-analyzer/visualization.js";

/**
 * Display performance metrics analysis
 */
export function displayPerformanceMetrics(metrics: any): void {
  console.log("\n🚀 Performance Analysis");
  console.log("========================\n");
  
  console.log(`📊 Session: ${metrics.sessionId}`);
  console.log(`⏱️  Duration: ${formatDuration(metrics.sessionDuration)}`);
  console.log(`👥 Agents Involved: ${metrics.totalAgentsInvolved}`);
  console.log(`📝 Context Entries: ${metrics.totalContextEntries}`);
  console.log(`🔄 Total Decisions: ${metrics.totalDecisions}`);
  console.log(`⚡ Throughput: ${metrics.averageThroughput.toFixed(1)} entries/hour`);
  console.log(`📈 Efficiency Score: ${metrics.efficiencyScore}%`);
  console.log(`✅ Workflow Completeness: ${metrics.workflowCompleteness}%\n`);

  // ASCII chart for efficiency score
  console.log(drawProgressBar("Efficiency", metrics.efficiencyScore, 100));
  console.log(drawProgressBar("Completeness", metrics.workflowCompleteness, 100));

  console.log("\n👤 Agent Performance:");
  console.log("┌─────────────────────┬─────────┬──────────┬────────────┬─────────────┐");
  console.log("│ Agent               │ Entries │ Avg Time │ Confidence │ Success %   │");
  console.log("├─────────────────────┼─────────┼──────────┼────────────┼─────────────┤");
  
  metrics.agentPerformance.forEach((agent: any) => {
    const name = agent.agentName.padEnd(19);
    const entries = agent.totalContextAdded.toString().padStart(7);
    const avgTime = formatTime(agent.averageResponseTime).padStart(8);
    const confidence = (agent.averageConfidenceScore * 100).toFixed(0).padStart(10) + "%";
    const success = (agent.handoffSuccessRate * 100).toFixed(0).padStart(9) + "%";
    
    console.log(`│ ${name} │ ${entries} │ ${avgTime} │ ${confidence} │ ${success} │`);
  });
  
  console.log("└─────────────────────┴─────────┴──────────┴────────────┴─────────────┘");
}
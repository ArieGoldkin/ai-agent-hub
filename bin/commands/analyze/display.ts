/**
 * Analyze Display Functions
 * 
 * Main display formatting for analysis results
 */

import { formatDuration } from "../../../lib/context-analyzer/visualization.js";

// Re-export all display functions
export { displayPerformanceMetrics } from "./performance.js";
export { displayHandoffPatterns } from "./handoffs.js";
export { displayBottleneckAnalysis } from "./bottlenecks.js";
export { displayInsightsAnalysis } from "./insights.js";
export { displayGrowthAnalysis } from "./growth.js";
export { displayQualityAnalysis } from "./quality.js";

/**
 * Display comprehensive analysis report
 */
export function displayFullAnalysisReport(report: any): void {
  console.log("\n📊 Complete Context Analysis");
  console.log("============================");
  
  // Summary
  console.log(`\n📋 Executive Summary:`);
  console.log(`   🆔 Session: ${report.performance.sessionId}`);
  console.log(`   ⏱️  Duration: ${formatDuration(report.performance.sessionDuration)}`);
  console.log(`   📈 Efficiency: ${report.performance.efficiencyScore}%`);
  console.log(`   🎯 Health: ${report.insights.overallHealth}`);
  
  // Quick stats
  console.log(`\n📊 Quick Stats:`);
  console.log(`   👥 Agents: ${report.performance.totalAgentsInvolved}`);
  console.log(`   📝 Contexts: ${report.performance.totalContextEntries}`);
  console.log(`   🔄 Handoffs: ${report.handoffs.totalHandoffs} (${(report.handoffs.successRate * 100).toFixed(0)}% success)`);
  console.log(`   🚧 Bottlenecks: ${report.bottlenecks.slowestAgents.length} agents`);

  console.log("\n💡 Use specific subcommands for detailed analysis:");
  console.log("   ai-agent-hub analyze performance");
  console.log("   ai-agent-hub analyze handoffs");
  console.log("   ai-agent-hub analyze bottlenecks");
  console.log("   ai-agent-hub analyze insights");
  console.log("   ai-agent-hub analyze growth");
  console.log("   ai-agent-hub analyze quality");
}
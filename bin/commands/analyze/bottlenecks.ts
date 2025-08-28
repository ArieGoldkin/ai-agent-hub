/**
 * Bottlenecks Analysis Display
 * 
 * Display formatting for bottleneck analysis
 */

import { 
  getSeverityEmoji,
  formatTime,
  formatBytes,
  formatRelativeTime
} from "../../../lib/context-analyzer/visualization.js";

/**
 * Display bottleneck analysis
 */
export function displayBottleneckAnalysis(bottlenecks: any): void {
  console.log("\n🚧 Bottleneck Analysis");
  console.log("======================\n");
  
  if (bottlenecks.slowestAgents.length > 0) {
    console.log("🐌 Slowest Agents:");
    bottlenecks.slowestAgents.forEach((agent: any, index: number) => {
      const severity = getSeverityEmoji(agent.severity);
      console.log(`${index + 1}. ${severity} ${agent.agentName}`);
      console.log(`   ⏱️  Avg Processing: ${formatTime(agent.averageProcessingTime)}`);
      console.log(`   📊 Queue Size: ${agent.contextQueueSize}`);
      console.log(`   🕐 Last Active: ${formatRelativeTime(agent.lastActivity)}\n`);
    });
  }

  if (bottlenecks.contextOverloads.length > 0) {
    console.log("💾 Context Overloads:");
    bottlenecks.contextOverloads.forEach((overload: any, index: number) => {
      console.log(`${index + 1}. 📦 ${overload.agentName}`);
      console.log(`   📊 Context Count: ${overload.contextCount}`);
      console.log(`   💽 Size: ${formatBytes(overload.contextSizeBytes)}`);
      console.log(`   🔄 Redundancy: ${overload.redundancyLevel}%`);
      console.log(`   🐌 Slowdown: ${(overload.processingSlowdown * 100).toFixed(0)}%\n`);
    });
  }

  if (bottlenecks.staleContexts.length > 0) {
    console.log("🗂️  Stale Contexts:");
    bottlenecks.staleContexts.slice(0, 3).forEach((stale: any, index: number) => {
      console.log(`${index + 1}. 📜 ${stale.agentName}`);
      console.log(`   ⏰ Age: ${stale.contextAge.toFixed(1)} hours`);
      console.log(`   📈 Relevance: ${(stale.relevanceScore * 100).toFixed(0)}%`);
      console.log(`   💡 Recommendation: ${stale.recommendation}\n`);
    });
  }

  if (bottlenecks.recommendations.length > 0) {
    console.log("💡 Recommendations:");
    bottlenecks.recommendations.forEach((rec: string, index: number) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}
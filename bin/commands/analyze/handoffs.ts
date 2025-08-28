/**
 * Handoffs Analysis Display
 * 
 * Display formatting for handoff patterns
 */

import { 
  drawProgressBar,
  drawTimelineChart,
  formatTime
} from "../../../lib/context-analyzer/visualization.js";

/**
 * Display handoff pattern analysis
 */
export function displayHandoffPatterns(handoffs: any): void {
  console.log("\n🔄 Handoff Analysis");
  console.log("===================\n");
  
  console.log(`📊 Total Handoffs: ${handoffs.totalHandoffs}`);
  console.log(`✅ Successful: ${handoffs.successfulHandoffs}`);
  console.log(`❌ Failed: ${handoffs.failedHandoffs}`);
  console.log(`📈 Success Rate: ${(handoffs.successRate * 100).toFixed(1)}%`);
  console.log(`⏱️  Average Time: ${formatTime(handoffs.averageHandoffTime)}\n`);

  console.log(drawProgressBar("Success Rate", Math.round(handoffs.successRate * 100), 100));

  if (handoffs.commonPaths.length > 0) {
    console.log("\n🛤️  Common Handoff Paths:");
    handoffs.commonPaths.slice(0, 5).forEach((path: any, index: number) => {
      console.log(`${index + 1}. ${path.fromAgent} → ${path.toAgent} (${path.frequency} times, ${(path.successRate * 100).toFixed(0)}% success)`);
    });
  }

  if (handoffs.circularDependencies.length > 0) {
    console.log("\n⚠️  Circular Dependencies Detected:");
    handoffs.circularDependencies.forEach((cycle: string, index: number) => {
      console.log(`${index + 1}. ${cycle}`);
    });
  }

  console.log("\n📈 Handoff Timeline:");
  console.log(drawTimelineChart(handoffs.successRate));
}
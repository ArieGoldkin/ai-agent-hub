/**
 * Growth Analysis Display
 * 
 * Display formatting for context growth analysis
 */

import { 
  drawProgressBar,
  getPatternEmoji,
  formatDuration,
  formatBytes
} from "../../../lib/context-analyzer/visualization.js";

/**
 * Display context growth analysis
 */
export function displayGrowthAnalysis(growth: any): void {
  console.log("\n📈 Context Growth Analysis");
  console.log("==========================\n");
  
  console.log(`📊 Session: ${growth.sessionId}`);
  console.log(`⏱️  Duration: ${formatDuration(growth.endTime.getTime() - growth.startTime.getTime())}`);
  console.log(`💽 Total Growth: ${formatBytes(growth.totalGrowth)}`);
  console.log(`📈 Growth Rate: ${formatBytes(growth.growthRate)}/hour`);
  console.log(`🔄 Redundancy: ${growth.redundancyDetected}%`);
  console.log(`💾 Storage Efficiency: ${growth.storageEfficiency}%\n`);

  console.log(drawProgressBar("Efficiency", growth.storageEfficiency, 100));

  console.log("\n👥 Context by Agent:");
  Object.entries(growth.contextsByAgent)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .forEach(([agent, count]) => {
      console.log(`   ${agent}: ${count} entries`);
    });

  if (growth.accumulationPatterns.length > 0) {
    console.log("\n📊 Accumulation Patterns:");
    growth.accumulationPatterns.forEach((pattern: any, index: number) => {
      const patternEmoji = getPatternEmoji(pattern.pattern);
      console.log(`${index + 1}. ${patternEmoji} ${pattern.agentName}`);
      console.log(`   📈 Pattern: ${pattern.pattern}`);
      console.log(`   📊 Frequency: ${pattern.frequency.toFixed(2)}/hour`);
      console.log(`   💡 ${pattern.recommendation}\n`);
    });
  }
}
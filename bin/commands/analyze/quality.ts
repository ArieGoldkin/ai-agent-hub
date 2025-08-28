/**
 * Quality Analysis Display
 * 
 * Display formatting for decision quality analysis
 */

import { drawProgressBar } from "../../../lib/context-analyzer/visualization.js";

/**
 * Display decision quality analysis
 */
export function displayQualityAnalysis(quality: any): void {
  console.log("\n🎯 Decision Quality Analysis");
  console.log("============================\n");
  
  console.log(`📊 Average Quality: ${(quality.averageQuality * 100).toFixed(1)}%`);
  console.log(`📈 Confidence Trend: ${quality.confidenceTrend}`);

  console.log(drawProgressBar("Quality Score", Math.round(quality.averageQuality * 100), 100));

  if (quality.recommendations.length > 0) {
    console.log("\n💡 Recommendations:");
    quality.recommendations.forEach((rec: string, index: number) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}
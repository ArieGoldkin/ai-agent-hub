/**
 * Insights Analysis Display
 * 
 * Display formatting for insights analysis
 */

import { 
  drawProgressBar,
  getHealthEmoji,
  getPriorityEmoji,
  getSeverityEmoji
} from "../../../lib/context-analyzer/visualization.js";

/**
 * Display comprehensive insights
 */
export function displayInsightsAnalysis(insights: any): void {
  console.log("\n🔍 Insights & Recommendations");
  console.log("=============================\n");
  
  const healthEmoji = getHealthEmoji(insights.overallHealth);
  console.log(`${healthEmoji} Overall Health: ${insights.overallHealth.toUpperCase()}`);
  console.log(`📊 Performance Score: ${insights.performanceScore}%`);
  console.log(`🎯 Analysis Confidence: ${insights.confidenceLevel}%\n`);

  console.log(drawProgressBar("Performance", insights.performanceScore, 100));
  console.log(drawProgressBar("Confidence", insights.confidenceLevel, 100));

  if (insights.keyFindings.length > 0) {
    console.log("\n🔍 Key Findings:");
    insights.keyFindings.forEach((finding: string, index: number) => {
      console.log(`${index + 1}. ${finding}`);
    });
  }

  if (insights.optimizationOpportunities.length > 0) {
    console.log("\n🚀 Optimization Opportunities:");
    insights.optimizationOpportunities.forEach((opp: any, index: number) => {
      const priority = getPriorityEmoji(opp.priority);
      console.log(`${index + 1}. ${priority} ${opp.description}`);
      console.log(`   📈 Potential Improvement: ${opp.potentialImprovement}%`);
      console.log(`   ⚡ Effort: ${opp.effort}`);
      console.log(`   👥 Affected: ${opp.affectedAgents.join(', ')}\n`);
    });
  }

  if (insights.warnings.length > 0) {
    console.log("⚠️  Warnings:");
    insights.warnings.forEach((warning: any, index: number) => {
      const severity = getSeverityEmoji(warning.severity);
      console.log(`${index + 1}. ${severity} ${warning.message}`);
      console.log(`   💥 Impact: ${warning.impact}`);
      console.log(`   💡 Action: ${warning.suggestedAction}\n`);
    });
  }

  if (insights.actionableRecommendations.length > 0) {
    console.log("💡 Actionable Recommendations:");
    insights.actionableRecommendations.forEach((rec: any, index: number) => {
      const priority = getPriorityEmoji(rec.priority);
      console.log(`${index + 1}. ${priority} ${rec.title}`);
      console.log(`   📝 ${rec.description}`);
      console.log(`   🎯 Expected Benefit: ${rec.expectedBenefit}`);
      console.log(`   ⚡ Effort: ${rec.estimatedEffort}\n`);
    });
  }
}
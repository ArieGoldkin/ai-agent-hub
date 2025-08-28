/**
 * Analyze Command Help
 * 
 * Help text for analyze commands (following session-help.ts pattern)
 */

/**
 * Display analyze command help
 */
export function showAnalyzeHelp(): void {
  console.log("\n🔬 AI Agent Hub - Analyze Commands");
  console.log("=================================\n");
  
  console.log("📊 Available Commands:");
  console.log("  ai-agent-hub analyze                  Show complete analysis summary");
  console.log("  ai-agent-hub analyze performance      Performance metrics & efficiency");
  console.log("  ai-agent-hub analyze handoffs         Handoff patterns & success rates");
  console.log("  ai-agent-hub analyze bottlenecks      Bottleneck detection & analysis");
  console.log("  ai-agent-hub analyze insights         Comprehensive insights & recommendations");
  console.log("  ai-agent-hub analyze growth           Context growth & accumulation patterns");
  console.log("  ai-agent-hub analyze quality          Decision quality & confidence trends");
  console.log("  ai-agent-hub analyze help             Show this help message\n");

  console.log("📋 Examples:");
  console.log("  ai-agent-hub analyze                  # Full analysis report");
  console.log("  ai-agent-hub analyze performance      # Agent performance metrics");
  console.log("  ai-agent-hub analyze bottlenecks      # Find workflow bottlenecks\n");

  console.log("💡 Tips:");
  console.log("  • Start a session first: ai-agent-hub session start");
  console.log("  • Use specific commands for detailed insights");
  console.log("  • Analyze after major workflow changes");
  console.log("  • Regular analysis helps optimize agent collaboration");
}
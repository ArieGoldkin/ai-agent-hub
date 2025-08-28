/**
 * Analyze Command Module - Main Handler
 * 
 * Routes analyze subcommands to appropriate functions
 */

import { ContextManager } from "../../../lib/context-manager.js";
import { ContextAnalyzer } from "../../../lib/context-analyzer/index.js";
import { showAnalyzeHelp } from "../analyze-help.js";
import { 
  showPerformanceAnalysis,
  showHandoffAnalysis, 
  showBottleneckAnalysis,
  showInsightsAnalysis,
  showGrowthAnalysis,
  showQualityAnalysis,
  showFullAnalysis
} from "./operations.js";

/**
 * Handle analyze command with subcommands
 */
export async function handleAnalyzeCommand(subcommand?: string): Promise<void> {
  // Handle help command first (doesn't need session)
  if (subcommand === "help") {
    showAnalyzeHelp();
    return;
  }

  const contextManager = new ContextManager();
  const sessionContext = await contextManager.getContext();

  if (!sessionContext) {
    console.log("❌ No active session found. Start a session with 'ai-agent-hub session start'");
    return;
  }

  const analyzer = new ContextAnalyzer(sessionContext);

  try {
    switch (subcommand) {
      case "performance":
        await showPerformanceAnalysis(analyzer);
        break;
      case "handoffs":
        await showHandoffAnalysis(analyzer);
        break;
      case "bottlenecks":
        await showBottleneckAnalysis(analyzer);
        break;
      case "insights":
        await showInsightsAnalysis(analyzer);
        break;
      case "growth":
        await showGrowthAnalysis(analyzer);
        break;
      case "quality":
        await showQualityAnalysis(analyzer);
        break;
      case undefined:
        await showFullAnalysis(analyzer);
        break;
      default:
        console.error(`❌ Unknown analyze command: ${subcommand}`);
        console.log("Use 'ai-agent-hub analyze help' for available commands");
        break;
    }
  } catch (error) {
    console.error("❌ Analysis failed:", error instanceof Error ? error.message : error);
  }
}
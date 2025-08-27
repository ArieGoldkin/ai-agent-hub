/**
 * List agents command - Shows available AI agents
 */

export function listAgents(): void {
  console.log("\n🤖 Available AI Agent Personalities:\n");
  console.log("1. ai-ml-engineer");
  console.log("   Expert in AI/ML implementation, LLMs, computer vision");
  console.log("");
  console.log("2. backend-system-architect");
  console.log("   System design, API architecture, scaling strategies");
  console.log("");
  console.log("3. code-quality-reviewer");
  console.log("   Automated code review, best practices enforcement");
  console.log("");
  console.log("4. frontend-ui-developer");
  console.log("   React/Vue/Angular, responsive design, accessibility");
  console.log("");
  console.log("5. rapid-ui-designer");
  console.log("   Quick prototyping, design systems, UI/UX");
  console.log("");
  console.log("6. sprint-prioritizer");
  console.log("   Agile planning, feature prioritization, roadmaps");
  console.log("");
  console.log("7. studio-coach");
  console.log("   Team coordination, motivation, peak performance");
  console.log("");
  console.log("8. ux-researcher");
  console.log("   User research, testing, journey mapping");
  console.log("");
  console.log("9. whimsy-injector");
  console.log("   Creative enhancement, delightful experiences");
  console.log("");
  console.log("These agents will be installed to .claude/agents/ when you run:");
  console.log("  npx ai-agent-hub\n");
}
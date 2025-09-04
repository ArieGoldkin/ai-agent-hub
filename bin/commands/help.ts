/**
 * Help Command - Display usage information
 */

export function showHelp(): void {
  console.log(`
🚀 AI Agent Hub - Deploy 9 AI Agents with MCP Configuration

Transform Claude into a team of 9 specialized AI agents.

Usage:
  npx ai-agent-hub                 Interactive setup (asks where to install)
  npx ai-agent-hub --project-only  Install to project (.claude/ + .mcp.json)
  npx ai-agent-hub --desktop-only  Install to Claude Desktop only  
  npx ai-agent-hub --both          Install to both locations
  npx ai-agent-hub --help          Show this help
  npx ai-agent-hub --version       Show version

Mode Options:
  --mode classic                   Use full agent prompts (default)
  --mode squad                     Use slim templates with 97% token reduction
  --mode auto                      Auto-detect optimal mode based on project

Quick Start:
  1. Run: npx ai-agent-hub
  2. Choose installation target
  3. Open Claude and say: "Use Studio Coach to help me build..."

9 Specialized AI Agents:
  🎭 Studio Coach         - Master orchestrator
  🎯 Sprint Prioritizer   - Agile planning
  🔍 UX Researcher        - User research & requirements
  🎨 Rapid UI Designer    - Design systems
  🏗️ Backend Architect    - API & database design
  🖥️ Frontend Developer   - UI implementation
  🤖 AI/ML Engineer       - Machine learning features
  🎪 Whimsy Injector      - Delightful interactions
  🔬 Quality Reviewer     - Quality assurance

MCP Servers Configured:
  • Memory - Persistent context
  • Sequential Thinking - Step-by-step reasoning
  • Context7 - Advanced context management
  • Playwright - Browser automation

Execution Modes:
  Classic Mode (default):
    • Full agent prompts (~37,500 tokens)
    • Sequential execution
    • Best for simple tasks and small projects
  
  Squad Mode:
    • Slim templates (97% token reduction)
    • Parallel execution (up to 4 agents)
    • Supervisor orchestration
    • Best for complex features and large projects

Learn more: https://github.com/ArieGoldkin/ai-agent-hub
  `);
}
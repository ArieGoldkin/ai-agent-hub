/**
 * Help Command - Show usage information
 */

export function showHelp(): void {
  console.log(`
🚀 AI Agent Hub - Orchestration System

Transform Claude into a team of 9 specialized AI agents with one command.

Usage:
  npx ai-agent-hub              Quick setup (installs everything)
  npx ai-agent-hub session       Start orchestration session
  npx ai-agent-hub doctor        Verify installation
  npx ai-agent-hub help          Show this help

Quick Start:
  1. Run: npx ai-agent-hub
  2. Open project in Claude Code
  3. Edit START_SESSION.md with your request
  4. Claude orchestrates agents to implement

AI Agents Installed:
  🎭 Studio Coach         - Master orchestrator
  🔍 UX Researcher        - Requirements & research  
  🏗️ Backend Architect    - System design
  🎨 UI Designer          - Interface design
  🖥️ Frontend Developer   - UI implementation
  🤖 AI/ML Engineer       - Intelligent features
  🎪 Whimsy Injector      - Delightful interactions
  🔬 Quality Reviewer     - Code review
  🎯 Sprint Prioritizer   - Task planning

Learn more: https://github.com/ArieGoldkin/ai-agent-hub
  `);
}
#!/usr/bin/env node

/**
 * AI Agent Hub - NPX Installer for Claude MCP Configuration
 * Simple installer that configures Claude Desktop with MCP servers
 */

export const version = "1.0.0";

// Export core modules
export * from "./claude-config.js";
export {
  detectProjectInfo,
  createMCPConfigFromServers,
  hasMCPConfig,
  getMCPJsonPath,
  loadMCPConfig,
  saveMCPConfig,
  addServerToMCPConfig,
  removeServerFromMCPConfig,
  listMCPConfiguredServers,
  validateMCPConfig,
  type ProjectInfo,
  type MCPCodeConfig
} from "./claude-code-config.js";
export * from "./mcp-installer.js";
export * from "./server-registry.js";

// Export type definitions
export * from "./types/index.js";

// Export agent templates
export { default as agentTemplates } from "./agent-templates.json" with { type: "json" };

export function main(): void {
  console.log(`AI Agent Hub v${version}`);
  console.log("NPX Installer for Claude MCP Configuration");
  console.log("Use: npx ai-agent-hub init");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

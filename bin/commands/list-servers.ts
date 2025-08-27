/**
 * List servers command - Shows configured MCP servers
 */

import { listServers } from "../../lib/claude-ops.js";

export async function listConfiguredServers(): Promise<void> {
  const servers = await listServers();
  
  if (servers.desktop.length > 0) {
    console.log("\n📱 Claude Desktop servers:");
    servers.desktop.forEach(s => console.log(`  • ${s}`));
  }
  
  if (servers.code.length > 0) {
    console.log("\n💻 Claude Code servers (.mcp.json):");
    servers.code.forEach(s => console.log(`  • ${s}`));
  }
  
  if (servers.desktop.length === 0 && servers.code.length === 0) {
    console.log("\n❌ No servers configured yet");
    console.log("   Run 'ai-agent-hub' to set up default servers");
  }
}
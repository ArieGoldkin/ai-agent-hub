/**
 * Remove server command - Removes an MCP server
 */

import { removeServer } from "../../lib/claude-ops.js";

export async function removeServerCommand(serverName: string): Promise<void> {
  console.log(`🗑️  Removing ${serverName}...`);
  await removeServer(serverName);
  console.log(`✅ Removed ${serverName} from configurations`);
}
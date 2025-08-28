/**
 * Claude Desktop Setup
 * 
 * Configures MCP servers for Claude Desktop across all platforms
 */

import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { 
  getClaudeDesktopPath, 
  getClaudeMCPConfigPath,
  getPlatformName,
  isClaudeDesktopInstalled 
} from "./platform-paths.js";

/**
 * MCP server configuration for Claude Desktop
 */
interface ClaudeDesktopConfig {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Setup MCP servers for Claude Desktop
 */
export async function setupClaudeDesktopMCP(): Promise<boolean> {
  try {
    // Check if Claude Desktop is installed
    if (!isClaudeDesktopInstalled()) {
      console.log(`ℹ️  Claude Desktop not found on ${getPlatformName()}`);
      console.log("   Install Claude Desktop to enable system-wide MCP servers");
      return false;
    }
    
    const configPath = getClaudeMCPConfigPath();
    if (!configPath) {
      console.log("⚠️  Cannot determine Claude Desktop config path");
      return false;
    }
    
    // Read existing config or create new one
    let config: ClaudeDesktopConfig = {};
    
    if (existsSync(configPath)) {
      try {
        const content = await readFile(configPath, 'utf-8');
        config = JSON.parse(content);
        console.log("📄 Found existing Claude Desktop configuration");
      } catch {
        console.log("⚠️  Could not read Claude Desktop config, creating new one");
        config = {};
      }
    } else {
      // Ensure directory exists
      const dir = dirname(configPath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
    
    // Add/update MCP servers
    if (!config.mcpServers) {
      config.mcpServers = {};
    }
    
    // Add our recommended MCP servers
    const serversToAdd = {
      memory: {
        command: "npx",
        args: ["@modelcontextprotocol/server-memory"]
      },
      "sequential-thinking": {
        command: "npx",
        args: ["@modelcontextprotocol/server-sequential-thinking"]
      },
      filesystem: {
        command: "npx",
        args: ["@modelcontextprotocol/server-filesystem", "--read-only"]
      },
      github: {
        command: "npx",
        args: ["@modelcontextprotocol/server-github"]
      }
    };
    
    // Merge servers (don't overwrite existing ones)
    let addedServers = 0;
    for (const [name, serverConfig] of Object.entries(serversToAdd)) {
      if (!config.mcpServers[name]) {
        config.mcpServers[name] = serverConfig;
        addedServers++;
      }
    }
    
    // Save updated configuration
    await writeFile(configPath, JSON.stringify(config, null, 2));
    
    if (addedServers > 0) {
      console.log(`✅ Added ${addedServers} MCP servers to Claude Desktop`);
      console.log("   Restart Claude Desktop to activate the servers");
    } else {
      console.log("✅ Claude Desktop MCP servers already configured");
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Failed to setup Claude Desktop:", error);
    return false;
  }
}

/**
 * Install agents to Claude Desktop (for system-wide access)
 */
export async function installAgentsToDesktop(sourceAgentsPath: string): Promise<boolean> {
  try {
    const claudePath = getClaudeDesktopPath();
    if (!claudePath) {
      return false;
    }
    
    const desktopAgentsPath = join(claudePath, 'agents');
    
    // Check if we should install
    if (existsSync(desktopAgentsPath)) {
      const { readdir } = await import('fs/promises');
      const files = await readdir(desktopAgentsPath);
      const agentFiles = files.filter(f => f.endsWith('.md'));
      
      if (agentFiles.length >= 9) {
        console.log("✅ Agents already installed in Claude Desktop");
        return true;
      }
    }
    
    // Copy agents to Claude Desktop
    if (!existsSync(desktopAgentsPath)) {
      await mkdir(desktopAgentsPath, { recursive: true });
    }
    
    const { cp } = await import('fs/promises');
    await cp(sourceAgentsPath, desktopAgentsPath, { recursive: true });
    
    console.log(`✅ Installed agents to Claude Desktop (${getPlatformName()})`);
    console.log(`   Location: ${desktopAgentsPath}`);
    
    return true;
    
  } catch (error) {
    console.error("⚠️  Could not install agents to Claude Desktop:", error);
    return false;
  }
}

/**
 * Check if Claude Desktop has our configuration
 */
export async function validateDesktopSetup(): Promise<{
  hasAgents: boolean;
  hasMCP: boolean;
  platform: string;
}> {
  const platform = getPlatformName();
  let hasAgents = false;
  let hasMCP = false;
  
  if (!isClaudeDesktopInstalled()) {
    return { hasAgents, hasMCP, platform };
  }
  
  const claudePath = getClaudeDesktopPath();
  if (claudePath) {
    // Check for agents
    const agentsPath = join(claudePath, 'agents');
    if (existsSync(agentsPath)) {
      try {
        const { readdir } = await import('fs/promises');
        const files = await readdir(agentsPath);
        hasAgents = files.filter(f => f.endsWith('.md')).length >= 9;
      } catch {}
    }
    
    // Check for MCP config
    const configPath = getClaudeMCPConfigPath();
    if (configPath && existsSync(configPath)) {
      try {
        const content = await readFile(configPath, 'utf-8');
        const config = JSON.parse(content);
        hasMCP = config.mcpServers && Object.keys(config.mcpServers).length > 0;
      } catch {}
    }
  }
  
  return { hasAgents, hasMCP, platform };
}

// Re-export for convenience
import { join } from "path";
export { getClaudeDesktopPath, getPlatformName, isClaudeDesktopInstalled };
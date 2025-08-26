/**
 * Core type definitions for AI Agent Hub
 */

export interface MCPServer {
  id: string
  name: string
  enabled: boolean
  config: Record<string, unknown>
}

export interface AgentProfile {
  name: string
  description: string
  servers: string[]
  capabilities: string[]
}
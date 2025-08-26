#!/usr/bin/env node

/**
 * AI Agent Hub - Enhanced MCP Server Orchestration System
 * Entry point for the application
 */

export const version = '0.1.0'

// Export configuration system
export * from './config/index.js'

// Export type definitions
export * from './types/index.js'

export function main(): void {
  // eslint-disable-next-line no-console
  console.log(`AI Agent Hub v${version}`)
  // eslint-disable-next-line no-console
  console.log('MCP Server Orchestration System')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
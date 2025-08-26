/**
 * Optional server definitions - additional servers that can be enabled based on feature requirements
 */

import type { 
  ServerDefinition, 
  Capability,
  SecurityLevel,
  TransportType 
} from '../../types/config.js';

// Sequential thinking server configuration
export const SEQUENTIAL_THINKING_SERVER: ServerDefinition = {
  name: 'Sequential Thinking',
  description: 'Advanced reasoning capabilities with planning, reflection, and optimization for complex problem solving',
  package: '@modelcontextprotocol/server-sequential-thinking',
  version: 'latest',
  transport: 'stdio' as TransportType,
  capabilities: ['reasoning', 'analysis'] as Capability[],
  tools: [
    {
      name: 'think',
      description: 'Perform structured thinking process',
      security: 'none' as SecurityLevel,
    },
    {
      name: 'plan',
      description: 'Create execution plan for complex tasks',
      security: 'none' as SecurityLevel,
    },
    {
      name: 'reflect',
      description: 'Reflect on completed actions and outcomes',
      security: 'none' as SecurityLevel,
    },
    {
      name: 'optimize',
      description: 'Optimize approach based on feedback',
      security: 'none' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: false,
    requiresAuth: false,
    permissions: [],
    environmentVariables: [],
  },
  defaultConfig: {
    maxThinkingSteps: 10,
    enableReflection: true,
  },
  category: 'optional',
};

// Context7 server configuration
export const CONTEXT7_SERVER: ServerDefinition = {
  name: 'Documentation Search',
  description: 'Context7 powered documentation search and code snippet retrieval from various sources',
  package: '@upstash/context7-mcp',
  version: 'latest',
  transport: 'http' as TransportType,
  capabilities: ['documentation'] as Capability[],
  tools: [
    {
      name: 'search_docs',
      description: 'Search documentation and code snippets',
      security: 'authenticated' as SecurityLevel,
    },
    {
      name: 'fetch_snippet',
      description: 'Fetch specific code snippet by ID',
      security: 'authenticated' as SecurityLevel,
    },
    {
      name: 'index_content',
      description: 'Index new content for search',
      security: 'authenticated' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: false,
    requiresAuth: true,
    permissions: ['network'],
    environmentVariables: ['CONTEXT7_API_KEY'],
  },
  defaultConfig: {
    baseUrl: 'https://api.upstash.com',
    maxResults: 20,
    enableCaching: true,
  },
  category: 'optional',
};

// Playwright server configuration
export const PLAYWRIGHT_SERVER: ServerDefinition = {
  name: 'Browser Automation',
  description: 'Playwright-powered browser automation for testing, scraping, and web interaction',
  package: '@playwright/mcp',
  version: 'latest',
  transport: 'stdio' as TransportType,
  capabilities: ['browser', 'testing'] as Capability[],
  tools: [
    {
      name: 'navigate',
      description: 'Navigate to URL in browser',
      security: 'restricted' as SecurityLevel,
    },
    {
      name: 'click',
      description: 'Click element on page',
      security: 'restricted' as SecurityLevel,
    },
    {
      name: 'screenshot',
      description: 'Take screenshot of page',
      security: 'restricted' as SecurityLevel,
    },
    {
      name: 'extract_text',
      description: 'Extract text content from page',
      security: 'restricted' as SecurityLevel,
    },
    {
      name: 'fill_form',
      description: 'Fill form fields',
      security: 'restricted' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: true,
    requiresAuth: false,
    permissions: ['network', 'filesystem'],
    environmentVariables: [],
  },
  defaultConfig: {
    headless: true,
    timeout: 30000,
    viewport: {
      width: 1280,
      height: 720,
    },
    allowedDomains: ['localhost', '127.0.0.1'],
  },
  category: 'optional',
};

// Optional servers collection
export const OPTIONAL_SERVERS = {
  'sequential-thinking': SEQUENTIAL_THINKING_SERVER,
  context7: CONTEXT7_SERVER,
  playwright: PLAYWRIGHT_SERVER,
} as const;

// Optional server IDs
export const OPTIONAL_SERVER_IDS = Object.keys(OPTIONAL_SERVERS);
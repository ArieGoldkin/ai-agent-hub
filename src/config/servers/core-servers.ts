/**
 * Core server definitions - essential servers that are always enabled
 */

import type { 
  ServerDefinition, 
  Capability,
  SecurityLevel,
  TransportType 
} from '../../types/config.js';

// Filesystem server configuration
export const FILESYSTEM_SERVER: ServerDefinition = {
  name: 'Filesystem Operations',
  description: 'Secure filesystem operations with PROJECT_ROOT sandboxing for reading, writing, and searching files',
  package: '@modelcontextprotocol/server-filesystem',
  version: 'latest',
  transport: 'stdio' as TransportType,
  capabilities: ['filesystem'] as Capability[],
  tools: [
    {
      name: 'read_file',
      description: 'Read file contents from filesystem',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'write_file', 
      description: 'Write content to file in filesystem',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'list_directory',
      description: 'List directory contents',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'search_files',
      description: 'Search for files matching pattern',
      security: 'sandboxed' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: true,
    requiresAuth: false,
    permissions: ['read', 'write', 'filesystem'],
    environmentVariables: ['PROJECT_ROOT'],
  },
  defaultConfig: {
    allowedDirectories: ['${PROJECT_ROOT}'],
    maxFileSize: '10MB',
    allowedExtensions: ['.ts', '.js', '.json', '.md', '.txt', '.yml', '.yaml'],
  },
  category: 'core',
};

// Git server configuration
export const GIT_SERVER: ServerDefinition = {
  name: 'Git Version Control',
  description: 'Git operations including commits, branches, diffs, and logs with security-first approach',
  package: '@modelcontextprotocol/server-git',
  version: 'latest',
  transport: 'stdio' as TransportType,
  capabilities: ['git'] as Capability[],
  tools: [
    {
      name: 'git_status',
      description: 'Get repository status',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'git_commit',
      description: 'Create git commit',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'git_diff',
      description: 'Show git diff',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'git_log',
      description: 'Show commit history',
      security: 'sandboxed' as SecurityLevel,
    },
    {
      name: 'git_branch',
      description: 'Git branch operations',
      security: 'sandboxed' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: true,
    requiresAuth: false,
    permissions: ['read', 'write', 'git'],
    environmentVariables: ['PROJECT_ROOT'],
  },
  defaultConfig: {
    allowAutoCommit: false,
    signCommits: true,
    workingDirectory: '${PROJECT_ROOT}',
  },
  category: 'core',
};

// GitHub server configuration
export const GITHUB_SERVER: ServerDefinition = {
  name: 'GitHub Integration',
  description: 'GitHub API integration for managing repositories, issues, and pull requests with OAuth2/PAT authentication',
  package: '@modelcontextprotocol/server-github',
  version: 'latest',
  transport: 'stdio' as TransportType,
  capabilities: ['github'] as Capability[],
  tools: [
    {
      name: 'create_pull_request',
      description: 'Create GitHub pull request',
      security: 'authenticated' as SecurityLevel,
    },
    {
      name: 'list_issues',
      description: 'List repository issues',
      security: 'authenticated' as SecurityLevel,
    },
    {
      name: 'create_issue',
      description: 'Create repository issue',
      security: 'authenticated' as SecurityLevel,
    },
    {
      name: 'get_repository',
      description: 'Get repository information', 
      security: 'authenticated' as SecurityLevel,
    },
  ],
  security: {
    sandboxed: false,
    requiresAuth: true,
    permissions: ['network', 'github'],
    environmentVariables: ['GITHUB_TOKEN', 'GITHUB_AUTH_MODE'],
  },
  defaultConfig: {
    authMode: 'oauth2',
    scopes: ['repo', 'issues', 'pull_requests'],
    apiVersion: '2022-11-28',
  },
  category: 'core',
};

// Core servers collection
export const CORE_SERVERS = {
  filesystem: FILESYSTEM_SERVER,
  git: GIT_SERVER,
  github: GITHUB_SERVER,
} as const;

// Core server IDs
export const CORE_SERVER_IDS = Object.keys(CORE_SERVERS);
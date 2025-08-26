/**
 * Configuration validation tests
 */

import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';

import {
  validateProfileConfig,
  validateServerRegistry,
  isValidProfileConfig,
  isValidServerRegistry,
  assertValidProfileConfig,
  assertValidServerRegistry,
  validateServerId,
  validateToolName,
  validateEnvironmentVariableName,
  validateNpmPackageName,
  validateVersion,
  formatValidationErrors,
  createValidationReport,
  validateConfigurations,
} from '../../src/config/validator.js';

import type { ProfileConfig, ServerRegistry } from '../../src/types/config.js';

describe('Configuration Validation', () => {
  const validProfile: ProfileConfig = {
    profile: {
      name: 'Test Profile',
      version: '1.0.0',
      description: 'Test description',
    },
    system: {
      projectRoot: '${PROJECT_ROOT}',
      memoryBackend: 'sqlite',
      contextDirectory: '.test-context',
      logLevel: 'info',
      enableAuditLog: true,
    },
    servers: {
      enabled: {
        filesystem: {
          enabled: true,
          config: {
            maxFileSize: '10MB',
          },
          environmentVariables: {
            PROJECT_ROOT: '${PROJECT_ROOT}',
          },
          toolOverrides: {
            read_file: {
              enabled: true,
              security: 'sandboxed',
            },
          },
        },
      },
      disabled: ['playwright'],
    },
    security: {
      authMode: 'none',
      requireAuthentication: false,
      sandboxMode: true,
      allowedOrigins: ['http://localhost:3000'],
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 60,
      },
    },
    features: {
      enableBrowserAutomation: false,
      enableDocumentationSearch: true,
      enableSequentialThinking: false,
      enableGitHubIntegration: true,
    },
  };

  const validRegistry: ServerRegistry = {
    servers: {
      filesystem: {
        name: 'Filesystem Server',
        description: 'File operations server',
        package: '@modelcontextprotocol/server-filesystem',
        version: 'latest',
        transport: 'stdio',
        capabilities: ['filesystem'],
        tools: [
          {
            name: 'read_file',
            description: 'Read file contents',
            security: 'sandboxed',
          },
          {
            name: 'write_file',
            description: 'Write file contents',
            security: 'sandboxed',
          },
        ],
        security: {
          sandboxed: true,
          requiresAuth: false,
          permissions: ['read', 'write', 'filesystem'],
          environmentVariables: ['PROJECT_ROOT'],
        },
        defaultConfig: {
          maxFileSize: '10MB',
          allowedExtensions: ['.txt', '.json'],
        },
        category: 'core',
      },
    },
    categories: {
      core: {
        name: 'Core Servers',
        description: 'Essential servers',
        servers: ['filesystem'],
      },
    },
  };

  describe('Profile Validation', () => {
    test('should validate correct profile configuration', () => {
      const result = validateProfileConfig(validProfile);
      
      assert.ok(result.valid);
      assert.ok(result.data);
      assert.deepEqual(result.data, validProfile);
      assert.equal(result.errors, undefined);
    });

    test('should reject profile missing required fields', () => {
      const invalidProfile = {
        profile: {
          name: 'Test',
          // missing version and description
        },
        system: {
          projectRoot: '/test',
          memoryBackend: 'sqlite',
          contextDirectory: '.test',
        },
        // missing servers
      };

      const result = validateProfileConfig(invalidProfile);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
      assert.ok(result.errors.length > 0);
    });

    test('should reject profile with invalid memory backend', () => {
      const invalidProfile = {
        ...validProfile,
        system: {
          ...validProfile.system,
          memoryBackend: 'invalid-backend' as unknown as 'sqlite',
        },
      };

      const result = validateProfileConfig(invalidProfile);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
      const hasEnumError = result.errors.some(e => {
        if (!e.message) return false;
        return e.message.includes('enum') || e.message.includes('must be equal to one of') || e.message.includes('allowed values');
      });
      assert.ok(hasEnumError);
    });

    test('should reject profile with invalid security configuration', () => {
      const invalidProfile = {
        ...validProfile,
        security: {
          authMode: 'invalid-mode' as unknown as 'none',
          requireAuthentication: 'not-boolean' as unknown as boolean,
          rateLimiting: {
            enabled: true,
            requestsPerMinute: -1, // Invalid negative value
          },
        },
      };

      const result = validateProfileConfig(invalidProfile);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
      assert.ok(result.errors.length > 0);
    });

    test('should reject profile with invalid server configuration', () => {
      const invalidProfile = {
        ...validProfile,
        servers: {
          enabled: {
            'invalid-server-id!': { // Invalid server ID with special character
              enabled: true,
            },
          },
        },
      };

      const result = validateProfileConfig(invalidProfile);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
    });
  });

  describe('Registry Validation', () => {
    test('should validate correct registry configuration', () => {
      const result = validateServerRegistry(validRegistry);
      
      assert.ok(result.valid);
      assert.ok(result.data);
      assert.deepEqual(result.data, validRegistry);
      assert.equal(result.errors, undefined);
    });

    test('should reject registry missing required fields', () => {
      const invalidRegistry = {
        servers: {
          filesystem: {
            name: 'Test Server',
            // missing required fields
          },
        },
        // missing categories
      };

      const result = validateServerRegistry(invalidRegistry);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
      assert.ok(result.errors.length > 0);
    });

    test('should reject registry with invalid transport', () => {
      const invalidRegistry = {
        ...validRegistry,
        servers: {
          filesystem: {
            ...validRegistry.servers.filesystem,
            transport: 'invalid-transport' as unknown as 'stdio',
          },
        },
      };

      const result = validateServerRegistry(invalidRegistry);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
      const hasEnumError = result.errors.some(e => {
        if (!e.message) return false;
        return e.message.includes('enum') || e.message.includes('must be equal to one of') || e.message.includes('allowed values');
      });
      assert.ok(hasEnumError);
    });

    test('should reject registry with invalid capabilities', () => {
      const invalidRegistry = {
        ...validRegistry,
        servers: {
          filesystem: {
            ...validRegistry.servers.filesystem,
            capabilities: ['invalid-capability'] as unknown as ['filesystem'],
          },
        },
      };

      const result = validateServerRegistry(invalidRegistry);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
    });

    test('should reject registry with invalid tool names', () => {
      const invalidRegistry = {
        ...validRegistry,
        servers: {
          filesystem: {
            ...validRegistry.servers.filesystem,
            tools: [
              {
                name: 'Invalid-Tool-Name!', // Invalid characters
                description: 'Test tool',
              },
            ],
          },
        },
      };

      const result = validateServerRegistry(invalidRegistry);
      
      assert.equal(result.valid, false);
      assert.ok(result.errors);
    });
  });

  describe('Type Guards', () => {
    test('isValidProfileConfig should work correctly', () => {
      assert.ok(isValidProfileConfig(validProfile));
      assert.ok(!isValidProfileConfig({}));
      assert.ok(!isValidProfileConfig(null));
      assert.ok(!isValidProfileConfig('invalid'));
    });

    test('isValidServerRegistry should work correctly', () => {
      assert.ok(isValidServerRegistry(validRegistry));
      assert.ok(!isValidServerRegistry({}));
      assert.ok(!isValidServerRegistry(null));
      assert.ok(!isValidServerRegistry('invalid'));
    });
  });

  describe('Assertion Functions', () => {
    test('assertValidProfileConfig should pass for valid config', () => {
      assert.doesNotThrow(() => {
        assertValidProfileConfig(validProfile);
      });
    });

    test('assertValidProfileConfig should throw for invalid config', () => {
      assert.throws(() => {
        assertValidProfileConfig({});
      }, /Invalid profile configuration/);
    });

    test('assertValidServerRegistry should pass for valid registry', () => {
      assert.doesNotThrow(() => {
        assertValidServerRegistry(validRegistry);
      });
    });

    test('assertValidServerRegistry should throw for invalid registry', () => {
      assert.throws(() => {
        assertValidServerRegistry({});
      }, /Invalid server registry/);
    });
  });

  describe('Format Validation Functions', () => {
    test('validateServerId should work correctly', () => {
      assert.ok(validateServerId('filesystem'));
      assert.ok(validateServerId('sequential-thinking'));
      assert.ok(validateServerId('context7'));
      
      assert.ok(!validateServerId('InvalidName'));
      assert.ok(!validateServerId('invalid_name'));
      assert.ok(!validateServerId('invalid.name'));
      assert.ok(!validateServerId('123invalid'));
      assert.ok(!validateServerId(''));
    });

    test('validateToolName should work correctly', () => {
      assert.ok(validateToolName('read_file'));
      assert.ok(validateToolName('git_status'));
      assert.ok(validateToolName('create_pull_request'));
      
      assert.ok(!validateToolName('invalid-name'));
      assert.ok(!validateToolName('InvalidName'));
      assert.ok(!validateToolName('invalid.name'));
      assert.ok(!validateToolName('123invalid'));
      assert.ok(!validateToolName(''));
    });

    test('validateEnvironmentVariableName should work correctly', () => {
      assert.ok(validateEnvironmentVariableName('PROJECT_ROOT'));
      assert.ok(validateEnvironmentVariableName('GITHUB_TOKEN'));
      assert.ok(validateEnvironmentVariableName('CONTEXT7_API_KEY'));
      
      assert.ok(!validateEnvironmentVariableName('project_root'));
      assert.ok(!validateEnvironmentVariableName('Project-Root'));
      assert.ok(!validateEnvironmentVariableName('123_INVALID'));
      assert.ok(!validateEnvironmentVariableName(''));
    });

    test('validateNpmPackageName should work correctly', () => {
      assert.ok(validateNpmPackageName('@modelcontextprotocol/server-filesystem'));
      assert.ok(validateNpmPackageName('simple-package'));
      assert.ok(validateNpmPackageName('@upstash/context7-mcp'));
      assert.ok(validateNpmPackageName('package'));
      
      assert.ok(!validateNpmPackageName('Invalid-Package'));
      assert.ok(!validateNpmPackageName('@/invalid'));
      assert.ok(!validateNpmPackageName(''));
    });

    test('validateVersion should work correctly', () => {
      assert.ok(validateVersion('1.0.0'));
      assert.ok(validateVersion('^1.0.0'));
      assert.ok(validateVersion('~2.1.0'));
      assert.ok(validateVersion('>=1.0.0'));
      assert.ok(validateVersion('latest'));
      assert.ok(validateVersion('beta'));
      assert.ok(validateVersion('alpha'));
      assert.ok(validateVersion('1.0.0-alpha.1'));
      
      assert.ok(!validateVersion('invalid'));
      assert.ok(!validateVersion('1.0'));
      assert.ok(!validateVersion(''));
    });
  });

  describe('Error Formatting', () => {
    test('formatValidationErrors should format single error', () => {
      const errors = [{
        path: '/profile/name',
        message: 'is required',
        value: undefined,
      }];

      const result = formatValidationErrors(errors);
      assert.ok(result.includes('/profile/name'));
      assert.ok(result.includes('is required'));
    });

    test('formatValidationErrors should format multiple errors', () => {
      const errors = [
        { path: '/profile/name', message: 'is required', value: undefined },
        { path: '/system/memoryBackend', message: 'invalid enum', value: 'invalid' },
      ];

      const result = formatValidationErrors(errors);
      assert.ok(result.includes('1. /profile/name'));
      assert.ok(result.includes('2. /system/memoryBackend'));
    });

    test('formatValidationErrors should handle empty errors', () => {
      const result = formatValidationErrors([]);
      assert.equal(result, 'No validation errors');
    });

    test('createValidationReport should create success report', () => {
      const result = createValidationReport({ valid: true, data: validProfile }, 'profile');
      assert.ok(result.includes('✓'));
      assert.ok(result.includes('profile configuration is valid'));
    });

    test('createValidationReport should create error report', () => {
      const validationResult = {
        valid: false,
        errors: [
          { path: '/test', message: 'test error', value: undefined },
        ],
      };
      
      const result = createValidationReport(validationResult, 'registry');
      assert.ok(result.includes('✗'));
      assert.ok(result.includes('registry configuration has 1 error'));
      assert.ok(result.includes('test error'));
    });
  });

  describe('Batch Validation', () => {
    test('should validate multiple configurations successfully', () => {
      const result = validateConfigurations({
        profile: validProfile,
        registry: validRegistry,
      });

      assert.ok(result.allValid);
      assert.ok(result.profile?.valid);
      assert.ok(result.registry?.valid);
    });

    test('should detect validation failures in batch', () => {
      const result = validateConfigurations({
        profile: {},
        registry: validRegistry,
      });

      assert.ok(!result.allValid);
      assert.ok(!result.profile?.valid);
      assert.ok(result.registry?.valid);
    });

    test('should handle partial batch validation', () => {
      const result = validateConfigurations({
        profile: validProfile,
        // registry not provided
      });

      assert.ok(result.allValid);
      assert.ok(result.profile?.valid);
      assert.equal(result.registry, undefined);
    });
  });
});
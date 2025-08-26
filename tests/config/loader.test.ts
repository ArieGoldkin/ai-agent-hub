/**
 * Configuration loader and environment substitution tests
 */

import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';

import { 
  EnvironmentSubstitutionService, 
  ConfigurationBuilder,
  validateEnvironmentVariables,
} from '../../src/config/loader.js';

describe('Configuration Loader', () => {
  describe('EnvironmentSubstitutionService', () => {
    let envService: EnvironmentSubstitutionService;

    const setup = (): void => {
      envService = new EnvironmentSubstitutionService();
    };

    test('should substitute single environment variable', () => {
      setup();
      const result = envService.substitute('${TEST_VAR}', { TEST_VAR: 'test_value' });
      assert.equal(result, 'test_value');
    });

    test('should substitute multiple environment variables', () => {
      setup();
      const template = '${PROJECT_ROOT}/data/${NODE_ENV}';
      const env = {
        PROJECT_ROOT: '/app',
        NODE_ENV: 'development',
      };
      
      const result = envService.substitute(template, env);
      assert.equal(result, '/app/data/development');
    });

    test('should substitute same variable multiple times', () => {
      setup();
      const template = '${VAR}/${VAR}/file.txt';
      const env = { VAR: 'test' };
      
      const result = envService.substitute(template, env);
      assert.equal(result, 'test/test/file.txt');
    });

    test('should handle template with no variables', () => {
      setup();
      const template = '/static/path/file.txt';
      const result = envService.substitute(template, {});
      assert.equal(result, '/static/path/file.txt');
    });

    test('should throw error for undefined variable', () => {
      setup();
      assert.throws(() => {
        envService.substitute('${UNDEFINED_VAR}', {});
      }, /Environment variable UNDEFINED_VAR is not defined/);
    });

    test('should extract variables from template', () => {
      setup();
      const template = '${PROJECT_ROOT}/data/${NODE_ENV}/${LOG_LEVEL}';
      const variables = envService.extractVariables(template);
      
      assert.deepEqual(variables.sort(), ['LOG_LEVEL', 'NODE_ENV', 'PROJECT_ROOT']);
    });

    test('should extract unique variables only', () => {
      setup();
      const template = '${VAR}/${VAR}/${OTHER_VAR}';
      const variables = envService.extractVariables(template);
      
      assert.deepEqual(variables.sort(), ['OTHER_VAR', 'VAR']);
    });

    test('should handle template with no variables for extraction', () => {
      setup();
      const template = '/static/path';
      const variables = envService.extractVariables(template);
      
      assert.deepEqual(variables, []);
    });

    test('should validate successful substitution', () => {
      setup();
      const result = envService.validate('${TEST_VAR}', { TEST_VAR: 'value' });
      
      assert.ok(result.valid);
      assert.equal(result.data, 'value');
      assert.equal(result.errors, undefined);
    });

    test('should validate failed substitution', () => {
      setup();
      const result = envService.validate('${MISSING_VAR}', {});
      
      assert.ok(!result.valid);
      assert.ok(result.errors);
      assert.ok(result.errors.length > 0);
      assert.ok(result.errors[0].message.includes('MISSING_VAR is not defined'));
    });

    test('should handle complex variable patterns', () => {
      setup();
      const template = 'prefix_${VAR_1}_middle_${VAR_2}_suffix';
      const env = {
        VAR_1: 'first',
        VAR_2: 'second',
      };
      
      const result = envService.substitute(template, env);
      assert.equal(result, 'prefix_first_middle_second_suffix');
    });

    test('should handle edge case variable names', () => {
      setup();
      const template = '${A}/${A_B}/${A_B_C_123}';
      const env = {
        A: 'a',
        A_B: 'ab',
        A_B_C_123: 'abc123',
      };
      
      const result = envService.substitute(template, env);
      assert.equal(result, 'a/ab/abc123');
    });
  });

  describe('Environment Variable Validation', () => {
    test('should validate correct environment variables', () => {
      const mockRuntimeConfig = {
        profile: { name: 'test', version: '1.0.0', description: 'test' },
        system: { 
          projectRoot: '/test',
          memoryBackend: 'sqlite' as const,
          contextDirectory: '.test',
        },
        servers: { enabled: {}, disabled: [] },
        resolvedProjectRoot: '/test',
        activeServers: {
          filesystem: {
            name: 'Filesystem',
            description: 'Test filesystem',
            package: '@test/filesystem',
            transport: 'stdio' as const,
            capabilities: ['filesystem' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {
              PROJECT_ROOT: '/test/project',
            },
            enabledTools: new Set(['read_file']),
            security: {
              environmentVariables: ['PROJECT_ROOT'],
            },
          },
        },
      };

      // Mock process.env
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        PROJECT_ROOT: '/test/project',
      };

      try {
        const result = validateEnvironmentVariables(mockRuntimeConfig);
        
        assert.ok(result.valid);
        assert.deepEqual(result.missing, []);
        assert.deepEqual(result.invalid, []);
      } finally {
        process.env = originalEnv;
      }
    });

    test('should detect missing environment variables', () => {
      const mockRuntimeConfig = {
        profile: { name: 'test', version: '1.0.0', description: 'test' },
        system: { 
          projectRoot: '/test',
          memoryBackend: 'sqlite' as const,
          contextDirectory: '.test',
        },
        servers: { enabled: {}, disabled: [] },
        resolvedProjectRoot: '/test',
        activeServers: {
          github: {
            name: 'GitHub',
            description: 'GitHub integration',
            package: '@test/github',
            transport: 'stdio' as const,
            capabilities: ['github' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {},
            enabledTools: new Set(),
            security: {
              environmentVariables: ['GITHUB_TOKEN'],
            },
          },
        },
      };

      const result = validateEnvironmentVariables(mockRuntimeConfig);
      
      assert.ok(!result.valid);
      assert.deepEqual(result.missing, ['github.GITHUB_TOKEN']);
      assert.deepEqual(result.invalid, []);
    });

    test('should detect invalid environment variables', () => {
      const mockRuntimeConfig = {
        profile: { name: 'test', version: '1.0.0', description: 'test' },
        system: { 
          projectRoot: '/test',
          memoryBackend: 'sqlite' as const,
          contextDirectory: '.test',
        },
        servers: { enabled: {}, disabled: [] },
        resolvedProjectRoot: '/test',
        activeServers: {
          context7: {
            name: 'Context7',
            description: 'Documentation search',
            package: '@test/context7',
            transport: 'http' as const,
            capabilities: ['documentation' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {
              CONTEXT7_API_KEY: '   ', // Invalid - whitespace only
            },
            enabledTools: new Set(),
            security: {
              environmentVariables: ['CONTEXT7_API_KEY'],
            },
          },
        },
      };

      const result = validateEnvironmentVariables(mockRuntimeConfig);
      
      assert.ok(!result.valid);
      assert.deepEqual(result.missing, []);
      assert.deepEqual(result.invalid, ['context7.CONTEXT7_API_KEY']);
    });

    test('should validate multiple servers with mixed results', () => {
      const mockRuntimeConfig = {
        profile: { name: 'test', version: '1.0.0', description: 'test' },
        system: { 
          projectRoot: '/test',
          memoryBackend: 'sqlite' as const,
          contextDirectory: '.test',
        },
        servers: { enabled: {}, disabled: [] },
        resolvedProjectRoot: '/test',
        activeServers: {
          filesystem: {
            name: 'Filesystem',
            description: 'Test filesystem',
            package: '@test/filesystem',
            transport: 'stdio' as const,
            capabilities: ['filesystem' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {
              PROJECT_ROOT: '/valid/path',
            },
            enabledTools: new Set(),
            security: {
              environmentVariables: ['PROJECT_ROOT'],
            },
          },
          github: {
            name: 'GitHub',
            description: 'GitHub integration',
            package: '@test/github',
            transport: 'stdio' as const,
            capabilities: ['github' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {},
            enabledTools: new Set(),
            security: {
              environmentVariables: ['GITHUB_TOKEN'],
            },
          },
        },
      };

      const result = validateEnvironmentVariables(mockRuntimeConfig);
      
      assert.ok(!result.valid);
      assert.deepEqual(result.missing, ['github.GITHUB_TOKEN']);
      assert.deepEqual(result.invalid, []);
    });

    test('should handle servers without environment variables', () => {
      const mockRuntimeConfig = {
        profile: { name: 'test', version: '1.0.0', description: 'test' },
        system: { 
          projectRoot: '/test',
          memoryBackend: 'sqlite' as const,
          contextDirectory: '.test',
        },
        servers: { enabled: {}, disabled: [] },
        resolvedProjectRoot: '/test',
        activeServers: {
          'sequential-thinking': {
            name: 'Sequential Thinking',
            description: 'Reasoning capabilities',
            package: '@test/sequential-thinking',
            transport: 'stdio' as const,
            capabilities: ['reasoning' as const],
            category: 'test',
            enabled: true,
            resolvedConfig: {},
            resolvedEnvironmentVariables: {},
            enabledTools: new Set(),
            security: {
              environmentVariables: [], // No environment variables required
            },
          },
        },
      };

      const result = validateEnvironmentVariables(mockRuntimeConfig);
      
      assert.ok(result.valid);
      assert.deepEqual(result.missing, []);
      assert.deepEqual(result.invalid, []);
    });
  });

  describe('Configuration Deep Merging', () => {
    test('should handle deep merge correctly', async () => {
      const builder = new ConfigurationBuilder();
      
      // Create test configurations that will test deep merging
      const testOverrides = {
        system: {
          logLevel: 'debug' as const,
        },
        security: {
          rateLimiting: {
            requestsPerMinute: 120,
          },
        },
      };

      builder.withOverrides(testOverrides);
      builder.withEnvironment({
        PROJECT_ROOT: '/test/merge',
      });

      const result = await builder.build();
      
      // Should preserve existing values while merging overrides
      assert.equal(result.system.logLevel, 'debug');
      assert.equal(result.system.memoryBackend, 'sqlite'); // Should keep default
      assert.equal(result.resolvedProjectRoot, '/test/merge');
    });

    test('should handle array overrides correctly', async () => {
      const builder = new ConfigurationBuilder();
      
      const testOverrides = {
        servers: {
          disabled: ['context7', 'playwright'],
        },
      };

      builder.withOverrides(testOverrides);
      builder.withEnvironment({
        PROJECT_ROOT: '/test/array',
      });

      const result = await builder.build();
      
      // Arrays should be replaced, not merged
      assert.deepEqual(result.servers.disabled, ['context7', 'playwright']);
    });

    test('should handle nested object merging', async () => {
      const builder = new ConfigurationBuilder();
      
      const testOverrides = {
        features: {
          enableBrowserAutomation: true,
          // Other features should remain from default
        },
      };

      builder.withOverrides(testOverrides);
      builder.withEnvironment({
        PROJECT_ROOT: '/test/nested',
      });

      const result = await builder.build();
      
      assert.equal(result.features?.enableBrowserAutomation, true);
      assert.equal(result.features?.enableGitHubIntegration, true); // From default
    });
  });
});
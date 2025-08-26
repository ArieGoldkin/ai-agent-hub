/**
 * Configuration system tests
 */

import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';

import type { ProfileConfig, ServerRegistry } from '../../src/types/config.js';
import { ConfigurationLoader, ConfigurationBuilder, loadDefaultConfiguration } from '../../src/config/loader.js';

describe('Configuration System', () => {
  let tempDir: string;
  let validProfile: ProfileConfig;
  let validRegistry: ServerRegistry;

  // Setup test data
  const setupTestData = (): void => {
    tempDir = mkdtempSync(join(tmpdir(), 'ai-agent-hub-test-'));

    validProfile = {
      profile: {
        name: 'Test Profile',
        version: '1.0.0',
        description: 'Test configuration',
      },
      system: {
        projectRoot: '${TEST_PROJECT_ROOT}',
        memoryBackend: 'sqlite',
        contextDirectory: '.test-context',
        logLevel: 'debug',
        enableAuditLog: true,
      },
      servers: {
        enabled: {
          filesystem: {
            enabled: true,
            config: {
              maxFileSize: '5MB',
            },
            environmentVariables: {
              PROJECT_ROOT: '${TEST_PROJECT_ROOT}',
            },
          },
        },
        disabled: [],
      },
      security: {
        authMode: 'none',
        requireAuthentication: false,
        sandboxMode: true,
      },
      features: {
        enableBrowserAutomation: false,
        enableGitHubIntegration: true,
      },
    };

    validRegistry = {
      servers: {
        filesystem: {
          name: 'Test Filesystem',
          description: 'Test filesystem server',
          package: '@test/filesystem',
          version: '1.0.0',
          transport: 'stdio',
          capabilities: ['filesystem'],
          tools: [
            {
              name: 'read_file',
              description: 'Read file',
              security: 'sandboxed',
            },
          ],
          security: {
            sandboxed: true,
            requiresAuth: false,
            permissions: ['read', 'filesystem'],
            environmentVariables: ['PROJECT_ROOT'],
          },
          defaultConfig: {
            maxFileSize: '10MB',
          },
          category: 'core',
        },
      },
      categories: {
        core: {
          name: 'Core',
          description: 'Core servers',
          servers: ['filesystem'],
        },
      },
    };
  };

  // Cleanup after tests
  const cleanup = (): void => {
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors in tests
      }
    }
  };

  describe('ConfigurationLoader', () => {
    test('should load valid profile configuration', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));

      const loader = new ConfigurationLoader();
      const result = await loader.loadProfile(profilePath);

      assert.deepEqual(result.profile, validProfile.profile);
      assert.deepEqual(result.system, validProfile.system);
      cleanup();
    });

    test('should load valid registry configuration', async () => {
      setupTestData();
      const registryPath = join(tempDir, 'registry.json');
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const loader = new ConfigurationLoader();
      const result = await loader.loadRegistry(registryPath);

      assert.deepEqual(result.servers, validRegistry.servers);
      assert.deepEqual(result.categories, validRegistry.categories);
      cleanup();
    });

    test('should throw error for invalid profile', async () => {
      setupTestData();
      const invalidProfile = { invalid: 'config' };
      const profilePath = join(tempDir, 'invalid-profile.json');
      writeFileSync(profilePath, JSON.stringify(invalidProfile, null, 2));

      const loader = new ConfigurationLoader();
      
      await assert.rejects(
        async () => await loader.loadProfile(profilePath),
        /Invalid profile configuration/
      );
      cleanup();
    });

    test('should throw error for non-existent file', async () => {
      const loader = new ConfigurationLoader();
      
      await assert.rejects(
        async () => await loader.loadProfile('/non/existent/path.json'),
        /Failed to load profile/
      );
    });

    test('should validate profile configuration', () => {
      setupTestData();
      const loader = new ConfigurationLoader();
      
      const result = loader.validateProfile(validProfile);
      assert.deepEqual(result, validProfile);
      cleanup();
    });

    test('should throw error for invalid profile validation', () => {
      const loader = new ConfigurationLoader();
      const invalidProfile = { invalid: 'config' };
      
      assert.throws(
        () => loader.validateProfile(invalidProfile),
        /Invalid profile configuration/
      );
    });
  });

  describe('ConfigurationBuilder', () => {
    test('should build runtime configuration with defaults', async () => {
      const builder = new ConfigurationBuilder();
      
      // Set test environment
      const testEnv = {
        PROJECT_ROOT: '/test/project',
        NODE_ENV: 'test',
      };
      
      builder.withEnvironment(testEnv);
      
      const result = await builder.build();
      
      assert.ok(result.profile);
      assert.ok(result.system);
      assert.ok(result.servers);
      assert.equal(result.resolvedProjectRoot, '/test/project');
      assert.ok(result.activeServers);
    });

    test('should apply configuration overrides', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      const registryPath = join(tempDir, 'registry.json');
      
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const builder = new ConfigurationBuilder()
        .fromProfile(profilePath)
        .fromRegistry(registryPath)
        .withOverrides({
          system: {
            logLevel: 'error',
          },
        })
        .withEnvironment({
          TEST_PROJECT_ROOT: '/override/project',
        });

      const result = await builder.build();
      
      assert.equal(result.system.logLevel, 'error');
      assert.equal(result.resolvedProjectRoot, '/override/project');
      cleanup();
    });

    test('should resolve environment variables', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      const registryPath = join(tempDir, 'registry.json');
      
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const testProjectRoot = '/test/resolved/project';
      
      const builder = new ConfigurationBuilder()
        .fromProfile(profilePath)
        .fromRegistry(registryPath)
        .withEnvironment({
          TEST_PROJECT_ROOT: testProjectRoot,
        });

      const result = await builder.build();
      
      assert.equal(result.system.projectRoot, testProjectRoot);
      assert.equal(result.resolvedProjectRoot, testProjectRoot);
      cleanup();
    });

    test('should resolve active servers', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      const registryPath = join(tempDir, 'registry.json');
      
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const builder = new ConfigurationBuilder()
        .fromProfile(profilePath)
        .fromRegistry(registryPath)
        .withEnvironment({
          TEST_PROJECT_ROOT: '/test/project',
        });

      const result = await builder.build();
      
      assert.ok(result.activeServers.filesystem);
      assert.equal(result.activeServers.filesystem.enabled, true);
      assert.equal(result.activeServers.filesystem.name, 'Test Filesystem');
      assert.ok(result.activeServers.filesystem.enabledTools.has('read_file'));
      cleanup();
    });

    test('should merge server configurations', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      const registryPath = join(tempDir, 'registry.json');
      
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const builder = new ConfigurationBuilder()
        .fromProfile(profilePath)
        .fromRegistry(registryPath)
        .withEnvironment({
          TEST_PROJECT_ROOT: '/test/project',
        });

      const result = await builder.build();
      
      // Should merge default config with profile overrides
      const filesystemConfig = result.activeServers.filesystem.resolvedConfig;
      assert.equal(filesystemConfig.maxFileSize, '5MB'); // From profile override
      cleanup();
    });
  });

  describe('Default Configuration Loading', () => {
    test('should load default configuration successfully', async () => {
      // Set minimal required environment
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        PROJECT_ROOT: process.cwd(),
        NODE_ENV: 'test',
      };

      try {
        const result = await loadDefaultConfiguration();
        
        assert.ok(result.profile);
        assert.ok(result.system);
        assert.ok(result.servers);
        assert.ok(result.resolvedProjectRoot);
        assert.ok(result.activeServers);
        
        // Should have core servers enabled
        assert.ok(result.activeServers.filesystem);
        assert.ok(result.activeServers.git);
        assert.ok(result.activeServers.github);
      } finally {
        process.env = originalEnv;
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle missing environment variables', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'profile.json');
      const registryPath = join(tempDir, 'registry.json');
      
      writeFileSync(profilePath, JSON.stringify(validProfile, null, 2));
      writeFileSync(registryPath, JSON.stringify(validRegistry, null, 2));

      const builder = new ConfigurationBuilder()
        .fromProfile(profilePath)
        .fromRegistry(registryPath)
        .withEnvironment({}); // Empty environment

      await assert.rejects(
        async () => await builder.build(),
        /Failed to resolve PROJECT_ROOT/
      );
      cleanup();
    });

    test('should handle invalid JSON files', async () => {
      setupTestData();
      const profilePath = join(tempDir, 'invalid.json');
      writeFileSync(profilePath, '{ invalid json }');

      const loader = new ConfigurationLoader();
      
      await assert.rejects(
        async () => await loader.loadProfile(profilePath),
        /Failed to load profile/
      );
      cleanup();
    });
  });
});
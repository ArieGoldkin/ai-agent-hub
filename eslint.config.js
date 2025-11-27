import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'complexity': ['error', { max: 15 }],
      'max-params': ['error', 5],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  // Override for core library files that legitimately need more lines
  {
    files: [
      'lib/context/types.ts',
      'lib/quality-gates/gate-validator.ts'
    ],
    rules: {
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }]
    }
  },
  // Context manager is the core orchestration file with many responsibilities
  {
    files: ['lib/context/context-manager.ts'],
    rules: {
      'max-lines': ['error', { max: 850, skipBlankLines: true, skipComments: true }]
    }
  },
  // Override for skill templates (reference implementations meant to be copied)
  {
    files: ['skills/**/templates/*.ts', 'skills/**/examples/*.ts'],
    rules: {
      'max-lines': ['error', { max: 350, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  // Override for squad patterns (orchestration reference code)
  {
    files: ['.squad/patterns/*.ts'],
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }]
    }
  },
  // Override for CLI commands
  {
    files: ['bin/commands/*.ts'],
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }]
    }
  },
  {
    ignores: ['dist/', 'node_modules/', '*.js']
  }
];
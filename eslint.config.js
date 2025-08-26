import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'bin/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off', // Disable base rule as we use TypeScript version
      
      // General code quality
      'no-console': 'off', // CLI tools need console output
      'no-process-exit': 'off', // CLI tools may need to exit
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'quotes': ['error', 'double', { avoidEscape: true }],
      'semi': ['error', 'always'],
      
      // Import/Export
      'no-duplicate-imports': 'error',
      
      // Error prevention
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-dupe-keys': 'error',
      'no-empty': 'error',
      'valid-typeof': 'error'
    }
  },
  {
    files: ['*.js', '*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '**/*.d.ts'
    ]
  }
];
# Contributing

## Development Setup

1. Install Node.js 20+ (22 LTS recommended)
2. Enable Corepack: `corepack enable`
3. Install dependencies: `pnpm install`

## Coding Standards

- **TypeScript**: Strict mode enabled with all strict checks
- **ESM Only**: Use `import/export`, no CommonJS
- **Code Style**: Prettier with 2 spaces, no semicolons
- **Linting**: ESLint 9 with flat config
- **Testing**: Node.js built-in test runner

## Scripts

```bash
pnpm dev          # Development with watch mode
pnpm build        # Build TypeScript to JavaScript
pnpm lint         # Lint code with ESLint
pnpm lint:fix     # Fix linting issues automatically
pnpm type-check   # Type checking without emit
pnpm test         # Run tests
pnpm clean        # Clean build artifacts
```

## Git Workflow

- Pre-commit hooks run linting and formatting
- Conventional commit messages preferred
- All checks must pass in CI

## Code Quality

- Write tests for new features
- Maintain TypeScript strict compliance
- Follow existing architectural patterns
- Keep dependencies minimal
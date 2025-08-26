# AI Agent Hub

Enhanced AI Agent Hub - A modern MCP (Model Context Protocol) server orchestration system designed to bundle essential and optional MCP servers with secure defaults and provide a unified gateway for AI agents.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint
```

## Requirements

- Node.js 20+ (22 LTS recommended)
- pnpm 9+

## Project Structure

```
ai-agent-hub/
├── src/                 # Source code
│   ├── config/         # Configuration modules
│   ├── orchestration/  # Gateway logic
│   ├── servers/        # MCP servers
│   └── types/          # TypeScript definitions
├── bin/                # CLI entry points
├── tests/              # Test files
└── agents/             # AI agent definitions
```

## Development

This project uses:
- TypeScript with strict mode
- ESLint 9 with flat config
- Prettier for code formatting
- Husky for git hooks
- GitHub Actions for CI

## License

MIT
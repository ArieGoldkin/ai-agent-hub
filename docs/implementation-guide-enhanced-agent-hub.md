## Implementation Guide: Enhanced AI Agent Hub (2025 Best Practices)

Small, attainable steps to ship the hub with modern Node.js, Docker, security, and key MCP servers. Use this as the implementation checklist.

### Goals

- Bundle essential and optional MCP servers with sane, secure defaults
- Unified gateway that proxies child server tools
- Simple CLI (setup + doctor) and production-ready containers
- Tests and smoke checks from day one

---

### Prerequisites (2025-ready)

- Node.js 20+ (prefer 22 LTS), Corepack enabled (pnpm or npm)
- Docker 26+ and Docker Compose v2
- Git 2.44+, GitHub auth (OAuth app or PAT) stored outside git
- Optional: kubectl for Kubernetes

Notes:

- Enable Corepack: `corepack enable`; prefer pnpm for monorepos
- Use ESM-only, TypeScript strict, ESLint flat config, Prettier

---

### High-level Checklist

1. ✅ Config registry + default profile (Sprint 1 - COMPLETE)
2. Orchestration gateway + tool proxying (Sprint 2 - Next)
3. CLI: setup wizard, doctor, gateway start (Sprint 3)
4. Memory + project context (local-first) (Sprint 4)
5. Security (secrets, sandboxing, audit) (Sprint 5)
6. Docker Compose (and optional K8s) (Sprint 6-7)
7. Tests: unit, integration, Playwright E2E (Sprint 8)

### Implementation Progress

**Completed Sprints:**
- **Sprint 0:** Foundation & Tooling (2h, Quality: 92/100)
- **Sprint 1:** Configuration System (5h, Quality: 96/100)

**Current Status:** Ready for Sprint 2 - Orchestration Gateway

---

### 1) Configuration

Centralize server registry and defaults.

- Files:
  - config/server-registry.json
  - config/default-profile.json
  - agents/config/bundled-servers.ts

```jsonc
// config/server-registry.json (add optional servers as needed)
{
  "filesystem": {
    "name": "@modelcontextprotocol/server-filesystem",
    "version": "latest"
  },
  "git": { "name": "@modelcontextprotocol/server-git", "version": "latest" },
  "github": {
    "name": "@modelcontextprotocol/server-github",
    "version": "latest"
  },
  // Optional additions (verified package names where available):
  "playwright": { "name": "@playwright/mcp", "version": "latest" },
  "context7": { "name": "@upstash/context7-mcp", "version": "latest" },
  "sequential-thinking": {
    "name": "@modelcontextprotocol/server-sequential-thinking",
    "version": "latest"
  }
}
```

```jsonc
// config/default-profile.json
{
  "servers": ["filesystem", "git", "github"],
  "optionalServers": ["playwright", "context7", "supernatural-thinking"],
  "memoryBackend": "sqlite",
  "projectContextDir": ".agent-context"
}
```

```ts
// agents/config/bundled-servers.ts (defaults; tighten per env)
export const BUNDLED_SERVERS = {
  filesystem: {
    name: "@modelcontextprotocol/server-filesystem",
    version: "latest",
    config: {
      allowedPaths: ["${PROJECT_ROOT}"],
      readOnly: false,
      respectGitignore: true,
      maxFileSize: "10MB",
    },
    capabilities: ["read", "write", "list", "search"],
  },
  git: {
    name: "@modelcontextprotocol/server-git",
    version: "latest",
    config: { autoCommit: false, branchPrefix: "agent/", signCommits: true },
    capabilities: ["commit", "branch", "diff", "log", "stash"],
  },
  github: {
    name: "@modelcontextprotocol/server-github",
    version: "latest",
    config: {
      auth: { type: "oauth", fallback: "pat" },
      scopes: ["repo", "issues", "pull_requests"],
    },
    capabilities: ["create_pr", "manage_issues", "review_code"],
  },
  // Optional MCPs (verified where possible):
  playwright: {
    name: "@playwright/mcp",
    version: "latest",
    config: { browser: "chromium", headless: true, timeoutMs: 30000 },
    capabilities: ["navigate", "query", "screenshot"],
  },
  context7: {
    name: "@upstash/context7-mcp",
    version: "latest",
    config: { apiKeyEnv: "CONTEXT7_API_KEY" },
    capabilities: ["search_docs", "fetch_snippets"],
  },
  sequentialThinking: {
    name: "@modelcontextprotocol/server-sequential-thinking",
    version: "latest",
    config: { maxDepth: 3 },
    capabilities: ["plan", "reflect", "optimize"],
  },
} as const;
```

Success criteria: Registry resolves core + optional servers; TS compiles.

---

### 2) Orchestration (Gateway)

- ESM modules, async init, cancellation (AbortController), retries with backoff
- Structured logs (pino), health checks per child server
- Expose tools as `${server}_${tool}`; propagate tracing context

```ts
// orchestration/gateway.ts (skeleton)
export class AgentHubGateway {
  private servers = new Map<string, any>();
  async initialize(bundled: any) {
    for (const [id, cfg] of Object.entries(bundled)) {
      const server = await this.launchServer(cfg);
      this.servers.set(id, server);
      for (const tool of server.tools ?? []) {
        this.registerTool(`${id}_${tool.name}`, this.proxy(id, tool));
      }
    }
  }
  private async launchServer(cfg: any) {
    /* spawn/import; attach healthcheck */
  }
  private registerTool(name: string, handler: any) {
    /* expose to clients */
  }
  private proxy(id: string, tool: any) {
    return async (args: any) => this.servers.get(id)?.execute(tool.name, args);
  }
}
```

---

### 3) CLI (modern Node)

- ESM shebang files in bin/, use `tsx` for dev, `node --enable-source-maps` in prod
- Use enquirer or prompts; write config to config/
- Commands: setup | doctor | gateway-start

Doctor checks: Node 20/22, Docker, Git, env vars, ports

---

### 4) Memory & Project Context (local-first)

- servers/core/memory: SQLite (better-sqlite3/Drizzle); Postgres later
- servers/core/project-context: manage `${PROJECT_ROOT}/.agent-context/`:
  - decisions.jsonl, patterns.json, workflows.json, dependencies.graph
- Preserve full code; summarize discussions with rationale

---

### 5) Security & Credentials (baseline)

- No secrets in git. Load from env or secret managers (1Password, Vault, AWS SM)
- GitHub scopes: minimum required (repo, issues, pull_requests)
- Sandboxing: FS constrained to ${PROJECT_ROOT}; validate paths; size limits
- Audit: append-only JSONL; include hashes, user, agent, action, result
- Supply chain: lockfiles committed; verify image signatures (cosign) when possible

Env vars:

- GITHUB_AUTH_MODE=oauth|pat, GITHUB_TOKEN=... (PAT mode)
- CONTEXT7_API_KEY=...
- MEMORY_BACKEND=sqlite|postgresql|hybrid, PROJECT_ROOT=abs path

---

### 6) Docker (2025 best practices)

- Multi-stage builds; non-root user; read-only root FS; drop capabilities
- Healthchecks; small images. For Playwright use official Playwright image (Jammy)
- Compose example (trimmed):

```yaml
services:
  gateway:
    image: ai-agent-hub:latest
    ports: ["3000:3000"]
    environment:
      - MCP_MODE=gateway
      - MEMORY_BACKEND=sqlite
    read_only: true
    security_opt: ["no-new-privileges:true"]
    cap_drop: ["ALL"]

  playwright:
    image: mcr.microsoft.com/playwright:v1-latest
    shm_size: 1g
    user: pwuser
    security_opt: ["no-new-privileges:true"]
```

Kubernetes (optional): set runAsNonRoot, readOnlyRootFilesystem, probes.

---

### 7) Testing & Validation

- Unit: registry loader, gateway proxy, memory read/write
- Integration: gateway + filesystem tool call
- E2E: Playwright scripts (headless, CI friendly)
- Smoke:
  - `node bin/doctor.js` -> green
  - `node bin/cli.js gateway-start` -> lists filesystem*\*, git*\_, github\_\_ (and optional ones)
  - Filesystem read/write within ${PROJECT_ROOT} works and is audited

---

### 8) Optional Next Steps

- Add context compression pipeline; workflow template extraction
- Agent collaboration protocol (delegate/merge); performance dashboard
- Postgres + Redis backends; Docker Compose profiles for prod/dev

Keep scope tight; ship essentials first, iterate weekly.

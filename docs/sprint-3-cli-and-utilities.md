## Sprint 3: CLI & Utilities (Stage 3)

Duration: 1 week

### Goals

- Provide npx entry with setup wizard and doctor

### Tasks and Estimates

1. CLI entry (bin/cli.mjs) – 4h

   - ESM shebang, commands: setup | doctor | gateway-start
   - Acceptance: `node bin/cli.mjs --help` prints usage

2. Setup wizard (bin/setup-wizard.mjs) – 8h

   - enquirer prompts: quick/custom; select agents/servers
   - Include optional MCPs: Sequential Thinking (@modelcontextprotocol/server-sequential-thinking), Context7 (@upstash/context7-mcp), Playwright (@playwright/mcp)
   - Acceptance: writes config/default-profile.json accordingly

3. Doctor (bin/doctor.mjs) – 4h

   - Checks Node (20/22), Docker, Git, env vars, port 3000
   - Acceptance: prints green checks or actionable errors

4. Wire gateway-start to gateway – 3h
   - Acceptance: starts gateway and lists tools

Total estimate: ~19h

### Technical Notes & Examples

```js
#!/usr/bin/env node
import { Select, MultiSelect } from "enquirer";
// ... parse argv, route to commands
```

### Testing Requirements

- Unit: argument parsing; config writer
- Integration: run setup wizard in non-interactive mode; doctor checks
- Validate generated config against JSON Schemas:
  - config/server-registry.json -> config/schemas/server-registry.schema.json
  - config/default-profile.json -> config/schemas/default-profile.schema.json

### Risks & Mitigation

- Risk: Interactive prompts in CI
  - Mitigation: add non-interactive flags and defaults

### Definition of Done

- CLI runnable locally; setup updates profile; doctor validates environment
- Optional MCP choices appear in the wizard and config

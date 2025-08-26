## Sprint 8: Testing & Validation (Stage 8)

Duration: 1 week

### Goals

- Establish testing strategy: unit, integration, Playwright E2E

### Tasks and Estimates

1. Unit tests – 6h

   - Registry loader, profile reader, gateway proxy, memory read/write
   - Acceptance: unit suite passes locally and in CI

2. Integration tests – 6h

   - Gateway + filesystem server end-to-end tool call
   - Acceptance: integration suite passes

3. Playwright E2E – 6h

   - Configure Playwright MCP and example flows (navigate, query, screenshot)
   - Acceptance: headless run passes locally and in CI

4. CI wiring (optional) – 4h
   - GitHub Actions workflow; Node 22; cache pnpm; run tests

Total estimate: ~22h

### Technical Notes & Examples

```bash
# Example Playwright run
npx playwright test --reporter=list
```

### Testing Requirements

- Unit, integration, and E2E suites in package scripts
- Config validation with JSON Schemas using Ajv:
  - config/server-registry.json -> config/schemas/server-registry.schema.json
  - config/default-profile.json -> config/schemas/default-profile.schema.json

### Risks & Mitigation

- Risk: Flaky E2E
  - Mitigation: retries, timeouts, network stabilization, deterministic test data

### Definition of Done

- All tests green locally; CI workflow green; artifacts stored (reports)

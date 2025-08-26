## Sprint 4: Memory & Project Context (Stage 4)

Duration: 1 week

### Goals

- Implement local-first memory and .agent-context storage

### Tasks and Estimates

1. Memory interface + SQLite stub – 8h

   - servers/core/memory/index.ts using better-sqlite3 or Drizzle
   - Methods: storeInteraction, getBySession, search, prune
   - Acceptance: unit tests pass; basic reads/writes

2. Project context manager – 6h

   - servers/core/project-context/index.ts
   - Manage `${PROJECT_ROOT}/.agent-context/` files
   - Acceptance: files created and updated

3. Sequential Thinking integration (optional) – 4h
   - Hook reasoning outputs into memory tiers (@modelcontextprotocol/server-sequential-thinking)
   - Acceptance: stored with category and metadata

Total estimate: ~18h

### Technical Notes & Examples

```ts
export interface Memory {
  storeInteraction(x: any): Promise<void>;
  getBySession(id: string): Promise<any[]>;
}
```

### Testing Requirements

- Unit: memory read/write; context file creation
- Integration: gateway calls that persist to memory

### Risks & Mitigation

- Risk: SQLite locking under concurrency
  - Mitigation: single-writer queue; WAL mode

### Definition of Done

- Memory and project context operational; tests cover main flows

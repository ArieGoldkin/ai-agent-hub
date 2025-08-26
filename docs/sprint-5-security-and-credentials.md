## Sprint 5: Security & Credentials (Stage 5)

Duration: 1 week

### Goals

- Secure secrets, sandbox filesystem access, and add audit logging

### Tasks and Estimates

1. Secrets handling – 5h

   - Load from env or providers (1Password CLI/Vault/AWS SM)
   - Acceptance: no plaintext secrets in repo; docs include env names

2. Filesystem sandbox validation – 6h

   - Enforce allowedPaths within ${PROJECT_ROOT}; path traversal checks
   - Acceptance: attempts to escape root are denied and logged

3. Audit logger – 6h

   - Append-only JSONL with timestamp, user, agent, action, resources, result, hash
   - Acceptance: audit entries generated for key actions

4. Context7 API key wiring – 2h
   - Read CONTEXT7_API_KEY; pass to MCP server (@upstash/context7-mcp)

Total estimate: ~19h

### Technical Notes & Examples

```ts
class AuditLogger {
  async log(action: any) {
    /* write JSONL with hash */
  }
}
```

### Testing Requirements

- Unit: path guards, audit log format
- Integration: secret injection to GitHub and Context7 servers

### Risks & Mitigation

- Risk: Overly strict sandbox breaks tools
  - Mitigation: configurable allowlist and clear error messages

### Definition of Done

- Secrets loaded securely; FS sandbox enforced; audit logs created

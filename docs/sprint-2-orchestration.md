## Sprint 2: Orchestration (Stage 2)

Duration: 1 week

### Goals
- Build the gateway that launches and proxies MCP servers
- Basic router and load-balancer stub

### Tasks and Estimates
1) Gateway bootstrap (orchestration/gateway.ts) – 8h
   - Async init, start/stop lifecycle, health checks
   - Register tools as `${server}_${tool}`
   - Acceptance: can list tools, call a filesystem read via proxy

2) Router (orchestration/router.ts) – 4h
   - Simple passthrough; logging/tracing hook points
   - Acceptance: requests pass to the intended server

3) Load-balancer stub (orchestration/load-balancer.ts) – 3h
   - Interface for future per-server balancing
   - Acceptance: compiles, no-op balancing

4) Logging (pino) and retry/backoff – 3h
   - Acceptance: logs include server id, tool, latency; retry on transient failures

Total estimate: ~18h

### Technical Notes & Examples
```ts
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
  private async launchServer(cfg: any) {/* spawn/import; attach health checks */}
  private registerTool(name: string, handler: any) {/* expose to clients */}
  private proxy(id: string, tool: any) { return async (args: any) => this.servers.get(id)?.execute(tool.name, args); }
}
```

### Testing Requirements
- Unit: tool name mapping; router passes args; retry logic
- Integration: gateway + filesystem server end-to-end call

### Risks & Mitigation
- Risk: Child server startup race conditions
  - Mitigation: health checks and readiness gates
- Risk: Unhandled rejections on child failures
  - Mitigation: centralized error handler and retries

### Definition of Done
- Gateway starts child servers, proxies at least one tool successfully
- Router and load balancer stubs exist and are wired
- Logs and basic retries present


## Sprint 6: Docker Compose (Stage 6)

Duration: 1 week

### Goals

- Production-ready containers with least privilege; optional Playwright container

### Tasks and Estimates

1. Dockerfile (multi-stage, non-root, read-only) – 6h

   - Healthcheck script; `node --enable-source-maps`
   - Acceptance: image builds quickly; size optimized

2. docker-compose.yml – 6h

   - Services: gateway, filesystem-server, memory-server, postgres (if needed), redis (optional), playwright
   - Security: no-new-privileges, cap_drop ALL, read_only FS
   - Acceptance: `docker compose up -d` green; health checks pass

3. Playwright MCP container – 4h

   - Use official Playwright image; shm_size=1g; user=pwuser
   - Package: @playwright/mcp (npm)
   - Acceptance: can execute a simple navigate+screenshot via gateway

4. Compose profiles – 2h
   - dev vs prod profiles

Total estimate: ~18h

### Technical Notes & Examples

```yaml
services:
  gateway:
    image: ai-agent-hub:latest
    ports: ["3000:3000"]
    read_only: true
    security_opt: ["no-new-privileges:true"]
    cap_drop: ["ALL"]

  playwright:
    image: mcr.microsoft.com/playwright:v1-latest
    shm_size: 1g
    user: pwuser
```

### Testing Requirements

- Integration: run compose, hit health endpoint, list tools
- E2E: Playwright flow via MCP through gateway

### Risks & Mitigation

- Risk: Large images
  - Mitigation: alpine+glibc or distroless where possible; cache bust control

### Definition of Done

- Compose up yields healthy services; Playwright MCP works via gateway

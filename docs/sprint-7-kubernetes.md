## Sprint 7: Kubernetes (Stage 7)

Duration: 1 week (optional sprint)

### Goals
- Provide baseline manifests with secure defaults

### Tasks and Estimates
1) k8s manifests – 8h
   - Deployment, Service, ConfigMap/Secret refs
   - securityContext: runAsNonRoot, readOnlyRootFilesystem
   - Probes: readiness/liveness
   - Acceptance: `kubectl apply -f k8s/` -> healthy pods

2) Optional sidecars – 4h
   - Filesystem server sidecar; volume mounts for workspace
   - Acceptance: gateway <-> sidecar communication works

3) Minimal Helm chart (optional) – 6h
   - Values for resources, images, env, secrets

Total estimate: ~18h

### Technical Notes & Examples
```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: gateway
        image: ai-agent-hub:latest
        securityContext:
          runAsNonRoot: true
          readOnlyRootFilesystem: true
```

### Testing Requirements
- Cluster smoke test: list tools, call filesystem read

### Risks & Mitigation
- Risk: PV/PVC provisioning issues
  - Mitigation: document storage class expectations

### Definition of Done
- Manifests applied successfully; probes healthy; secure defaults present


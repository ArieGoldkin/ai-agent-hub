# Observability & Monitoring Skill

> **Version**: 1.0.0
> **Category**: Operations & Reliability
> **Agents**: Backend System Architect, Code Quality Reviewer, AI/ML Engineer
> **Keywords**: observability, monitoring, logging, metrics, tracing, alerts, Prometheus, Grafana, OpenTelemetry, debugging

## Overview

This skill provides comprehensive frameworks for implementing observability in applications, including structured logging, metrics collection, distributed tracing, and alerting strategies.

## When to Use This Skill

Load this skill when:
- Setting up application monitoring
- Implementing structured logging
- Adding metrics and dashboards
- Configuring distributed tracing
- Creating alerting rules
- Debugging production issues
- Planning observability architecture

## The Three Pillars of Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                       OBSERVABILITY                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│     LOGS        │     METRICS     │         TRACES              │
│                 │                 │                             │
│  What happened  │  How is the     │  How do requests flow      │
│  at a specific  │  system         │  through distributed       │
│  point in time  │  performing     │  services                  │
│                 │  over time      │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## Structured Logging

### Log Levels and Usage

| Level | When to Use | Examples |
|-------|-------------|----------|
| **ERROR** | Application errors requiring attention | Unhandled exceptions, failed operations |
| **WARN** | Potentially harmful situations | Deprecated API usage, retry attempts |
| **INFO** | Important business events | User actions, successful operations |
| **DEBUG** | Development troubleshooting | Variable values, flow tracing |
| **TRACE** | Detailed diagnostic info | Entry/exit points, data dumps |

### Structured Logging Implementation

```typescript
// logger.ts - Winston-based structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'app',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : winston.format.json()
    }),
    // Add file transport for production
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : [])
  ],
});

// Add request context
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({
    requestId,
    userId,
  });
}

export default logger;
```

### Logging Best Practices

```typescript
// Good: Structured with context
logger.info('User action completed', {
  action: 'purchase',
  userId: user.id,
  orderId: order.id,
  amount: order.total,
  duration_ms: Date.now() - startTime,
});

// Bad: Unstructured string interpolation
logger.info(`User ${user.id} completed purchase of $${order.total}`);

// Good: Error with context
logger.error('Payment processing failed', {
  error: err.message,
  stack: err.stack,
  userId: user.id,
  orderId: order.id,
  paymentMethod: payment.method,
  retryAttempt: attempt,
});

// Bad: Just the error message
logger.error(err.message);
```

### Request Logging Middleware

```typescript
// middleware/request-logger.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  const startTime = Date.now();

  // Attach logger to request
  req.logger = logger.child({ requestId });
  req.requestId = requestId;

  // Log request
  req.logger.info('Request started', {
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration_ms: duration,
    };

    if (res.statusCode >= 500) {
      req.logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      req.logger.warn('Request client error', logData);
    } else {
      req.logger.info('Request completed', logData);
    }
  });

  next();
}
```

## Metrics Collection

### Prometheus Metrics

```typescript
// metrics.ts
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create registry
export const registry = new Registry();

// Collect default Node.js metrics
collectDefaultMetrics({ register: registry });

// HTTP request metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [registry],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry],
});

// Business metrics
export const orderTotal = new Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status', 'payment_method'],
  registers: [registry],
});

export const orderAmount = new Histogram({
  name: 'order_amount_dollars',
  help: 'Order amounts in dollars',
  buckets: [10, 50, 100, 500, 1000, 5000],
  registers: [registry],
});

// Database metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['query_type', 'table'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [registry],
});

export const dbConnectionPool = new Gauge({
  name: 'db_connection_pool_size',
  help: 'Database connection pool metrics',
  labelNames: ['state'],
  registers: [registry],
});

// Cache metrics
export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_name'],
  registers: [registry],
});

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_name'],
  registers: [registry],
});
```

### Metrics Middleware

```typescript
// middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestTotal } from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const route = req.route?.path || req.path;

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });

  next();
}
```

### Expose Metrics Endpoint

```typescript
// routes/metrics.ts
import { Router } from 'express';
import { registry } from '../metrics';

const router = Router();

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

export default router;
```

## Distributed Tracing

### OpenTelemetry Setup

```typescript
// tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'app',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
      '@opentelemetry/instrumentation-redis': { enabled: true },
    }),
  ],
});

// Start the SDK
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
```

### Manual Span Creation

```typescript
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('app');

async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    try {
      span.setAttribute('order.id', orderId);

      // Child span for payment processing
      await tracer.startActiveSpan('processPayment', async (paymentSpan) => {
        paymentSpan.setAttribute('payment.method', 'credit_card');
        await processPayment(orderId);
        paymentSpan.end();
      });

      // Child span for inventory update
      await tracer.startActiveSpan('updateInventory', async (inventorySpan) => {
        await updateInventory(orderId);
        inventorySpan.end();
      });

      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Alerting Strategy

### Alert Severity Levels

| Level | Response Time | Examples |
|-------|---------------|----------|
| **Critical (P1)** | Immediate (< 15 min) | Service down, data loss, security breach |
| **High (P2)** | < 1 hour | Major feature broken, performance degraded |
| **Medium (P3)** | < 4 hours | Minor feature issues, increased error rate |
| **Low (P4)** | Next business day | Warnings, non-critical issues |

### Prometheus Alerting Rules

```yaml
# alerts.yml
groups:
  - name: app-alerts
    rules:
      # High Error Rate
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} over the last 5 minutes"

      # High Latency
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
          > 2
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "High latency on {{ $labels.route }}"
          description: "95th percentile latency is {{ $value | humanizeDuration }}"

      # Service Down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          description: "Service has been down for more than 1 minute"

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: |
          process_resident_memory_bytes / 1024 / 1024 > 512
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanize }}MB"

      # Database Connection Pool Exhausted
      - alert: DBConnectionPoolExhausted
        expr: |
          db_connection_pool_size{state="available"} < 2
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Only {{ $value }} connections available"

      # Cache Hit Rate Low
      - alert: LowCacheHitRate
        expr: |
          sum(rate(cache_hits_total[5m]))
          /
          (sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m])))
          < 0.7
        for: 10m
        labels:
          severity: medium
        annotations:
          summary: "Low cache hit rate"
          description: "Cache hit rate is {{ $value | humanizePercentage }}"
```

## Grafana Dashboards

### Dashboard JSON Example

```json
{
  "title": "Application Overview",
  "panels": [
    {
      "title": "Request Rate",
      "type": "stat",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total[5m]))",
          "legendFormat": "Requests/sec"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "gauge",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "thresholds": {
            "steps": [
              { "color": "green", "value": 0 },
              { "color": "yellow", "value": 1 },
              { "color": "red", "value": 5 }
            ]
          },
          "unit": "percent"
        }
      }
    },
    {
      "title": "Response Time (p95)",
      "type": "timeseries",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
          "legendFormat": "p95"
        },
        {
          "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
          "legendFormat": "p50"
        }
      ]
    },
    {
      "title": "Request Rate by Status",
      "type": "timeseries",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total[5m])) by (status_code)",
          "legendFormat": "{{status_code}}"
        }
      ]
    }
  ]
}
```

## Health Checks

```typescript
// health.ts
import { Router } from 'express';
import { pool } from '../db';
import { redis } from '../cache';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, {
    status: 'pass' | 'fail';
    latency_ms?: number;
    error?: string;
  }>;
  version: string;
  uptime: number;
}

// Liveness probe - is the app running?
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Readiness probe - is the app ready to serve traffic?
router.get('/ready', async (req, res) => {
  const health: HealthStatus = {
    status: 'healthy',
    checks: {},
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime(),
  };

  // Check database
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    health.checks.database = {
      status: 'pass',
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    health.checks.database = {
      status: 'fail',
      error: error.message,
    };
    health.status = 'unhealthy';
  }

  // Check Redis
  try {
    const start = Date.now();
    await redis.ping();
    health.checks.redis = {
      status: 'pass',
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    health.checks.redis = {
      status: 'fail',
      error: error.message,
    };
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 :
                     health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(health);
});

export default router;
```

## Observability Checklist

### Implementation
- [ ] Structured logging with JSON format
- [ ] Request/response logging with correlation IDs
- [ ] Error logging with stack traces and context
- [ ] RED metrics (Rate, Errors, Duration)
- [ ] Business metrics for key actions
- [ ] Distributed tracing across services
- [ ] Health check endpoints

### Alerting
- [ ] Critical alerts for service outages
- [ ] Error rate threshold alerts
- [ ] Latency threshold alerts
- [ ] Resource utilization alerts
- [ ] Business metric alerts

### Dashboards
- [ ] Service overview dashboard
- [ ] Error analysis dashboard
- [ ] Performance dashboard
- [ ] Business metrics dashboard

## Extended Thinking Triggers

Use Opus 4.5 extended thinking when:
- **Incident investigation** - Correlating logs, metrics, and traces to find root cause
- **Alert tuning** - Reducing noise while catching real issues
- **Architecture decisions** - Choosing between monitoring solutions
- **Capacity planning** - Analyzing metrics to predict scaling needs
- **Performance debugging** - Analyzing complex latency issues across services

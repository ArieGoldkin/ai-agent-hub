# Performance Optimization Skill

> **Version**: 1.0.0
> **Category**: Quality & Optimization
> **Agents**: Backend System Architect, Frontend UI Developer, Code Quality Reviewer
> **Keywords**: performance, optimization, speed, latency, throughput, caching, profiling, bundle, load time, Core Web Vitals

## Overview

This skill provides comprehensive frameworks for analyzing and optimizing application performance across the entire stack - from database queries to frontend rendering.

## When to Use This Skill

Load this skill when:
- Application feels slow or unresponsive
- Database queries are taking too long
- Frontend bundle size is too large
- API response times exceed targets
- Users report performance issues
- Preparing for scale or high traffic
- Core Web Vitals need improvement

## Performance Analysis Framework

### 1. Identify Performance Bottlenecks

**Step 1: Establish Baselines**
```bash
# Frontend metrics
lighthouse --output=json --output-path=./lighthouse-report.json http://localhost:3000

# Backend metrics (Node.js)
node --cpu-prof --heap-prof app.js

# Database metrics (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

**Step 2: Categorize Issues**

| Category | Symptoms | Tools |
|----------|----------|-------|
| **Network** | High TTFB, slow resource loading | Network tab, WebPageTest |
| **Database** | Slow queries, connection pool exhaustion | EXPLAIN ANALYZE, pg_stat_statements |
| **CPU** | High CPU usage, slow computations | Profiler, flame graphs |
| **Memory** | Memory leaks, GC pauses | Heap snapshots, memory profiler |
| **I/O** | Slow file operations, disk bottlenecks | iostat, iotop |
| **Rendering** | Layout thrashing, paint storms | Performance tab, React DevTools |

### 2. Performance Targets

**Frontend (Core Web Vitals)**
```
LCP (Largest Contentful Paint): < 2.5s (good), < 4s (needs improvement)
INP (Interaction to Next Paint): < 200ms (good), < 500ms (needs improvement)
CLS (Cumulative Layout Shift): < 0.1 (good), < 0.25 (needs improvement)
TTFB (Time to First Byte): < 200ms (good), < 600ms (acceptable)
```

**Backend**
```
API Response Time:
  - Simple reads: < 100ms
  - Complex queries: < 500ms
  - Write operations: < 200ms
  - Batch operations: < 2s

Database Query Time:
  - Index lookups: < 10ms
  - Complex joins: < 100ms
  - Full table scans: AVOID
```

## Database Optimization

### Query Optimization

**Identify Slow Queries**
```sql
-- PostgreSQL: Find slow queries
SELECT
  query,
  calls,
  total_time / 1000 as total_seconds,
  mean_time / 1000 as mean_seconds,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;
```

**Optimization Patterns**

**1. Add Missing Indexes**
```sql
-- Before: Full table scan
SELECT * FROM orders WHERE user_id = 123;

-- Add index
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);

-- Verify improvement
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
-- Should show "Index Scan" instead of "Seq Scan"
```

**2. Fix N+1 Query Problems**
```typescript
// BAD: N+1 queries
const users = await db.user.findMany();
for (const user of users) {
  const orders = await db.order.findMany({ where: { userId: user.id } });
  // This executes N additional queries!
}

// GOOD: Single query with join
const usersWithOrders = await db.user.findMany({
  include: { orders: true }
});
```

**3. Use Query Pagination**
```typescript
// BAD: Loading all records
const allUsers = await db.user.findMany();

// GOOD: Cursor-based pagination
const users = await db.user.findMany({
  take: 20,
  cursor: { id: lastUserId },
  orderBy: { id: 'asc' }
});
```

**4. Optimize Complex Queries**
```sql
-- BAD: Subquery in SELECT
SELECT
  u.*,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u;

-- GOOD: Use JOIN with GROUP BY
SELECT
  u.*,
  COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

### Connection Pooling

```typescript
// PostgreSQL connection pool configuration
const pool = new Pool({
  max: 20,                    // Maximum connections
  min: 5,                     // Minimum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if can't connect
  maxUses: 7500,              // Close connection after N uses
});
```

### Caching Strategies

**Cache Hierarchy**
```
L1: In-Memory Cache (fastest, smallest)
    - LRU cache in application
    - Per-request memoization

L2: Distributed Cache (fast, shared)
    - Redis/Memcached
    - Session storage

L3: CDN Cache (edge, static content)
    - Static assets
    - API responses (with care)

L4: Database Query Cache (optional)
    - Query result caching
    - Materialized views
```

**Redis Caching Pattern**
```typescript
async function getUserWithCache(userId: string) {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const user = await db.user.findUnique({ where: { id: userId } });

  // Store in cache with TTL
  if (user) {
    await redis.setex(cacheKey, 3600, JSON.stringify(user)); // 1 hour TTL
  }

  return user;
}

// Cache invalidation on update
async function updateUser(userId: string, data: UserUpdate) {
  const user = await db.user.update({
    where: { id: userId },
    data
  });

  // Invalidate cache
  await redis.del(`user:${userId}`);

  return user;
}
```

## Frontend Optimization

### Bundle Size Optimization

**1. Analyze Bundle**
```bash
# Next.js
npx @next/bundle-analyzer

# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer stats.json
```

**2. Code Splitting**
```typescript
// Dynamic imports for route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**3. Tree Shaking**
```typescript
// BAD: Import entire library
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD: Import only what you need
import debounce from 'lodash/debounce';
debounce(fn, 300);

// BEST: Use native or smaller alternatives
function debounce(fn: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

**4. Image Optimization**
```tsx
// Next.js Image component with optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Modern formats with fallback
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" loading="lazy" />
</picture>
```

### Rendering Optimization

**1. React Memo and Callbacks**
```typescript
// Memoize expensive components
const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <Item key={item.id} {...item} />);
});

// Memoize callbacks passed to children
function Parent() {
  const handleClick = useCallback((id: string) => {
    // Handle click
  }, []);

  return <ExpensiveList items={items} onClick={handleClick} />;
}

// Memoize expensive calculations
function Component({ data }: Props) {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <Display data={processedData} />;
}
```

**2. Virtualization for Long Lists**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <ItemRow item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**3. Avoid Layout Thrashing**
```typescript
// BAD: Causes multiple layout recalculations
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.width = height + 'px'; // Write
});

// GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.width = heights[i] + 'px'; // All writes
});
```

### Network Optimization

**1. HTTP/2 and HTTP/3**
```nginx
# Nginx HTTP/2 configuration
server {
    listen 443 ssl http2;

    # Enable server push
    http2_push_preload on;

    location / {
        add_header Link "</styles.css>; rel=preload; as=style";
        add_header Link "</app.js>; rel=preload; as=script";
    }
}
```

**2. Resource Hints**
```html
<!-- Preconnect to required origins -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">

<!-- Prefetch next page -->
<link rel="prefetch" href="/dashboard">
```

**3. Compression**
```typescript
// Express with compression middleware
import compression from 'compression';

app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress already compressed formats
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

## API Optimization

### Response Optimization

**1. Field Selection**
```typescript
// GraphQL - client requests only needed fields
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      # Only requested fields are returned
    }
  }
`;

// REST with field selection
// GET /api/users/123?fields=id,name,email
app.get('/api/users/:id', (req, res) => {
  const fields = req.query.fields?.split(',') || ['*'];
  const user = await selectFields(userId, fields);
  res.json(user);
});
```

**2. Pagination**
```typescript
// Cursor-based pagination (recommended for large datasets)
interface PaginatedResponse<T> {
  data: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

// Usage: GET /api/users?first=20&after=cursor123
```

**3. Compression and ETags**
```typescript
// Automatic ETag generation
app.use((req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, must-revalidate');
  next();
});

// Conditional requests
app.get('/api/data/:id', async (req, res) => {
  const data = await getData(req.params.id);
  const etag = generateETag(data);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.json(data);
});
```

## Performance Monitoring

### Key Metrics to Track

```typescript
// Custom performance metrics
const metrics = {
  // Server-side
  apiResponseTime: new Histogram({
    name: 'api_response_time_seconds',
    help: 'API response time in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
  }),

  // Database
  queryDuration: new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Database query duration',
    labelNames: ['query_type'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1]
  }),

  // Cache
  cacheHitRate: new Counter({
    name: 'cache_hits_total',
    help: 'Cache hit count',
    labelNames: ['cache_type']
  })
};
```

### Performance Budget

```javascript
// performance-budget.json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 100 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "total", "budget": 1000 }
      ],
      "resourceCounts": [
        { "resourceType": "script", "budget": 10 },
        { "resourceType": "third-party", "budget": 5 }
      ],
      "timings": [
        { "metric": "first-contentful-paint", "budget": 1500 },
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "total-blocking-time", "budget": 300 },
        { "metric": "time-to-interactive", "budget": 3500 }
      ]
    }
  ]
}
```

## Optimization Checklist

### Before Launch
- [ ] Run Lighthouse audit (score > 90)
- [ ] Verify Core Web Vitals pass
- [ ] Check bundle size against budget
- [ ] Profile database queries
- [ ] Enable compression (gzip/brotli)
- [ ] Configure CDN for static assets
- [ ] Set up caching headers
- [ ] Enable HTTP/2 or HTTP/3

### Ongoing Monitoring
- [ ] Set up performance monitoring
- [ ] Configure alerting for degradation
- [ ] Regular Lighthouse CI checks
- [ ] Database query analysis weekly
- [ ] Bundle size tracking in CI
- [ ] Real User Monitoring (RUM)

## Extended Thinking Triggers

Use Opus 4.5 extended thinking when:
- **Complex performance debugging** - Multiple potential causes
- **Architecture decisions** - Choosing between caching strategies
- **Trade-off analysis** - Memory vs CPU vs latency
- **System-wide optimization** - Changes affecting multiple components
- **Root cause analysis** - Performance regression investigation

```
Example: "Our API response times increased by 200ms after deployment"

Extended thinking should:
1. List all recent changes
2. Analyze each potential cause
3. Identify likely culprits
4. Suggest investigation steps
5. Recommend fixes with trade-offs
```

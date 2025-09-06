# Example: From User Description to Parallel Execution

## Scenario 1: No Existing Requirements

### Step 1: User Starts Parallel Execution
```bash
$ npx ai-agent-hub --mode squad --project-only
$ # User wants to start parallel execution
```

### Step 2: System Searches for Requirements
```bash
Searching for existing requirements...
✗ No PRD found
✗ No requirements.md found
✗ No feature description in README
```

### Step 3: System Asks Single Question
```markdown
What are you building? (describe in your own words):
> I need a dashboard to visualize user activity with real-time updates, 
  export to CSV, and daily email reports
```

### Step 4: Smart Inference
```markdown
Based on your description, I've identified:

📊 Components:
- Frontend: Dashboard with real-time visualizations
- Backend: Metrics API and WebSocket server  
- Services: CSV export and email notifications

📝 Generated Tasks:
1. Create dashboard layout component
2. Implement real-time chart components
3. Build metrics REST API
4. Setup WebSocket for live updates
5. Create CSV export endpoint
6. Implement email notification service

🚀 I'll use 3 parallel agents:
- Agent 1: Frontend UI (dashboard, charts)
- Agent 2: Backend API (metrics, WebSocket)
- Agent 3: Services (export, emails)

Ready to start? (Y/n): Y
```

### Step 5: Automatic Allocation
System creates `.squad/parallel-plans/`:
- `agent-1-plan.md` - Frontend tasks
- `agent-2-plan.md` - Backend tasks
- `agent-3-plan.md` - Service tasks

### Step 6: Parallel Execution Begins
```markdown
✅ Requirements inferred and saved
✅ Task allocation complete
✅ 3 agents ready to start

Open 3 terminals and follow the instructions in each plan file.
```

---

## Scenario 2: Existing README with Features

### Step 1: System Finds Requirements
```bash
Searching for existing requirements...
✓ Found feature description in README.md
```

### Step 2: System Summarizes and Confirms
```markdown
📄 Found existing requirements in README.md:
"E-commerce platform with product catalog, shopping cart, 
 checkout flow, and payment processing"

Is this what you're building? (Y/n): Y
```

### Step 3: Direct to Allocation
```markdown
✅ Using existing requirements from README.md

📊 Analyzing for parallel execution:
- Frontend: Product pages, cart UI, checkout flow
- Backend: Product API, cart management, payment integration
- Database: Product catalog, order management

🚀 Recommending 4 parallel agents:
- Agent 1: Product catalog (frontend + backend)
- Agent 2: Shopping cart (frontend + backend)
- Agent 3: Checkout flow (frontend)
- Agent 4: Payment processing (backend)

Proceed with this allocation? (Y/n): Y
```

---

## Scenario 3: Found Requirements But Outdated

### Step 1: System Finds PRD
```bash
Searching for existing requirements...
✓ Found PRD in docs/old-prd.md
```

### Step 2: User Rejects
```markdown
📄 Found existing requirements in docs/old-prd.md:
"Admin panel for user management and reporting"

Is this what you're building? (Y/n): n
```

### Step 3: Ask for New Requirements
```markdown
What are you building? (describe in your own words):
> Actually building a mobile app backend with social features
```

### Step 4: New Inference
```markdown
Based on your new description:

📊 Components:
- API: Mobile app endpoints
- Social: User connections, feeds
- Database: User data, relationships

🚀 I'll use 2 parallel agents:
- Agent 1: Core API endpoints
- Agent 2: Social features

Ready to start? (Y/n): Y
```

---

## Scenario 4: Minimal Input

### User Input
```markdown
What are you building? (describe in your own words):
> login system
```

### System Response
```markdown
Based on "login system":

📊 Inferred components:
- Frontend: Login/register forms
- Backend: Authentication endpoints
- Database: User storage

⚠️ Note: Limited description = conservative parallelization

🚀 I'll use 2 parallel agents:
- Agent 1: Frontend forms
- Agent 2: Backend auth + database

Ready to start? (Y/n): Y
```

---

## Key Principles Demonstrated

1. **Always find path forward** - Works with any input quality
2. **Single question maximum** - Respects user time
3. **Smart defaults** - Infers sensible architecture
4. **Conservative when uncertain** - Fewer agents when vague
5. **Progressive enhancement** - Can improve with more info

## Quality to Parallelization Mapping

| Input Quality | Example | Agents | Strategy |
|--------------|---------|---------|----------|
| None | No description | 1 | Sequential only |
| Minimal | "login system" | 1-2 | Very conservative |
| Basic | One sentence | 2-3 | Conservative |
| Good | Paragraph | 3-4 | Balanced |
| Detailed | Full PRD | 3-9 | Optimal |

## The Result

Users can go from **zero documentation** to **parallel execution** in:
- 1 question
- 30 seconds
- No friction
- Smart defaults
- Always works
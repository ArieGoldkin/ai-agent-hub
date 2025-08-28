# AI Agent Hub Workflows 🚀

Visual guide to agent collaboration patterns and context flows in the AI Agent Hub.

## Agent Network Topology 🕸️

```
                        🎯 Sprint Prioritizer
                               │
                               ▼
    🎭 Studio Coach ◄─────────────────────────► 🔍 UX Researcher
         │                                           │
         ▼                                           ▼
    🏗️ Backend Architect ◄─────────────────────► 🎨 Rapid UI Designer
         │                                           │
         ▼                                           ▼
    🖥️ Frontend Developer ◄─────────────────────► 🤖 AI/ML Engineer
         │                                           │
         ▼                                           ▼
    🎪 Whimsy Injector ◄─────────────────────────► 🔬 Code Quality Reviewer
```

## Context Flow Direction ➡️

### Primary Flow (Feature Development)
```
🎯 Priorities → 🔍 Research → 🎨 Design → 🏗️ Backend → 🖥️ Frontend → 🎪 Delight → 🔬 Review
     │              │           │           │            │              │           │
     └──────────────┼───────────┼───────────┼────────────┼──────────────┼───────────┘
                    └─── 🎭 Studio Coach (Orchestration Layer) ─────────────────────┘
```

### Feedback Loops
```
🔬 Code Quality ──► 🏗️ Backend ──► 🖥️ Frontend
     │                   │             │
     ▼                   ▼             ▼
🎪 Whimsy Injector ◄── 🎨 Design ◄─── 🔍 Research
```

## Decision Accumulation Visualization 📈

```
Session Start: [ ]

After Research: [User Needs, Personas, Flows]

After Design:   [User Needs, Personas, Flows] + [Components, Tokens, Layouts]

After Backend:  [Previous Context] + [APIs, Schema, Security]

After Frontend: [Previous Context] + [Components, State, Integration]

After Quality:  [Previous Context] + [Standards, Performance, Security]

Final Output:   [Complete Implementation Context]
```

## Workflow Patterns 🔄

### 1. Feature Development Flow
```
Start → 🎯 Sprint → 🔍 UX → 🎨 Design → 🏗️ Backend → 🖥️ Frontend → 🎪 Delight → 🔬 Review → Done
  ▲                                                                                           │
  └───────────────────────── 🎭 Studio Coach (Monitors & Guides) ─────────────────────────┘
```

### 2. Bug Fix Flow
```
Issue → 🔬 Review → 🏗️ Backend/🖥️ Frontend → 🔍 UX Test → 🎯 Priority → Done
         ▲                      │                │            │
         └──────────────────────┼────────────────┼────────────┘
                                └── 🎭 Coach ─────┘
```

### 3. Research-First Flow
```
Discovery → 🔍 Research → 🎯 Prioritize → 🎨 Design → Implementation → Quality
              ▲              │             │              │            │
              └──────────────┼─────────────┼──────────────┼────────────┘
                            🎭 Studio Coach Coordination
```

## Parallel vs Sequential Flows ⚡

### Sequential (Dependencies)
```
🔍 Research → 🎨 Design → 🏗️ Backend → 🖥️ Frontend
  Must Wait    Must Wait   Must Wait    Must Wait
```

### Parallel (Independent Work)
```
    🏗️ Backend APIs
   ╱                ╲
🎨 Design         🤖 ML Models
   ╲                ╱
    🎪 Delight Features
```

### Hybrid (Mixed Dependencies)
```
🔍 Research ──┬── 🎨 Design ──┬── 🖥️ Frontend
              │               │
              └── 🏗️ Backend ──┼── 🤖 ML Engine
                              │
              🎯 Priorities ───┴── 🎪 Whimsy
                              │
                         🔬 Quality Review
```

## Handoff Triggers 🚦

### Context-Based Triggers
```
🔍 UX Research
├─ User flows complete ──► 🎨 Rapid UI Designer
├─ Personas defined ──────► 🎯 Sprint Prioritizer  
└─ Pain points found ─────► 🏗️ Backend Architect

🏗️ Backend Architect
├─ API contracts ready ───► 🖥️ Frontend Developer
├─ Schema finalized ──────► 🤖 AI/ML Engineer
└─ Architecture docs ─────► 🔬 Code Quality Reviewer
```

### Milestone-Based Triggers
```
Phase Gates:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Research   │   Design    │ Development │  Enhancement│
│   Complete  │  Complete   │  Complete   │  Complete   │
│      ▼      │      ▼      │      ▼      │      ▼      │
│  🎨 Design  │ 🏗️ Backend │ 🎪 Delight │ 🔬 Review  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## Best Practices 📋

### Context Sharing
```
✅ DO: Share structured context
{
  "decisions": [...],
  "constraints": [...],
  "requirements": [...]
}

❌ DON'T: Share unstructured notes
"Made some changes to the API"
```

### Agent Coordination
```
🎭 Studio Coach Always:
├─ Tracks session progress
├─ Identifies bottlenecks  
├─ Suggests next steps
└─ Maintains context quality

Other Agents:
├─ Read upstream context
├─ Add their expertise
├─ Write structured output
└─ Trigger downstream work
```

### Context Quality Gates
```
Before Handoff, Verify:
□ All required context present
□ Decisions documented with rationale
□ Clear action items for next agent
□ Success criteria defined
□ Constraints and assumptions noted
```

## Emergency Patterns 🆘

### Context Corruption
```
Issue Detected → 🎭 Studio Coach → Restore from Archive → Resume
```

### Agent Bottleneck
```
Stuck Agent → 🎭 Coach Assessment → Parallel Path → Continue
```

### Missing Dependencies
```
Dependency Gap → 🎭 Coach → Backfill Context → Resume
```

---

💡 **Pro Tip**: Use `ai-agent-hub session show` to visualize current workflow state and `ai-agent-hub analyze` for performance insights.

🚀 **Quick Start**: Begin any project with `ai-agent-hub session start project-name` to initialize the context system.
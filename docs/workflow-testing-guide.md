# 🧪 AI Agent Hub - Workflow Testing Guide

## 🎯 Overview

This guide provides step-by-step instructions for testing the AI Agent Hub orchestration system, ensuring all agents work together seamlessly through context-aware collaboration.

---

## 🚀 Quick Test Workflow

### 1. Initial Setup Test
```bash
# Install AI Agent Hub
npx ai-agent-hub --both

# Verify installation
npx ai-agent-hub --list-agents
npx ai-agent-hub --list-servers
```

### 2. Basic Session Test
```bash
# Start a test session
npx ai-agent-hub session start "test-workflow"

# Check session status
npx ai-agent-hub session show

# Clear session
npx ai-agent-hub session clear
```

---

## 📋 Comprehensive Testing Scenarios

### Test 1: Feature Development Workflow

**Objective:** Test complete feature development from requirements to implementation

#### Step 1: Initialize Session
```bash
npx ai-agent-hub session start "auth-feature-test"
```

#### Step 2: Engage Studio Coach
In Claude, type:
```
Hey Studio Coach, let's build a user authentication system with social login support. 
We need Google and GitHub OAuth, secure session management, and 2FA options.
```

#### Step 3: Monitor Context Flow
```bash
# Watch context accumulation
npx ai-agent-hub session show

# Expected context from agents:
# - ux-researcher: User requirements and personas
# - backend-system-architect: API design and security
# - frontend-ui-developer: UI components
# - code-quality-reviewer: Validation checks
```

#### Step 4: Analyze Performance
```bash
npx ai-agent-hub analyze performance
```

**Expected Output:**
```
📊 Agent Performance Metrics
Agent                    | Time  | Confidence | Success
------------------------|-------|------------|--------
studio-coach            | 0.8s  | 95%        | ✅
ux-researcher          | 1.2s  | 92%        | ✅
backend-architect      | 2.1s  | 88%        | ✅
frontend-developer     | 1.8s  | 90%        | ✅
```

#### Step 5: Check Handoffs
```bash
npx ai-agent-hub analyze handoffs
```

**Expected Pattern:**
```
🔄 Handoff Analysis
studio-coach → ux-researcher (requirements gathering)
ux-researcher → backend-architect (technical specs)
backend-architect → frontend-developer (API contracts)
frontend-developer → code-quality-reviewer (validation)
```

---

### Test 2: Bug Fix Workflow

**Objective:** Test issue resolution and debugging workflow

#### Step 1: Start Bug Fix Session
```bash
npx ai-agent-hub session start --template bug-fix
```

#### Step 2: Report Bug to Studio Coach
```
Studio Coach, we have a critical bug: users can't log in on mobile devices. 
The OAuth redirect fails with a 404 error. Priority: High.
```

#### Step 3: Monitor Investigation Flow
```bash
# Real-time monitoring
watch -n 2 'npx ai-agent-hub session show'
```

**Expected Agent Sequence:**
1. Studio Coach → Sprint Prioritizer (assess impact)
2. Studio Coach → Backend Architect (investigate API)
3. Studio Coach → Frontend Developer (check mobile UI)
4. Studio Coach → Code Quality Reviewer (validate fix)

#### Step 4: Verify Fix Implementation
```bash
npx ai-agent-hub analyze quality
```

---

### Test 3: Performance Optimization

**Objective:** Test system optimization workflow

#### Step 1: Initialize Performance Session
```bash
npx ai-agent-hub session start --template performance-optimization
```

#### Step 2: Request Optimization
```
Studio Coach, our dashboard is loading slowly (8+ seconds). 
Users are complaining about lag when switching views. Let's optimize performance.
```

#### Step 3: Analyze Bottlenecks
```bash
npx ai-agent-hub analyze bottlenecks
```

**Expected Bottlenecks:**
```
🚨 Bottleneck Detection
- Slow Agent: backend-architect (5.2s response)
- Context Overload: frontend-developer (125KB context)
- Circular Dependency: None detected
```

#### Step 4: Get Optimization Insights
```bash
npx ai-agent-hub analyze insights
```

**Expected Recommendations:**
```
💡 Optimization Opportunities
1. Parallelize backend-architect and frontend-developer
2. Reduce context size by archiving completed decisions
3. Cache frequently accessed data
4. Implement progressive loading
```

---

### Test 4: Multi-Agent Collaboration

**Objective:** Test parallel agent execution and context sharing

#### Step 1: Start Complex Project
```bash
npx ai-agent-hub session start "ml-dashboard"
```

#### Step 2: Request Multi-Domain Feature
```
Studio Coach, let's build an ML-powered analytics dashboard.
We need real-time predictions, beautiful visualizations, and model performance tracking.
```

#### Step 3: Monitor Parallel Execution
```bash
# Check for parallel agent work
npx ai-agent-hub analyze handoffs

# Look for parallel indicators:
# - Multiple agents with same timestamp
# - Context sharing between parallel agents
```

#### Step 4: Verify Context Integration
```bash
npx ai-agent-hub session show

# Verify context includes:
# - ML model specs from ai-ml-engineer
# - UI components from frontend-developer
# - API design from backend-architect
# - All integrated coherently
```

---

## 🔍 Advanced Testing Scenarios

### Test 5: Session Recovery

**Test session persistence and recovery after interruption**

```bash
# Start session
npx ai-agent-hub session start "recovery-test"

# Add some context (work with agents)
# ... interact with agents ...

# Simulate interruption
# Close terminal/IDE

# Recover session
npx ai-agent-hub session show

# Verify context preserved
```

### Test 6: Template Validation

**Test each session template**

```bash
# Test each template
for template in feature-development bug-fix refactoring performance-optimization; do
  echo "Testing template: $template"
  npx ai-agent-hub session start --template $template
  npx ai-agent-hub session show
  npx ai-agent-hub session clear
done
```

### Test 7: Analytics Accuracy

**Verify analytics calculations**

```bash
# Start tracked session
npx ai-agent-hub session start "analytics-test"

# Perform specific actions with known outcomes
# ... interact with agents ...

# Verify each analytics type
npx ai-agent-hub analyze performance  # Check timing accuracy
npx ai-agent-hub analyze growth       # Verify context accumulation
npx ai-agent-hub analyze quality      # Validate decision tracking
```

---

## 🎯 Validation Checklist

### ✅ Core Functionality
- [ ] Session start/stop works correctly
- [ ] Context persists between agent calls
- [ ] Handoffs occur in correct sequence
- [ ] Analytics provide accurate metrics
- [ ] Templates initialize properly

### ✅ Agent Orchestration
- [ ] Studio Coach routes to correct agents
- [ ] Context flows between agents
- [ ] Parallel agents execute simultaneously
- [ ] Sequential agents wait for dependencies
- [ ] No circular dependencies occur

### ✅ Error Handling
- [ ] Corrupted context recovers gracefully
- [ ] Missing agents handled properly
- [ ] Session expiry works (24 hours)
- [ ] Size limits enforced (100KB)
- [ ] Invalid commands show helpful errors

### ✅ Performance
- [ ] Response times under 3 seconds
- [ ] Context size stays manageable
- [ ] No memory leaks during long sessions
- [ ] Analytics compute quickly
- [ ] Parallel execution improves speed

---

## 🐛 Troubleshooting Test Failures

### Issue: Session Not Found
```bash
# Check if session exists
ls -la .claude/session-context.json

# If missing, reinitialize
npx ai-agent-hub session start
```

### Issue: Agent Not Responding
```bash
# Verify agent installation
npx ai-agent-hub --list-agents

# Check agent file exists
ls -la .claude/agents/

# Reinstall if needed
npx ai-agent-hub --project-only
```

### Issue: Analytics Show No Data
```bash
# Ensure session has context
npx ai-agent-hub session show

# If empty, interact with agents first
# Then retry analytics
```

### Issue: Context Corruption
```bash
# Check for backup
ls -la .claude/session-context.json.backup

# System auto-recovers, but can force clear
npx ai-agent-hub session clear
npx ai-agent-hub session start
```

---

## 📊 Expected Test Results

### Successful Workflow Test
```
✅ Session Management: All operations complete
✅ Agent Orchestration: Correct routing and handoffs  
✅ Context Flow: Accumulates and shares properly
✅ Analytics: Accurate metrics and insights
✅ Performance: Under 3s response times
✅ Error Recovery: Handles corrupted data
```

### Performance Benchmarks
```
Session Start: < 500ms
Agent Handoff: < 1000ms
Context Save: < 200ms
Analytics Compute: < 1500ms
Full Workflow: < 30s for simple features
```

---

## 🚀 Automated Test Script

Save as `test-workflow.sh`:

```bash
#!/bin/bash

echo "🧪 Starting AI Agent Hub Workflow Tests"

# Test 1: Installation
echo "Test 1: Verifying Installation..."
npx ai-agent-hub --list-agents > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ Installation verified"; else echo "❌ Installation failed"; exit 1; fi

# Test 2: Session Management
echo "Test 2: Testing Session Management..."
npx ai-agent-hub session start "automated-test"
npx ai-agent-hub session show > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ Session management works"; else echo "❌ Session management failed"; fi

# Test 3: Analytics
echo "Test 3: Testing Analytics..."
npx ai-agent-hub analyze performance > /dev/null 2>&1
if [ $? -eq 0 ]; then echo "✅ Analytics functioning"; else echo "❌ Analytics failed"; fi

# Test 4: Cleanup
echo "Test 4: Testing Cleanup..."
npx ai-agent-hub session clear
if [ $? -eq 0 ]; then echo "✅ Cleanup successful"; else echo "❌ Cleanup failed"; fi

echo "🎉 All tests completed!"
```

Make executable and run:
```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

---

## 📝 Test Reporting

After testing, document results:

1. **Session ID:** [Generated ID]
2. **Test Date:** [Date/Time]
3. **Tests Passed:** X/Y
4. **Issues Found:** [List any problems]
5. **Performance Metrics:** [Key measurements]
6. **Recommendations:** [Improvements needed]

---

## 🔗 Related Documentation

- [Command Reference](./command-reference.md) - All available commands
- [WORKFLOW.md](../WORKFLOW.md) - Visual workflow patterns
- [README.md](../README.md) - Main documentation
- [CLAUDE.md](../CLAUDE.md) - Development guide
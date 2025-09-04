# Allocate Tasks for Parallel Execution

**INTERACTION MODE: REQUIRED**

This command requires user interaction. You MUST wait for user input before proceeding.

You are responsible for analyzing feature requirements and distributing work across multiple agents to enable parallel execution.

## STEP 1: Gather Requirements

**FIRST ACTION:** Check if the user provided requirements with this command.

If NO requirements were provided:
1. **STOP** and ask the user directly:
   "📋 **What would you like to build?**
   
   Please describe your requirements and I'll allocate tasks across multiple agents for parallel execution."
   
2. **WAIT** for the user to respond with their requirements
3. **DO NOT** proceed until the user provides their input
4. **DO NOT** create any files or generate any output until requirements are received

If requirements WERE provided with the command:
- Proceed directly to Step 2

## STEP 2: Process Requirements

Only after receiving requirements from the user, proceed with allocation:

## Core Responsibilities

### 1. Parse Feature Requirements

#### Source Priority (check in order):
1. **User-provided requirements**: From the command or follow-up prompt
2. **Formal PRD**: `.squad/feature-prd.md` or `feature-prd.md` 
3. **Discovered Requirements**: Found in README, docs, or issues
4. **Inferred Requirements**: From user's natural language description

#### For Formal PRDs:
- Extract all implementation tasks
- Identify dependencies between tasks
- Determine task complexity and time estimates

#### For Inferred Requirements:
```python
def parse_inferred_requirements(user_description):
    # Work with what we have
    requirements = {
        "description": user_description,
        "components": extract_components(user_description),
        "tasks": generate_basic_tasks(user_description)
    }
    
    # Be conservative with parallelization
    if quality_score(requirements) < 0.5:
        max_agents = 2  # Low confidence = fewer agents
    else:
        max_agents = calculate_optimal(requirements)
    
    return requirements, max_agents
```

### 2. Identify Independent Work Streams
- Group related tasks by subsystem (frontend, backend, database, etc.)
- Find tasks with no shared file dependencies
- Create parallel execution paths
- Ensure no resource conflicts

### 3. Generate Task Assignments

For each parallel worker, create a role-plan file:

**File: `.squad/parallel-plans/agent-[id]-plan.md`**

```markdown
# Parallel Execution Plan - Agent [ID]

## Agent Identity
- Agent Type: [frontend-ui-developer|backend-system-architect|ai-ml-engineer]
- Work Stream: [component/api/model]
- Assigned Files: [list of files this agent owns]

## Tasks
1. [Task description]
   - Files: [files to create/modify]
   - Dependencies: [what must exist first]
   - Output: [what will be produced]

## File Ownership
- CREATE: [files this agent will create]
- MODIFY: [files this agent will modify]
- READ-ONLY: [files this agent needs to read]

## Communication Points
- Handoff to: [next agent if any]
- Receives from: [previous agent if any]
- Sync points: [when to check with coordinator]
```

### 4. Implement File-Level Mutex Strategy

Create mutex rules in each plan:
- No two agents modify the same file simultaneously
- Agents work in different directories when possible
- Shared resources accessed read-only during parallel work
- Sequential handoffs for files requiring multiple agent edits

### 5. Task Allocation Algorithm

```python
def allocate_tasks(prd_tasks, available_agents):
    # 1. Build dependency graph
    dependency_graph = build_dependencies(prd_tasks)
    
    # 2. Analyze parallelization potential
    analysis = analyze_parallel_potential(dependency_graph)
    
    # 3. Determine optimal agent count
    optimal_agents = recommend_agent_count(analysis)
    
    # 4. Identify parallel paths
    parallel_streams = find_independent_paths(dependency_graph)
    
    # 5. Assign agents to streams
    assignments = {}
    for stream in parallel_streams[:optimal_agents]:
        agent = select_best_agent(stream.requirements, available_agents)
        assignments[agent.id] = stream.tasks
        
    # 6. Generate conflict-free file maps
    file_ownership = assign_file_ownership(assignments)
    
    # 7. Create execution plans
    for agent_id, tasks in assignments.items():
        create_plan_file(agent_id, tasks, file_ownership[agent_id])
    
    return assignments, optimal_agents
```

### 6. Dependency Analysis for Optimal Agent Count

```python
def analyze_parallel_potential(dependency_graph):
    """
    Analyze tasks to determine parallelization opportunity
    """
    analysis = {
        'independent_chains': 0,
        'max_parallel_tasks': 0,
        'shared_files': [],
        'blocking_dependencies': [],
        'task_types': {}
    }
    
    # Find completely independent work streams
    for task in dependency_graph:
        if not task.dependencies and not task.dependents:
            analysis['independent_chains'] += 1
            
    # Calculate maximum parallel width
    levels = topological_sort_by_levels(dependency_graph)
    analysis['max_parallel_tasks'] = max(len(level) for level in levels)
    
    # Identify shared resources
    file_usage = {}
    for task in dependency_graph:
        for file in task.files:
            file_usage[file] = file_usage.get(file, 0) + 1
    
    analysis['shared_files'] = [f for f, count in file_usage.items() if count > 1]
    
    # Categorize task types
    for task in dependency_graph:
        task_type = categorize_task(task)  # frontend, backend, ml, etc.
        analysis['task_types'][task_type] = analysis['task_types'].get(task_type, 0) + 1
    
    return analysis

def recommend_agent_count(analysis):
    """
    Recommend optimal number of agents based on analysis
    """
    # Start with max parallel opportunity
    recommended = analysis['max_parallel_tasks']
    
    # Adjust based on shared files (reduce if too many conflicts)
    conflict_ratio = len(analysis['shared_files']) / max(1, analysis['max_parallel_tasks'])
    if conflict_ratio > 0.5:
        recommended = max(2, recommended - 1)  # High conflict, reduce agents
    
    # Consider task diversity
    task_diversity = len(analysis['task_types'])
    recommended = min(recommended, task_diversity)  # Don't exceed unique task types
    
    # Apply practical limits
    if recommended > 5:
        print(f"⚠️  High parallelization ({recommended} agents) may increase coordination overhead")
    
    # Minimum and maximum bounds
    recommended = max(1, min(9, recommended))
    
    return recommended
```

## Handling Different Input Quality

### High Quality (Formal PRD)
- Full parallelization possible
- Can use 3-9 agents safely
- Clear file ownership boundaries
- Explicit dependencies

### Medium Quality (Basic Requirements)
- Conservative parallelization
- Use 2-4 agents maximum
- Focus on obvious separations (frontend/backend)
- Add safety margins for conflicts

### Low Quality (Vague Description)  
- Minimal parallelization
- Use 1-2 agents only
- Start sequential, learn, then parallelize
- Gather more info during execution

## Execution Instructions

1. **Find Requirements**:
   ```bash
   # Check for formal PRD
   cat feature-prd.md 2>/dev/null || cat .squad/feature-prd.md 2>/dev/null
   
   # If not found, check for inferred requirements
   cat .squad/inferred-requirements.md 2>/dev/null
   
   # If nothing, work from user description
   echo "Working from user description: '[description]'"
   ```

2. **Analyze Task Dependencies**:
   - List all implementation tasks
   - Map file dependencies
   - Identify blocking relationships

3. **Create Parallel Plans**:
   ```bash
   mkdir -p .squad/parallel-plans
   # Generate agent-1-plan.md through agent-N-plan.md
   ```

4. **Validate No Conflicts**:
   - Ensure no file appears in multiple MODIFY lists
   - Verify all dependencies are satisfied
   - Check that work streams are truly independent

5. **Generate Allocation Report**:
   ```markdown
   File: .squad/parallel-allocation-report.md
   
   # Parallel Allocation Report
   
   ## Parallelization Analysis
   - Independent work streams identified: 4
   - Maximum parallel tasks possible: 5
   - Shared file conflicts: 2
   - Recommended agent count: **3 agents** (optimal balance)
   
   ## Work Streams
   - Stream 1: Frontend Components (Agent 1)
   - Stream 2: API Endpoints (Agent 2)  
   - Stream 3: Database Schema (Agent 3)
   
   ## Why 3 Agents?
   - Task diversity: 3 distinct domains (Frontend, Backend, Database)
   - Shared files: Low conflict ratio (20%)
   - Coordination overhead: Manageable with 3 agents
   - Efficiency gain: Optimal at 66%
   
   ## Alternative Configurations
   | Agents | Efficiency | Coordination | Recommendation |
   |--------|------------|--------------|----------------|
   | 2 | 50% | Low | Under-utilized |
   | **3** | **66%** | **Moderate** | **OPTIMAL** |
   | 4 | 70% | High | Diminishing returns |
   | 5 | 72% | Very High | Not recommended |
   
   ## File Ownership Matrix
   | File | Owner | Access Type |
   |------|-------|-------------|
   | /frontend/Dashboard.tsx | Agent 1 | MODIFY |
   | /backend/api/metrics.py | Agent 2 | CREATE |
   | /database/schema.sql | Agent 3 | CREATE |
   
   ## Estimated Completion
   - Parallel execution time: 2 hours
   - Sequential execution time: 6 hours
   - Efficiency gain: 66%
   ```

## Success Criteria
- All tasks from PRD are assigned
- No file conflicts between agents
- Clear ownership boundaries established
- Parallel paths maximize efficiency
- Dependencies properly sequenced
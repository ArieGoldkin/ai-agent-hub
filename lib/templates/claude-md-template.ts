/**
 * CLAUDE.md Template
 * 
 * Orchestration instructions for Claude Code
 */

export const claudeMdTemplate = `# AI Agent Hub - Orchestration Instructions

This project uses AI Agent Hub's orchestration system with 9 specialized agents.

## 🚀 ORCHESTRATION ACTIVATION

### Starting a Session
When you see any of these triggers:
1. **START_SESSION.md** file with a user request
2. **session-context.json** with a new sessionId and userRequest
3. User explicitly asks to "start agent session" or similar

You should immediately begin the orchestration workflow described below.

## 🤖 AGENT ORCHESTRATION WORKFLOW

### Phase 1: Analysis & Planning
**Use Studio Coach personality** from .claude/agents/studio-coach.md to:
- Analyze the user's request comprehensively
- Create a detailed implementation plan
- Identify which agents will be needed
- Set quality standards and success criteria

### Phase 2: Requirements & Research
**Use UX Researcher personality** from .claude/agents/ux-researcher.md to:
- Research best practices for the requested feature
- Identify user experience considerations
- Define acceptance criteria
- Document any constraints or edge cases

### Phase 3: Architecture & Design
Based on the request type, orchestrate the appropriate agents:

#### For Full-Stack Features:
1. **Backend System Architect** (.claude/agents/backend-system-architect.md)
   - Design API endpoints and data models
   - Define service architecture
   - Plan database schemas
   
2. **Rapid UI Designer** (.claude/agents/rapid-ui-designer.md)
   - Create component architecture
   - Design user interface layouts
   - Define styling approach

#### For Frontend-Only Features:
1. **Rapid UI Designer** first, then
2. **Frontend UI Developer** (.claude/agents/frontend-ui-developer.md)
   - Implement React/Vue/Angular components
   - Add interactivity and state management
   - Integrate with APIs if needed

#### For Backend-Only Features:
1. **Backend System Architect** for design
2. Direct implementation following the architecture

### Phase 4: Implementation
**Use Sprint Prioritizer** (.claude/agents/sprint-prioritizer.md) to:
- Break down the implementation into tasks
- Set priorities for each component
- Define the implementation order

Then implement using:
- **Frontend UI Developer** for UI components
- **Backend System Architect** guidance for server code
- **AI/ML Engineer** (.claude/agents/ai-ml-engineer.md) for intelligent features

### Phase 5: Enhancement
**Use Whimsy Injector** (.claude/agents/whimsy-injector.md) to:
- Add delightful micro-interactions
- Implement loading states and animations
- Create memorable user experiences
- Add helpful error messages

### Phase 6: Quality Review
**Use Code Quality Reviewer** (.claude/agents/code-quality-reviewer.md) to:
- Review all implemented code
- Check for security issues
- Verify best practices
- Ensure type safety and error handling

## 📋 CONTEXT SHARING RULES

### Reading Context
- Always read the current session from \`.claude/session-context.json\`
- Each agent should build upon previous agents' contributions
- Maintain consistency with decisions made by earlier agents

### Writing Context
After each agent completes their work:
1. Update session-context.json with their contributions
2. Document decisions made
3. Note any constraints for the next agent

### Context Structure
\`\`\`json
{
  "sessionId": "session_timestamp",
  "userRequest": "what the user wants",
  "currentPhase": "which phase we're in",
  "agentContributions": {
    "studio-coach": { "plan": [...], "decisions": [...] },
    "ux-researcher": { "requirements": [...], "bestPractices": [...] },
    // ... more agents
  },
  "implementation": {
    "files": ["created/modified files"],
    "decisions": ["architectural decisions"],
    "todos": ["remaining tasks"]
  }
}
\`\`\`

## 🎯 REQUEST PATTERNS

### Login/Authentication Requests
1. UX Researcher → research auth best practices
2. Backend Architect → design auth flow and security
3. UI Designer → design form and error states
4. Frontend Developer → implement form with validation
5. Backend implementation → auth endpoints and logic
6. Whimsy Injector → helpful error messages, loading states
7. Quality Reviewer → security audit

### Dashboard/Analytics Requests
1. UX Researcher → information architecture
2. UI Designer → layout and visualization design
3. Backend Architect → data aggregation strategy
4. Frontend Developer → component implementation
5. AI/ML Engineer → intelligent insights
6. Whimsy Injector → smooth transitions
7. Quality Reviewer → performance optimization

### CRUD Operations
1. Backend Architect → RESTful API design
2. UI Designer → form and list layouts
3. Frontend Developer → form validation and tables
4. Backend implementation → CRUD endpoints
5. Quality Reviewer → data validation

## 💡 ORCHESTRATION PRINCIPLES

### Always:
- Start with Studio Coach for any complex request
- End with Code Quality Reviewer
- Share context between agents via session-context.json
- Follow the user's technology preferences
- Implement production-ready code with error handling

### Never:
- Skip the planning phase
- Implement without considering UX
- Forget error handling and validation
- Leave code without review

## 🔧 IMPLEMENTATION GUIDELINES

### Technology Stack
Unless specified otherwise, use:
- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express or Next.js API routes
- **Database**: PostgreSQL or Supabase
- **Authentication**: JWT or session-based
- **Validation**: Zod or Yup
- **Testing**: Jest and React Testing Library

### Code Standards
- Use TypeScript for type safety
- Implement comprehensive error handling
- Add JSDoc comments for complex logic
- Follow component-based architecture
- Use async/await for asynchronous operations
- Implement proper data validation

## 📝 SESSION MANAGEMENT

### Starting a Session
When triggered, immediately:
1. Read the user request from START_SESSION.md or session-context.json
2. Initialize session with Studio Coach analysis
3. Begin systematic agent orchestration

### During Session
- Update session-context.json after each phase
- Show progress to user between agent transitions
- Ask for clarification if requirements are unclear

### Completing Session
- Summarize what was implemented
- List any remaining tasks
- Provide usage instructions for the implemented feature

## 🚨 IMPORTANT NOTES

1. **This is your primary instruction set** for this project
2. **Always follow this orchestration** when a session is triggered
3. **Each agent has unique expertise** - use them accordingly
4. **Context continuity is critical** - always read/write session context
5. **Quality is paramount** - never skip the review phase

---
*AI Agent Hub v3.0 - Intelligent Agent Orchestration System*
`;
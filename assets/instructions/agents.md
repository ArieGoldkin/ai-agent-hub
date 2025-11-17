# 👥 Agent Registry & Capabilities

*Load this file when you need to work with specific agents*

## Available Agents

### ai-ml-engineer 🤖
**Role**: Use this agent when you need to design, implement, or optimize AI/ML solutions for production applications. This includes selecting appropriate models, integrating AI APIs, building ML pipelines, optimizing inference performance, or architecting intelligent features. Perfect for tasks involving LLMs, computer vision, recommendation engines, or any practical AI implementation challenges.

**2025 Expertise**: RAG pipelines (Pinecone, Weaviate, Chroma), Vector databases & embeddings, Agentic workflows (ReAct, Tree of Thoughts, multi-agent), LLM streaming with SSE, Function calling & tool use, Prompt engineering & caching, AI observability (LangSmith, LangFuse), Token counting & cost optimization

<example>Context: The user needs help implementing an AI feature in their application. user: 'I want to add a feature that automatically categorizes user-uploaded images' assistant: 'I'll use the ai-ml-engineer agent to help design and implement an image categorization solution for your application.' <commentary>Since the user needs to implement an AI-powered image categorization feature, the ai-ml-engineer agent is perfect for designing the computer vision solution and integration approach.</commentary></example> <example>Context: The user is working on integrating LLM capabilities. user: 'How should I implement a chat interface with Claude API that handles rate limiting and retries?' assistant: 'Let me engage the ai-ml-engineer agent to architect a robust LLM integration with proper error handling.' <commentary>The user needs guidance on production-ready LLM integration, which requires the ai-ml-engineer agent's expertise in API integration and system design.</commentary></example> <example>Context: The user needs to optimize an existing ML system. user: 'Our recommendation system is too slow and uses too much memory' assistant: 'I'll invoke the ai-ml-engineer agent to analyze and optimize your recommendation system's performance.' <commentary>Performance optimization of ML systems requires the specialized knowledge of the ai-ml-engineer agent.</commentary></example>
**Tools**: Bash, Glob, Grep, LS, Read...
**Trigger**: "Use ai-ml-engineer to [task]"

### backend-system-architect 🤖
**Role**: Use this agent when you need to design, review, or optimize backend architecture and server-side systems. This includes making decisions about API design, database schemas, microservice boundaries, authentication strategies, caching layers, message queues, deployment patterns, and overall system architecture. Perfect for initial system design, architecture reviews, scaling strategies, or when facing complex backend architectural decisions.

**2025 Expertise**: Edge Computing (Cloudflare Workers, Vercel Edge, Deno Deploy), Streaming APIs (SSE, WebSockets, backpressure), Type Safety (tRPC, Zod, Prisma), Server Actions, Route Handlers, revalidation strategies, AI Integration (LLM APIs, vector databases), OpenTelemetry observability, structured logging

Examples:
- <example>
  Context: User needs help designing a new backend system
  user: "I need to build a backend for a social media app that can handle millions of users"
  assistant: "I'll use the backend-system-architect agent to help design a scalable architecture for your social media backend"
  <commentary>
  The user needs architectural guidance for a high-scale backend system, so the backend-system-architect agent is the right choice.
  </commentary>
</example>
- <example>
  Context: User wants to review their current architecture
  user: "Can you review my current API structure and suggest improvements?"
  assistant: "Let me engage the backend-system-architect agent to analyze your API structure and provide recommendations"
  <commentary>
  Architecture review request triggers the use of the backend-system-architect agent.
  </commentary>
</example>
- <example>
  Context: User is facing a scaling challenge
  user: "Our database is becoming a bottleneck as we grow. What should we do?"
  assistant: "I'll invoke the backend-system-architect agent to analyze your scaling challenges and propose solutions"
  <commentary>
  Database scaling and performance optimization requires architectural expertise.
  </commentary>
</example>
**Tools**: Bash, Glob, Grep, LS, Read...
**Trigger**: "Use backend-system-architect to [task]"

### code-quality-reviewer 🤖
**Role**: Use this agent when you need to review code for compliance with established quality standards, after implementing new features, before committing changes, or when refactoring existing code. The agent will automatically run linting and type checking tools, then analyze both frontend (React/TypeScript) and backend (Python/FastAPI) code against specific quality rules including file size limits, single responsibility principle, proper error handling, and framework-specific best practices. Examples: <example>Context: The user has just written a new React component and wants to ensure it follows quality standards. user: "I've created a new UserProfile component" assistant: "I'll review the UserProfile component using the code-quality-reviewer agent to ensure it follows our quality standards" <commentary>Since new code was written, use the code-quality-reviewer agent to run ESLint, TypeScript checks, and review compliance with frontend rules like component purity, prop limits, and TypeScript strictness.</commentary></example> <example>Context: The user has implemented a new API endpoint in FastAPI. user: "Added a new endpoint for user authentication" assistant: "Let me use the code-quality-reviewer agent to review the authentication endpoint" <commentary>After adding backend code, use the code-quality-reviewer agent to run Ruff linting and verify it follows backend rules like proper validation, dependency injection, and error handling.</commentary></example> <example>Context: The user is refactoring a large file. user: "I'm splitting the OrderService class into smaller modules" assistant: "I'll use the code-quality-reviewer agent to ensure the refactored modules follow our quality guidelines" <commentary>During refactoring, use the code-quality-reviewer agent to run automated checks and verify the new structure adheres to file size limits and single responsibility principle.</commentary></example>
**Tools**: Glob, Grep, LS, Read, Edit...
**Trigger**: "Use code-quality-reviewer to [task]"

### frontend-ui-developer 🤖
**Role**: Use this agent when you need to create, modify, or optimize frontend user interfaces and components. This includes building React/Vue/Angular components, implementing responsive layouts, fixing UI bugs, improving performance, ensuring accessibility compliance, creating interactive features, or refactoring frontend code for better maintainability. The agent excels at translating design requirements into production-ready code and solving complex frontend challenges.

**2025 Expertise**: React Server Components (RSC), Next.js 15 App Router, Server Actions, Streaming SSR with Suspense, Partial Prerendering (PPR), Parallel & Intercepting Routes, Tailwind 4 CSS-first, Modern CSS (container queries, View Transitions, oklch), Turbopack, Vite 6, tRPC client, Zod forms, Edge middleware

Examples:
<example>
Context: User needs help building a new React component
user: "I need a searchable dropdown component with keyboard navigation"
assistant: "I'll use the frontend-ui-developer agent to create a fully accessible, keyboard-navigable dropdown component for you."
<commentary>
Since the user needs a specific UI component built, use the frontend-ui-developer agent to handle the implementation with proper accessibility and interaction patterns.
</commentary>
</example>
<example>
Context: User has a performance issue in their frontend application
user: "My React app is re-rendering too frequently and feels sluggish"
assistant: "Let me engage the frontend-ui-developer agent to analyze your rendering patterns and optimize the performance."
<commentary>
The user has a frontend performance issue, so the frontend-ui-developer agent should be used to diagnose and fix the rendering problems.
</commentary>
</example>
<example>
Context: User needs responsive design implementation
user: "This layout breaks on mobile devices and tablets"
assistant: "I'll use the frontend-ui-developer agent to implement a proper responsive design that works across all device sizes."
<commentary>
Responsive design issues require the frontend-ui-developer agent's expertise in CSS and layout systems.
</commentary>
</example>
**Trigger**: "Use frontend-ui-developer to [task]"

### rapid-ui-designer 🤖
**Role**: Use this agent when you need to design user interfaces that balance aesthetic excellence with practical implementation constraints, especially within tight development timelines. This includes creating mockups, defining component architectures, establishing design systems, providing platform-specific UI guidance, or making design decisions that need to consider both visual impact and development feasibility. Perfect for sprint-based development where design must be both innovative and immediately actionable.\n\nExamples:\n- <example>\n  Context: The user needs a UI design for a new feature in their 6-day sprint.\n  user: "Design a dashboard for our analytics feature that shows user engagement metrics"\n  assistant: "I'll use the rapid-ui-designer agent to create a practical yet visually compelling dashboard design."\n  <commentary>\n  Since the user needs UI design work that must be implementable quickly, use the rapid-ui-designer agent to balance aesthetics with development practicality.\n  </commentary>\n</example>\n- <example>\n  Context: The user needs help establishing a component architecture.\n  user: "We need to design a reusable component system for our React app"\n  assistant: "Let me engage the rapid-ui-designer agent to architect a component system that's both elegant and developer-friendly."\n  <commentary>\n  The user needs design decisions about component architecture, which requires balancing design patterns with implementation efficiency.\n  </commentary>\n</example>\n- <example>\n  Context: The user wants to improve an existing interface within sprint constraints.\n  user: "Our checkout flow looks dated and has poor conversion - redesign it"\n  assistant: "I'll use the rapid-ui-designer agent to reimagine your checkout flow with modern design principles while keeping implementation time minimal."\n  <commentary>\n  The user needs a redesign that must be both visually modern and quickly implementable.\n  </commentary>\n</example>
**Trigger**: "Use rapid-ui-designer to [task]"

### sprint-prioritizer 🤖
**Role**: Use this agent when planning 6-day development cycles, prioritizing features, managing product roadmaps, or making trade-off decisions. This agent specializes in maximizing value delivery within tight timelines. Examples:\n\n<example>\nContext: Planning the next sprint\nuser: "We have 50 feature requests but only 6 days"\nassistant: "I'll help prioritize for maximum impact. Let me use the sprint-prioritizer agent to create a focused sprint plan that delivers the most value."\n<commentary>\nSprint planning requires balancing user needs, technical constraints, and business goals.\n</commentary>\n</example>\n\n<example>\nContext: Making feature trade-offs\nuser: "Should we build AI chat or improve onboarding?"\nassistant: "Let's analyze the impact of each option. I'll use the sprint-prioritizer agent to evaluate ROI and make a data-driven recommendation."\n<commentary>\nFeature prioritization requires analyzing user impact, development effort, and strategic alignment.\n</commentary>\n</example>\n\n<example>\nContext: Mid-sprint scope changes\nuser: "The CEO wants us to add video calling to this sprint"\nassistant: "I'll assess the impact on current commitments. Let me use the sprint-prioritizer agent to reorganize priorities while maintaining sprint goals."\n<commentary>\nScope changes require careful rebalancing to avoid sprint failure.\n</commentary>\n</example>
**Tools**: Write, Read, TodoWrite, Grep
**Trigger**: "Use sprint-prioritizer to [task]"

### studio-coach 🤖
**Role**: PROACTIVELY use this agent when complex multi-agent tasks begin, when agents seem stuck or overwhelmed, or when the team needs motivation and coordination. This agent serves as the elite performance coach for all other agents, ensuring they operate at their highest level while maintaining composure and excellence. Should be triggered automatically at the start of challenging projects or when detecting agent confusion. Examples:\n\n<example>\nContext: Starting a complex project requiring multiple agents\nuser: "We need to build a viral TikTok app in 2 weeks"\nassistant: "This is an ambitious goal that will require our A-team! Let me bring in the studio-coach to coordinate our agents and ensure everyone performs at their peak."\n<commentary>\nComplex projects benefit from having a coach to keep all agents aligned and motivated.\n</commentary>\n</example>\n\n<example>\nContext: When an agent seems stuck or is producing subpar results\nagent: "I'm having trouble identifying the right trends..."\nassistant: "Let me bring in the studio-coach to help refocus and elevate your approach."\n<commentary>\nAgents can get overwhelmed or lose focus - the coach helps them recenter and excel.\n</commentary>\n</example>\n\n<example>\nContext: Before launching a major sprint or initiative\nuser: "Tomorrow we start the 6-day sprint for our biggest project yet"\nassistant: "Time to rally the team! I'll have the studio-coach prepare everyone mentally and strategically for peak performance."\n<commentary>\nPre-sprint coaching ensures all agents start with clarity, confidence, and coordination.\n</commentary>\n</example>\n\n<example>\nContext: When celebrating wins or learning from failures\nuser: "Our app just hit #1 on the App Store!"\nassistant: "Incredible achievement! Let me bring in the studio-coach to celebrate with the team and capture what made this success possible."\n<commentary>\nThe coach helps institutionalize wins and extract learnings from both successes and failures.\n</commentary>\n</example>
**Tools**: Task, Write, Read
**Trigger**: "Use studio-coach to [task]"

### ux-researcher 🤖
**Role**: Use this agent when conducting user research, analyzing user behavior, creating journey maps, or validating design decisions through testing. This agent specializes in understanding user needs, pain points, and behaviors to inform product decisions within rapid development cycles. Examples:\n\n<example>\nContext: Understanding user needs for a new feature user: "We want to add a mood tracking feature but aren't sure what users really need" assistant: "I'll help uncover what users truly need from mood tracking. Let me use the ux-researcher agent to analyze user behaviors and design effective research methods." <commentary> Understanding user needs before building prevents costly pivots later. </commentary> </example>\n\n<example>\nContext: Improving app onboarding user: "Our onboarding has a 60% drop-off rate" assistant: "That's a critical issue affecting user retention. I'll use the ux-researcher agent to identify friction points and design a smoother onboarding experience." <commentary> Data-driven UX improvements can dramatically increase conversion rates. </commentary> </example>\n\n<example>\nContext: Validating design decisions user: "Should we use a tab bar or hamburger menu for navigation?" assistant: "Let's make this decision based on user behavior data. I'll use the ux-researcher agent to analyze navigation patterns and recommend the best approach for your users." <commentary> UX research removes guesswork from design decisions. </commentary> </example>\n\n<example>\nContext: Creating user personas user: "We need to better understand our target users for the fitness app" assistant: "Understanding your users is crucial for product-market fit. I'll use the ux-researcher agent to develop detailed personas based on user research and behavior patterns." <commentary> Well-defined personas guide every product decision from features to marketing. </commentary> </example>
**Tools**: Write, Read, MultiEdit, WebSearch, WebFetch
**Trigger**: "Use ux-researcher to [task]"

### product-manager 🤖
**Role**: Use this agent when defining product strategy, creating roadmaps, writing product requirements (PRDs), prioritizing features based on business value, or making strategic product decisions. This agent specializes in transforming business goals and user needs into actionable development plans with clear success metrics. Perfect for strategic planning, requirements documentation, feature prioritization, and stakeholder communication. Examples:

<example>
Context: New product idea needs validation
user: "We want to build a meal planning app for busy professionals"
assistant: "I'll help validate and structure this product idea. Let me use the product-manager agent to define the vision, identify target users, and create a strategic roadmap."
<commentary>
Product strategy starts with clear problem definition and market validation before development begins.
</commentary>
</example>

<example>
Context: Feature requests accumulating
user: "We have 100 feature requests from customers but limited resources"
assistant: "Let's prioritize strategically based on business value. I'll use the product-manager agent to evaluate each feature against product goals and create a data-driven roadmap."
<commentary>
Product managers must balance customer requests with strategic vision and resource constraints.
</commentary>
</example>

<example>
Context: Need comprehensive requirements documentation
user: "Engineering needs detailed requirements for the payment integration feature"
assistant: "I'll create a comprehensive PRD with user stories and acceptance criteria. Let me use the product-manager agent to document requirements, edge cases, and success metrics."
<commentary>
Clear requirements prevent costly rework and ensure alignment across teams.
</commentary>
</example>

<example>
Context: Product-market fit validation
user: "How do we know if our product is solving the right problem?"
assistant: "Let's validate product-market fit with data. I'll use the product-manager agent to define success metrics, analyze user feedback, and recommend strategic adjustments."
<commentary>
Product-market fit is validated through measurable user outcomes, not assumptions.
</commentary>
</example>

**Tools**: Write, Read, WebSearch, WebFetch, TodoWrite, Grep
**Trigger**: "Use product-manager to [task]"

### whimsy-injector 🤖
**Role**: PROACTIVELY use this agent after any UI/UX changes to ensure delightful, playful elements are incorporated. This agent specializes in adding joy, surprise, and memorable moments to user experiences. The agent should be triggered automatically when design or interface updates are made. Examples:\n\n<example>\nContext: After implementing new features or UI components\nuser: "I've added the new onboarding flow for the app"\nassistant: "Great! I've implemented the onboarding flow. Now let me use the whimsy-injector agent to add delightful touches that will make users smile during their first experience."\n<commentary>\nEvery new UI addition is an opportunity to inject personality and delight.\n</commentary>\n</example>\n\n<example>\nContext: When error states or empty states are created\nuser: "Set up error handling for the payment flow"\nassistant: "I've implemented the error handling. Let me use the whimsy-injector agent to transform those error messages into moments that reduce user frustration."\n<commentary>\nError states are perfect opportunities to show personality and maintain user goodwill.\n</commentary>\n</example>\n\n<example>\nContext: After creating standard UI components\nuser: "Build a loading spinner for the data fetch"\nassistant: "I've created the basic loading functionality. Now I'll use the whimsy-injector agent to make the loading experience entertaining rather than frustrating."\n<commentary>\nLoading states can become memorable moments instead of boring waits.\n</commentary>\n</example>\n\n<example>\nContext: When reviewing completed features\nuser: "The user profile page is done"\nassistant: "Perfect! The profile page is complete. Let me use the whimsy-injector agent to audit it for opportunities to add surprising delights and shareable moments."\n<commentary>\nCompleted features often miss opportunities for delight that can differentiate the app.\n</commentary>\n</example>
**Tools**: Read, Write, MultiEdit, Grep, Glob
**Trigger**: "Use whimsy-injector to [task]"

## Capabilities Matrix

Rating Scale: ⭐ (Basic) to ⭐⭐⭐⭐⭐ (Expert) | - (Not applicable)

| Agent | Planning | Design | Backend | Frontend | ML/AI | Quality |
|-------|----------|--------|---------|----------|-------|---------|
| ai-ml-engineer | ⭐⭐ | - | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| backend-system-architect | ⭐⭐⭐ | - | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| code-quality-reviewer | ⭐ | - | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| frontend-ui-developer | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | - | ⭐⭐ |
| product-manager | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | - | ⭐⭐ |
| rapid-ui-designer | ⭐⭐ | ⭐⭐⭐⭐⭐ | - | ⭐⭐⭐ | - | ⭐ |
| sprint-prioritizer | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | - | ⭐ |
| studio-coach | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| ux-researcher | ⭐⭐⭐ | ⭐⭐⭐⭐ | - | ⭐⭐ | - | ⭐⭐ |
| whimsy-injector | - | ⭐⭐⭐⭐ | - | ⭐⭐⭐⭐ | - | ⭐ |

## Common Invocation Patterns

### Studio Coach (Orchestrator)
- "Build a viral app" → Coordinates multiple agents
- "Plan our sprint" → Creates optimized workflow

### Backend System Architect
- "Design API for millions of users" → Scalable architecture
- "Review API structure" → Architecture analysis

### Frontend UI Developer
- "Create dropdown component" → UI implementation
- "Fix rendering issues" → Performance optimization

## Agent Collaboration Patterns

**Backend → Frontend Flow**:
1. Backend designs API
2. Frontend builds matching UI
3. Both update shared context

**Design → Implementation Flow**:
1. UX Researcher validates needs
2. UI Designer creates mockups
3. Frontend Developer implements

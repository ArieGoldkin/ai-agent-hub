# Context Triggers for Automatic Agent Invocation

## Backend System Architect
KEYWORDS: api, database, backend, server, endpoint, auth, authentication, microservice, REST, GraphQL, SQL, PostgreSQL, MongoDB, Redis, schema, migration, route, controller, FastAPI, Express, Django, serverless, lambda, queue, cache, webhook, JWT, OAuth, session, middleware

## Frontend UI Developer  
KEYWORDS: component, UI, interface, React, frontend, button, form, page, CSS, HTML, Vue, Angular, Next.js, styling, render, state, props, hooks, JSX, DOM, responsive, mobile, desktop, navigation, modal, dropdown, carousel, accordion

## AI/ML Engineer
KEYWORDS: ML, AI, model, predict, train, neural, recommendation, machine learning, tensorflow, pytorch, LLM, GPT, classification, regression, embedding, vector, transformer, fine-tune, dataset, accuracy, loss, optimization, inference, chatbot, NLP, computer vision

## UX Researcher
KEYWORDS: user, research, experience, journey, persona, testing, feedback, needs, requirements, usability, interview, survey, analytics, behavior, heatmap, A/B test, conversion, retention, engagement, pain point, user story, accessibility

## Rapid UI Designer
KEYWORDS: design, mockup, prototype, wireframe, layout, figma, sketch, UI design, visual, aesthetic, color, typography, spacing, branding, style guide, design system, component library, illustration, icon, pattern, theme

## Code Quality Reviewer
KEYWORDS: test, review, quality, bug, lint, coverage, refactor, standard, security, audit, check, validate, unit test, integration test, code smell, technical debt, performance, optimize, clean code, best practice, SOLID, DRY

## Sprint Prioritizer
KEYWORDS: sprint, plan, prioritize, roadmap, timeline, scope, estimate, backlog, agile, scrum, kanban, velocity, story points, deadline, milestone, release, iteration, MVP, feature flag, dependency, blocker

## Product Manager
KEYWORDS: product, strategy, feature, PRD, product requirements, user story, epic, theme, vision, market, competitor, competitive, pricing, positioning, GTM, go-to-market, product-market fit, PMF, customer, stakeholder, requirement, specification, OKR, KPI, metrics, success criteria, trade-off, launch, beta, feedback, persona, journey, value proposition, business model, revenue, monetization, target audience, market research, product roadmap

## Whimsy Injector
KEYWORDS: delight, animation, fun, interaction, creative, playful, easter egg, micro-interaction, surprise, engaging, gamify, confetti, particle, bounce, hover, transition, loading, empty state, success, celebration, personality

## Studio Coach (Orchestrator)
KEYWORDS: build app, create application, full project, entire system, complete platform, orchestrate, coordinate, whole, everything, startup, MVP, product, launch, ship, deploy, end-to-end, full-stack
MULTI_AGENT: true

## Trigger Rules

### Single Agent Activation
When user mentions keywords from a single category, automatically invoke that specialist agent.

### Multi-Agent Coordination
When user mentions:
- Keywords from multiple categories
- Terms like "full app", "entire project", "complete system"
- Complex features spanning multiple domains

Automatically invoke Studio Coach to coordinate multiple agents.

### Context-Aware Activation
Agents should activate based on:
1. **Direct keywords** - Explicit mentions of technology or domain
2. **Intent signals** - What the user wants to achieve
3. **File context** - Currently open files or recent edits
4. **Project structure** - Existing codebase patterns

### Priority Order
When multiple agents could apply:
1. Studio Coach (for multi-domain tasks)
2. Domain-specific agent (based on strongest keyword match)
3. Supporting agents (triggered by Studio Coach as needed)

## Usage Examples

**User says:** "I need to add user authentication"
**Triggers:** Backend System Architect (auth, authentication keywords)

**User says:** "Make the loading screen more fun"
**Triggers:** Whimsy Injector (fun, loading keywords)

**User says:** "Build a dashboard with real-time data"
**Triggers:** Studio Coach → Frontend UI Developer + Backend System Architect

**User says:** "The app feels slow"
**Triggers:** Code Quality Reviewer (performance optimization)

**User says:** "Plan next week's development"
**Triggers:** Sprint Prioritizer (plan, week keywords)

## Implementation Notes

- Keyword matching should be case-insensitive
- Support partial matches and stemming (e.g., "designing" matches "design")
- Context from previous messages should influence agent selection
- Agents can suggest bringing in other specialists when needed
- User can always override with explicit agent requests
---
name: ai-native-development
description: Build AI-first applications with RAG pipelines, embeddings, vector databases, agentic workflows, and LLM integration. Master prompt engineering, function calling, streaming responses, and cost optimization for 2025+ AI development.
version: 1.0.0
author: AI Agent Hub
tags: [ai, llm, rag, embeddings, vector-database, agents, langchain, 2025]
---

# AI-Native Development

## Overview

AI-Native Development focuses on building applications where AI is a first-class citizen, not an afterthought. This skill provides comprehensive patterns for integrating LLMs, implementing RAG (Retrieval-Augmented Generation), using vector databases, building agentic workflows, and optimizing AI application performance and cost.

**When to use this skill:**
- Building chatbots, Q&A systems, or conversational interfaces
- Implementing semantic search or recommendation engines
- Creating AI agents that can use tools and take actions
- Integrating LLMs (OpenAI, Anthropic, open-source models) into applications
- Building RAG systems for knowledge retrieval
- Optimizing AI costs and latency
- Implementing AI observability and monitoring

---

## Why AI-Native Development Matters

Traditional software is deterministic; AI-native applications are probabilistic:

- **Context is Everything**: LLMs need relevant context to provide accurate answers
- **RAG Over Fine-Tuning**: Retrieval is cheaper and more flexible than fine-tuning
- **Embeddings Enable Semantic Search**: Move beyond keyword matching to understanding meaning
- **Agentic Workflows**: LLMs can reason, plan, and use tools autonomously
- **Cost Management**: Token usage directly impacts operational costs
- **Observability**: Debugging probabilistic systems requires new approaches
- **Prompt Engineering**: How you ask matters as much as what you ask

---

## Core Concepts

### 1. Embeddings & Vector Search

Embeddings are vector representations of text that capture semantic meaning. Similar concepts have similar vectors.

**Key Capabilities:**
- Convert text to high-dimensional vectors (1536 or 3072 dimensions)
- Measure semantic similarity using cosine similarity
- Find relevant documents through vector search
- Batch process for efficiency

**Detailed Implementation:** See `references/vector-databases.md` for:
- OpenAI embeddings setup and batch processing
- Cosine similarity algorithms
- Chunking strategies (500-1000 tokens with 10-20% overlap)

### 2. Vector Databases

Store and retrieve embeddings efficiently at scale.

**Popular Options:**
- **Pinecone**: Serverless, managed service ($0.096/hour)
- **Chroma**: Open source, self-hosted
- **Weaviate**: Flexible schema, hybrid search
- **Qdrant**: Rust-based, high performance

**Detailed Implementation:** See `references/vector-databases.md` for:
- Complete setup guides for each database
- Upsert, query, update, delete operations
- Metadata filtering and hybrid search
- Cost comparison and best practices

### 3. RAG (Retrieval-Augmented Generation)

RAG combines retrieval systems with LLMs to provide accurate, grounded answers.

**Core Pattern:**
1. Retrieve relevant documents from vector database
2. Construct context from top results
3. Generate answer with LLM using retrieved context

**Advanced Patterns:**
- RAG with citations and source tracking
- Hybrid search (semantic + keyword)
- Multi-query RAG for better recall
- HyDE (Hypothetical Document Embeddings)
- Contextual compression for relevance

**Detailed Implementation:** See `references/rag-patterns.md` for:
- Basic and advanced RAG patterns with full code
- Citation strategies
- Hybrid search with Reciprocal Rank Fusion
- Conversation memory patterns
- Error handling and validation

### 4. Function Calling & Tool Use

Enable LLMs to use external tools and APIs reliably.

**Capabilities:**
- Define tools with JSON schemas
- Execute functions based on LLM decisions
- Handle parallel tool calls
- Stream responses with tool use

**Detailed Implementation:** See `references/function-calling.md` for:
- Tool definition patterns (OpenAI and Anthropic)
- Function calling loops
- Parallel and streaming tool execution
- Input validation with Zod
- Error handling and fallback strategies

### 5. Agentic Workflows

Enable LLMs to reason, plan, and take autonomous actions.

**Patterns:**
- **ReAct**: Reasoning + Acting loop with observations
- **Tree of Thoughts**: Explore multiple reasoning paths
- **Multi-Agent**: Specialized agents collaborating on complex tasks
- **Autonomous Agents**: Self-directed goal achievement

**Detailed Implementation:** See `references/agentic-workflows.md` for:
- Complete ReAct loop implementation
- Tree of Thoughts exploration
- Multi-agent coordinator patterns
- Agent memory management
- Error recovery and safety guards

### 6. Streaming Responses

Deliver real-time AI responses for better UX.

**Capabilities:**
- Stream LLM output token-by-token
- Server-Sent Events (SSE) for web clients
- Streaming with function calls
- Backpressure handling

**Detailed Implementation:** See `../streaming-api-patterns/SKILL.md` for streaming patterns

### 7. Cost Optimization

**Strategies:**
- Use smaller models for simple tasks (GPT-3.5 vs GPT-4)
- Implement prompt caching (Anthropic's ephemeral cache)
- Batch requests when possible
- Set max_tokens to prevent runaway generation
- Monitor usage with alerts

**Token Counting:**
```typescript
import { encoding_for_model } from 'tiktoken'

function countTokens(text: string, model = 'gpt-4'): number {
  const encoder = encoding_for_model(model)
  const tokens = encoder.encode(text)
  encoder.free()
  return tokens.length
}
```

**Detailed Implementation:** See `references/observability.md` for:
- Cost estimation and budget tracking
- Model selection strategies
- Prompt caching patterns

### 8. Observability & Monitoring

Track LLM performance, costs, and quality in production.

**Tools:**
- **LangSmith**: Tracing, evaluation, monitoring
- **LangFuse**: Open-source observability
- **Custom Logging**: Structured logs with metrics

**Key Metrics:**
- Throughput (requests/minute)
- Latency (P50, P95, P99)
- Token usage and cost
- Error rate
- Quality scores (relevance, coherence, factuality)

**Detailed Implementation:** See `references/observability.md` for:
- LangSmith and LangFuse integration
- Custom logger implementation
- Performance monitoring
- Quality evaluation
- Debugging and error analysis

---

## Searching References

This skill includes detailed reference material. Use grep to find specific patterns:

```bash
# Find RAG patterns
grep -r "RAG" references/

# Search for specific vector database
grep -A 10 "Pinecone Setup" references/vector-databases.md

# Find agentic workflow examples
grep -B 5 "ReAct Pattern" references/agentic-workflows.md

# Locate function calling patterns
grep -n "parallel.*tool" references/function-calling.md

# Search for cost optimization
grep -i "cost\|pricing\|budget" references/observability.md

# Find all code examples for embeddings
grep -A 20 "async function.*embedding" references/
```

---

## Best Practices

### Context Management
- ✅ Keep context windows under 75% of model limit
- ✅ Use sliding window for long conversations
- ✅ Summarize old messages before they scroll out
- ✅ Remove redundant or irrelevant context

### Embedding Strategy
- ✅ Chunk documents to 500-1000 tokens
- ✅ Overlap chunks by 10-20% for continuity
- ✅ Include metadata (title, source, date) with chunks
- ✅ Re-embed when source data changes

### RAG Quality
- ✅ Use hybrid search (semantic + keyword)
- ✅ Re-rank results for relevance
- ✅ Include citation/source in context
- ✅ Set temperature low (0.1-0.3) for factual answers
- ✅ Validate answers against retrieved context

### Function Calling
- ✅ Provide clear, concise function descriptions
- ✅ Use strict JSON schema for parameters
- ✅ Handle missing or invalid parameters gracefully
- ✅ Limit to 10-20 tools to avoid confusion
- ✅ Validate function outputs before returning to LLM

### Cost Optimization
- ✅ Use smaller models for simple tasks
- ✅ Implement prompt caching for repeated content
- ✅ Batch requests when possible
- ✅ Set max_tokens to prevent runaway generation
- ✅ Monitor usage with alerts for anomalies

### Security
- ✅ Validate and sanitize user inputs
- ✅ Never include secrets in prompts
- ✅ Implement rate limiting
- ✅ Filter outputs for harmful content
- ✅ Use separate API keys per environment

---

## Templates

Use the provided templates for common AI patterns:

- **`templates/rag-pipeline.ts`** - Basic RAG implementation
- **`templates/agentic-workflow.ts`** - ReAct agent pattern

---

## Examples

### Complete RAG Chatbot

See `examples/chatbot-with-rag/` for a full-stack implementation:
- Vector database setup with document ingestion
- RAG query with citations
- Streaming chat interface
- Cost tracking and monitoring

---

## Checklists

### AI Implementation Checklist

See `checklists/ai-implementation.md` for comprehensive validation covering:
- [ ] Vector database setup and configuration
- [ ] Embedding generation and chunking strategy
- [ ] RAG pipeline with quality validation
- [ ] Function calling with error handling
- [ ] Streaming response implementation
- [ ] Cost monitoring and budget alerts
- [ ] Observability and logging
- [ ] Security and input validation

---

## Common Patterns

### Semantic Caching

Reduce costs by caching similar queries:

```typescript
const cache = new Map<string, { embedding: number[]; response: string }>()

async function cachedRAG(query: string) {
  const queryEmbedding = await createEmbedding(query)

  // Check if similar query exists in cache
  for (const [cachedQuery, cached] of cache.entries()) {
    const similarity = cosineSimilarity(queryEmbedding, cached.embedding)
    if (similarity > 0.95) {
      return cached.response
    }
  }

  // Not cached, perform RAG
  const response = await ragQuery(query)
  cache.set(query, { embedding: queryEmbedding, response })
  return response
}
```

### Conversational Memory

Maintain context across multiple turns:

```typescript
interface ConversationMemory {
  messages: Message[] // Last 10 messages
  summary?: string // Summary of older messages
}

async function getConversationContext(userId: string): Promise<Message[]> {
  const memory = await db.memory.findUnique({ where: { userId } })

  return [
    { role: 'system', content: `Previous conversation summary: ${memory.summary}` },
    ...memory.messages.slice(-5) // Last 5 messages
  ]
}
```

---

## Prompt Engineering

### Few-Shot Learning

Provide examples to guide LLM behavior:

```typescript
const fewShotExamples = `
Example 1:
Input: "I love this product!"
Sentiment: Positive

Example 2:
Input: "It's okay, nothing special"
Sentiment: Neutral
`

// Include in system prompt
```

### Chain of Thought (CoT)

Ask LLM to show reasoning:

```typescript
const prompt = `${problem}\n\nLet's think step by step:`
```

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [LangChain Documentation](https://python.langchain.com/docs/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Chroma Documentation](https://docs.trychroma.com/)
- [LangSmith Observability](https://docs.smith.langchain.com/)

---

## Next Steps

After mastering AI-Native Development:
1. Explore **Streaming API Patterns** skill for real-time AI responses
2. Use **Type Safety & Validation** skill for AI input/output validation
3. Apply **Edge Computing Patterns** skill for global AI deployment
4. Reference **Observability Patterns** for production monitoring

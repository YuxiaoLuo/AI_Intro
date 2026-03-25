# 03 Prompt caching

> This tutorial is inspired by Anthropic's flagship Agentic AI product - Claude Code, see [ClaudeAPIDocs](https://platform.claude.com/docs/en/build-with-claude/context-windows).

---

## 1. 🧠 What is Prompt Caching?

Prompt caching is a technique that allows AI systems to:

- **Reuse previously processed information**  
- Avoid reprocessing the same input repeatedly  

👉 It improves both:
- **Speed (performance)**  
- **Cost efficiency**  

📌 From the source:  
Prompt caching allows systems to reuse previously processed prompt prefixes, reducing time and cost :contentReference[oaicite:0]{index=0}  

---

## 2. 📊 Why Prompt Caching Matters in Business Systems

AI systems in business often deal with:

- Repeated queries  
- Large datasets  
- Standardized instructions  

### Without caching:
- Systems repeatedly process the same information  
- Higher costs and slower responses  

### With caching:
- Faster responses  
- Lower operational costs  
- Better scalability  

---

## 3. 🔄 How Prompt Caching Works (Conceptual)

When a request is sent:

1. The system checks if part of the request was processed before  
2. If found:
   - It reuses the stored version (**cache hit**)  
3. If not:
   - It processes the request and stores it (**cache write**)  

👉 This avoids unnecessary repetition  

---

## 4. 🧩 Key Concept: The “Prefix”

- The **prefix** is the reusable part of a request  
- Usually includes:
  - Instructions  
  - background data  
  - previous conversation  

👉 Only this reusable part is cached  

---

## 5. ⚙️ Types of Prompt Caching

### A. Automatic Caching

- System automatically decides what to cache  
- Best for:
  - Ongoing conversations  
  - General use cases  

👉 Simple and low maintenance  

---

### B. Explicit Caching

- Users define exactly what to cache  
- Best for:
  - Complex systems  
  - Fine control over performance  

👉 More control, but requires planning  

---

## 6. 🏢 Business Applications

### A. Customer Support Systems
- Cache:
  - Standard responses  
  - FAQs  
- Result:
  - Faster replies  
  - Reduced workload  

---

### B. Business Analytics Tools
- Cache:
  - Data models  
  - Reports  
- Result:
  - Faster insights generation  

---

### C. Document Processing Systems
- Cache:
  - Large documents (e.g., contracts)  
- Result:
  - Avoid re-analyzing entire documents  

---

## 7. 💰 Cost and Performance Benefits

### ✔ Reduced Processing Costs
- Less repeated computation  

### ✔ Faster Response Times
- Immediate reuse of cached data  

### ✔ Improved Scalability
- Handles more users efficiently  

---

## 8. ⚠️ Challenges & Limitations

- ❗ Cache expires after a time period  
- ❗ Only works if input is identical  
- ❗ Changes in data may invalidate cache  

---

## 9. 🧠 Strategic Design Considerations

To use caching effectively:

- Cache **stable and reusable information**  
- Avoid caching frequently changing data  
- Place reusable content at the **beginning of requests**  

---

## 10. 🔗 Integration with Business Systems

Prompt caching works best when combined with:

- **Knowledge management systems**  
- **Databases**  
- **AI workflows**  

👉 Enables:
- Efficient large-scale operations  
- Consistent performance  

---

## 📈 Strategic Insight

> Efficiency in AI systems comes from avoiding unnecessary work.

---

## 📝 In-Class Activity

### Scenario:
A company uses AI to analyze large legal documents repeatedly.

### Task:
1. Identify:
   - What parts of the process can be cached  
   - What must be processed each time  

2. Discuss:
   - How caching reduces:
     - Cost  
     - Processing time  

---

# How Claude Code did Prompt Caching in Practice

## 📌 Key Takeaways

- Prompt caching reuses previously processed information  
- It improves **speed, efficiency, and cost management**  
- Best used for **repetitive and stable inputs**  
- Critical for scalable **business AI systems**

--- 


Prompt caching optimizes your API usage by allowing resuming from specific prefixes in your prompts. This significantly reduces processing time and costs for repetitive tasks or prompts with consistent elements.

Prompt caching stores KV cache representations and cryptographic hashes of cached content, but does not store the raw text of prompts or responses. This may be suitable for customers who require [ZDR-type data retention](/docs/en/build-with-claude/zero-data-retention) commitments. See [cache lifetime](/docs/en/build-with-claude/prompt-caching#what-is-the-cache-lifetime) for details.

There are two ways to enable prompt caching:

- **[Automatic caching](#automatic-caching)**: Add a single `cache_control` field at the top level of your request. The system automatically applies the cache breakpoint to the last cacheable block and moves it forward as conversations grow. Best for multi-turn conversations where the growing message history should be cached automatically.
- **[Explicit cache breakpoints](#explicit-cache-breakpoints)**: Place `cache_control` directly on individual content blocks for fine-grained control over exactly what gets cached. The simplest way to start is with automatic caching.

With automatic caching, the system caches all content up to and including the last cacheable block. On subsequent requests with the same prefix, cached content is reused automatically.

---

## How prompt caching works

When you send a request with prompt caching enabled:

1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.
2. If found, it uses the cached version, reducing processing time and costs.
3. Otherwise, it processes the full prompt and caches the prefix once the response begins.

This is especially useful for:
- Prompts with many examples
- Large amounts of context or background information
- Repetitive tasks with consistent instructions
- Long multi-turn conversations

By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used.

If you find that 5 minutes is too short, Anthropic also offers a 1-hour cache duration [at additional cost](#pricing).

For more information, see [1-hour cache duration](#1-hour-cache-duration).

  **Prompt caching caches the full prefix**

Prompt caching references the entire prompt - `tools`, `system`, and `messages` (in that order) up to and including the block designated with `cache_control`.

---

## Automatic caching

Automatic caching is the simplest way to enable prompt caching. Instead of placing `cache_control` on individual content blocks, add a single `cache_control` field at the top level of your request body. The system automatically applies the cache breakpoint to the last cacheable block.

### How automatic caching works in multi-turn conversations

With automatic caching, the cache point moves forward automatically as conversations grow. Each new request caches everything up to the last cacheable block, and previous content is read from cache.

| Request | Content | Cache behavior |
|---------|---------|----------------|
| Request 1 | System <br/> + User(1) + Asst(1) <br/> + **User(2)** ◀ cache | Everything written to cache |
| Request 2 | System <br/> + User(1) + Asst(1) <br/> + User(2) + Asst(2) <br/> + **User(3)** ◀ cache | System through User(2) read from cache; <br/> Asst(2) + User(3) written to cache |
| Request 3 | System <br/> + User(1) + Asst(1) <br/> + User(2) + Asst(2) <br/> + User(3) + Asst(3) <br/> + **User(4)** ◀ cache | System through User(3) read from cache; <br/> Asst(3) + User(4) written to cache |

The cache breakpoint automatically moves to the last cacheable block in each request, so you don't need to update any `cache_control` markers as the conversation grows.

### Best practices for effective caching

To optimize prompt caching performance:

- Start with [automatic caching](#automatic-caching) for multi-turn conversations. It handles breakpoint management automatically.
- Use [explicit block-level breakpoints](#explicit-cache-breakpoints) when you need to cache different sections with different change frequencies.
- Cache stable, reusable content like system instructions, background information, large contexts, or frequent tool definitions.
- Place cached content at the prompt's beginning for best performance.
- Use cache breakpoints strategically to separate different cacheable prefix sections.
- Place the breakpoint on the last block that stays identical across requests. For a prompt with a static prefix and a varying suffix (timestamps, per-request context, the incoming message), that is the end of the prefix, not the varying block.
- Regularly analyze cache hit rates and adjust your strategy as needed.

### Optimizing for different use cases

Tailor your prompt caching strategy to your scenario:

- Conversational agents: Reduce cost and latency for extended conversations, especially those with long instructions or uploaded documents.
- Coding assistants: Improve autocomplete and codebase Q&A by keeping relevant sections or a summarized version of the codebase in the prompt.
- Large document processing: Incorporate complete long-form material including images in your prompt without increasing response latency.
- Detailed instruction sets: Share extensive lists of instructions, procedures, and examples to fine-tune Claude's responses.  Developers often include an example or two in the prompt, but with prompt caching you can get even better performance by including 20+ diverse examples of high quality answers.
- Agentic tool use: Enhance performance for scenarios involving multiple tool calls and iterative code changes, where each step typically requires a new API call.
- Talk to books, papers, documentation, podcast transcripts, and other longform content:  Bring any knowledge base alive by embedding the entire document(s) into the prompt, and letting users ask it questions.
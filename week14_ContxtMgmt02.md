# 02 Context editing

> This tutorial is inspired by Anthropic's flagship Agentic AI product - Claude Code, see [ClaudeAPIDocs](https://platform.claude.com/docs/en/build-with-claude/context-windows).

Automatically manage conversation context as it grows with context editing.

---
## 1. 🧠 What is Context Editing?

Context editing is the process of:

- **Removing unnecessary information** from an AI system’s memory  
- Keeping only the **most relevant data** for decision-making  

👉 It is a more **controlled and selective approach** than summarization.

📌 From the source:  
Context editing allows selective clearing of content to maintain focus and efficiency :contentReference[oaicite:0]{index=0}  

---

## 2. 📊 Why Context Editing Matters in Business Systems

In business environments, AI systems often:

- Process large amounts of data  
- Interact with multiple tools (databases, APIs)  
- Run long workflows  

### Problem:
- Too much information leads to:
  - Slower performance  
  - Reduced accuracy  
  - Higher operational costs  

👉 Context editing helps **optimize what the system “remembers”**

---

## 3. 🔄 Context Editing vs. Compaction

| Approach | Description | Use Case |
|----------|------------|----------|
| **Compaction** | Summarizes past information | General long conversations |
| **Context Editing** | Removes specific pieces of data | Fine-grained control scenarios |

👉 Context editing = **precision control**  
👉 Compaction = **broad summarization**

---

## 4. 🧩 Key Context Editing Strategies

### A. Tool Result Clearing

- Removes results from tools (e.g., search results, file data)  
- Keeps only **recent or relevant outputs**  

👉 Example:
- A system analyzing multiple reports:
  - Old reports can be removed once processed  

---

### B. Thinking Block Clearing

- Removes internal reasoning steps used by the AI  
- Keeps only **final outputs or recent reasoning**  

👉 Helps reduce:
- Memory usage  
- Processing overhead  

---

### C. Selective Retention

- Keep only:
  - Recent actions  
  - Important decisions  
- Remove:
  - Repetitive or outdated information  

---

## 5. ⚙️ How Context Editing Works (Conceptual Flow)

1. System monitors context size  
2. When threshold is reached:
   - Identifies unnecessary content  
3. Removes selected elements  
4. Continues processing with a **cleaner, focused context**

---

## 6. 🏢 Business Applications

### A. AI-Powered Customer Support
- Removes:
  - Old conversation details  
- Keeps:
  - Current issue  
  - Customer preferences  

👉 Result: Faster and more relevant responses  

---

### B. Business Analytics Systems
- Removes:
  - Raw data already analyzed  
- Keeps:
  - Key insights and results  

---

### C. Workflow Automation Systems
- Removes:
  - Completed task logs  
- Keeps:
  - Current workflow state  

---

## 7. ⚖️ Benefits of Context Editing

- ✔ Improved performance  
- ✔ Better focus on relevant data  
- ✔ Lower computational costs  
- ✔ Scalable long-running systems  

---

## 8. ⚠️ Challenges & Trade-offs

- ❗ Risk of removing important information  
- ❗ Requires careful configuration  
- ❗ May affect continuity if overused  

---

## 9. 🔗 Integration with Business Memory Systems

Context editing can be combined with:

- **Databases / storage systems**
- **Knowledge management systems**

### Key Idea:
- Store important information externally  
- Remove it from active memory  

👉 This creates:
- Efficient systems  
- Persistent knowledge storage  

---

## 10. 📈 Strategic Insight

> Effective systems don’t store everything—they store what matters.

---

## 📝 In-Class Activity

### Scenario:
An AI system helps analysts process large datasets.

### Task:
1. Identify:
   - What data should be removed after use  
   - What should be retained  

2. Discuss:
   - How this improves:
     - System efficiency  
     - Decision quality  

---

## 📌 Key Takeaways

- Context editing is about **selective information removal**  
- It improves **efficiency and accuracy**  
- It is critical for **complex, tool-based business systems**  
- Works best when combined with **external memory systems**

---

# How Claude Code did Context Editing in Ppactice

For most use cases, [server-side compaction](/docs/en/build-with-claude/compaction) is the primary strategy for managing context in long-running conversations. The strategies on this page are useful for specific scenarios where you need more fine-grained control over what content is cleared.

Context editing allows you to selectively clear specific content from conversation history as it grows. Beyond optimizing costs and staying within limits, this is about actively curating what Claude sees: context is a finite resource with diminishing returns, and irrelevant content degrades model focus. Context editing gives you fine-grained runtime control over that curation. For the broader principles behind context management, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). This page covers:

- **Tool result clearing** - Best for agentic workflows with heavy tool use where old tool results are no longer needed
- **Thinking block clearing** - For managing thinking blocks when using extended thinking, with options to preserve recent thinking for context continuity
- **Client-side SDK compaction** - An SDK-based alternative for summary-based context management (server-side compaction is generally preferred)

| Approach | Where it runs | Strategies | How it works |
|----------|---------------|------------|--------------|
| **Server-side** | API | Tool result clearing (`clear_tool_uses_20250919`)<br/>Thinking block clearing (`clear_thinking_20251015`) | Applied before the prompt reaches Claude. Clears specific content from conversation history. Each strategy can be configured independently. |
| **Client-side** | SDK | Compaction | Available in [Python, TypeScript, and Ruby SDKs](/docs/en/api/client-sdks) when using [`tool_runner`](/docs/en/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Generates a summary and replaces full conversation history. See [Client-side compaction](#client-side-compaction-sdk) below. |

## Server-side strategies

Context editing is in beta with support for tool result clearing and thinking block clearing. To enable it, use the beta header `context-management-2025-06-27` in your API requests.

Share feedback on this feature through the [feedback form](https://forms.gle/YXC2EKGMhjN1c4L88).

This feature is in beta and is **not** eligible for [Zero Data Retention (ZDR)](/docs/en/build-with-claude/zero-data-retention). Beta features are excluded from ZDR.

### Tool result clearing

The `clear_tool_uses_20250919` strategy clears tool results when conversation context grows beyond your configured threshold. This is particularly useful for agentic workflows with heavy tool use. Older tool results (like file contents or search results) are no longer needed once Claude has processed them.

When activated, the API automatically clears the oldest tool results in chronological order. The API replaces each cleared result with placeholder text so Claude knows it was removed. By default, only tool results are cleared. You can optionally clear both tool results and tool calls (the tool use parameters) by setting `clear_tool_inputs` to true.

### Thinking block clearing

The `clear_thinking_20251015` strategy manages `thinking` blocks in conversations when extended thinking is enabled. This strategy gives you control over thinking preservation: you can choose to keep more thinking blocks to maintain reasoning continuity, or clear them more aggressively to save context space.

**Default behavior:** When extended thinking is enabled without configuring the `clear_thinking_20251015` strategy, the API automatically keeps only the thinking blocks from the last assistant turn (equivalent to `keep: {type: "thinking_turns", value: 1}`).

To maximize cache hits, preserve all thinking blocks by setting `keep: "all"`.

An assistant conversation turn may include multiple content blocks (e.g. when using tools) and multiple thinking blocks (e.g. with [interleaved thinking](/docs/en/build-with-claude/extended-thinking#interleaved-thinking)).

### Context editing happens server-side

Context editing is applied server-side before the prompt reaches Claude. Your client application maintains the full, unmodified conversation history. You do not need to sync your client state with the edited version. Continue managing your full conversation history locally as you normally would.

### Context editing and prompt caching

Context editing's interaction with [prompt caching](/docs/en/build-with-claude/prompt-caching) varies by strategy:

- **Tool result clearing**: Invalidates cached prompt prefixes when content is cleared. To account for this, clear enough tokens to make the cache invalidation worthwhile. Use the `clear_at_least` parameter to ensure a minimum number of tokens is cleared each time. You'll incur cache write costs each time content is cleared, but subsequent requests can reuse the newly cached prefix.

- **Thinking block clearing**: When thinking blocks are **kept** in context (not cleared), the prompt cache is preserved, enabling cache hits and reducing input token costs. When thinking blocks are **cleared**, the cache is invalidated at the point where clearing occurs. Configure the `keep` parameter based on whether you want to prioritize cache performance or context window availability.


### When to use compaction

**Good use cases:**

- Long-running agent tasks that process many files or data sources
- Research workflows that accumulate large amounts of information
- Multi-step tasks with clear, measurable progress
- Tasks that produce artifacts (files, reports) that persist outside the conversation

**Less ideal use cases:**

- Tasks requiring precise recall of early conversation details
- Workflows using server-side tools extensively
- Tasks that need to maintain exact state across many variables
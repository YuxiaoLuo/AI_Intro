# 01 Compaction - Managing Information Overload in AI Systems  

> This tutorial is inspired by Anthropic's flagship Agentic AI product - Claude Code, see [ClaudeAPIDocs](https://platform.claude.com/docs/en/build-with-claude/context-windows).

Server-side context compaction for managing long conversations that approach context window limits.

---

## 1. 🧠 The Problem: Information Overload in AI Systems

Modern Agentic AI systems (e.g., chatbots, decision-support tools) process information within a **limited memory window** (called a *context window*).

### Key Issue:
- As conversations or tasks grow longer:
  - The system receives **too much information**
  - It becomes harder to focus on **relevant details**
  - Performance **declines**

👉 **Business Analogy:**  
A manager reading hundreds of emails—important insights get buried.

---

## 2. 📊 Why Context Limits Matter in Business Systems

In business applications, AI systems are used for:

- Customer service chats  
- Long-running workflows (e.g., project management)  
- Data-driven decision support  

### Without proper management:
- Systems become **slower and less accurate**
- Important context is **lost or diluted**
- Costs increase due to **inefficient processing**

---

## 3. 💡 Solution: Context Compaction (Summarization)

### What is Compaction?

Compaction is a process where:
- Older, less relevant information is **summarized**
- The system keeps only **key insights**
- The conversation continues using a **shorter, more focused version**

> Compaction summarizes older context when approaching limits, keeping the system focused and performant.

---

## 4. 🔄 How Compaction Works (Conceptual Flow)

1. System monitors how much information it holds  
2. When it reaches a threshold:
   - It creates a **summary of past interactions**
3. Replaces detailed history with this summary  
4. Continues processing using the **condensed version**

### Analogy:
Like writing **meeting minutes** instead of replaying the entire meeting.

---

### How Claude Code Did Context Compaction

Server-side compaction is the recommended strategy for managing context in long-running conversations and agentic workflows. It handles context management automatically with minimal integration work.

Compaction extends the effective context length for long-running conversations and tasks by automatically summarizing older context when approaching the context window limit. This isn't just about staying under a token cap. As conversations get longer, models struggle to maintain focus across the full history. Compaction keeps the active context focused and performant by replacing stale content with concise summaries.

For a deeper look at why long contexts degrade and how compaction helps, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

This is ideal for:

- Chat-based, multi-turn conversations where you want users to use one chat for a long period of time
- Task-oriented prompts that require a lot of follow-up work (often tool use) that may exceed the context window

#### Specific Steps

When compaction is enabled, Claude automatically summarizes your conversation when it approaches the configured token threshold. The API:

1. Detects when input tokens exceed your specified trigger threshold.
2. Generates a summary of the current conversation.
3. Creates a `compaction` block containing the summary.
4. Continues the response with the compacted context.

On subsequent requests, append the response to your messages. The API automatically drops all message blocks prior to the `compaction` block, continuing the conversation from the summary.

![Flow diagram showing the compaction process: when input tokens exceed the trigger threshold, Claude generates a summary in a compaction block and continues the response with the compacted context](/data/image_tutorial/compaction-flow.svg)

---

## 5. 🏢 Business Applications

### A. Customer Support Systems
- Long conversations with customers  
- Compaction keeps:
  - Customer issue  
  - Key actions taken  
- Removes repetitive details  

👉 **Result:** Faster and more accurate responses  

---

### B. AI Assistants in Organizations
- Used for:
  - Project tracking  
  - Task coordination  

Compaction helps maintain:
- Current project status  
- Next steps  

---

### C. Data Analytics & Decision Support
- Systems summarize:
  - Historical data trends  
  - Key insights  

👉 Helps managers focus on **actionable information**

---

## 6. ⚖️ Benefits of Compaction

- ✔ **Efficiency** – Reduces processing load  
- ✔ **Focus** – Keeps only relevant information  
- ✔ **Scalability** – Supports long-running tasks  
- ✔ **Cost Reduction** – Uses fewer computational resources  

---

## 7. ⚠️ Challenges & Trade-offs

- ❗ **Loss of Detail** – Some information may be removed  
- ❗ **Summary Quality Matters** – Poor summaries → poor decisions  
- ❗ **Bias Risk** – What is kept vs. removed can affect outcomes  

---

## 8. 🧩 Customization in Business Systems

Organizations can control:
- **When compaction happens** (thresholds)  
- **What is preserved** (e.g., decisions vs. technical details)  

### Example:
- Finance system → preserve numbers and calculations  
- Customer system → preserve sentiment and complaints  

---

## 9. 📈 Strategic Insight

> Not all data is equally valuable—focus on what drives decisions.

---

## 📝 In-Class Activity

### Scenario:
A company uses an AI chatbot for customer service.

### Task:
1. Identify what information should be:
   - Kept  
   - Summarized  
   - Discarded  

2. Explain how this improves:
   - Efficiency  
   - Customer satisfaction  

---

## 📌 Key Takeaways

- AI systems have **limited processing capacity**  
- Long interactions reduce performance  
- **Compaction (summarization)** helps manage this  
- It is essential for **scalable, efficient business systems**
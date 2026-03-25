# 00 Context windows

> This tutorial is inspired by Anthropic's flagship Agentic AI product - Claude Code, see [ClaudeAPIDocs](https://platform.claude.com/docs/en/build-with-claude/context-windows).

As conversations grow, you'll eventually approach context window limits. This guide explains how context windows work and introduces strategies for managing them effectively.

For long-running conversations and agentic workflows, [server-side compaction](/week14_ContxtMgmt01.md) is the primary strategy for context management. For more specialized needs, [context editing](/week14_ContxtMgmt02.md) offers additional strategies like tool result clearing and thinking block clearing.

## 1. 🧠 What is a Context Window?

A **context window** is the amount of information an AI system can use at one time when generating a response.

- It includes:
  - Previous conversation history  
  - Current user input  
  - The system’s response  

👉 Think of it as the AI’s **working memory**  

📌 From the source:  
The context window represents all text the model can reference during a task :contentReference[oaicite:0]{index=0}  

---

## 2. 📊 Why Context Matters in Business Systems

AI systems are widely used in business for:

- Customer service chatbots  
- Business analytics tools  
- Workflow automation systems  

### The Role of Context:
- Helps AI understand:
  - Customer history  
  - Project progress  
  - Past decisions  

👉 Without context, systems behave like:
- Employees with **no memory of previous interactions**

---

## 3. 📈 How Context Grows Over Time

As interactions continue:

- Each message adds more information  
- The system keeps accumulating data  

### Key Characteristics:
- **Progressive accumulation** – information builds over time  
- **Linear growth** – each interaction increases memory usage  
- **Finite capacity** – there is a maximum limit  

---

## 4. ⚠️ The Problem: Context Limits & “Context Rot”

### Context Limit
- AI systems can only handle a **fixed amount of information**

### Context Rot
- As more information is added:
  - Accuracy decreases  
  - Important details are harder to retrieve  

👉 **Business Analogy:**  
A manager overloaded with too many reports may miss critical insights.

---

## 5. 🔄 How AI Processes Context (Simplified)

Each interaction follows two phases:

### Input Phase:
- Includes:
  - All previous conversation history  
  - Current user request  

### Output Phase:
- AI generates a response  
- That response becomes part of future context  

👉 This creates a **continuous cycle of information growth**

---

## 6. 🧩 Context in Complex Systems (Tools & Automation)

In advanced business systems:

- AI may:
  - Use external tools (e.g., databases, APIs)  
  - Perform multi-step workflows  

### Key Idea:
- Every step adds more information to the context  

### Example:
A business analytics AI:
1. Receives a query  
2. Pulls data from a system  
3. Generates insights  
4. Stores results for future steps  

👉 All steps contribute to the **context load**

---

## 7. 🧠 Context Awareness (Advanced Concept)

Some modern AI systems can:

- Track how much memory they are using  
- Adjust behavior based on remaining capacity  

### Benefits:
- Better planning for long tasks  
- Improved efficiency  
- Reduced risk of overload  

👉 **Business Analogy:**  
Like a project manager tracking budget and time remaining.


## 8. Understanding the context window in Claude Code

The "context window" refers to all the text a language model can reference when generating a response, including the response itself. This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model. A larger context window allows the model to handle more complex and lengthy prompts, but more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as *context rot*. This makes curating what's in context just as important as how much space is available.

Claude achieves state-of-the-art results on long-context retrieval benchmarks like [MRCR](https://arxiv.org/abs/2501.03276) and [GraphWalks](https://arxiv.org/abs/2412.04360), but these gains depend on what's in context, not just how much fits.

For a deep dive into why long contexts degrade and how to engineer around it, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

The diagram below illustrates the standard context window behavior for API requests<sup>1</sup>:

![Context window diagram](/data/image_tutorial/context-window.svg)

_<sup>1</sup>For chat interfaces, such as for [claude.ai](https://claude.ai/), context windows can also be set up on a rolling "first in, first out" system._

* **Progressive token accumulation:** As the conversation advances through turns, each user message and assistant response accumulates within the context window. Previous turns are preserved completely.
* **Linear growth pattern:** The context usage grows linearly with each turn, with previous turns preserved completely.
* **Context window capacity:** The total available context window (up to 1M tokens) represents the maximum capacity for storing conversation history and generating new output from Claude.
* **Input-output flow:** Each turn consists of:
  - **Input phase:** Contains all previous conversation history plus the current user message
  - **Output phase:** Generates a text response that becomes part of a future input

### The context window with extended thinking and tool use

The diagram below illustrates the context window token management when combining extended thinking with tool use:

![Context window diagram with extended thinking and tool use](/data/image_tutorial/context-window-thinking-tools.svg)

#### Steps

##### 1. First turn architecture
- **Input components:** Tools configuration and user message  
- **Output components:** Extended thinking + text response + tool use request  
- **Token calculation:** All input and output components count toward the context window, and all output components are billed as output tokens.

##### 2. Tool result handling (turn 2)
- **Input components:** Every block in the first turn as well as the `tool_result`. The extended thinking block **must** be returned with the corresponding tool results. This is the only case wherein you **have to** return thinking blocks.  
- **Output components:** After tool results have been passed back to Claude, Claude will respond with only text (no additional extended thinking until the next `user` message).  
- **Token calculation:** All input and output components count toward the context window, and all output components are billed as output tokens.

##### 3. Third Step
- **Input components:** All inputs and the output from the previous turn are carried forward, with the exception of the thinking block, which can be dropped now that Claude has completed the entire tool use cycle. The API will automatically strip the thinking block for you if you pass it back, or you can strip it yourself at this stage. This is also where you would add the next `User` turn.  
- **Output components:** Since there is a new `User` turn outside of the tool use cycle, Claude generates a new extended thinking block and continues from there.  
- **Token calculation:** Previous thinking tokens are automatically stripped from context window calculations. All other previous blocks still count as part of the token window, and the thinking block in the current `Assistant` turn counts as part of the context window.

#### Context awareness in Claude models

Some of Claude LLM models feature **context awareness**. This capability lets these models track their remaining context window (i.e. "token budget") throughout a conversation. This enables Claude to execute tasks and manage context more effectively by understanding how much space it has to work. Claude is trained to use this context precisely, persisting in the task until the very end rather than guessing how many tokens remain. For a model, lacking context awareness is like competing in a cooking show without a clock. Claude 4.5+ models change this by explicitly informing the model about its remaining context, so it can take maximum advantage of the available tokens.

**How it works:**

At the start of a conversation, Claude receives information about its total context window:

```xml
<budget:token_budget>1000000</budget:token_budget>
```

The budget is set to 1M tokens (200k for models with a smaller context window).

After each tool call, Claude receives an update on remaining capacity:

```xml
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

This awareness helps Claude determine how much capacity remains for work and enables more effective execution on long-running tasks. Image tokens are included in these budgets.

**Benefits:**

Context awareness is particularly valuable for:
- Long-running agent sessions that require sustained focus
- Multi-context-window workflows where state transitions matter
- Complex tasks requiring careful token management

<Tip>
For agents that span multiple sessions, design your state artifacts so that context recovery is fast when a new session starts. The [memory tool's multi-session pattern](/docs/en/agents-and-tools/tool-use/memory-tool#multi-session-software-development-pattern) walks through a concrete approach. See also [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
</Tip>

For prompting guidance on leveraging context awareness, see the [prompting best practices guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
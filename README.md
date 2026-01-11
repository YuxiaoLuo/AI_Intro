# Introduction to AI
This repo holds the learning materials taught by [Yuxiao (Rain) Luo](https://github.com/YuxiaoLuo) and related to the undergraduate 
INFS course [Advanced Data Analytics and AI](https://yuxiaoluo.github.io/teaching/ai_analytics).

Want to keep up with AI technology developments? Check out the weekly AI news digests:
- [Weekly Digest of AI Events in 2026](https://yuxiaoluo.github.io/post/ai-events-weekly-2026/)
- [Weekly Digest of AI Events in 2025](https://yuxiaoluo.github.io/post/ai-events-weekly-2025/).

## Course Description
This course explores artificial intelligence as a transformative tool in business, focusing on practical applications, strategic integration, and ethical considerations. Students will gain insight into AI’s foundational concepts, engage with industry-specific use cases, and analyze AI’s impact on organizational strategy. Through case studies, simulations, and expert talks, students will develop a managerial perspective on AI and learn to leverage AI as a source of competitive advantage.

## Tentative Schedule
Please follow the official syllabus and find the coursework tab for each week. All Python code (IPython Notebook file) is included in this GitHub repo.

## Prompting
- [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)
- [Learn Prompting](https://learnprompting.org/docs/introduction)
- [Prompt Engineering Guide from DAIR.AI](https://www.promptingguide.ai)

## Python Demo
- Python Basics
    - [Data Type and Structures](https://github.com/YuxiaoLuo/AI_Intro/blob/main/python_type_structure.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/python_type_structure.ipynb)
    - [Intro to Analytics](https://github.com/YuxiaoLuo/AI_Intro/blob/main/python_analytics.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/python_analytics.ipynb)

- AI Analytics
    - [Descriptive analytics](https://github.com/YuxiaoLuo/AI_Intro/blob/main/ai_analytics_descriptive_week5_1.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/ai_analytics_descriptive_week5_1.ipynb)
    - [Diagnostic analytics](https://github.com/YuxiaoLuo/AI_Intro/blob/main/ai_analytics_diagnostic_week5_2.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/ai_analytics_diagnostic_week5_2.ipynb)
    - [Text mining 1](https://github.com/YuxiaoLuo/AI_Intro/blob/main/week10_TextMining_1.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/week10_TextMining_1.ipynb)
    - [Text mining 2](https://github.com/YuxiaoLuo/AI_Intro/blob/main/week10_TextMining_2.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/week10_TextMining_2.ipynb)
    - [Image mining 1](https://github.com/YuxiaoLuo/AI_Intro/blob/main/week11_ImageMining_1.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/week11_ImageMining_1.ipynb)
    - [Image mining 2](https://github.com/YuxiaoLuo/AI_Intro/blob/main/week11_ImageMining_2.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/week11_ImageMining_2.ipynb)
    - Resources: 
        - [Google Data Science Agent](https://labs.google.com/code/dsa)
        - [LLM Token Estimator](https://tiktokenizer.vercel.app/)

- AI Applications
    - [Text-to-Speech (tts)](https://github.com/YuxiaoLuo/AI_Intro/blob/main/tts/tts_kokoro.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/tts/tts_kokoro.ipynb)
    - [LLM (Google Gemini)](https://github.com/YuxiaoLuo/AI_Intro/blob/main/google_gemini.ipynb) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YuxiaoLuo/AI_Intro/blob/main/google_gemini.ipynb)

## LLM System & APIs

### [Ollama](https://ollama.com/)
Ollama is a free, open-source tool that allows users to run large language models (LLMs) locally on their computers. Details can be found on their [GitHub Page](https://github.com/ollama/ollama?tab=readme-ov-file).

1. Download Ollama ([Windows](https://ollama.com/download/OllamaSetup.exe)/[macOS](https://ollama.com/download/Ollama-darwin.zip)/[Linux](https://github.com/ollama/ollama/blob/main/docs/linux.md)).
2. To use the LLMs in Ollama, you can use 
    - [ollama-python](https://github.com/ollama/ollama-python), the Python library for Ollama.
    - Or use [Command Line](https://en.wikipedia.org/wiki/Command-line_interface) program. Ex., [Command Prompt](https://www.geeksforgeeks.org/what-is-a-command-prompt/) for WindowsOS and [Terminal](https://www.freecodecamp.org/news/command-line-for-beginners/) for macOS.
3. Let's get started with the [tutorial](https://github.com/YuxiaoLuo/AI_Intro/blob/main/tutorial_ollama.md).
4. Please be aware of the security issues of ollama: read the article [vulnerabilities in ollama](https://www.oligo.security/blog/more-models-more-probllms)

### APIs
Here is the list of APIs used in the course. Since we only use free versions of these APIs, some may come with use limit. 
Please click into each link to obtain the API key for yourself (free account registration is needed).
- [Alpha Vantage API](https://www.alphavantage.co/support/#api-key): fetch news for LLM to do sentiment analysis from AlphaVantage, they provide free stock API service covering the majority of their datasets for up to 25 requests per day.
- [Google Gemini API](https://aistudio.google.com/): call Gemini LLM API.

## Agentic AI

### [n8n](https://github.com/n8n-io/n8n)
n8n is a workflow automation platform that enables the development of agentic AI systems. It supports the construction of AI agents and retrieval-augmented generation (RAG) pipelines through extensive, highly flexible integrations with a wide range of software tools.

1. [Self-hosted AI Starter Kit](https://docs.n8n.io/hosting/starter-kits/ai-starter-kit/).
2. Usecase 1 - [Chat with a database using AI](https://n8n.io/workflows/2090-chat-with-a-database-using-ai/).
3. Usecase 2 - [Automated competitor pricing monitor with Bright Data MCP & OpenAI](https://n8n.io/workflows/5948-automated-competitor-pricing-monitor-with-bright-data-mcp-and-openai/)
4. Usecase 3 - [Generate funny AI videos with Sora 2 and auto-publish to TikTok](https://n8n.io/workflows/10212-generate-funny-ai-videos-with-sora-2-and-auto-publish-to-tiktok/)

### [Google Opal](https://opal.google/)
Google Opal is a no-code agentic AI platform for creating mini-AI apps. It connects AI models (like Gemini) with tools and prompts to automate tasks and create content without writing code. Users create visual workflows with steps like user input, generative AI, and outputs (which can go to Docs/Sheets), then publish them as shareable web apps for personal or collaborative use.

1. Tutorial 1 - [A beginner's guide to to Google opal](https://www.datacamp.com/tutorial/google-opal-tutorial)
2. Tutorial 2 - [Official Guide from Google Labs](https://developers.google.com/opal/overview)

## How to download Jupter Notebook File from this Github Repo
Click this [instruction](https://github.com/YuxiaoLuo/Intro_Python/blob/main/How_to_download_JupyterNotebook.md).

## Markdown format
This README page is created with [Markdown](https://www.markdownguide.org/getting-started/) format, which is easy to learn [here](https://markdownlivepreview.com/). 
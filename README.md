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

## How to download Jupter Notebook File from this Github Repo
Click this [instruction](https://github.com/YuxiaoLuo/Intro_Python/blob/main/How_to_download_JupyterNotebook.md).

## Markdown format
This README page is created with [Markdown](https://www.markdownguide.org/getting-started/) format, which is easy to learn [here](https://markdownlivepreview.com/). 
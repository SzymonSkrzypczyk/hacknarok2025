from os import environ
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.agents import Tool
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = environ["OPENAI_API_KEY"]
PROMPT = PromptTemplate.from_template("""
You are an AI assistant that classifies and fact-checks social media posts.

You will receive:
- A **global list of expected categories** that apply to all posts.
- A list of **post contents** (e.g., tweets, articles, or messages).

Your task for **each post** is to:
1. Analyze the post content to determine if it fits into any of the expected categories.
2. Evaluate whether the content is **truthful** or **false**.
3. Return the following for each post:
   - `"truthy"`: `true` if the post is truthful with at least 80% confidence, otherwise `false`.
   - `"confidentiality_score"`: your confidence in the post’s factual accuracy, as an integer from 0 to 100.

### Expected Categories (shared for all posts)
{expected_categories}

### Posts to Analyze
Each item is a JSON object like:
{{
  "content": "<text of the post>"
}}

### Input
{items}

### Output Format
Return a **strict JSON array**, one object per post, like this:

[
  {{
    "truthy": true,
    "confidentiality_score": 95
  }},
  {{
    "truthy": false,
    "confidentiality_score": 40
  }}
]

⚠️ Do not include trailing commas in any JSON objects.
⚠️ Return only valid JSON. Do not include any commentary, markdown, or explanation.
""")


openai_model = OpenAI(
    openai_api_key=OPENAI_API_KEY,
)

ddg_search = DuckDuckGoSearchRun()
tools = [
   Tool(
       name="DuckDuckGo Search",
       func=ddg_search.run,
       description="Useful to browse information from the Internet.",
   )
]

chain = PROMPT | openai_model | JsonOutputParser()

chain.bind(tools=tools)

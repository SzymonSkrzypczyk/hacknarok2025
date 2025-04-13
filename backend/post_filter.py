from os import environ
from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]
PROMPT = PromptTemplate.from_template("""
You are a content classification assistant.

Your task is to analyze a list of blog posts. For each post:
1. Examine its content.
2. From the global list of expected categories, identify which ones apply to the post.
3. Return:
   - `"confidentiality_score"`: the percentage of categories from the expected list that apply to the post content (rounded to the nearest whole number).
   - `"truthy"`: `true` if **at least one** expected category applies to the content, otherwise `false`.

### Expected Categories
{expected_categories}

### Posts to Analyze
Each post has the following format:
{{
  "content": "<post content>"
}}

### Input
{items}

### Output
Return a **JSON array** of objects (one per post), in the format:

[
  {{
    "confidentiality_score": <int>,   // 0–100
    "truthy": <bool>                  // true if at least one expected category applies
  }},
  ...
]

⚠️ Only return valid JSON. Do not include explanations, markdown, or any extra text.
⚠️ Do not use trailing commas in the JSON.
""")
openai_model = OpenAI(
    openai_api_key=OPENAI_API_KEY,
)

chain = PROMPT | openai_model | JsonOutputParser()


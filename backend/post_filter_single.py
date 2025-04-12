from os import environ
from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]
PROMPT = PromptTemplate.from_template("""
You are a content classification assistant.

Your task is to analyze the content of a blog post or article and identify which categories it fits into from a general knowledge perspective.

Then compare your identified categories with the **provided list of expected categories**, and return:
1. The **percentage** of how many expected categories are actually matched (rounded to the nearest whole number).
2. A **boolean** indicating whether the match is 70% or higher.

Only consider categories from the expected list when evaluating the match.

Expected categories:
{categories_applied}

Post content:
{content}

| Output Format |
Return **only** a valid JSON object and nothing else — no explanations, no markdown, no extra formatting.

Example:
{{
  "match_percent": 80,
  "is_high_match": true
}}
""")
openai_model = OpenAI(
    openai_api_key=OPENAI_API_KEY,
)

chain = PROMPT | openai_model | JsonOutputParser()

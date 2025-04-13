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

if __name__ == "__main__":
    # Example usage
    categories_applied = ["Technology", "Health", "Finance"]
    contents = [
        "The latest advancements in AI technology are remarkable.",
        "Healthy eating habits can significantly improve your well-being.",
        "The stock market is experiencing unprecedented volatility."
    ]

    result = chain.invoke({"categories_applied": categories_applied, "contents": contents})

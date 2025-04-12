from os import environ
from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]
PROMPT = PromptTemplate.from_template("""
You are a content classification assistant.

Your task is to analyze a list of blog posts or articles. For each post, you will:
1. Identify which categories it fits into from a general knowledge perspective.
2. Compare the identified categories with the **expected categories provided for that specific post**.
3. Return:
   - The **percentage** of expected categories that match (rounded to the nearest whole number).
   - A **boolean** indicating whether the match is 70% or higher.

Only consider categories from the expected list when evaluating each post.

The input is a list of post objects, each structured like this:
{{
  "content": "<post content>",
  "categories_applied": ["Category1", "Category2", ...]
}}

Input list:
{items}

| Output Format |
Return only a valid **JSON array of objects**, one per post. Each object must follow this structure:

[
  {{
    "match_percent": 80,
    "is_high_match": true
  }},
  ...
]
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
    print(result)

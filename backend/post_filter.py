from os import environ
from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]
PROMPT = PromptTemplate.from_template("""
You are a content classification assistant.

Your task is to analyze the content of a blog post or article and select the most relevant categories **only from the list provided** that best describe the main topics discussed.

Only return categories that are clearly relevant to the post. Use **only** the categories from the list. Return your answer as a **valid JSON array of double-quoted strings** and nothing else.

Allowed categories:
{categories_applied}

Post content:
{content}

| Output Format |
Valid JSON array of strings. Example:
["Technology", "AI"]
""")
openai_model = OpenAI(
    openai_api_key=OPENAI_API_KEY,
)

chain = PROMPT | openai_model | JsonOutputParser()

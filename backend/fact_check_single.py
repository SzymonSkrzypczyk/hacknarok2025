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
You are an AI that performs fact-checking on a tweet. Given the content of a tweet, evaluate whether the information is **truthful** or **false** based on your analysis.

- **Confidentiality Score**: Assess the confidence in your fact-checking analysis and provide a score between **0 and 100**. 
  - A score closer to **100** indicates high confidence that the content is factually accurate.
  - A score closer to **0** indicates low confidence in the content's accuracy.

- If the content is truthful (with at least 80% confidence), return `true` for **truthy**.
- If the content is false or misleading, return `false` for **truthy**.

Return the result in strict JSON format with the following structure:
{{
  "truthy": true,  # or false based on the evaluation
  "confidentiality_score": 85  # A number between 0 and 100 indicating confidence level
}}

Tweet content:
{content}
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

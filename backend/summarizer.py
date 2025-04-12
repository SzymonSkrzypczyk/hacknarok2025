from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from assets.prompts import PROMPT_SUMMARIZE_BY_TAG

load_dotenv()

def _get_chain():
    llm = OpenAI()
    prompt = PromptTemplate.from_template(PROMPT_SUMMARIZE_BY_TAG)

    return prompt | llm

chain = _get_chain()

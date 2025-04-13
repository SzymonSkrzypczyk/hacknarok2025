import os
import langchain
from langchain_openai import OpenAI
import langchain_community
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from time import perf_counter
from dotenv import load_dotenv
from assets.prompts import PROMPT_SUMMARIZE_BY_TAG, PROMPT_GET_TAGS

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from assets.db.models import User, Post, Tag

load_dotenv()

def _get_chain():
    llm = OpenAI()
    prompt = PromptTemplate.from_template(PROMPT_SUMMARIZE_BY_TAG)

    return prompt | llm

chain = _get_chain()



load_dotenv()

OPENAI_API = os.getenv("OPENAI_API_KEY")

TEXT_SAMPLE = """Now, there is no doubt that one of the most important aspects of any Pixel phone is its camera.
And there might be good news for all camera lovers. Rumours have suggested that the Pixel 9 could come with a telephoto lens,
improving its photography capabilities even further. Google will likely continue to focus on using AI to enhance its camera performance,
in order to make sure that Pixel phones remain top contenders in the world of mobile photography."""



def get_chain(db_uri: str, user_name: str):
    engine = create_engine(db_uri)
    session = sessionmaker(bind=engine)()

    user = session.query(User).filter(User.name == user_name).first()
    if not user:
        raise ValueError(f"User with name '{user_name}' not found.")
    user_id = user.id
    current_tags = session.query(Tag).filter(Tag.user_id == user_id).all()
    print(list(map(lambda x: x.tag, current_tags)))
    prompt = PromptTemplate.from_template(PROMPT_GET_TAGS)
    llm = OpenAI()
    chain = prompt | llm

    return chain, current_tags


if __name__ == "__main__":
    start = perf_counter()
    # response = invoke_summarizer(TEXT_SAMPLE)
    chain, tags = get_chain("sqlite:///assets/db/example.db", "Milon")
    res = chain.invoke(
        {
            "content": TEXT_SAMPLE,
            "tags": tags 
        }
    )
    print(res)
    print(perf_counter() - start)

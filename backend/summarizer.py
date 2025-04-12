import os
import langchain
from langchain_openai import OpenAI
import langchain_community
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from time import perf_counter
from dotenv import load_dotenv
from assets.prompts import PROMPT_SUMMARIZER, PROMPT_GET_TAGS, PROMPT_SUMMARIZE_BY_TAG

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from assets.db.models import User, Post, Tag, PostTag
import datetime

load_dotenv()

OPENAI_API = os.getenv("OPENAI_API_KEY")

TEXT_SAMPLE = """Now, there is no doubt that one of the most important aspects of any Pixel phone is its camera.
And there might be good news for all camera lovers. Rumours have suggested that the Pixel 9 could come with a telephoto lens,
improving its photography capabilities even further. Google will likely continue to focus on using AI to enhance its camera performance,
in order to make sure that Pixel phones remain top contenders in the world of mobile photography."""



def _get_chain():
    llm = OpenAI()
    prompt = PromptTemplate.from_template(PROMPT_SUMMARIZE_BY_TAG)

    return prompt | llm


def get_posts_by_tag_for_user(session, user_name) -> dict:
    """
    Fetches all the posts for every tag (for the specified user).
    """
    user = session.query(User).filter(User.name == user_name).first()
    if not user:
        raise ValueError(f"User with name '{user_name}' not found.")
    
    query = (
        session.query(Tag.tag, Post.content)
        .join(PostTag, Tag.id == PostTag.tag_id)
        .join(Post, Post.id == PostTag.post_id)
        .filter(Tag.user_id == user.id)
        .filter(Tag.last_access >= datetime.datetime.now() - datetime.timedelta(hours=12))
        .order_by(Tag.tag)
    )

    posts_per_tag = {}
    for tag_name, content in query:
        if tag_name not in posts_per_tag:
            posts_per_tag[tag_name] = []
        posts_per_tag[tag_name].append(content)

    return posts_per_tag


def get_summary_per_tags(db_uri: str, user_name: str) -> str:
    """
    Creates the summaries for every distinct tag (for the current user) and current session.
    """
    engine = create_engine(db_uri)
    session = sessionmaker(bind=engine)()

    posts_per_tag = get_posts_by_tag_for_user(session, user_name)

    chain = _get_chain()

    response = chain.invoke(
        {
            "payload": str(posts_per_tag)
        }
    )

    return response


if __name__ == "__main__":
    start = perf_counter()
    response = get_summary_per_tags("sqlite:///example.db", "Milon")
    print(response)
    print(perf_counter() - start)
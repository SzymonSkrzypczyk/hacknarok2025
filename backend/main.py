from os import environ
from typing import List, Union, Optional
from datetime import date
from dotenv import load_dotenv
from fastapi import FastAPI, Response
from pydantic import BaseModel

load_dotenv()

OPENAI_TOKEN = environ["OPENAI_TOKEN"]
app = FastAPI()


class Post(BaseModel):
    """
    Incoming Post model

    :param author: Author of the post
    :param date: Date of the post
    :param content: Content of the post
    :param likes: Number of likes
    """
    author: str
    date: Union[str, date]
    content: str
    likes: int
    reposts: int


class PostResponse(BaseModel):
    """
    Outgoing Post model

    """
    category: List[str]
    summary: Optional[str] = None


@app.get("/post-filter", response_model=PostResponse)
async def filter_post(post_data: Post) -> PostResponse:
    """
    Return a list of hashtags based on a content

    :return:
    """
    ...


@app.get("/posts-summary")
async def get_posts_summary():
    """
    Summarize a batch of posts

    :return:
    """
    ...


@app.get("/health")
async def health_check():
    """
    Health check endpoint

    :return:
    """
    return Response(status_code=200, content="I'm still standing")


if __name__ == "__main__":
    from uvicorn import run
    run(app, host="0.0.0.0", port=8888)

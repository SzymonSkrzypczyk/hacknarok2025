from os import environ
from typing import List, Union, Optional
from datetime import date
from dotenv import load_dotenv
from fastapi import FastAPI, Response
from pydantic import BaseModel

from post_filter import chain as post_filter_chain

load_dotenv()

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
    categories_applied: List[str] = []


class PostResponse(BaseModel):
    """
    Outgoing Post model

    """
    category: List[str]
    summary: Optional[str] = None


@app.post("/post-filter", response_model=PostResponse)
async def filter_post(post_data: Post) -> PostResponse:
    """
    Return a list of hashtags based on a content

    :return:
    """
    content = await post_filter_chain.ainvoke({
        "categories_applied": post_data.categories_applied,
        "content": post_data.content
    })

    return PostResponse(
        category=content
    )


@app.post("/posts-summary")
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

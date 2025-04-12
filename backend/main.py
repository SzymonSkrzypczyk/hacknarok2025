from typing import List, Union, Optional
from datetime import date
from dotenv import load_dotenv
from fastapi import FastAPI, Response, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel

from post_filter import chain as post_filter_chain
from fast_check import chain as fact_check_chain

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
    author: Optional[str] = None
    date: Optional[Union[str, date]] = None
    content: str
    likes: Optional[int] = 0
    reposts: Optional[int] = 0
    comments: Optional[int] = 0
    link: Optional[str] = None
    categories_applied: List[str] = []


class PostFilterResponse(BaseModel):
    """
    Outgoing Post model

    """
    match_percent: int
    is_high_match: bool
    author: Optional[str] = None
    date: Optional[Union[str, date]] = None
    link: Optional[str] = None
    category: Optional[List[str]] = []
    reposts: Optional[int] = 0
    likes: Optional[int] = 0


class PostFactCheckResponse(BaseModel):
    """
    Outgoing Post model

    """
    confidentiality_score: int
    truthy: bool
    author: Optional[str] = None
    date: Optional[Union[str, date]] = None
    link: Optional[str] = None
    category: Optional[List[str]] = []
    reposts: Optional[int] = 0
    likes: Optional[int] = 0


@app.post("/post-filter", response_model=PostFilterResponse)
async def filter_post(post_data: Post) -> PostFilterResponse:
    """
    Return a list of hashtags based on a content

    :return:
    """
    content = await post_filter_chain.ainvoke({
        "categories_applied": post_data.categories_applied,
        "content": post_data.content
    })

    if not content:
        raise HTTPException(500, "Error in the model response - empty response")

    if "match_percent" not in content or "is_high_match" not in content:
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return PostFilterResponse(
        match_percent=content["match_percent"],
        is_high_match=content["is_high_match"]
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.post("/posts-summary")
async def get_posts_summary():
    """
    Summarize a batch of posts

    :return:
    """
    ...


@app.post("/post-factcheck")
async def get_posts_factcheck(post_data: Post):
    """
    Fact-check a post

    :return:
    """
    content = await fact_check_chain.ainvoke({
        "content": post_data.content
    })

    if not content:
        raise HTTPException(500, "Error in the model response - empty response")

    if "truthy" not in content or "confidentiality_score" not in content:
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return PostFactCheckResponse(
        confidentiality_score=content["confidentiality_score"],
        truthy=content["truthy"]
    )


@app.get("/health")
async def health_check():
    """
    Health check endpoint

    :return:
    """
    return Response(status_code=200, content="I'm still standing")


@app.get("/")
async def root():
    return RedirectResponse(url="/health")


if __name__ == "__main__":
    from uvicorn import run
    run(app, port=8888)

from typing import List, Union, Optional
from datetime import date
from dotenv import load_dotenv
from fastapi import FastAPI, Response, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, RootModel

from post_filter_single import chain as post_filter_single_chain
from post_filter_multiple import chain as post_filter_multiple_chain
from fact_check_single import chain as fact_check_single_chain
from fact_check_multiple import chain as fact_check_multiple_chain

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


class PostList(RootModel[List[Post]]):
    """Incoming list of posts."""
    pass


class PostFilterListResponse(RootModel[List[PostFilterResponse]]):
    """Outgoing list of filtered responses."""
    pass


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


class PostFactCheckListResponse(RootModel[List[PostFactCheckResponse]]):
    """Outgoing list of filtered responses."""
    pass


@app.post("/post-filter-single", response_model=PostFilterResponse)
async def filter_post_single(post_data: Post) -> PostFilterResponse:
    """
    Return a list of hashtags based on a content

    :return:
    """
    content = await post_filter_single_chain.ainvoke({
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


@app.post("/post-filter-multiple", response_model=PostFilterListResponse)
async def filter_post_multiple(post_data: PostList) -> PostFilterListResponse:
    """
    Return a list of hashtags based on a content

    :return:
    """
    content = await post_filter_multiple_chain.ainvoke({
        "items": post_data
    })

    if not content:
        raise HTTPException(500, "Error in the model response - empty response")

    if "match_percent" not in content[0] or "is_high_match" not in content[0]:
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return content


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


@app.post("/post-factcheck-single", response_model=PostFactCheckResponse)
async def get_posts_factcheck_single(post_data: Post) -> PostFactCheckResponse:
    """
    Fact-check a post

    :return:
    """
    content = await fact_check_single_chain.ainvoke({
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


@app.post("/post-factcheck-multiple", response_model=PostFactCheckListResponse)
async def get_posts_factcheck_multiple(post_data: PostList) -> PostFactCheckListResponse:
    """
    Fact-check a post

    :return:
    """
    content = await fact_check_multiple_chain.ainvoke({
        "items": post_data
    })

    if not content:
        raise HTTPException(500, "Error in the model response - empty response")

    if "truthy" not in content[0] or "confidentiality_score" not in content[0]:
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return PostFactCheckListResponse(
        [PostFactCheckResponse(
            confidentiality_score=post["confidentiality_score"],
            truthy=post["truthy"]
        )
            for post in content
        ]
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

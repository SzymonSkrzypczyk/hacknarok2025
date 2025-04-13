from typing import List, Union, Optional
from datetime import date
from dotenv import load_dotenv

from fastapi import FastAPI, Response, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from post_filter import chain as post_filter_chain
from fast_check import chain as fact_check_chain
from summarizer import chain as summarize_chain
from tagger import chain as tag_chain
from logger import logger

from utils import *
import json

load_dotenv()
app = FastAPI()


class Stats(BaseModel):
    likesCount: int
    viewsCount: int
    commentsCount: int


class ScrappedXPost(BaseModel):
    app: str
    accountName: str
    date: str
    content: str
    link: str
    avatarURL: str

    stats: Stats


class APIRequest(BaseModel):
    expectedContent: List[str]
    scrappedDataBatch: List[ScrappedXPost]


class ResponseModel(BaseModel):
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


class ResponseModelList(RootModel[List[ResponseModel]]):
    """Outgoing list of filtered responses."""
    pass


@app.post("/post-filter-multiple", response_model=ResponseModelList)
async def filter_post_multiple(post_data: APIRequest) -> ResponseModelList:
    """
    Return a list of hashtags based on a content

    :return:
    """
    logger.info("Filtering multiple posts")
    content = await post_filter_chain.ainvoke({
        "items": [post.content for post in post_data.scrappedDataBatch],
        "expected_categories": post_data.expectedContent
    })

    if not content:
        logger.error("Empty response from model - filtering multiple")
        raise HTTPException(500, "Error in the model response - empty response")

    if "confidentiality_score" not in content[0] or "truthy" not in content[0]:
        logger.error("Invalid response keys: %s - filtering multiple", content[0].keys())
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return content


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    logger.error("Validation error: %s", exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.post("/posts-summary")
async def get_posts_summary(user_session: UserSession) -> SessionSummaryResponse:
    """
    Get current summaries for the user session.

    :return:
    """
    engine = create_engine(DATABASE_URI)
    session = sessionmaker(bind=engine)()

    user = session.query(User).filter(User.name == user_session.user_name).first()

    results = session.query(Summary).filter(
            Summary.user_id == user.id \
        and Summary.date_created >= datetime.datetime.now() - datetime.timedelta(hours=24)).all()
    
    all_summaries = [{s.tag: {"short_summary": s.short_summary, "long_summary": s.long_summary}} for s in results]

    return SessionSummaryResponse(summaries=all_summaries)

@app.post("/trigger-processing")
async def get_posts_tag(user_session: UserSession):
    engine = create_engine(DATABASE_URI)
    session = sessionmaker(bind=engine)()

    print("PROCESSING NEW POSTS")
    process_new_posts(session, user_session.user_name)
    print("PROCESSING SUMMARIES")
    process_summaries(session, user_session.user_name)

    return 200


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


@app.post("/post-factcheck-multiple", response_model=ResponseModelList)
async def get_posts_factcheck_multiple(post_data: APIRequest) -> ResponseModelList:
    """
    Fact-check a post

    :return:
    """
    logger.info("Fact-checking multiple posts")
    content = await fact_check_chain.ainvoke({
        "items": [post.content for post in post_data.scrappedDataBatch],
        "expected_categories": post_data.expectedContent
    })

    if not content:
        logger.error("Empty response from model - fact-checking multiple")
        raise HTTPException(500, "Error in the model response - empty response")

    if "truthy" not in content[0] or "confidentiality_score" not in content[0]:
        logger.error("Invalid response keys: %s - fact-checking multiple", content[0].keys())
        raise HTTPException(500, "Error in the model response - invalid keys in the response")

    return ResponseModelList(
        [ResponseModel(
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
    run(app, port=8888, log_config=log_config)

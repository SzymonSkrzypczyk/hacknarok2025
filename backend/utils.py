from assets.db.models import User, Tag, PostTag, Post, Summary
import datetime
from typing import List
import json

from tagger import chain as chain_tagger
from summarizer import chain as chain_summarizer

from utils import *

DATABASE_URI="sqlite:///hacknarok2025/backend/assets/db/example.db"



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
    # kocham pati g

    posts_per_tag = {}
    for tag_name, content in query:
        if tag_name not in posts_per_tag:
            posts_per_tag[tag_name] = []
        posts_per_tag[tag_name].append(content)

    return posts_per_tag


def get_summaries_for_user(session, user_name) -> dict:
    user = session.query(User).filter(User.name == user_name)
    if not user:
        raise ValueError(f"User with name '{user_name}' not found.")

    # get the posts for the user that don't have tags specified yet
    posts_to_process = session.query(Post).filter(Post.tags == None).all()
    posts_content, posts_ids = zip(*list(map(lambda p: (p.content, p.id), posts_to_process)))
    print(posts_content, posts_ids)

    if not posts_to_process:
        return {}

    # for those posts get the tags
    existing_tags = session.query(Tag).all()
    existing_tags_names = list(map(lambda x: x.tag, existing_tags))
    print(existing_tags_names)

    response_tags = chain_tagger.invoke({
        "posts": posts_content,
        "tags": existing_tags_names
    })

    response_tags_dict = json_to_dict(response_tags)

    for post_id, post_n in zip(posts_ids, response_tags_dict.keys()):
        post_tags = response_tags_dict[post_n]["matched_tags"]
        print(post_id, post_tags)

        for tag in post_tags:
            if tag not in existing_tags_names:
                new_tag = Tag(tag=tag, user_id=user.id, last_access=datetime.datetime.now())
                session.add(new_tag)
    session.commit()
    # add the new tags to the tags table


    # insert the tags and posts relation to the PostTags
    

    # call the get_post_by_tag_user function

    # invoke the model for the result

    # format the results

    # insert the results to the summaries table


def json_to_dict(data: str) -> dict:
    try:
        result = json.loads(data)
    except Exception as e:
        print(e)
    return result



if __name__ == "__main__":
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine

    engine = create_engine("sqlite:///assets/db/example.db")
    session = sessionmaker(bind=engine)()
    res = get_summaries_for_user(session=session, user_name="Milon")
    print(res)
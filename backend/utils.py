from assets.db.models import User, Tag, PostTag, Post, Summary
from sqlalchemy.exc import IntegrityError
import datetime
from typing import List
import json

from tagger import chain as chain_tagger
from summarizer import chain as chain_summarizer

from utils import *
import re

DATABASE_URI="sqlite:///assets/db/example.db"



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
        .filter(Tag.last_access >= datetime.datetime.now() - datetime.timedelta(hours=24))
        .order_by(Tag.tag)
    )
    # kocham pati g

    posts_per_tag = {}
    for tag_name, content in query:
        if tag_name not in posts_per_tag:
            posts_per_tag[tag_name] = []
        posts_per_tag[tag_name].append(content)

    print("POSTPERTAG: ", posts_per_tag)
    return posts_per_tag

def process_new_posts(session, user_name: str) -> None:
    """
    Assigns the tags to posts that don't have ones.

    """
    user = session.query(User).filter(User.name == user_name).first()
    if not user:
        raise ValueError(f"User with name '{user_name}' not found.")
    
    # get the posts for the user that don't have tags specified yet
    posts_to_process = session.query(Post).filter(Post.tags == None).all()
    if not posts_to_process:
        print("NO POSTS TO PROCESS")
        return {}
    
    posts_content, posts_ids = zip(*list(map(lambda p: (p.content, p.id), posts_to_process)))

    # for those posts get the tags
    existing_tags = session.query(Tag).all()
    existing_tags_names = list(map(lambda x: x.tag, existing_tags))
    print("EXISTING TAGS", existing_tags_names)

    response_tags = chain_tagger.invoke({
        "posts": posts_content,
        "tags": existing_tags_names
    })

    print("RESPONSE TAGS TEXT", response_tags)
    response_tags_test = re.search(r'\{.*\}', response_tags, re.DOTALL).group(0)
    response_tags_dict = json_to_dict(response_tags_test)
    print("TAGS DICT", response_tags_dict)

    for post_id, post_n in zip(posts_ids, response_tags_dict.keys()):
        post_tags = response_tags_dict[post_n]["matched_tags"]
        print(post_id, post_tags)
        # add the new tags to the tags table
        for tag in post_tags:
            if tag not in existing_tags_names: # here i would need to add a feature of
                try:
                    new_tag = Tag(tag=tag, user_id=user.id, last_access=datetime.datetime.now())
                    session.add(new_tag)
                    session.flush()
                except IntegrityError:
                    session.rollback()
                    continue
        session.commit()

        # insert the tags and posts relation to the PostTags
        tags = session.query(Tag).filter(Tag.user_id == user.id and Tag.tag in post_tags).all()
        for tag in tags:
            post_tag = PostTag(user_id=user.id, post_id=post_id, tag_id=tag.id)
            session.add(post_tag)
        session.commit()


def process_summaries(session, user_name: str) -> None:
    """
    KOMBAJN AFRYKANSKI!!!
    """
    user = session.query(User).filter(User.name == user_name).first()
    if not user:
        raise ValueError(f"User with name '{user_name}' not found.")

    # call the get_post_by_tag_user function
    payload = get_posts_by_tag_for_user(session, user_name)

    print("NIE NO KURWA", payload)
    for key, val in payload.items():
        # invoke the model for the result
        try:
            response = chain_summarizer.invoke({
                "payload": val 
            })

            print("RESPONSE SUMMARY TEXT", response)
            
            response_dict = json_to_dict(response)
            print("RESPONSEEE\n\n", response_dict)
            # format the results
            # insert the results to the summaries table
            summary = Summary(user_id=user.id, tag=key, short_summary=response_dict["short_summary"], long_summary=response_dict["brief_summary"])    
            session.add(summary)
            session.commit()
        except:
            print("CONTINUING...(someerror)")
            continue


def json_to_dict(data: str) -> dict:
    try:
        return json.loads(data)
    except Exception as e:
        return {}
    



if __name__ == "__main__":
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine


    engine = create_engine("sqlite:///assets/db/example.db")
    session = sessionmaker(bind=engine)()
    process_new_posts(session, user_name="Milon")
    get_summaries_for_user(session=session, user_name="Milon")
    
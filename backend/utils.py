from assets.db.models import User, Tag, PostTag, Post, Summary
import datetime
from typing import List

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
    
    summaries = session.query(Summary).filter(Summary.user_id == user.id)

    def _convert_to_json(summaries: List)

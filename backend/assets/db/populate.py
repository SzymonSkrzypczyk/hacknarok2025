from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from models import Post, User

def populate() -> None:
    engine = create_engine("sqlite:///example.db")
    Session = sessionmaker(bind=engine)
    session = Session()

    users = [
        User(
            name="Milon",
            age=21
        ),
        User(
            name="kitka",
            age=22
        )
    ]
    # Sample data to populate the Post table
    posts = [
        Post(
            app_type="Blog",
            user_id=1,
            url="https://techblog.com/pixel9-camera-leak",
            date=datetime(2025, 4, 11, 16, 20),
            likes=400,
            views=1800,
            author="Tech Guru",
            content="Now, there is no doubt that one of the most important aspects of any Pixel phone is its camera. Rumors suggest the Pixel 9 could feature a telephoto lens, enhancing its photography capabilities. AI-powered performance improvements are expected to keep Pixel phones at the top of mobile photography."
        ),
        Post(
            app_type="Twitter",
            user_id=1,
            url="https://twitter.com/techinsider/status/2233445566",
            date=datetime(2025, 4, 12, 8, 45),
            likes=500,
            views=2000,
            author="Tech Insider",
            content="Breaking: The Pixel 9 might revolutionize mobile photography with its rumored AI-enhanced telephoto lens. Stay tuned for more updates! #Pixel9 #MobilePhotography"
        ),
        Post(
            app_type="Facebook",
            user_id=1,
            url="https://facebook.com/photographyworld/posts/3344556677",
            date=datetime(2025, 4, 12, 12, 30),
            likes=350,
            views=1400,
            author="Photography World",
            content="Exciting news for photography enthusiasts! The Pixel 9 is rumored to feature a telephoto lens and advanced AI capabilities. Could this be the best camera phone yet? 📸"
        ),
        Post(
            app_type="Instagram",
            user_id=2,
            url="https://instagram.com/pixelupdates/post/4455667788",
            date=datetime(2025, 4, 12, 18, 15),
            likes=600,
            views=2500,
            author="Pixel Updates",
            content="Pixel 9 leaks are here! A telephoto lens and AI-powered enhancements could make this the ultimate phone for photographers. What do you think? #Pixel9 #Photography"
        )
    ]

    # tags = [
    #     Tag(
    #         user_id=1,
    #         last_access=datetime(2025, 4, 12, 12, 0, 0),
    #         tag="tech"
    #     ),
    #     Tag(
    #         user_id=1,
    #         last_access=datetime(2025, 4, 12, 12, 0, 0),
    #         tag="smartphones"
    #     )
    # ]

    # post_tags = [
    #     PostTag(
    #         user_id=1,
    #         post_id=1,
    #         tag_id=1
    #     ),
    #     PostTag(
    #         user_id=1,
    #         post_id=1,
    #         tag_id=2
    #     ),
    #     PostTag(
    #         user_id=1,
    #         post_id=2,
    #         tag_id=1
    #     ),
    #     PostTag(
    #         user_id=1,
    #         post_id=2,
    #         tag_id=2
    #     ),
    #     PostTag(
    #         user_id=1,
    #         post_id=3,
    #         tag_id=1
    #     ),
    #     PostTag(
    #         user_id=1,
    #         post_id=3,
    #         tag_id=2
    #     )
    # ]

    session.add_all(users)
    session.add_all(posts)
    # session.add_all(tags)
    # session.add_all(post_tags)
    session.commit()

    print("Database populated with sample posts.")


if __name__ == "__main__":
    populate()
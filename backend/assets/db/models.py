from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, ForeignKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DATABASE_URL = "sqlite:///example.db"
engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    
    tags = relationship("Tag", back_populates="user")
    posts = relationship("Post", back_populates="user")

class Post(Base):
    __tablename__ = "posts"
        
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    app_type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    likes = Column(Integer, nullable=False)
    views = Column(Integer, nullable=False)
    author = Column(String, nullable=False)
    content = Column(String, nullable=False)
    
    user = relationship("User", back_populates="posts")
    tags = relationship("Tag", secondary="post_tags", back_populates="posts")

class Tag(Base):
    __tablename__ = "tags"
        
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    last_access = Column(DateTime, nullable=False)
    tag = Column(String, nullable=False)
    
    user = relationship("User", back_populates="tags")
    posts = relationship("Post", secondary="post_tags", back_populates="tags")

class PostTag(Base):
    __tablename__ = "post_tags"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    
    __table_args__ = (
        ForeignKeyConstraint(['post_id'], ['posts.id']),
        ForeignKeyConstraint(['tag_id'], ['tags.id']),
    )


if __name__ == "__main__":
    Base.metadata.create_all(engine)



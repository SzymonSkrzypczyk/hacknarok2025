from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///example.db"
engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)

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


class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tag = Column(String, nullable=False)


class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    short_summary = Column(String, nullable=False)
    long_summary = Column(String, nullable=False)


class SummaryTags(Base):
    __tablename__ = "summarytags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    summary_id = Column(Integer, nullable=False)
    tag_id = Column(Integer, nullable=False)



if __name__ == "__main__":
    Base.metadata.create_all(engine)



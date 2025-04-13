-- Create the 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INTEGER NOT NULL
);

-- Insert example users
INSERT INTO users (name, age) VALUES
('Alice', 30),
('Bob', 25),
('Charlie', 28);

-- Create the 'posts' table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    app_type VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL,
    likes INTEGER NOT NULL,
    views INTEGER NOT NULL,
    author VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users (id)
);

-- Insert example posts
INSERT INTO posts (user_id, app_type, url, date, likes, views, author, content) VALUES
(1, 'Blog', 'https://example.com/post1', '2024-04-01 10:00:00', 120, 1000, 'Alice', 'Exploring AI and ML today!'),
(2, 'Social Media', 'https://example.com/post2', '2024-04-05 15:30:00', 85, 700, 'Bob', 'My thoughts on the latest tech trends.');

-- Create the 'tags' table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    last_access TIMESTAMP NOT NULL,
    tag VARCHAR NOT NULL,
    CONSTRAINT uix_user_id_tag UNIQUE (user_id, tag),
    FOREIGN KEY(user_id) REFERENCES users (id),
    UNIQUE (tag)
);

-- Insert example tags
INSERT INTO tags (user_id, last_access, tag) VALUES
(1, '2024-04-01 10:00:00', 'AI'),
(2, '2024-04-05 15:30:00', 'Tech');

-- Create the 'post_tags' table
CREATE TABLE post_tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY(post_id) REFERENCES posts (id),
    FOREIGN KEY(tag_id) REFERENCES tags (id),
    FOREIGN KEY(user_id) REFERENCES users (id)
);

-- Insert example post_tags
INSERT INTO post_tags (user_id, post_id, tag_id) VALUES
(1, 1, 1),
(2, 2, 2);

-- Create the 'summaries' table
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tag VARCHAR NOT NULL,
    short_summary VARCHAR NOT NULL,
    long_summary VARCHAR NOT NULL,
    date_created TIMESTAMP NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users (id),
    FOREIGN KEY(tag) REFERENCES tags (tag)
);

-- Insert example summaries
INSERT INTO summaries (user_id, tag, short_summary, long_summary, date_created) VALUES
(1, 'AI', 'AI advancements', 'A detailed overview of the current advancements in Artificial Intelligence, covering key technologies and breakthroughs.', '2024-04-01 12:00:00'),
(2, 'Tech', 'Latest tech trends', 'An in-depth look at the latest trends in the tech industry, including AI, IoT, and 5G advancements.', '2024-04-05 16:00:00');

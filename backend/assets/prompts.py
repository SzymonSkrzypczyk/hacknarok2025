PROMPT_SUMMARIZER = """
You are an AI that reads social media posts and returns two things:
1. A brief, clear summary of the post's main message.
2. A list of all URLs or links mentioned in the post.

Please read the following post and respond ONLY in the following JSON format:

{{
  "summary": "<summary of the post>",
  "links": ["<link1>", "<link2>", "..."]
}}

Here is the post:
<<<
{content}
>>>    
"""


# PROMPT_GET_TAGS = """
# You are an AI that classifies social media posts by assigning relevant topic tags.
# Given the content of a post and a list of existing tags in the database, select the most relevant tag(s) from the list.
# If none of the existing tags are a good fit, create one or more new tags that best describe the post.

# Return the result in strict JSON format with the following structure:
# {{ "post": "<original post content>", "selected_tags": ["tag1", "tag2"], "new_tags": ["new_tag1", "new_tag2"] }}

# Post Content:
# {content}

# Existing Tags (if not empty):
# {tags}
# """

PROMPT_GET_TAGS = """
You are an AI that classifies social media posts by assigning relevant topic tags.
Given the content of a post and a list of existing tags in the database, select the most relevant tag(s) from the list.
If none of the existing tags are a good fit, create one or more new tags that best describe the post.

You must return a total of EXACTLY 3 distinct tags in the final output.

- The "selected_tags" field must contain ALL of the 3 final tags (whether they were selected from the existing tags or newly created).
- The "new_tags" field must contain ONLY the tags that were not in the existing tags list and were created by you.
- The tags in "new_tags" must also appear in "selected_tags".
- Do NOT repeat tags. All tags must be distinct.

Return the result in strict JSON format with the following structure:
{{
  "post": "<original post content>",
  "selected_tags": ["tag1", "tag2", "tag3"],
  "new_tags": ["new_tag1", "new_tag2"]
}}

Post Content:
{content}

Existing Tags (if not empty):
{tags}
"""


PROMPT_GET_TAGS = """
You are an AI that classifies social media posts by assigning relevant topic tags.
Given the content of a post and a list of existing tags in the database, select the best 3 relevant tag(s) from the existing tags or newly created tags.
- You should prefer to select tags from the existing list if they fit the post content. Only create new tags if the topic is truly out of scope of the existing tags and requires a unique tag.
- If the topic is similar to the existing tags, do not create a new tag; simply use the relevant existing tag(s).
- Your task is to select the **best 3 tags** based on relevance, and if needed, you can create new tags, but only when absolutely necessary. If new tags are created, they should fit the topic and should be used in the selected tags as well.

Return the result in strict JSON format with the following structure:
{{
  "post": "<original post content>",
  "selected_tags": ["tag1", "tag2", "tag3"],
  "new_tags": ["new_tag1", "new_tag2"]
}}

Post Content:
{content}

Existing Tags (if not empty):
{tags}

"""
# --- EXAMPLE ---:

# Post Content:
# "Just installed the new beta version of iOS and the battery life is incredible. Loving the new lock screen widgets too!"

# Existing Tags:
# ["tech", "smartphones"]

# Result:
# {{
#   "post": "Just installed the new beta version of iOS and the battery life is incredible. Loving the new lock screen widgets too!",
#   "selected_tags": ["tech", "smartphones", "ios"],
#   "new_tags": ["ios"]
# }}



# "Just installed the new beta version of iOS and the battery life is incredible. Loving the new lock screen widgets too!"
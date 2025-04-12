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

- Prefer to select tags from the existing list if they fit the post content. Only create new tags if the topic is truly out of scope of the existing tags and requires a unique tag.
- If new tags are created, **ensure that they are included in the `selected_tags`** list as part of the top 3 tags. If a new tag is created, it **must be included in the `selected_tags`** and **cannot be excluded**.
- Do not create new tags unnecessarily. Only create new tags if they are completely out of scope of the existing tags and are highly relevant to the post.
- If existing tags cover the content well, select relevant tags from that list. Ensure that the created new tags are included within the top 3 selected tags, so no newly created tags are left out.
- The newly created tag(s) must be included in both the `selected_tags` list and the `new_tags` list. If no new tags are created, the `new_tags` list should be empty.

Your task is to select the **best 3 tags** based on relevance. The 3 tags returned should include both existing and, if applicable, newly created tags, with the newly created tag being prioritized to be included if any are created. **Ensure that any new tag(s) are included in the `selected_tags`** list as part of the top 3 tags.

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

think step by step, by return only the final result
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
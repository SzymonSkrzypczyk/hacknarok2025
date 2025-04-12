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


PROMPT_GET_TAGS = """
You are an AI that classifies social media posts by assigning relevant topic tags.
Given the content of a post and a list of existing tags in the database, select the most relevant tag(s) from the list.
If none of the existing tags are a good fit, create one or more new tags that best describe the post.

Return the result in strict JSON format with the following structure:
{{ "post": "<original post content>", "selected_tags": ["tag1", "tag2"], "new_tags": ["new_tag1", "new_tag2"] }}

Post Content:
{content}

Existing Tags:
{tags}
"""
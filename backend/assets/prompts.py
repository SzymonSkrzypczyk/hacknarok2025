<<<<<<< HEAD
PROMPT_GET_TAGS = """
You are a tagging assistant that analyzes social media posts and classifies them using a predefined list of tags.

## INPUT:

You will receive:
- A list of social media posts (variable length, indexed from 1)
- A list of existing tags

## TASK:

1. For **each post**, determine which of the existing tags apply.
2. Only include new tags if they are:
   - Clearly and specifically relevant to the content
   - Not already captured by the existing tags
   - Unavoidable for proper classification

IF YOU WANT TO CREATE A TAG, FIRST CHECK IF THIS TAG DOESN'T EXIST IN EXISTING TAGS!!! DO NOT USE ABBREVIATIONS!
RETURN THE MINIMUM POSSIBLE NUMBER OF TAGS PER POST (MINIMUM 1, MAXIMUM 2) LET THEM BE AS CONCISE AS POSSIBLE!


Return a JSON object where each key is the index of the post, and the value is an object:
RETURN ONLY THE JSON IN PLAIN TEXT AND NOTHING ELSE so it's easily converted with json.loads()

example:
```json
{{
  "1": {{
    "matched_tags": ["tag1", "tag2", "tag3"]
  }},
  "2": {{
    "matched_tags": ["tag1", "tag4", "tag5"]
  }}
  ...
}}
```
POSTS:

{posts}

ALREADY_EXISTING_TAGS (if doesn't exist, generate tags that you find fitting to the posts!)

{tags}

"""

PROMPT_SUMMARIZE_BY_TAG = """
You are an AI assistant that generates a summary for a single social media tag and its associated posts.

You will receive a JSON object where:
- The key is a single tag (e.g., "tech" or "smartphones").
- The value is a list of social media post contents associated with that tag.

Your task: For the given tag, write:
1. A **short_summary**: a 1-sentence summary capturing the key idea from the full list of posts.
2. A **brief_summary**: a more detailed summary (2–4 sentences) that gives a broader understanding of the common topic discussed in the posts.

Instructions:
- You must take into account **every single post** in the list when generating the summaries.
- Do not ignore or generalize — base your summaries on actual content and recurring themes.
- Do not invent any facts or speculate beyond what's explicitly stated in the posts.
- Avoid repetition and overly generic phrases.
- Your output must strictly follow the structure provided below.
- If there are no posts specified, return an empty JSON object {{}}.

ALWAYS RETURN PLAIN TEXT THAT WILL BE EASILY PARSED BY json.loads() FUNCTION!
ALWAYS RETURN THE PROPER JSON, SO ALWAYS ENSURE IT'S WELL FORMATED!

Return the result in this exact JSON format:
{{
  "short_summary": "...",
  "brief_summary": "..."
}}

THE CONTENT:

{payload}
"""
=======
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
>>>>>>> main

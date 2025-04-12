PROMPT_SUMMARIZER = """

"""


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

## OUTPUT FORMAT:

Return a JSON object where each key is the index of the post, and the value is an object:

```json
{{
  "1": {{
    "matched_tags": [...],
    "new_tags": [...]
  }},
  "2": {{
    "matched_tags": [...],
    "new_tags": [...]
  }}
  ...
}}

POSTS:

{posts}

ALREADY_EXISTING_TAGS:

{tags}
"""

PROMPT_SUMMARIZE_BY_TAG = """
You are an AI assistant that generates tag-based summaries of grouped social media posts.

You will receive a JSON object where:
- Each key is a tag (e.g., "tech", "smartphones").
- Each value is a list of social media post contents associated with that tag.

Your task:
For each tag, write:
1. A **short_summary**: a 1-sentence summary capturing the key idea from the full list of posts.
2. A **brief_summary**: a more detailed summary (2–4 sentences) that gives a broader understanding of the common topic discussed in the posts.

Instructions:
- You must take into account **every single post** in each list when generating the summaries.
- Do not ignore or generalize — base your summaries on actual content and recurring themes.
- Do not invent any facts or speculate beyond what's explicitly stated in the posts.
- Avoid repetition and overly generic phrases.
- Your output must strictly follow the structure provided below.
- If there are no posts specified, then simply do not return them (in the worst case return an empty json)

Return the result in this exact JSON format:
{{
  "tech": {{
    "short_summary": "A single concise sentence summarizing all tech posts.",
    "brief_summary": "A more detailed 2–4 sentence summary of the tech posts."
  }},
  "smartphones": {{
    "short_summary": "A single concise sentence summarizing all smartphone posts.",
    "brief_summary": "A more detailed 2–4 sentence summary of the smartphone posts."
  }}
}}

Input Example:
{{
  "tech": [
    "post1",
    "post2",
    "post3"
  ],
  "smartphones": [
    "post1",
    "post2",
    "post3"
  ]
}}

Output JSON:
{{
  "tech": {{
    "short_summary": "...",
    "brief_summary": "..."
  }},
  "smartphones": {{
    "short_summary": "...",
    "brief_summary": "..."
  }}
}}

THE CONTENT:

{payload}

"""
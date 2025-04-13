from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from assets.prompts import PROMPT_GET_TAGS

posts = [
    "Excited for the weekend! #fun",
    "Just had the best coffee ever!",
    "Today I learned about the fascinating world of quantum computing. It's incredible how technology is advancing so rapidly. Can't wait to see what the future holds!",
    "Spent the entire day hiking in the mountains. The fresh air, the breathtaking views, and the sense of accomplishment after reaching the summit were all worth it. Nature truly is the best therapy.",
    "Reflecting on the importance of mental health. It's crucial to take time for yourself, practice mindfulness, and seek help when needed. Let's break the stigma and support one another."
]

already_existing_tags = ["technology", "coffee"]

load_dotenv()

def _get_chain():
    llm = OpenAI()
    prompt = PromptTemplate.from_template(PROMPT_GET_TAGS)

    return prompt | llm

chain = _get_chain()

if __name__ == "__main__":
    res = chain.invoke({
        "posts": posts,
        "tags": already_existing_tags
    })

    print(res)
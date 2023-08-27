from fastapi import FastAPI
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import openai
from fastapi.responses import StreamingResponse

class Envs(BaseSettings):
    # expects an environment variable called OPENAI_API_KEY
    openai_api_key: str

envs = Envs()

openai.api_key = envs.openai_api_key

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_streamed_ai_response(response):
    for chunk in response: 
        yield chunk['choices'][0]['delta'].get("content", "")

class Message(BaseModel):
    role: str
    content: str

@app.post("/message")
async def send_message(messages: List[Message]):
    # remember to have set an environment variable called OPENAI_API_KEY
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[message.dict() for message in messages],
        stream=True
    )

    return StreamingResponse(get_streamed_ai_response(response), media_type='text/event-stream')
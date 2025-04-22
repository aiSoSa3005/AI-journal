from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ollama import call_ollama

app = FastAPI()

# 🔐 CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Data model
class JournalEntry(BaseModel):
    text: str

@app.post("/journal")
async def ask_journal(entry: JournalEntry):
    prompt = f"""
You are a wise assistant. The user wrote this journal entry:

"{entry.text}"

Respond with a short reflection or helpful insight.
"""
    response = call_ollama(prompt)
    return {"ai_reply": response}

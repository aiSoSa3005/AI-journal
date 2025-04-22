import requests


def call_ollama(prompt: str, model="qwen2:7b"):
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": model,
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"]

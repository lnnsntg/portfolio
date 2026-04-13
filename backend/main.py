"""
AI Chatbot Backend - FastAPI + Ollama Cloud AI
Portfolio Chatbot - Usa Ollama Cloud API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="Portfolio Chatbot API")

# CORS - configurable per environment
# Local dev: http://localhost:5173 (Vite), http://localhost:3000
# Production: https://developer-ports.duckdns.org
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama Cloud configuration
OLLAMA_CLOUD_URL = "https://ollama.com/api/chat"
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", os.getenv("AI_API_KEY", ""))
MODEL = "gemma3:4b"  # Lightweight, fast, multilingual - free tier compatible

# System prompt for the portfolio assistant
SYSTEM_PROMPT = """INFORMACIÓN SOBRE LENIN:
- Desarrollador Full-Stack, +5 años de experiencia
- Frontend: React, Next.js, TypeScript, JavaScript
- Backend: Node.js, Express, Python, Django, FastAPI
- Bases de datos: PostgreSQL, MongoDB
- Cloud: AWS, Docker, CI/CD
- IA: LLMs, Ollama, automatizaciones
- Tarifa: $20 USD/hora o precio fijo negociable
- Email: lnnsntg@gmail.com | Disponible en Upwork

GUÍAS:
1. Responde directo y natural, SIN repeticiones ni introducciones genéricas.
2. Ve al grano — adapta tu respuesta a la pregunta específica.
3. Responde en inglés o en el mismo idioma del usuario.
4. Menciona info de Lenin SOLO cuando sea relevante.
5. Si preguntan por ti, di brevemente que eres el asistente del portafolio.
6. Cuando sea apropiado, sugiere contactar a Lenin.
7. Sé conciso: 2-4 oraciones salvo que pidan más detalle.
8. NO empieces con "¡Hola!" ni "Lenin es un desarrollador..." a menos que lo pregunten directamente.
9. No inventes — si no sabes, sugiere contactar a Lenin."""

# Modelos de mensaje
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

def chat_with_ollama_cloud(message: str, history: List[ChatMessage] = None) -> str:
    """Usa Ollama Cloud API para generar respuestas"""
    if not OLLAMA_API_KEY:
        print("Warning: OLLAMA_API_KEY not set, using fallback responses")
        return None

    try:
        # Build messages including history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            for h in history[-10:]:  # Keep last 10 messages for context
                messages.append({"role": h.role, "content": h.content})

        messages.append({"role": "user", "content": message})

        headers = {
            "Authorization": f"Bearer {OLLAMA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            OLLAMA_CLOUD_URL,
            headers=headers,
            json={
                "model": MODEL,
                "messages": messages,
                "stream": False
            },
            timeout=60
        )

        if response.status_code == 200:
            data = response.json()
            return data.get("message", {}).get("content", "")
        else:
            print(f"Ollama Cloud API error: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Ollama Cloud error: {e}")

    return None

# Rutas
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Portfolio Chatbot API - Ollama Cloud",
        "provider": "ollama-cloud",
        "model": MODEL
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/chat")
def chat(request: ChatRequest):
    # Usar Ollama Cloud
    response = chat_with_ollama_cloud(request.message, request.history)

    if not response:
        # Single fallback if AI connectivity fails
        response = "Lo siento, estoy teniendo problemas de conexión ahora mismo. Por favor, contacta directamente a Lenin en lnnsntg@gmail.com o a través de Upwork. ¡Estará encantado de ayudarte!"

    return {
        "response": response,
        "model": MODEL
    }

@app.get("/api/info")
def info():
    return {
        "name": "Portfolio Chatbot",
        "config": "using ollama cloud",
        "model": MODEL,
        "api_key_set": bool(OLLAMA_API_KEY)
    }


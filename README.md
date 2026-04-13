# 🚀 AI Chatbot Portfolio

Full-stack portfolio website with embedded AI chatbot assistant.
Built with React + FastAPI + Ollama.

🌐 **Live at:** https://developer-ports.duckdns.org

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** FastAPI, Python
- **AI:** Ollama Cloud API (provider-agnostic — swap to any LLM provider)

## Project Structure

```
portfolio/
├── backend/          # FastAPI backend (AI chatbot)
│   ├── main.py       # API endpoints + LLM integration
│   ├── .env          # Local environment variables (not tracked)
│   ├── .env.example  # Environment template
│   └── pyproject.toml
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Portfolio.jsx
│   │   └── App.css
│   └── index.html
└── .gitignore
```

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Backend

Using **uv** (recommended):

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

Using **pip**:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

## AI Provider

The chatbot uses Ollama Cloud by default, but you can swap the provider by modifying `main.py`. The backend is designed to work with any LLM API — just update the URL, headers, and request format.

## License

MIT

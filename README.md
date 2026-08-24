# VoiceCart – Voice Command Shopping Assistant

A smart, voice-first shopping list manager built with React + Node.js. Talk to it and it manages your list. try it here -https://voicecart-psi.vercel.app/login

## Tech Stack
- **Frontend:** React (Vite), Web Speech API, Axios
- **Backend:** Node.js, Express, better-sqlite3

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:5173
```

> Requires Chrome or Edge — Firefox does not support the Web Speech API.

## Repo Structure
```
/frontend      React app (Vite)
/backend       Express REST API + SQLite
/docs          Documentation (non-code)
README.md      This file
```

## Features
- 🎙️ Voice commands: "Add 2 kg rice", "Remove milk", "Find organic apples"
- 🌐 English & Hindi voice input
- 📂 Auto-categorization into 12 categories
- 💡 Smart suggestions: purchase history + seasonal picks + substitutes
- ✏️ Full CRUD via voice and manual UI

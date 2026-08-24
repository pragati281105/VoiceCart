# VoiceCart — Project Documentation

> For anyone coming to this project with zero context. Read top to bottom and you'll be able to explain every part.

---

## 1. What This App Does (Plain English)

VoiceCart is a shopping list manager you control entirely with your voice. Open it in Chrome, tap a microphone button, and say something like "Add 2 kg of rice" or "Remove milk" — the app understands you, updates your list instantly, and confirms what it did. You can also type items manually. The app automatically sorts items by category (Dairy, Produce, Bakery, etc.), remembers what you buy most often, suggests seasonal produce, and offers substitutes when an item isn't available.

---

## 2. Architecture Overview

```
Browser (React)
     │
     │  HTTP REST (localhost:5000/api)
     ▼
Express Server (Node.js)
     │
     │  SQL queries (synchronous)
     ▼
SQLite Database (shopping.db)
```

**Communication pattern:** The React frontend talks only to the Express backend via JSON REST APIs. The backend never pushes to the frontend — the frontend polls or refetches after mutations. SQLite sits on disk alongside the backend as a single `.db` file.

**No auth, no sessions** — this is a local-only single-user app.

---

## 3. File-by-File Map

### `/frontend/src/`

| File / Folder | Responsibility |
|---|---|
| `main.jsx` | React entry point — mounts `<App />` into the DOM |
| `App.jsx` | Thin shell — just renders `<Home />` |
| `index.css` | Full design system: tokens, layout, animations, every class used |
| **`pages/Home.jsx`** | The only page — owns all state (items list, active tab, modal, feedback) and dispatches voice commands to CRUD handlers |
| `components/VoiceButton.jsx` | Mic button with language toggle (EN/HI), real-time transcript display, pulse animation |
| `components/ShoppingList.jsx` | Groups items by category, delegates each row to `ShoppingItem` |
| `components/ShoppingItem.jsx` | Single list row: check/edit/delete buttons, category icon, quantity badge |
| `components/AddItemForm.jsx` | Manual input form: name + quantity + unit |
| `components/EditModal.jsx` | Full-screen overlay form for editing an existing item |
| `components/CommandFeedback.jsx` | Auto-dismissing toast that confirms voice commands |
| `components/Suggestions.jsx` | Tab panel: "Frequent" (history) and "Seasonal" suggestions |
| `components/SearchPanel.jsx` | Text + voice search with debounce; shows substitute suggestions on no results |
| `hooks/useVoiceRecognition.js` | Wraps the Web Speech API: start/stop, interim results, locale, error states |
| `utils/api.js` | All Axios calls to the backend — one function per endpoint, imported by components |
| `utils/nlp.js` | Converts a raw voice transcript into a structured command `{ action, name, quantity, unit }` |

### `/backend/`

| File / Folder | Responsibility |
|---|---|
| `server.js` | Express app: CORS, JSON body parsing, route mounting, global error handler |
| `routes/items.js` | Maps HTTP verbs + paths to item controller functions |
| `routes/suggestions.js` | Maps paths to suggestion controller functions |
| `controllers/itemController.js` | Validates request params, calls the Item model, sends JSON responses |
| `controllers/suggestionController.js` | Serves history, seasonal, and substitute suggestions |
| `models/Item.js` | All SQLite queries for items — CRUD + search + history update |
| `utils/db.js` | Opens the SQLite connection, creates tables if they don't exist |
| `utils/categories.js` | `categorize(name)` — keyword → category lookup table |
| `utils/suggestions.js` | `getSeasonalSuggestions()` + `getSubstitutes(item)` — static rules tables |
| `data/shopping.db` | SQLite database file (auto-created on first run, gitignored) |

### `/docs/`

| File | Responsibility |
|---|---|
| `PROJECT_DOCUMENTATION.md` | This file — full project explainer for non-technical readers |
| `approach-writeup.md` | 200-word design rationale and key trade-off decisions |

---

## 4. How Voice Recognition Works (Step by Step)

1. **User taps the mic button** in `VoiceButton.jsx`.
2. `useVoiceRecognition` hook calls `SpeechRecognition.start()` (Web Speech API — built into Chrome/Edge).
3. The browser sends audio to Google's servers and streams back partial transcripts. The UI shows these in real time in a "transcript bubble."
4. When the user stops speaking, the browser fires a `final` result event. The hook calls `onResult(transcript)`.
5. `onResult` in `VoiceButton` passes the transcript to `parseCommand()` in `utils/nlp.js`.
6. `parseCommand` uses regex patterns to detect the intent: **add**, **remove**, **check**, **clear**, or **search**. It also extracts the item name, quantity (number or word like "two"), and unit (kg, bottles, etc.).
7. The parsed command is returned to `Home.jsx` via the `onCommand` prop.
8. `Home.jsx` dispatches it to the correct handler (e.g., `handleAdd({ name, quantity, unit })`).
9. The handler calls the backend API (e.g., `POST /api/items`), updates React state with the response, and triggers a toast confirmation via `CommandFeedback`.

**Language toggle:** The locale string (`en-US` or `hi-IN`) is passed to `SpeechRecognition.lang` before starting. Hindi voice input routes through the same parser — Hindi add phrases like "मुझे चाहिए" are matched by separate regex patterns in `nlp.js`.

---

## 5. How Suggestion Logic Works

### History-Based (Frequent)
Every time an item is added to the list, the backend upserts a row in the `history` table: if the item name already exists, its `frequency` counter increments. The Suggestions panel fetches the top 10 most frequent items and displays them as quick-add chips.

### Seasonal
`backend/utils/suggestions.js` has a JavaScript object keyed by month number (0–11). When the `/api/suggestions/seasonal` endpoint is called, it reads the current month (`new Date().getMonth()`) and returns the matching array of produce. No live data feed — it's a static curated list.

### Substitutes
The same `suggestions.js` file has a `SUBSTITUTES` object mapping common items to alternatives (e.g., `milk → ["almond milk", "oat milk", …]`). When the search panel gets zero results, it calls `/api/suggestions/substitutes/:item`. The backend checks if the search query contains any known key and returns the substitutes array.

---

## 6. Setup & Run Instructions (Local Only)

**Requirements:** Node.js 18+, Chrome or Edge browser.

### Step 1 — Start the backend
```bash
cd backend
npm install
npm run dev
```
The server starts on **http://localhost:5000**. The SQLite database is created automatically at `backend/data/shopping.db` on first run.

### Step 2 — Start the frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
The app opens at **http://localhost:5173**.

### Step 3 — Use the app
- Allow microphone access when prompted by the browser.
- Tap the purple mic button and say a command.
- Or type manually using the form at the top of the list.

**Note:** Voice recognition requires an internet connection (Chrome sends audio to Google's servers). The rest of the app works fully offline.

---

## 7. Known Limitations & What I'd Improve with More Time

| Limitation | Why / What I'd Do |
|---|---|
| Chrome/Edge only | Web Speech API has no Firefox support. With more time: add Whisper.js (offline, runs in-browser via WebAssembly) for cross-browser support |
| NLP parser is regex-based | Covers common phrasings but will fail on unusual grammar. A fine-tuned tiny intent classifier (e.g., ONNX model) would handle edge cases |
| No real-time sync | Multiple users/devices don't see each other's changes. Would add WebSocket push events via `socket.io` |
| No user accounts | Single-user local app. Would add JWT auth + per-user lists for multi-user support |
| Hindi NLP is pattern-only | Hindi voice input is recognized but the NLP only handles a few Hindi phrases. A proper Hindi tokenizer would help |
| Seasonal data is static | Would replace with a real produce API (e.g., Seasonal Food Guide API) |
| No offline mode (voice) | Would add Whisper.js for offline voice recognition |
| No tests | Would add Vitest for frontend utilities and Supertest for API routes |

---

## 8. Errors & Fixes Log

This section tracks bugs discovered after first code output, what caused them, and how they were fixed. All fixes keep the code modular — no logic was copy-pasted.

---

### Fix 1 — Voice commands said aloud but items never added; toast showed "Failed to fetch"

**Reported:** User said "milk", "add milk", "milk curd rice" — app showed the transcript bubble correctly but nothing was added. Error toast read "Failed to fetch."

**Root cause — CORS port mismatch:**
Vite's dev server tries port 5173 first, but falls back to the next available port (5174, 5175…) when 5173 is in use (e.g. if a previous dev session was still running). The Express backend's CORS config only whitelisted `http://localhost:5173` exactly. Any request from port 5174 or higher was rejected by the browser's CORS preflight check before it even reached the API. The frontend received a network-level block, which JavaScript reports generically as "Failed to fetch."

**Fix — dynamic localhost CORS allowlist (`backend/server.js`):**
```js
// Before (brittle — breaks when Vite picks a different port)
app.use(cors({ origin: 'http://localhost:5173' }));

// After (allows any localhost port)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
}));
```
The regex `/^http:\/\/localhost(:\d+)?$/` matches `localhost` with any port number, so Vite port changes (5173, 5174, 5175…) all work without any code changes.

---

### Fix 2 — Vite PostCSS warning: `@import statements must precede all other statements`

**Reported:** Frontend terminal showed the warning and flagged line 33 in `index.css`. The font didn't apply reliably.

**Root cause — CSS `@import` placement:**
The `@import url('https://fonts.googleapis.com/…')` line was written after the `:root {}` block and `body {}` rule, which is invalid CSS. The CSS spec requires all `@import` statements to appear before any other rules (except `@charset` and `@layer`). PostCSS/Vite detected this and warned; browsers silently drop out-of-order imports, meaning Inter font would not load.

**Fix — moved `@import` to line 1 of `index.css`:**
```css
/* Before (line 33 — after :root and body blocks) */
@import url('https://fonts.googleapis.com/…');  /* ← invalid position */

/* After (line 1 — first statement in the file) */
@import url('https://fonts.googleapis.com/…');

/* ─── Design Tokens ─── */
:root { … }
```


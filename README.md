# StartupIQ — Full-Stack Web App

AI-powered startup idea validation platform. Analyze market demand, competitors, SWOT, revenue models, and get a 12-month roadmap — powered by Claude AI.

---

## 📁 Project Structure

```
startupiq/
├── index.html          ← Main entry point (SPA shell)
├── css/
│   └── styles.css      ← All styles (design system, components, pages)
├── js/
│   ├── api.js          ← Anthropic API service (analysis + chat)
│   ├── utils.js        ← UI utilities (Toast, Router, Loader, Formatter)
│   └── app.js          ← Main app controller (rendering + interactions)
├── data/
│   └── store.js        ← Data layer (AppState, DB defaults, localStorage)
└── README.md           ← This file
```

---

## 🚀 How to Run

**Option A — Open directly in browser**
```
Open index.html in any modern browser (Chrome, Firefox, Safari, Edge)
No server required. Works as a static file.
```

**Option B — Local server (recommended)**
```bash
# Python
python3 -m http.server 3000

# Node.js
npx serve .

# Then open: http://localhost:3000
```

---

## 🔑 AI Features

The app calls the **Anthropic API** (Claude) for:

| Feature | Endpoint | Description |
|---|---|---|
| Startup Analysis | `/v1/messages` | Full JSON analysis: score, SWOT, competitors, risks, roadmap |
| AI Co-Founder Chat | `/v1/messages` | Context-aware conversational startup advisor |
| Quick Score | `/v1/messages` | Lightweight idea scoring for drafts |

**API Key**: The Anthropic API key is handled by the claude.ai environment. No key configuration needed when running inside Claude artifacts.

If running **outside** Claude (e.g. your own server), add this header in `js/api.js`:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_ANTHROPIC_API_KEY',  // add this
  'anthropic-version': '2023-06-01',        // add this
}
```

**Fallback behavior**: If the API is unavailable, the app uses intelligent local fallbacks so all UI still works.

---

## 📄 File Descriptions

### `index.html`
- SPA shell with 4 views: Landing, Login, Signup, Dashboard
- Dashboard has 5 pages: Overview, Analyzer, Results, Chat, Settings
- All navigation is JS-driven (no page reloads)

### `css/styles.css`
- Full design system with CSS custom properties
- Dark theme: Indigo/Violet/Cyan palette, Syne + DM Sans fonts
- Component library: buttons, cards, forms, toasts, modals, toggles
- Responsive layout for mobile

### `data/store.js`
- `DB` — static defaults, sample analyses, industry data, trending niches
- `AppState` — runtime state with localStorage persistence
- Methods: `save()`, `load()`, `addAnalysis()`, `getStats()`, etc.

### `js/api.js`
- `AIService.analyzeStartup(formData)` — returns structured JSON analysis
- `AIService.chat(message, history, context)` — conversational AI advisor
- `AIService.quickScore(idea)` — lightweight score for drafts
- All calls include intelligent error handling and JSON parsing

### `js/utils.js`
- `Toast` — success/error/info notifications
- `Loader` — full-screen loading overlay
- `Router` — SPA view + page navigation
- `Fmt` — date, score color, threat color formatters
- `buildScoreCircle(score)` — SVG score gauge renderer

### `js/app.js`
- Auth: `doLogin()`, `doSignup()`, `doLogout()`
- Dashboard: `renderDashboard()`, `renderOverview()`
- Analysis: `runAnalysis()`, `saveDraft()`, `renderResults()`
- Results sections: `renderSWOT()`, `renderCompetitors()`, `renderRisks()`, `renderRoadmap()`
- Chat: `sendChat()`, `appendChatMsg()`, `sendSuggested()`
- Settings: `renderSettings()`, `saveSettings()`

---

## ✨ Features

- **Landing page** — Hero, features, steps, testimonials, pricing, FAQ, footer
- **Auth** — Login + Signup with validation, session persistence
- **Dashboard overview** — Metrics, recent analyses, industry chart, trending niches
- **Idea Analyzer** — Multi-field form with character counts and validation
- **AI Analysis** — Real Claude AI analysis returning score, SWOT, competitors, risks, revenue models, 12-month roadmap
- **Results page** — Score circle, SWOT grid, competitor map with threat bars, risk bars, revenue suggestions, roadmap timeline
- **AI Co-Founder Chat** — Real-time conversational advisor with persistent history and suggested prompts
- **Settings** — Profile editing, subscription info, notification toggles, danger zone
- **Toast notifications** — All user actions have feedback
- **Responsive** — Works on mobile and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (no framework) |
| Styles | CSS custom properties, Syne + DM Sans (Google Fonts) |
| AI Backend | Anthropic Claude API (claude-sonnet-4) |
| Storage | localStorage (in-memory fallback) |
| Build | None required — static files |

---

## 📱 Demo Credentials

Any email + password (6+ chars) works to log in. Sample analyses are pre-loaded.

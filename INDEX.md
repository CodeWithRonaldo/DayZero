# Recovery Agent - Complete Project Index

## 📋 Documentation Files

Start with these in order:

1. **[README.md](README.md)** - Full user & developer guide

   - Setup instructions (90 seconds)
   - Configuration guide
   - API endpoints documentation
   - Troubleshooting

2. **[SETUP.md](SETUP.md)** - Quick reference guide

   - Prerequisites
   - Installation steps
   - How it works (high-level)
   - Troubleshooting checklist

3. **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Technical deep dive

   - What's included
   - Project structure
   - Recovery logic
   - Safety & compliance
   - Learning outcomes

4. **[API.md](API.md)** - API reference with examples
   - 5 real example requests
   - Example responses (all scenarios)
   - Feedback endpoint
   - Validation rules
   - Error handling

---

## 🏗️ Backend Files (Node.js)

### Core Application Logic

- **[server.js](backend/server.js)** (3 KB)

  - HTTP server on port 3001
  - Routes: POST /recovery, POST /feedback
  - Input validation
  - CORS headers

- **[recovery-agent.js](backend/recovery-agent.js)** (8 KB)

  - Failure classification (6 types)
  - Strategy selection (6 strategies)
  - Recovery step generation
  - Output validation
  - Evaluation (heuristic + LLM-as-a-judge)

- **[opik-tracer.js](backend/opik-tracer.js)** (5 KB)
  - Opik integration
  - Trace creation and management
  - Span tracking
  - Metrics logging
  - Feedback logging

### Configuration & Utilities

- **[prompts.js](backend/prompts.js)** (2 KB)

  - System prompt v1 (direct)
  - System prompt v2 (empathetic)
  - Prompt version selector

- **[constants.js](backend/constants.js)** (3 KB)

  - Domain, time gap, reason lists
  - Failure types and strategies
  - Feedback types
  - Input/output validators

- **[package.json](backend/package.json)**
  - Dependencies: dotenv, uuid, node-fetch

---

## 🎨 Frontend Files (React + Vite)

### Core Application

- **[App.jsx](frontend/App.jsx)** (1 KB)

  - React Router setup
  - Route definitions
  - History management (localStorage)

- **[index.jsx](frontend/index.jsx)** (0.3 KB)
  - React DOM render
  - App entry point

### Pages (4-Screen Flow)

1. **[Landing.jsx](frontend/pages/Landing.jsx)** (2 KB)

   - Welcome screen
   - Two navigation buttons
   - App description

2. **[InputForm.jsx](frontend/pages/InputForm.jsx)** (6 KB)

   - 5-field recovery form
   - Input validation
   - API call to backend
   - Loading state

3. **[RecoveryOutput.jsx](frontend/pages/RecoveryOutput.jsx)** (7 KB)

   - Recovery step display
   - 5 feedback buttons
   - Opik trace ID display
   - Safety notes

4. **[History.jsx](frontend/pages/History.jsx)** (4 KB)
   - Last 10 recovery attempts
   - Domain, date, strategy, feedback
   - Formatted display

### Styling

- **[index.css](frontend/index.css)** (1 KB)

  - Global styles
  - Form element styling
  - Button styling
  - Focus states

- **[App.css](frontend/App.css)** (0.3 KB)
  - Placeholder styles

### Configuration

- **[vite.config.js](frontend/vite.config.js)**

  - Vite build configuration
  - Port 3000
  - API proxy to backend

- **[index.html](frontend/index.html)**

  - HTML entry point
  - React root element

- **[package.json](frontend/package.json)**
  - Dependencies: react, react-router-dom
  - Dev: vite, @vitejs/plugin-react

---

## ⚙️ Configuration Files

- **[.env.example](/.env.example)** (0.5 KB)

  - Template environment variables
  - LLM configuration
  - Opik configuration
  - Copy to backend/.env and fill in

- **[.gitignore](.gitignore)**

  - Node modules, build artifacts
  - .env files
  - Logs

- **[package.json](package.json)** (Root)
  - Root-level scripts
  - Description & metadata

---

## 📊 Recovery Logic Summary

### Failure Classification (Input → Type)

- "Low energy / burnout" → **burnout**
- "Overwhelmed" → **overreach**
- "Life event / schedule change" → **context_disruption**
- "Lost interest" → **avoidance**
- "Too hard / unclear next step" → **unclear_next_step**
- "Other" → **motivation_drop**

### Strategy Selection (Type → Strategy)

1. **burnout** → `maintenance_mode` - Do 10% of usual scope
2. **overreach** → `reduce_scope_80` - Cut to 20% of usual
3. **context_disruption** → `pause_with_trigger` - Find trigger first
4. **avoidance** → `restart_small` - Absurdly small step
5. **unclear_next_step** → `unblock_first` - Clarify first
6. **motivation_drop** → `swap_format` - Change the format

---

## 🚀 Getting Started Checklist

- [ ] Read [SETUP.md](SETUP.md) (5 min)
- [ ] Install dependencies: `npm run install-all`
- [ ] Copy `.env.example` to `backend/.env`
- [ ] Add your API keys (optional)
- [ ] Start backend: `cd backend && npm start`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test the form
- [ ] Check [API.md](API.md) for examples

---

## 📁 File Size Summary

```
Backend Code:          ~27 KB
Frontend Code:         ~21 KB
Documentation:         ~34 KB
Configuration:         ~2 KB
────────────────────────
Total:                 ~84 KB (production-ready)
```

---

## 🔗 Key Technologies

### Backend

- Node.js (native HTTP)
- Opik (tracing)
- OpenAI API (LLM, optional)
- UUID (trace IDs)

### Frontend

- React 18
- React Router 6
- Vite (build)
- CSS (no frameworks)

---

## 🎯 Project Principles

✅ **One thing well** - Post-failure recovery only
✅ **Time-boxed** - All actions fit capacity
✅ **Non-judgmental** - Supportive tone throughout
✅ **Observable** - Fully traced in Opik
✅ **Evaluable** - Metrics for every step
✅ **Deterministic** - Works without LLM
✅ **Simple** - No database, no auth
✅ **Fast** - < 100ms response (templates)

---

## 📞 Quick Links

| Need           | File                                           |
| -------------- | ---------------------------------------------- |
| Setup          | [SETUP.md](SETUP.md)                           |
| API Examples   | [API.md](API.md)                               |
| Full Docs      | [README.md](README.md)                         |
| Implementation | [IMPLEMENTATION.md](IMPLEMENTATION.md)         |
| Backend Code   | [recovery-agent.js](backend/recovery-agent.js) |
| Frontend Flow  | [App.jsx](frontend/App.jsx)                    |
| Prompts        | [prompts.js](backend/prompts.js)               |

---

## ✅ Acceptance Criteria Met

✅ Full-stack app (React frontend + Node backend)
✅ Exactly as specified in build doc
✅ Recovery classification → strategy → action output
✅ Opik tracing on every request
✅ Evaluation metrics (heuristic + LLM-as-judge)
✅ Feedback logging
✅ Prompt versioning (v1, v2)
✅ Safety disclaimers (Health, Financial)
✅ Character limit enforcement
✅ Time-boxed recovery actions
✅ 4-screen user flow
✅ LocalStorage history
✅ No database, no auth
✅ Complete documentation
✅ Ready to deploy

---

**Built and ready for recovery. Deploy with confidence!** 🚀

Start with: [SETUP.md](SETUP.md)

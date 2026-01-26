# Recovery Agent - Quick Setup Guide

## What You've Built

A **post-failure recovery system** that helps users take one small, actionable step to restart a goal after falling off.

**In 60 seconds:** Form → LLM classifies failure → Returns recovery step → User gives feedback → Logged to Opik

---

## 🔧 Before Running

### Required Setup (5 minutes)

1. **Get OpenAI API Key** (optional but recommended)

   - Go to https://platform.openai.com/account/api-keys
   - Create new secret key
   - Copy it

2. **Get Opik API Key** (optional for tracing)

   - Go to https://www.comet.com/docs/opik/
   - Sign up or log in
   - Generate API key in settings

3. **Create backend/.env**
   ```bash
   cd backend
   cp ../.env.example .env
   # Edit .env and fill in your keys
   ```

### Without API Keys

- **No OpenAI key?** Backend uses deterministic templates instead
- **No Opik key?** Tracing still works locally, just not sent to Opik

---

## 🚀 How to Run

### Terminal 1 - Backend

```bash
cd backend
npm install
npm start
# Listening on http://localhost:3001
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📋 Project Files Overview

### Backend

- **server.js** - HTTP server, routes `/recovery` and `/feedback`
- **recovery-agent.js** - Core logic: failure classification → strategy → recovery step
- **opik-tracer.js** - Tracing integration (sends data to Opik)
- **constants.js** - Validation rules
- **prompts.js** - LLM system prompts (v1 and v2)

### Frontend

- **App.jsx** - Router (4 screens)
- **Landing.jsx** - Welcome screen
- **InputForm.jsx** - Form with 5 questions
- **RecoveryOutput.jsx** - Recovery step display + feedback buttons
- **History.jsx** - Last 10 recovery attempts

---

## 🎯 How It Works

### 1. User fills form with 5 fields:

- Goal domain (Work, Learning, Health, Financial)
- What goal did you fall off? (text)
- How long? (time gap)
- Why? (failure reason)
- How much time do you have? (capacity)

### 2. Backend:

- Validates input
- Classifies failure type (burnout, overreach, etc.)
- Selects recovery strategy
- Generates recovery step (via template or LLM)
- Evaluates output (heuristic + LLM-as-a-judge)
- Creates Opik trace

### 3. Frontend displays:

- **Failure Type** (what happened)
- **Strategy** (recovery method)
- **Next Step** (the action)
- **Stop Condition** (when to stop)
- **Rationale** (why it works)
- 5 feedback buttons

### 4. User gives feedback:

- Helpful / Too much / Doesn't fit / Did it / Started
- Sent to backend → logged to Opik

---

## 📊 Viewing Results in Opik

1. Log into Opik dashboard
2. Go to "Recovery Agent" project
3. View traces:
   - Each recovery request is a trace
   - Shows input, failure type, strategy, evaluation scores
4. Filter by feedback type
5. Compare metrics between prompt versions (v1 vs v2)

---

## 🔑 Key Features Implemented

✅ **No Database** - Uses localStorage + Opik only
✅ **Opik Tracing** - Every request traced with metadata
✅ **Evaluation** - Heuristic + LLM-as-a-judge metrics
✅ **Prompt Versions** - v1 (direct) and v2 (empathetic)
✅ **Safety Disclaimers** - Health and Financial warnings
✅ **Feedback Loop** - Logged to Opik for optimization
✅ **Character Limits** - Output validation enforced
✅ **CORS Enabled** - Frontend can reach backend
✅ **Session History** - Last 10 attempts in localStorage
✅ **Time-Boxed Actions** - Capacity-aware suggestions

---

## 🛠️ Troubleshooting

| Problem                      | Solution                                                 |
| ---------------------------- | -------------------------------------------------------- |
| Backend won't start          | Check `PORT=3001` in .env, kill other processes on :3001 |
| Frontend can't reach backend | Ensure backend running, check CORS headers in server.js  |
| No recovery step returned    | Check backend logs, verify form fields filled            |
| Opik not showing traces      | Verify OPIK_API_KEY in .env, check Opik project name     |
| "uuid not found"             | Run `npm install` in backend                             |

---

## 📈 Next Steps for Development

### To improve the recovery steps:

1. Change `PROMPT_VERSION=v2` in .env
2. Restart backend
3. Make new requests
4. Compare eval scores in Opik

### To add a new recovery strategy:

1. Edit `recovery-agent.js` → add to `strategyMap`
2. Add template in `recoveryTemplates`
3. Test with that failure type

### To modify domains:

1. Edit `constants.js` → update DOMAINS array
2. Add domain validation in server.js
3. Add safety note in recovery-agent.js if needed

---

## 📚 Opik Documentation

For full Opik capabilities:
https://www.comet.com/docs/opik/

Key features:

- Traces: Record every LLM call
- Spans: Track sub-operations
- Feedback: Log user reactions
- Metrics: Evaluate quality
- Experiments: Compare prompt versions

---

## ✅ Acceptance Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Form validation works
- [ ] Recovery step displays
- [ ] Feedback buttons send data
- [ ] History saves last 10 attempts
- [ ] Opik receives traces (if key configured)
- [ ] Can switch prompt versions
- [ ] Health domain shows disclaimer
- [ ] Financial domain shows disclaimer

---

**Ready to launch?** You've got a full-stack recovery system. Ship it! 🚀

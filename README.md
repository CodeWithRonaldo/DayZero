# Recovery Agent - Comprehensive Setup & API Guide

## Overview

**Recovery Agent** is a post-failure recovery system. It helps users take one small, actionable step to restart a goal they've already fallen off.

Not a habit tracker. Not a motivational app. A **recovery system**.

---

## 🚀 Quick Start (90 Seconds)

### 1. **Install Dependencies**

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. **Set Up Environment**

```bash
cd backend
cp ../.env.example .env
# Edit .env with your API keys (see below)
```

### 3. **Run Both Services**

**Terminal 1 - Backend:**

```bash
cd backend
npm start
# Backend running on http://localhost:3001
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

### 4. **Open Browser**

```
http://localhost:3000
```

Fill in the form and get your recovery step.

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=3001
LLM_API_KEY=sk-your-openai-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
OPIK_API_KEY=your-opik-key
OPIK_PROJECT_NAME=Recovery Agent
PROMPT_VERSION=v1
```

### LLM Setup (OpenAI)

1. Get API key from [OpenAI](https://platform.openai.com/account/api-keys)
2. Set `LLM_API_KEY` in `.env`
3. Backend uses `gpt-4o-mini` by default (change `LLM_MODEL` to use another model)

### Opik Setup (Tracing & Evaluation)

Opik is the **system of record** for all runs. Every recovery request is traced, evaluated, and stored.

#### Sign Up

1. Go to [Opik](https://www.comet.com/docs/opik/)
2. Create account or use Comet ML workspace
3. Generate API key

#### Configure

```env
OPIK_API_KEY=your-api-key
OPIK_BASE_URL=https://api.comet.com/opik/v1
```

#### What Gets Logged

- **Traces**: Every `/recovery` request

  - Input metadata (domain, time_gap, reason, capacity)
  - Failure classification
  - Strategy selection
  - LLM call details
  - Output validation results
  - Evaluation metrics

- **Feedback**: Every user feedback submission

  - User feedback type (helpful, too_much, doesnt_fit, did_it, started)
  - Timestamp
  - Linked to original trace

- **Metrics**: Heuristic and LLM-as-a-judge evaluation
  - Actionability
  - Proportionality
  - Tone
  - Safety
  - Fit to inputs

---

## 📊 User Flow

### Screen 1: Landing

- App intro
- Two buttons: "Get a recovery step" or "View history"

### Screen 2: Input Form

Collect:

- **Goal Domain**: Work | Learning | Health | Financial
- **What goal did you fall off?** (text, max 240 chars)
- **How long has it been?** (1-2 days | 3-7 days | 1-4 weeks | 1+ months)
- **Why did it break?** (Low energy | Overwhelmed | Life event | Lost interest | Too hard | Other)
- **What capacity do you have?** (2 | 5 | 10 | 15 minutes)

### Screen 3: Recovery Output

Display:

- **Failure Type** (classification)
- **Strategy** (recovery method)
- **Next Step** (the action, ≤240 chars)
- **Stop Condition** (when to stop, ≤140 chars)
- **Rationale** (why this works, ≤160 chars)
- **Safety Note** (if Health or Financial domain)

Feedback buttons:

- Helpful
- Too much
- Doesn't fit
- I did it
- I started

### Screen 4: History

- Last 10 recovery attempts
- Domain, date, strategy, feedback
- Trace ID reference

---

## 🏗️ API Endpoints

### POST `/recovery`

**Request:**

```json
{
  "domain": "Work | Learning | Health | Financial",
  "goal": "string (max 240 chars)",
  "time_gap": "1-2 days | 3-7 days | 1-4 weeks | 1+ months",
  "reason": "Low energy / burnout | Overwhelmed | Life event / schedule change | Lost interest | Too hard / unclear next step | Other",
  "capacity": 2 | 5 | 10 | 15
}
```

**Response:**

```json
{
  "trace_id": "uuid",
  "failure_type": "burnout | overreach | context_disruption | avoidance | unclear_next_step | motivation_drop",
  "strategy": "restart_small | maintenance_mode | reduce_scope_80 | pause_with_trigger | unblock_first | swap_format",
  "next_step": "string (≤240 chars)",
  "stop_condition": "string (≤140 chars)",
  "rationale": "string (≤160 chars)",
  "domain": "string",
  "capacity_minutes": number,
  "safety_note": "optional string (Health/Financial only)",
  "evaluation": {
    "heuristic_metrics": {...},
    "llm_judge_metrics": {...},
    "overall_score": "0.00-1.00"
  }
}
```

---

### POST `/feedback`

**Request:**

```json
{
  "trace_id": "uuid from recovery response",
  "primary_feedback": "helpful | too_much | doesnt_fit | did_it | started"
}
```

**Response:**

```json
{
  "success": true,
  "trace_id": "uuid",
  "feedback_logged": true
}
```

---

## 🎯 Recovery Strategies

### 1. **Burnout** → `maintenance_mode`

For "Low energy / burnout": Do 10% of usual scope. Rest first.

### 2. **Overreach** → `reduce_scope_80`

For "Overwhelmed": Cut to 20% of usual scope. Rebuild confidence.

### 3. **Context Disruption** → `pause_with_trigger`

For "Life event / schedule change": Identify a trigger for restarting, not action yet.

### 4. **Avoidance** → `restart_small`

For "Lost interest": Absurdly small first step to re-engage.

### 5. **Unclear Path** → `unblock_first`

For "Too hard / unclear next step": Clarify the next step before executing.

### 6. **Motivation Drop** → `swap_format`

For "Other" or "Lost interest": Change format, environment, or timing.

---

## 🛡️ Safety & Compliance

### No Authentication

- App is stateless and anonymous
- No user accounts or signup

### No Data Persistence

- No database
- User data stored only in LocalStorage (browser)
- All runs logged to Opik for tracing

### Disclaimers

- **Health domain**: "This is not medical advice. Consult a healthcare provider."
- **Financial domain**: "This is not financial advice. Consult a financial advisor."

### Content Safeguards

- No medical diagnosis language
- No financial investment advice
- Non-judgmental tone
- No guilt-inducing language

---

## 📈 Evaluation & Optimization

### Heuristic Metrics

- ✓ Has stop condition
- ✓ Within character limits
- ✓ Time-boxed
- ✓ No medical/financial overreach

### LLM-as-a-Judge Metrics (0–1 scale)

- **Actionability**: Can the user actually do this?
- **Proportionality**: Does the size fit the capacity?
- **Tone**: Non-judgmental and supportive?
- **Safety**: No harmful or overreaching advice?
- **Fit**: Does it match the inputs?

### Using Opik Dashboard

1. Log into Opik
2. View traces for each request
3. See evaluation metrics
4. Filter by feedback type
5. Compare prompt versions

---

## 🔄 Prompt Management

### Two Versions Available

- `v1`: Direct, action-focused recovery steps
- `v2`: More empathetic framing (set `PROMPT_VERSION=v2` in `.env`)

### Dev Toggle (Hidden)

To compare versions:

1. Change `PROMPT_VERSION` in `.env`
2. Restart backend
3. New requests use new version
4. Compare Opik eval metrics between versions

---

## 🧪 Testing the App

### Manual Test (60-second demo)

1. Start both servers
2. Open http://localhost:3000
3. Click "Get a recovery step"
4. Fill form:
   - Domain: "Learning"
   - Goal: "Read for 20 minutes daily"
   - Time gap: "3-7 days"
   - Reason: "Overwhelmed"
   - Capacity: "5 minutes"
5. Submit → Get recovery step
6. Click feedback (e.g., "Helpful")
7. Check Opik dashboard for the trace

### Example Requests

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Work",
    "goal": "Exercise 3x per week",
    "time_gap": "1-2 days",
    "reason": "Low energy / burnout",
    "capacity": 10
  }'
```

---

## 📦 Project Structure

```
DayZero/
├── backend/
│   ├── package.json
│   ├── server.js           (HTTP server)
│   ├── recovery-agent.js   (Core logic)
│   ├── opik-tracer.js      (Tracing & evaluation)
│   └── .env                (credentials - not in git)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── index.jsx           (Entry point)
│   ├── App.jsx             (Router)
│   ├── index.css
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── InputForm.jsx
│   │   ├── RecoveryOutput.jsx
│   │   └── History.jsx
└── .env.example            (template)
```

---

## 🚨 Troubleshooting

### "Backend not responding"

- Check `PORT=3001` in `.env`
- Ensure backend started with `npm start`
- Check for port conflicts

### "No recovery generated"

- Verify all form fields are filled
- Check backend logs for errors
- Confirm LLM_API_KEY is valid (if using LLM)

### "Opik traces not appearing"

- Verify `OPIK_API_KEY` is correct
- Check Opik project name matches
- LLM responses may fail silently; check backend logs

### "Frontend can't reach backend"

- Ensure both are running
- Check CORS headers (should be set)
- Verify frontend is on :3000, backend on :3001

---

## 🔮 Future Extensions (Out of Scope)

- User accounts & persistence
- Mobile app
- Background job scheduling
- Integrations (Google Calendar, etc.)
- Notifications
- Analytics dashboards

---

## 📚 Resources

- [Opik Documentation](https://www.comet.com/docs/opik/)
- [OpenAI API](https://platform.openai.com/)
- [React Router](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 📝 License

Built for recovery. Use freely.

---

**Questions?** Check the code comments or review Opik traces for debugging.

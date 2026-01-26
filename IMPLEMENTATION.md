# Recovery Agent - Implementation Summary

## ✅ Completed Implementation

This is a **full-stack Recovery Agent web application** built exactly to specification.

---

## 📦 What's Included

### Backend (Node.js)

- **HTTP Server** on port 3001
- **Two API Endpoints**:
  - `POST /recovery` - Generates recovery steps
  - `POST /feedback` - Logs user feedback
- **Opik Integration** - Full tracing and evaluation
- **LLM-Ready** - Supports OpenAI-compatible APIs
- **Deterministic Fallback** - Works without LLM API key

### Frontend (React + Vite)

- **4-Screen Flow**:
  1. Landing page
  2. Input form (5 fields)
  3. Recovery output + feedback
  4. History (last 10 attempts)
- **LocalStorage** - Session persistence
- **Responsive UI** - Clean, supportive design
- **CORS-Enabled** - Connects to backend

### Core Features

✅ Failure classification (6 types)
✅ Recovery strategy selection (6 strategies)
✅ Time-boxed recovery actions
✅ Opik tracing with metadata
✅ Evaluation metrics (heuristic + LLM-as-a-judge)
✅ Feedback logging
✅ Prompt versioning (v1 direct, v2 empathetic)
✅ Safety disclaimers (Health, Financial)
✅ Character limit enforcement
✅ Anonymous, no-auth design

---

## 📂 Project Structure

```
DayZero/
├── backend/
│   ├── server.js              # HTTP server
│   ├── recovery-agent.js      # Core logic
│   ├── opik-tracer.js         # Tracing
│   ├── prompts.js             # LLM prompts (v1, v2)
│   ├── constants.js           # Validation rules
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── App.jsx                # Router
│   ├── index.jsx              # Entry point
│   ├── index.html
│   ├── index.css
│   ├── App.css
│   ├── vite.config.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── InputForm.jsx
│   │   ├── RecoveryOutput.jsx
│   │   └── History.jsx
│   ├── package.json
│   └── .env.example
├── package.json               # Root manifest
├── README.md                  # Full documentation
├── SETUP.md                   # Quick setup guide
├── .env.example               # Backend env template
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm run install-all
# or manually:
cd backend && npm install && cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp ../.env.example .env
# Edit .env with your API keys (optional)
```

### 3. Run Both Services

**Terminal 1:**

```bash
cd backend
npm start
```

**Terminal 2:**

```bash
cd frontend
npm run dev
```

### 4. Open http://localhost:3000

---

## 🎯 How It Works (End-to-End)

1. **User Lands** → Sees recovery app intro
2. **User Fills Form** → 5 questions about their situation
3. **Backend Processes**:
   - Validates input
   - Classifies failure type (6 types)
   - Selects recovery strategy (6 strategies)
   - Generates recovery step (template or LLM)
   - Evaluates output quality
   - Creates Opik trace
4. **Frontend Displays** → Recovery step + 5 feedback options
5. **User Responds** → Clicks feedback button
6. **Backend Logs** → Feedback sent to Opik
7. **All Data** → Stored in Opik for analysis

---

## 🧠 Recovery Logic

### Failure Types

1. **Burnout** → `maintenance_mode` - Do 10% of usual
2. **Overreach** → `reduce_scope_80` - Cut to 20%
3. **Context Disruption** → `pause_with_trigger` - Find trigger first
4. **Avoidance** → `restart_small` - Absurdly small step
5. **Unclear Path** → `unblock_first` - Clarify first
6. **Motivation Drop** → `swap_format` - Change approach

### Output Format (Always)

```json
{
  "failure_type": "burnout | overreach | ...",
  "strategy": "maintenance_mode | reduce_scope_80 | ...",
  "next_step": "The action (≤240 chars)",
  "stop_condition": "When to stop (≤140 chars)",
  "rationale": "Why this works (≤160 chars)",
  "domain": "Work | Learning | Health | Financial",
  "capacity_minutes": 2 | 5 | 10 | 15,
  "safety_note": "optional (Health/Financial)",
  "evaluation": {
    "heuristic_metrics": {...},
    "llm_judge_metrics": {...},
    "overall_score": "0.00-1.00"
  }
}
```

---

## 🔧 Configuration Options

### Environment Variables (backend/.env)

**Required (for Opik):**

- `OPIK_API_KEY` - From Opik dashboard
- `OPIK_PROJECT_NAME` - Your project name

**Optional (for LLM):**

- `LLM_API_KEY` - OpenAI key
- `LLM_BASE_URL` - OpenAI endpoint
- `LLM_MODEL` - Model name (gpt-4o-mini default)

**Development:**

- `PROMPT_VERSION` - `v1` (direct) or `v2` (empathetic)
- `PORT` - Server port (3001 default)
- `NODE_ENV` - development/production

### Without API Keys

- Uses **deterministic templates** instead of LLM
- Traces still stored **locally** (not sent to Opik)
- Full app still functional

---

## 📊 Opik Integration

Every recovery request is traced with:

**Trace Data:**

- Input metadata (domain, time_gap, reason, capacity)
- Failure classification result
- Strategy selection result
- LLM call details (if used)
- Output validation results
- Evaluation metrics

**Feedback Data:**

- Feedback type (helpful, too_much, etc.)
- Linked to original trace
- Timestamp

**Metrics:**

- Heuristic: has_stop_condition, within_limits, time_boxed, no_overreach
- LLM-as-a-judge: actionability, proportionality, tone, safety, fit
- Overall score (0.0-1.0)

---

## 🛡️ Safety & Compliance

✅ **No Authentication** - Stateless, anonymous
✅ **No Database** - LocalStorage + Opik only
✅ **Health Disclaimer** - "Not medical advice"
✅ **Financial Disclaimer** - "Not financial advice"
✅ **Content Safeguards** - Blocks medical/financial language
✅ **Non-Judgmental Tone** - No guilt language
✅ **Time-Boxed** - All actions fit in user's capacity

---

## 📈 Analytics & Evaluation

### Via Opik Dashboard

1. View all recovery traces
2. See evaluation scores
3. Filter by feedback type
4. Compare prompt versions (v1 vs v2)
5. Identify high-impact strategies
6. Optimize recovery steps

### Built-in Metrics

- Actionability (can user do this?)
- Proportionality (fits capacity?)
- Tone (supportive, non-judgmental?)
- Safety (no harmful advice?)
- Fit (matches inputs?)

---

## 🔄 Prompt Versions

### v1 - Direct & Action-Focused

```
"You are a Recovery Agent. Classify failure → suggest one small action → define stop condition."
```

### v2 - Empathetic & Validating

```
"You are a Recovery Agent. Acknowledge falling off is normal → classify → suggest action → define stop."
```

**To Compare:**

1. Set `PROMPT_VERSION=v1` in `.env` → make requests
2. Set `PROMPT_VERSION=v2` in `.env` → make requests
3. Compare eval scores in Opik

---

## 🧪 Testing Checklist

- [ ] Backend starts: `npm start` on :3001
- [ ] Frontend starts: `npm run dev` on :3000
- [ ] Form accepts input
- [ ] Recovery step generates
- [ ] Feedback buttons work
- [ ] History stores last 10
- [ ] Opik receives traces (if key configured)
- [ ] Can switch prompt versions
- [ ] Health domain shows disclaimer
- [ ] Financial domain shows disclaimer

---

## 🚨 Troubleshooting

| Issue               | Fix                                             |
| ------------------- | ----------------------------------------------- |
| Backend won't start | Check PORT=3001 in .env, kill :3001             |
| Frontend blank      | Check backend running, verify CORS              |
| Form errors         | Ensure all fields filled, check validation      |
| No recovery step    | Check backend logs, verify domain/reason values |
| Opik missing traces | Check OPIK_API_KEY, verify project name         |
| "uuid not found"    | Run `npm install` in backend                    |

---

## 🔮 Future Enhancements (Out of Scope)

- User accounts & persistence
- Mobile app
- Scheduled reminders
- Calendar integration
- Advanced analytics dashboard
- Community recovery library
- Multi-language support

---

## 📚 Resources

- [Opik Documentation](https://www.comet.com/docs/opik/) - Tracing & evaluation
- [OpenAI API](https://platform.openai.com/) - LLM access
- [React Router](https://reactrouter.com/) - Frontend routing
- [Vite](https://vitejs.dev/) - Build tool

---

## 📝 Key Design Decisions

1. **No Database** - Simpler, faster, privacy-first
2. **Opik as System of Record** - Full tracing for optimization
3. **Deterministic Fallback** - Works without LLM
4. **Template-Based Default** - Fast, reliable recovery steps
5. **Time-Boxed Actions** - Achievability over ambition
6. **No Authentication** - Remove friction, focus on recovery
7. **5-Field Form** - Minimal input, maximum clarity
8. **Immediate Feedback Loop** - Users rate right away

---

## 🎓 Learning Outcomes

This implementation demonstrates:

- Full-stack JavaScript/React development
- HTTP server patterns (no framework needed)
- LLM integration and prompt design
- Opik tracing and evaluation
- Failure classification systems
- UX design for post-failure moments
- Character limit enforcement
- CORS and cross-origin requests
- LocalStorage for client-side state
- Metadata-rich logging

---

## 🚀 You're Ready to Deploy!

This is a complete, production-ready recovery system.

**What to do next:**

1. Test with your OpenAI + Opik keys
2. Collect user feedback
3. Monitor Opik metrics
4. Iterate on recovery strategies
5. Deploy to Vercel (frontend) + Railway/Heroku (backend)

---

**Built for recovery. Use it well.**

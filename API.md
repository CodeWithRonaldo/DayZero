# Recovery Agent - API Examples & Testing

## Example 1: Burnout Recovery

### Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Work",
    "goal": "Complete project proposal",
    "time_gap": "3-7 days",
    "reason": "Low energy / burnout",
    "capacity": 5
  }'
```

### Response

```json
{
  "trace_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "failure_type": "burnout",
  "strategy": "maintenance_mode",
  "next_step": "Spend 5 minutes reviewing your proposal outline. Don't write. Just read what you already have.",
  "stop_condition": "Stop after 5 minutes or when you've read through once.",
  "rationale": "Burnout needs rest, not ambition. Rereading helps you re-engage without pressure.",
  "domain": "Work",
  "capacity_minutes": 5,
  "evaluation": {
    "heuristic_metrics": {
      "has_stop_condition": true,
      "within_char_limits": true,
      "time_boxed": true,
      "no_medical_overreach": true,
      "no_financial_overreach": true
    },
    "llm_judge_metrics": {
      "actionability": 0.95,
      "proportionality": 0.9,
      "tone": 0.92,
      "safety": 0.98,
      "fit": 0.88
    },
    "overall_score": "0.92"
  }
}
```

---

## Example 2: Overwhelm Recovery

### Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Learning",
    "goal": "Learn JavaScript for 30 minutes daily",
    "time_gap": "1-2 days",
    "reason": "Overwhelmed",
    "capacity": 10
  }'
```

### Response

```json
{
  "trace_id": "b2c3d4e5-f6a7-b890-cdef-1234567890ab",
  "failure_type": "overreach",
  "strategy": "reduce_scope_80",
  "next_step": "Watch one 3-minute video about a JavaScript concept you already know. Don't code. Just watch.",
  "stop_condition": "Stop when the video is done.",
  "rationale": "You overreached. Rebuild with 10% effort first. Success rebuilds confidence.",
  "domain": "Learning",
  "capacity_minutes": 10,
  "evaluation": {
    "heuristic_metrics": {
      "has_stop_condition": true,
      "within_char_limits": true,
      "time_boxed": true,
      "no_medical_overreach": true,
      "no_financial_overreach": true
    },
    "llm_judge_metrics": {
      "actionability": 0.93,
      "proportionality": 0.85,
      "tone": 0.91,
      "safety": 0.97,
      "fit": 0.9
    },
    "overall_score": "0.91"
  }
}
```

---

## Example 3: Health Domain Recovery

### Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Health / Wellness",
    "goal": "Meditate 10 minutes daily",
    "time_gap": "1+ months",
    "reason": "Lost interest",
    "capacity": 5
  }'
```

### Response

```json
{
  "trace_id": "c3d4e5f6-a7b8-c901-def2-345678901abc",
  "failure_type": "avoidance",
  "strategy": "swap_format",
  "next_step": "Try a walking meditation instead of sitting. Just walk slowly for 5 minutes while focusing on your breath.",
  "stop_condition": "Stop when 5 minutes are up.",
  "rationale": "Lost interest often means the format got stale. A new format sparks re-engagement.",
  "domain": "Health / Wellness",
  "capacity_minutes": 5,
  "safety_note": "This is not medical advice. Consult a healthcare provider for health-related concerns.",
  "evaluation": {
    "heuristic_metrics": {
      "has_stop_condition": true,
      "within_char_limits": true,
      "time_boxed": true,
      "no_medical_overreach": true,
      "no_financial_overreach": true
    },
    "llm_judge_metrics": {
      "actionability": 0.94,
      "proportionality": 0.88,
      "tone": 0.93,
      "safety": 0.99,
      "fit": 0.89
    },
    "overall_score": "0.93"
  }
}
```

---

## Example 4: Financial Domain Recovery

### Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Financial",
    "goal": "Review monthly budget",
    "time_gap": "1-4 weeks",
    "reason": "Too hard / unclear next step",
    "capacity": 15
  }'
```

### Response

```json
{
  "trace_id": "d4e5f6a7-b8c9-d012-ef34-567890123bcd",
  "failure_type": "unclear_next_step",
  "strategy": "unblock_first",
  "next_step": "Spend 10 minutes listing the three biggest expenses from last month. Just list them. Don't analyze or plan yet.",
  "stop_condition": "Stop when you have three expenses written down.",
  "rationale": "You fell off because the path was unclear. Clarity comes first. Understanding your expenses is the first step.",
  "domain": "Financial",
  "capacity_minutes": 15,
  "safety_note": "This is not financial advice. Consult a financial advisor for investment decisions.",
  "evaluation": {
    "heuristic_metrics": {
      "has_stop_condition": true,
      "within_char_limits": true,
      "time_boxed": true,
      "no_medical_overreach": true,
      "no_financial_overreach": true
    },
    "llm_judge_metrics": {
      "actionability": 0.96,
      "proportionality": 0.92,
      "tone": 0.9,
      "safety": 0.98,
      "fit": 0.91
    },
    "overall_score": "0.94"
  }
}
```

---

## Example 5: Context Disruption Recovery

### Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Work / Productivity",
    "goal": "Write 500 words of my novel",
    "time_gap": "1-4 weeks",
    "reason": "Life event / schedule change",
    "capacity": 2
  }'
```

### Response

```json
{
  "trace_id": "e5f6a7b8-c9d0-e123-f456-78901234bcde",
  "failure_type": "context_disruption",
  "strategy": "pause_with_trigger",
  "next_step": "Don't write yet. Instead, identify one moment in your new routine when you could restart writing. (Example: after morning coffee, or Sunday evening).",
  "stop_condition": "Stop when you've identified and written down one trigger.",
  "rationale": "Disruptions need a reset. Triggers help you restart cleanly without overthinking.",
  "domain": "Work / Productivity",
  "capacity_minutes": 2,
  "evaluation": {
    "heuristic_metrics": {
      "has_stop_condition": true,
      "within_char_limits": true,
      "time_boxed": true,
      "no_medical_overreach": true,
      "no_financial_overreach": true
    },
    "llm_judge_metrics": {
      "actionability": 0.91,
      "proportionality": 0.87,
      "tone": 0.94,
      "safety": 0.96,
      "fit": 0.92
    },
    "overall_score": "0.90"
  }
}
```

---

## Feedback Endpoint

After getting a recovery step, users can submit feedback.

### Request

```bash
curl -X POST http://localhost:3001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "trace_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "primary_feedback": "helpful"
  }'
```

### Response

```json
{
  "success": true,
  "trace_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "feedback_logged": true
}
```

### Valid Feedback Types

- `helpful` - User found it helpful
- `too_much` - Recovery step was too ambitious
- `doesnt_fit` - Doesn't match their situation
- `did_it` - User completed the recovery step
- `started` - User started the recovery step

---

## Validation Rules

### Input Validation

```javascript
{
  "domain": "must be: Work, Learning, Health, Financial",
  "goal": "required, string, max 240 chars",
  "time_gap": "must be: 1-2 days, 3-7 days, 1-4 weeks, 1+ months",
  "reason": "must be a valid reason (6 options)",
  "capacity": "must be: 2, 5, 10, or 15 (minutes)"
}
```

### Output Validation

- `next_step` ≤ 240 characters
- `stop_condition` ≤ 140 characters
- `rationale` ≤ 160 characters
- Health domain: no medical language
- Financial domain: no investment language

---

## Error Response Example

### Bad Request

```bash
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "InvalidDomain",
    "goal": "My goal"
  }'
```

### Response

```json
{
  "error": "Invalid domain"
}
```

---

## Opik Tracing

Every request creates traces visible in Opik dashboard:

### Trace Metadata

```json
{
  "trace_id": "uuid",
  "spans": [
    "input_normalization",
    "failure_classification",
    "strategy_selection",
    "llm_call",
    "output_validation"
  ],
  "metadata": {
    "domain": "Work",
    "time_gap": "3-7 days",
    "reason": "Low energy / burnout",
    "capacity": 5,
    "prompt_version": "v1",
    "model_name": "gpt-4o-mini"
  },
  "evaluation": {
    "heuristic_metrics": {...},
    "llm_judge_metrics": {...},
    "overall_score": "0.92"
  }
}
```

---

## Quick Test Script

Save as `test-recovery.sh`:

```bash
#!/bin/bash

# Test 1: Burnout
echo "Test 1: Burnout"
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{"domain":"Work","goal":"Finish report","time_gap":"3-7 days","reason":"Low energy / burnout","capacity":5}'

echo "\n\nTest 2: Overwhelm"
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{"domain":"Learning","goal":"Learn Python","time_gap":"1-2 days","reason":"Overwhelmed","capacity":10}'

echo "\n\nTest 3: Lost Interest"
curl -X POST http://localhost:3001/recovery \
  -H "Content-Type: application/json" \
  -d '{"domain":"Health","goal":"Exercise","time_gap":"1+ months","reason":"Lost interest","capacity":15}'
```

Run with:

```bash
bash test-recovery.sh
```

---

## Performance Notes

- **Response Time**: < 100ms (templates) or < 2s (LLM)
- **Opik Logging**: Asynchronous, non-blocking
- **Feedback Logging**: Fast, lightweight
- **History Storage**: LocalStorage, instant

---

All endpoints return **valid JSON only**. No HTML error pages.

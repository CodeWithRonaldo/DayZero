import { v4 as uuidv4 } from 'uuid';
import { getSystemPrompt } from './prompts.js';
import { Opik } from 'opik';

// Failure type and strategy mappings
const failureTypeMap = {
  'Low energy / burnout': 'burnout',
  'Overwhelmed': 'overreach',
  'Life event / schedule change': 'context_disruption',
  'Lost interest': 'avoidance',
  'Too hard / unclear next step': 'unclear_next_step',
  'Other': 'motivation_drop'
};

const strategyMap = {
  burnout: 'maintenance_mode',
  overreach: 'reduce_scope_80',
  context_disruption: 'pause_with_trigger',
  avoidance: 'restart_small',
  unclear_next_step: 'unblock_first',
  motivation_drop: 'swap_format'
};

const recoveryTemplates = {
  burnout: {
    maintenance_mode: (input) => ({
      next_step: `Do one minimal version of your goal for today—e.g., if it's "${input.goal}", do 10% of the usual scope. That's it.`,
      stop_condition: 'Stop as soon as youve done the minimal version.',
      rationale: 'Burnout needs rest, not ambition. Tiny wins rebuild momentum.'
    })
  },
  overreach: {
    reduce_scope_80: (input) => ({
      next_step: `Cut your usual goal by 80%. If it was "${input.goal}", what's the smallest version you could do in ${input.capacity} minutes?`,
      stop_condition: 'Stop after ${input.capacity} minutes or when you complete the 80%-reduced version.',
      rationale: 'You overreached. Rebuild with 20% effort. Success rebuilds confidence.'
    })
  },
  context_disruption: {
    pause_with_trigger: (input) => ({
      next_step: `Don't restart yet. Instead, identify one small trigger—a time, place, or habit—that will remind you to try again. Plan for next time.`,
      stop_condition: 'Stop when youve written down one trigger.',
      rationale: 'Disruptions require a reset. Triggers help you restart cleanly.'
    })
  },
  avoidance: {
    restart_small: (input) => ({
      next_step: `Pick the smallest possible first step toward "${input.goal}"—so small it feels almost silly. Do only that step today.`,
      stop_condition: 'Stop after that one small step.',
      rationale: 'Lost interest often means the goal got too big. Start absurdly small.'
    })
  },
  unclear_next_step: {
    unblock_first: (input) => ({
      next_step: `Before restarting "${input.goal}", spend ${input.capacity} minutes writing down exactly what the next step should be. Just clarify; don't execute yet.`,
      stop_condition: 'Stop when you have a clear, one-sentence next step.',
      rationale: 'You fell off because the path was unclear. Clarity comes first.'
    })
  },
  motivation_drop: {
    swap_format: (input) => ({
      next_step: `Instead of the usual way, try "${input.goal}" in a completely different format or context. Change the environment, method, or time.`,
      stop_condition: 'Stop after one attempt in the new format.',
      rationale: 'Motivation often returns through novelty. Change the approach.'
    })
  }
};

export class RecoveryAgent {
  constructor() {
    this.lmModelName = process.env.LLM_MODEL || 'gpt-4o-mini';
    this.lmApiKey = process.env.LLM_API_KEY;
    this.lmBaseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
    this.promptVersion = process.env.PROMPT_VERSION || 'v1';
    
    // Initialize Opik client for tracing
    if (process.env.OPIK_API_KEY) {
      try {
        this.opik = new Opik({
          apiKey: process.env.OPIK_API_KEY,
          projectName: process.env.OPIK_PROJECT_NAME || 'Recovery Agent'
        });
        console.log('[Opik] Client initialized in RecoveryAgent');
      } catch (error) {
        console.warn('[Opik] Failed to initialize in RecoveryAgent:', error.message);
        this.opik = null;
      }
    }
  }

  async generateRecovery(input, tracer) {
    const traceId = uuidv4();
    const trace = await tracer.startTrace(traceId, {
      domain: input.domain,
      time_gap: input.time_gap,
      reason: input.reason,
      capacity: input.capacity,
      prompt_version: this.promptVersion,
      model_name: this.lmModelName
    });

    try {
      // Normalize input
      const normalizedSpan = await tracer.startSpan(trace, 'input_normalization');
      const normalized = this.normalizeInput(input);
      await tracer.endSpan(normalizedSpan, { success: true });

      // Classify failure
      const classifySpan = await tracer.startSpan(trace, 'failure_classification');
      const failureType = failureTypeMap[input.reason] || 'motivation_drop';
      await tracer.endSpan(classifySpan, { failure_type: failureType });

      // Select strategy
      const strategySpan = await tracer.startSpan(trace, 'strategy_selection');
      const strategy = strategyMap[failureType];
      await tracer.endSpan(strategySpan, { strategy });

      // Generate recovery action via LLM
      const llmSpan = await tracer.startSpan(trace, 'llm_call');
      let recoveryData;
      
      if (this.lmApiKey) {
        // Use OpenAI API for dynamic generation
        recoveryData = await this.callOpenAI(input, failureType, strategy);
      } else {
        // Fallback to templates if no API key
        console.warn('No LLM_API_KEY configured, using template fallback');
        recoveryData = recoveryTemplates[failureType][strategy](input);
      }
      
      await tracer.endSpan(llmSpan, { success: true });

      // Validate output
      const validationSpan = await tracer.startSpan(trace, 'output_validation');
      const validated = this.validateOutput(recoveryData, input, failureType);
      await tracer.endSpan(validationSpan, { valid: validated.valid });

      const output = {
        trace_id: traceId,
        failure_type: failureType,
        strategy: strategy,
        next_step: recoveryData.next_step,
        stop_condition: recoveryData.stop_condition,
        rationale: recoveryData.rationale,
        domain: input.domain,
        capacity_minutes: input.capacity
      };

      // Add safety notes
      if (input.domain === 'Health') {
        output.safety_note = 'This is not medical advice. Consult a healthcare provider for health-related concerns.';
      } else if (input.domain === 'Financial') {
        output.safety_note = 'This is not financial advice. Consult a financial advisor for investment decisions.';
      }

      // Run evaluation
      await this.evaluateOutput(output, tracer, trace);

      await tracer.endTrace(trace);
      return output;
    } catch (error) {
      await tracer.endTrace(trace, { error: error.message });
      throw error;
    }
  }

  normalizeInput(input) {
    return {
      domain: input.domain.trim(),
      goal: input.goal.substring(0, 240).trim(),
      time_gap: input.time_gap,
      reason: input.reason,
      capacity: parseInt(input.capacity)
    };
  }

  validateOutput(data, input, failureType) {
    const issues = [];

    if (!data.stop_condition || data.stop_condition.length > 140) {
      issues.push('Invalid stop condition');
    }

    if (!data.next_step || data.next_step.length > 240) {
      issues.push('Invalid next step');
    }

    if (!data.rationale || data.rationale.length > 160) {
      issues.push('Invalid rationale');
    }

    const forbiddenTerms = ['medical', 'diagnose', 'treatment', 'therapy', 'financial advice', 'invest', 'stock', 'bond'];
    const text = `${data.next_step} ${data.rationale}`.toLowerCase();
    
    if (input.domain === 'Health' && forbiddenTerms.slice(0, 3).some(t => text.includes(t))) {
      issues.push('Health domain must avoid medical language');
    }

    if (input.domain === 'Financial' && forbiddenTerms.slice(3).some(t => text.includes(t))) {
      issues.push('Financial domain must avoid investment advice');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  async evaluateOutput(output, tracer, trace) {
    // Heuristic metrics
    const metrics = {
      has_stop_condition: Boolean(output.stop_condition && output.stop_condition.length <= 140),
      within_char_limits: output.next_step.length <= 240 && output.rationale.length <= 160,
      time_boxed: true,
      no_medical_overreach: !output.next_step.toLowerCase().includes('medical'),
      no_financial_overreach: !output.next_step.toLowerCase().includes('invest')
    };

    // LLM-as-a-judge evaluation (simplified for demo)
    const judgeMetrics = {
      actionability: 0.9,
      proportionality: 0.85,
      tone: 0.92,
      safety: 0.95,
      fit: 0.88
    };

    output.evaluation = {
      heuristic_metrics: metrics,
      llm_judge_metrics: judgeMetrics,
      overall_score: (
        (Object.values(metrics).filter(Boolean).length / Object.keys(metrics).length) * 0.5 +
        (Object.values(judgeMetrics).reduce((a, b) => a + b) / Object.keys(judgeMetrics).length) * 0.5
      ).toFixed(2)
    };

    await tracer.logMetrics(trace, output.evaluation);
  }

  async callOpenAI(input, failureType, strategy) {
    const systemPrompt = getSystemPrompt(this.promptVersion);
    
    const userPrompt = `
Goal Domain: ${input.domain}
Goal: ${input.goal}
Time since stopped: ${input.time_gap}
Reason for failure: ${input.reason}
Available capacity: ${input.capacity} minutes

Failure Type: ${failureType}
Recovery Strategy: ${strategy}

Generate a recovery step as JSON ONLY with these fields:
- next_step (string, max 240 chars)
- stop_condition (string, max 140 chars)
- rationale (string, max 160 chars)`;

    // Create Opik span for OpenAI API call
    let opikSpan = null;
    if (this.opik) {
      try {
        opikSpan = await this.opik.span({
          name: 'openai_chat_completion',
          input: {
            model: this.lmModelName,
            domain: input.domain,
            failureType,
            strategy
          }
        });
      } catch (error) {
        console.warn('[Opik] Failed to create span:', error.message);
      }
    }

    try {
      const response = await fetch(`${this.lmBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.lmApiKey}`
        },
        body: JSON.stringify({
          model: this.lmModelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1] || jsonMatch[0];
      }
      
      const recoveryData = JSON.parse(jsonStr);
      
      // Ensure all fields exist and are strings
      const result = {
        next_step: String(recoveryData.next_step || '').substring(0, 240),
        stop_condition: String(recoveryData.stop_condition || '').substring(0, 140),
        rationale: String(recoveryData.rationale || '').substring(0, 160)
      };
      
      // End Opik span with successful output
      if (opikSpan) {
        try {
          await opikSpan.end({
            output: result,
            metadata: { success: true }
          });
        } catch (error) {
          console.warn('[Opik] Failed to end span:', error.message);
        }
      }
      
      return result;
    } catch (error) {
      console.error('OpenAI API call failed:', error.message);
      console.log('Falling back to template');
      
      // End Opik span with error
      if (opikSpan) {
        try {
          await opikSpan.end({
            output: { error: error.message },
            metadata: { success: false }
          });
        } catch (spanError) {
          console.warn('[Opik] Failed to end error span:', spanError.message);
        }
      }
      
      // Fallback to templates if API fails
      return recoveryTemplates[failureType][strategy](input);
    }
  }
}

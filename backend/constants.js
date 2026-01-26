// Constants and validation utilities for Recovery Agent

export const DOMAINS = ["Work", "Learning", "Health", "Financial"];

export const TIME_GAPS = ["1-2 days", "3-7 days", "1-4 weeks", "1+ months"];

export const REASONS = [
  "Low energy / burnout",
  "Overwhelmed",
  "Life event / schedule change",
  "Lost interest",
  "Too hard / unclear next step",
  "Other",
];

export const CAPACITIES = [2, 5, 10, 15];

export const FAILURE_TYPES = [
  "burnout",
  "overreach",
  "context_disruption",
  "avoidance",
  "unclear_next_step",
  "motivation_drop",
];

export const STRATEGIES = [
  "maintenance_mode",
  "reduce_scope_80",
  "pause_with_trigger",
  "restart_small",
  "unblock_first",
  "swap_format",
];

export const FEEDBACK_TYPES = [
  "helpful",
  "too_much",
  "doesnt_fit",
  "did_it",
  "started",
];

export const validateInput = (input) => {
  const errors = [];

  if (!input.domain || !DOMAINS.includes(input.domain)) {
    errors.push("Invalid domain");
  }

  if (
    !input.goal ||
    typeof input.goal !== "string" ||
    input.goal.length === 0 ||
    input.goal.length > 240
  ) {
    errors.push("Goal must be between 1 and 240 characters");
  }

  if (!input.time_gap || !TIME_GAPS.includes(input.time_gap)) {
    errors.push("Invalid time gap");
  }

  if (!input.reason || !REASONS.includes(input.reason)) {
    errors.push("Invalid reason");
  }

  if (
    input.capacity === undefined ||
    !CAPACITIES.includes(parseInt(input.capacity))
  ) {
    errors.push("Invalid capacity");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateOutput = (output, domain) => {
  const errors = [];

  if (!output.next_step || output.next_step.length > 240) {
    errors.push("Next step must be ≤240 characters");
  }

  if (!output.stop_condition || output.stop_condition.length > 140) {
    errors.push("Stop condition must be ≤140 characters");
  }

  if (!output.rationale || output.rationale.length > 160) {
    errors.push("Rationale must be ≤160 characters");
  }

  if (!FAILURE_TYPES.includes(output.failure_type)) {
    errors.push("Invalid failure type");
  }

  if (!STRATEGIES.includes(output.strategy)) {
    errors.push("Invalid strategy");
  }

  // Safety checks
  const prohibitedTerms = {
    health: ["diagnose", "treatment", "therapy", "prescribe", "medication"],
    financial: ["invest", "stock", "bond", "crypto", "trading"],
  };

  const text = `${output.next_step} ${output.rationale}`.toLowerCase();

  if (domain === "Health") {
    for (const term of prohibitedTerms.health) {
      if (text.includes(term)) {
        errors.push(`Health domain cannot use term: "${term}"`);
      }
    }
  }

  if (domain === "Financial") {
    for (const term of prohibitedTerms.financial) {
      if (text.includes(term)) {
        errors.push(`Financial domain cannot use term: "${term}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

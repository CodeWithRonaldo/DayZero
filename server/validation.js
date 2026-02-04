/**
 * Validation utilities for recovery output
 */

// Character limits
const CHAR_LIMITS = {
  next_step: 240,
  stop_condition: 140,
  rationale: 160,
};

// Safety disclaimers for specific domains
const SAFETY_DISCLAIMERS = {
  Health:
    "This is not medical advice. Consult a healthcare provider for medical concerns.",
  Financial:
    "This is not financial advice. Consult a financial advisor for investment decisions.",
};

/**
 * Validate the AI-generated output
 * @param {Object} data - The parsed response from Gemini
 * @returns {Object} Validation result with metrics
 */
export function validateOutput(data) {
  const errors = [];
  const metrics = {
    has_required_fields: true,
    within_char_limits: true,
    has_stop_condition: true,
    field_checks: {},
  };

  // Check required fields
  const requiredFields = ["next_step", "stop_condition", "rationale"];
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim().length === 0) {
      errors.push(`Missing required field: ${field}`);
      metrics.has_required_fields = false;
    }
  }

  // Check character limits
  for (const [field, limit] of Object.entries(CHAR_LIMITS)) {
    if (data[field]) {
      const length = data[field].length;
      const withinLimit = length <= limit;
      metrics.field_checks[field] = {
        length,
        limit,
        valid: withinLimit,
      };

      if (!withinLimit) {
        errors.push(
          `Field '${field}' exceeds character limit (${length}/${limit})`,
        );
        metrics.within_char_limits = false;
      }
    }
  }

  // Check if stop_condition exists and is meaningful
  if (
    !data.stop_condition ||
    data.stop_condition.trim().length < 5 ||
    data.stop_condition.toLowerCase() === "none"
  ) {
    errors.push("Stop condition is missing or too vague");
    metrics.has_stop_condition = false;
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    metrics,
  };
}

/**
 * Add safety notes based on domain
 * @param {Object} data - The response data
 * @param {string} domain - The domain (Work, Learning, Health, Financial)
 */
export function addSafetyNote(data, domain) {
  if (SAFETY_DISCLAIMERS[domain]) {
    // Only override if not already set by the AI
    if (!data.safety_note) {
      data.safety_note = SAFETY_DISCLAIMERS[domain];
    } else {
      // Append to existing note if AI provided one
      data.safety_note += " " + SAFETY_DISCLAIMERS[domain];
    }
  }
}

/**
 * Sanitize output to ensure safe defaults
 * @param {Object} data - The response data
 * @returns {Object} Sanitized data
 */
export function sanitizeOutput(data) {
  return {
    failure_type: data.failure_type || "general",
    strategy: data.strategy || "recovery_step",
    next_step: data.next_step || "",
    stop_condition: data.stop_condition || "",
    rationale: data.rationale || "",
    safety_note: data.safety_note || null,
  };
}

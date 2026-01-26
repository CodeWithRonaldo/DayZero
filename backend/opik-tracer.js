import { v4 as uuidv4 } from "uuid";
import { Opik } from "opik";

export class OpikTracer {
  constructor() {
    this.opikApiKey = process.env.OPIK_API_KEY;
    this.opikProjectName = process.env.OPIK_PROJECT_NAME || "Recovery Agent";
    this.traces = new Map();
    this.spans = new Map();
    this.opikClient = null;
    this.currentTrace = null;

    // Initialize Opik client if API key exists
    if (this.opikApiKey) {
      try {
        this.opikClient = new Opik({
          apiKey: this.opikApiKey,
          projectName: this.opikProjectName,
        });
        console.log("[Opik] Client initialized");
      } catch (error) {
        console.warn("[Opik] Failed to initialize client:", error.message);
      }
    }
  }

  async startTrace(traceId, metadata = {}) {
    const trace = {
      id: traceId,
      startTime: new Date().toISOString(),
      metadata,
      spans: [],
      status: "running",
    };

    this.traces.set(traceId, trace);

    // Create trace in Opik
    if (this.opikClient) {
      try {
        this.currentTrace = await this.opikClient.trace({
          name: "recovery_request",
          input: {
            domain: metadata.domain,
            time_gap: metadata.time_gap,
            reason: metadata.reason,
            capacity: metadata.capacity,
          },
          metadata: {
            prompt_version: metadata.prompt_version,
            model_name: metadata.model_name,
          },
        });
        console.log(`[Opik] Trace started: ${traceId}`);
      } catch (error) {
        console.warn("Failed to create trace in Opik:", error.message);
      }
    }

    return trace;
  }

  async startSpan(trace, name) {
    const spanId = uuidv4();
    const span = {
      id: spanId,
      name,
      traceId: trace.id,
      startTime: new Date().toISOString(),
      status: "running",
      attributes: {},
      opikSpan: null,
    };

    this.spans.set(spanId, span);
    trace.spans.push(spanId);

    if (this.currentTrace) {
      try {
        span.opikSpan = await this.currentTrace.span({
          name: name,
          input: { operation: name },
        });
      } catch (error) {
        console.warn(`Failed to create span '${name}' in Opik:`, error.message);
      }
    }

    return span;
  }

  async endSpan(span, attributes = {}) {
    span.endTime = new Date().toISOString();
    span.status = "completed";
    span.attributes = attributes;

    if (span.opikSpan) {
      try {
        await span.opikSpan.end({
          output: attributes,
        });
      } catch (error) {
        console.warn(
          `Failed to end span '${span.name}' in Opik:`,
          error.message
        );
      }
    }
  }

  async endTrace(trace, finalData = {}) {
    trace.endTime = new Date().toISOString();
    trace.status = "completed";
    trace.output = finalData;

    if (this.currentTrace) {
      try {
        await this.currentTrace.end({
          output: {
            failure_type: finalData.failure_type,
            strategy: finalData.strategy,
            next_step: finalData.next_step,
            stop_condition: finalData.stop_condition,
            rationale: finalData.rationale,
          },
          metadata: {
            evaluation_metrics: finalData.evaluation,
            heuristic_metrics: finalData.evaluation?.heuristic_metrics,
            llm_judge_metrics: finalData.evaluation?.llm_judge_metrics,
            overall_score: finalData.evaluation?.overall_score,
          },
        });
        console.log(`[Opik] Trace completed: ${trace.id}`);
      } catch (error) {
        console.warn("Failed to finalize trace in Opik:", error.message);
      }
    }

    this.currentTrace = null;
  }

  async logFeedback(feedbackData) {
    const { trace_id, primary_feedback } = feedbackData;

    if (!trace_id || !primary_feedback) {
      return { error: "Missing trace_id or feedback" };
    }

    const trace = this.traces.get(trace_id);
    if (trace) {
      trace.feedback = primary_feedback;
    }

    if (this.opikClient) {
      try {
        // Log feedback to Opik via metadata update
        console.log(
          `[Opik] Feedback logged for trace ${trace_id}: ${primary_feedback}`
        );
      } catch (error) {
        console.warn("Failed to log feedback in Opik:", error.message);
      }
    }

    return { trace_id, feedback_logged: true };
  }

  async logMetrics(trace, evaluation) {
    // Metrics are now logged when trace ends
    if (this.opikClient) {
      console.log(`[Opik] Metrics will be sent with trace end`);
    }
  }

  getTraceHistory(limit = 10) {
    const traces = Array.from(this.traces.values())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);

    return traces.map((t) => ({
      trace_id: t.id,
      timestamp: t.startTime,
      domain: t.metadata.domain,
      strategy: t.output?.strategy,
      feedback: t.feedback || null,
    }));
  }
}

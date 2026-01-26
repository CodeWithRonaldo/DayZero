import http from "http";
import url from "url";
import { config } from "dotenv";
import { RecoveryAgent } from "./recovery-agent.js";
import { OpikTracer } from "./opik-tracer.js";
import { Opik } from "opik";

config();

const PORT = process.env.PORT || 3001;
const agent = new RecoveryAgent();
const tracer = new OpikTracer();

// Initialize Opik client for route-level tracing
let opik = null;
if (process.env.OPIK_API_KEY) {
  try {
    opik = new Opik({
      apiKey: process.env.OPIK_API_KEY,
      projectName: process.env.OPIK_PROJECT_NAME || "Recovery Agent",
    });
    console.log("[Opik] Client initialized in server");
  } catch (error) {
    console.warn("[Opik] Failed to initialize in server:", error.message);
  }
}

const parseBody = async (req) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    if (pathname === "/recovery" && req.method === "POST") {
      const body = await parseBody(req);
      console.log("[Request] POST /recovery received:", {
        domain: body.domain,
        capacity: body.capacity,
      });

      // Validate input
      const validation = validateRecoveryInput(body);
      if (!validation.valid) {
        console.warn("[Request] Validation failed:", validation.error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: validation.error }));
        return;
      }
      console.log("[Request] Validation passed");

      // Create Opik trace for this request
      let opikTrace = null;
      if (opik) {
        try {
          console.log("[Opik] Creating trace for recovery request...");
          opikTrace = await opik.trace({
            name: "recovery_request",
            input: {
              domain: body.domain,
              capacity: body.capacity,
              reason: body.reason,
            },
          });
          console.log(
            "[Opik] Trace created successfully:",
            opikTrace.id || "trace-object"
          );
        } catch (error) {
          console.warn(
            "[Opik] Failed to create trace:",
            error.message,
            error.stack
          );
        }
      } else {
        console.log("[Opik] Opik client not initialized");
      }

      try {
        // Create trace and get recovery
        const result = await agent.generateRecovery(body, tracer);

        // End Opik trace with result
        if (opikTrace) {
          try {
            await opikTrace.end({
              output: {
                failure_type: result.failure_type,
                strategy: result.strategy,
                domain: result.domain,
              },
              metadata: { success: true },
            });
          } catch (error) {
            console.warn("[Opik] Failed to end trace:", error.message);
          }
        }

        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        // End Opik trace with error
        if (opikTrace) {
          try {
            await opikTrace.end({
              output: { error: error.message },
              metadata: { success: false },
            });
          } catch (traceError) {
            console.warn(
              "[Opik] Failed to end error trace:",
              traceError.message
            );
          }
        }
        throw error;
      }
    } else if (pathname === "/feedback" && req.method === "POST") {
      const body = await parseBody(req);

      // Log feedback to Opik
      const result = await tracer.logFeedback(body);

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

const validateRecoveryInput = (input) => {
  if (
    !input.domain ||
    !["Work", "Learning", "Health", "Financial"].includes(input.domain)
  ) {
    return { valid: false, error: "Invalid domain" };
  }
  if (
    !input.goal ||
    typeof input.goal !== "string" ||
    input.goal.length > 240
  ) {
    return { valid: false, error: "Invalid goal" };
  }
  if (
    !input.time_gap ||
    !["1-2 days", "3-7 days", "1-4 weeks", "1+ months"].includes(input.time_gap)
  ) {
    return { valid: false, error: "Invalid time gap" };
  }
  if (!input.reason) {
    return { valid: false, error: "Invalid reason" };
  }
  if (!input.capacity || ![2, 5, 10, 15].includes(parseInt(input.capacity))) {
    return { valid: false, error: "Invalid capacity" };
  }
  return { valid: true };
};

server.listen(PORT, () => {
  console.log(`Recovery Agent backend running on port ${PORT}`);
});

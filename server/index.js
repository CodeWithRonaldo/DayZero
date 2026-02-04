import express from "express";
import { GoogleGenAI } from "@google/genai";
import { trackGemini } from "opik-gemini";
import { Opik } from "opik";
import { getPrompt } from "./prompts.js";
import { validateOutput, addSafetyNote } from "./validation.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Opik client for feedback logging
const opikClient = new Opik();

const app = express();
app.use(express.json());

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Initialize the original Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Wrap the client with Opik tracking
const trackedGenAI = trackGemini(genAI);

// API endpoint for generating recovery steps
app.post("/api/generate", async (req, res) => {
  try {
    const { domain, goal, time_gap, reason, capacity } = req.body;

    // Get prompt template based on version from .env
    const promptVersion = process.env.PROMPT_VERSION || "v1";
    const promptTemplate = getPrompt(promptVersion);
    const prompt = promptTemplate
      .replace("{goal}", goal)
      .replace("{domain}", domain)
      .replace("{time_gap}", time_gap)
      .replace("{reason}", reason)
      .replace(/{capacity}/g, capacity); // Replace all occurrences

    const completion = await trackedGenAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    await trackedGenAI.flush();

    let parsedData;
    let responseText = completion.text.trim();

    console.log("[API] Raw response:", responseText.substring(0, 200));

    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      responseText = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        responseText = jsonObjectMatch[0];
      }
    }

    try {
      parsedData = JSON.parse(responseText);
      console.log(
        "[API] Successfully parsed response:",
        JSON.stringify(parsedData).substring(0, 100),
      );
    } catch (parseError) {
      console.error(
        "[API] JSON parse error. Trying to extract from markdown...",
      );
      // Fallback: extract sections from markdown response
      parsedData = extractSectionsFromMarkdown(responseText);
      console.log("[API] Extracted from markdown:", Object.keys(parsedData));
    }

    // Validate output
    const validation = validateOutput(parsedData);
    if (!validation.valid) {
      console.warn("[API] Validation issues:", validation.errors);
    }

    // Add safety notes for Health/Financial domains
    addSafetyNote(parsedData, domain);

    res.json({
      success: true,
      data: {
        domain,
        failure_type: parsedData.failure_type || "general",
        strategy: parsedData.strategy || "recovery",
        next_step: parsedData.next_step,
        stop_condition: parsedData.stop_condition,
        rationale: parsedData.rationale,
        safety_note: parsedData.safety_note,
        capacity_minutes: parseInt(capacity),
        trace_id: null, // Will be populated by Opik tracking
        evaluation: {
          heuristic_metrics: validation.metrics,
          validated: validation.valid,
        },
      },
    });
  } catch (error) {
    console.error("[API] Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
// Helper function to extract structured data from markdown response
function extractSectionsFromMarkdown(text) {
  const result = {
    next_step: "",
    stop_condition: "",
    rationale: "",
    strategy: "Recovery Plan",
    safety_note: null,
  };

  // Extract section headers and their content
  const nextStepMatch = text.match(
    /(?:next\s+step|action)[:\s]*([^\n#]*?)(?=\n|$)/i,
  );
  if (nextStepMatch) {
    result.next_step = nextStepMatch[1].trim().substring(0, 200);
  }

  const stopMatch = text.match(
    /(?:when\s+to\s+stop|stop\s+condition)[:\s]*([^\n#]*?)(?=\n|$)/i,
  );
  if (stopMatch) {
    result.stop_condition = stopMatch[1].trim().substring(0, 200);
  }

  const rationaleMatch = text.match(
    /(?:why\s+this\s+works|rationale)[:\s]*([^\n#]*?)(?=\n|$)/i,
  );
  if (rationaleMatch) {
    result.rationale = rationaleMatch[1].trim().substring(0, 200);
  }

  const strategyMatch = text.match(
    /(?:strategy|approach)[:\s]*([^\n]*?)(?=\n|$)/i,
  );
  if (strategyMatch) {
    result.strategy = strategyMatch[1].trim().substring(0, 30);
  }

  // If extraction failed, use first few sentences
  if (!result.next_step || result.next_step.length < 10) {
    const sentences = text.split(/[.!?]+/).slice(0, 3);
    result.next_step = sentences.join(". ").substring(0, 300);
  }

  return result;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

app.post("/feedback", async (req, res) => {
  const { trace_id, primary_feedback } = req.body;

  console.log("[FEEDBACK]", { trace_id, primary_feedback });

  // Log feedback to Opik (if trace_id exists)
  let feedbackLogged = false;
  if (trace_id) {
    try {
      // Map feedback types to numeric scores
      const feedbackScoreMap = {
        helpful: 1.0,
        did_it: 1.0,
        too_much: 0.5,
        doesnt_fit: 0.3,
      };

      const score = feedbackScoreMap[primary_feedback] || 0.5;

      // Log feedback score to Opik using the SDK
      await opikClient.logTracesFeedbackScores([
        {
          id: trace_id,
          name: "user_feedback",
          value: score,
          reason: primary_feedback,
        },
      ]);

      feedbackLogged = true;
      console.log("[FEEDBACK] Successfully logged to Opik");
    } catch (error) {
      console.error("[FEEDBACK] Error logging to Opik:", error);
      // Don't fail the request if Opik logging fails
    }
  }

  res.json({ success: true, feedback_logged: feedbackLogged });
});

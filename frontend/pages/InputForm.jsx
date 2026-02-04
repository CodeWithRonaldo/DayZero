import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackingService } from "../trackingService.js";
import styles from "./InputForm.module.css";

function InputForm({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    domain: "Work",
    goal: "",
    time_gap: "1-2 days",
    reason: "Low energy / burnout",
    capacity: "30",
  });

  const domains = ["Work", "Learning", "Health", "Financial"];
  const timeGaps = ["< 1 day", "1-2 days", "1-2 weeks", "> 1 month"];
  const reasons = [
    "Low energy / burnout",
    "Lost interest",
    "External obstacles",
    "Lack of progress",
    "Other",
  ];
  const capacities = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
    { value: "180", label: "3+ hours" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.goal.trim()) {
      setError("Please describe your goal");
      setLoading(false);
      return;
    }

    // Generate session ID for this recovery attempt
    const sessionId = trackingService.generateId();

    // Track input submission
    trackingService.trackInputSubmitted(sessionId, form);

    try {
      const payload = {
        ...form,
        capacity: parseInt(form.capacity),
      };
      console.log("[InputForm] Sending recovery request:", payload);

      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[InputForm] Server error:", errorData);
        setError(errorData.error || "Failed to get recovery step");
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log("[InputForm] Recovery step received:", result.data);

      // Track recovery generation
      trackingService.trackRecoveryGenerated(
        sessionId,
        result.data,
        result.data.trace_id,
      );

      // Store session ID for feedback tracking
      const recoveryWithSession = { ...result.data, sessionId };
      sessionStorage.setItem(
        "lastRecovery",
        JSON.stringify(recoveryWithSession),
      );
      navigate("/recovery", { state: recoveryWithSession });
    } catch (err) {
      console.error("[InputForm] Network error:", err);
      setError(err.message || "Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Find Your Recovery Step</h1>
          <p className={styles.subtitle}>
            Answer a few questions so we can suggest personalized next steps
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>What area of life?</label>
            <div className={styles.selectGrid}>
              {domains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() =>
                    handleChange({ target: { name: "domain", value: domain } })
                  }
                  className={styles.selectOption}
                  style={{
                    backgroundColor:
                      form.domain === domain ? "#3b82f6" : "#f3f4f6",
                    color: form.domain === domain ? "#ffffff" : "#374151",
                  }}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Describe your goal</label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="E.g., 'Exercise 3 times per week' or 'Drink 8 glasses of water daily'"
              maxLength={240}
              className={styles.textarea}
              required
            />
            <div className={styles.counter}>
              {form.goal.length} / 240 characters
            </div>
          </div>

          <div className={styles.gridTwoCols}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                How long since you stopped?
              </label>
              <select
                name="time_gap"
                value={form.time_gap}
                onChange={handleChange}
                className={styles.select}
              >
                {timeGaps.map((gap) => (
                  <option key={gap} value={gap}>
                    {gap}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>How much time do you have?</label>
              <select
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className={styles.select}
              >
                {capacities.map((cap) => (
                  <option key={cap.value} value={cap.value}>
                    {cap.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>What happened?</label>
            <div className={styles.selectGrid}>
              {reasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() =>
                    handleChange({ target: { name: "reason", value: reason } })
                  }
                  className={styles.selectOption}
                  style={{
                    backgroundColor:
                      form.reason === reason ? "#3b82f6" : "#f3f4f6",
                    color: form.reason === reason ? "#ffffff" : "#374151",
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading || !form.goal.trim()}
            className={styles.submitButton}
            style={{
              opacity: loading || !form.goal.trim() ? 0.6 : 1,
              cursor: loading || !form.goal.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Finding your step..." : "Get Recovery Step"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={styles.cancelButton}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RecoveryOutput({ onAddHistory }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    // Get recovery data from session storage or route state
    const sessionData = sessionStorage.getItem("lastRecovery");
    const routeState = location.state;

    const data = routeState || (sessionData ? JSON.parse(sessionData) : null);

    if (data) {
      setRecovery(data);
      // Add to history
      onAddHistory({
        date: new Date().toISOString(),
        domain: data.domain,
        strategy: data.strategy,
        feedback: null,
        trace_id: data.trace_id,
      });
    } else {
      navigate("/form");
    }
  }, [location.state, navigate, onAddHistory]);

  const handleFeedback = async (feedback) => {
    if (!recovery) return;

    try {
      const response = await fetch("http://localhost:3002/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace_id: recovery.trace_id,
          primary_feedback: feedback,
        }),
      });

      if (response.ok) {
        setFeedbackSent(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      alert("Error sending feedback: " + error.message);
    }
  };

  if (!recovery) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Your Recovery Step</h2>
          <div style={styles.metadata}>
            <span style={styles.badge}>{recovery.failure_type}</span>
            <span style={styles.badge}>{recovery.strategy}</span>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Next Step</h3>
            <p style={styles.text}>{recovery.next_step}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Stop Condition</h3>
            <p style={styles.text}>{recovery.stop_condition}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Why This Works</h3>
            <p style={styles.text}>{recovery.rationale}</p>
          </div>

          {recovery.safety_note && (
            <div style={styles.warning}>
              <p style={styles.warningText}>⚠️ {recovery.safety_note}</p>
            </div>
          )}

          {recovery.capacity_minutes && (
            <div style={styles.info}>
              <p>
                You said you have{" "}
                <strong>{recovery.capacity_minutes} minutes</strong>. This fits.
              </p>
            </div>
          )}
        </div>

        <div style={styles.feedbackSection}>
          <p style={styles.feedbackLabel}>Was this helpful?</p>
          <div style={styles.feedbackButtons}>
            <button
              onClick={() => handleFeedback("helpful")}
              style={{ ...styles.feedbackBtn, backgroundColor: "#10b981" }}
              disabled={feedbackSent}
            >
              Helpful
            </button>
            <button
              onClick={() => handleFeedback("too_much")}
              style={{ ...styles.feedbackBtn, backgroundColor: "#f59e0b" }}
              disabled={feedbackSent}
            >
              Too much
            </button>
            <button
              onClick={() => handleFeedback("doesnt_fit")}
              style={{ ...styles.feedbackBtn, backgroundColor: "#ef4444" }}
              disabled={feedbackSent}
            >
              Doesn't fit
            </button>
            <button
              onClick={() => handleFeedback("did_it")}
              style={{ ...styles.feedbackBtn, backgroundColor: "#8b5cf6" }}
              disabled={feedbackSent}
            >
              I did it
            </button>
            <button
              onClick={() => handleFeedback("started")}
              style={{ ...styles.feedbackBtn, backgroundColor: "#06b6d4" }}
              disabled={feedbackSent}
            >
              I started
            </button>
          </div>
          {feedbackSent && (
            <p style={styles.successMsg}>✓ Thank you! Redirecting...</p>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          style={styles.backBtn}
          disabled={feedbackSent}
        >
          ← Back home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#6b7280",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    width: "100%",
  },
  header: {
    marginBottom: "28px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "#1f2937",
    marginBottom: "12px",
  },
  metadata: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  content: {
    marginBottom: "28px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "12px",
    borderRadius: "6px",
    borderLeft: "4px solid #2563eb",
  },
  warning: {
    backgroundColor: "#fef3c7",
    border: "1px solid #fbbf24",
    borderRadius: "6px",
    padding: "12px",
    marginTop: "12px",
  },
  warningText: {
    fontSize: "0.9rem",
    color: "#92400e",
    margin: 0,
  },
  info: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "6px",
    padding: "12px",
    marginTop: "12px",
    fontSize: "0.95rem",
    color: "#0c4a6e",
  },
  feedbackSection: {
    borderTop: "2px solid #e5e7eb",
    paddingTop: "20px",
    marginBottom: "20px",
  },
  feedbackLabel: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
  },
  feedbackButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "8px",
    marginBottom: "12px",
  },
  feedbackBtn: {
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  successMsg: {
    color: "#059669",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  backBtn: {
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
  },
};

export default RecoveryOutput;

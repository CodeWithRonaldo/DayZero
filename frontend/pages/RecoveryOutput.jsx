import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThumbsUp, AlertCircle, CheckCircle, Star, Home } from "lucide-react";
import { trackingService } from "../trackingService.js";
import styles from "./RecoveryOutput.module.css";

function RecoveryOutput({ onAddHistory }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("lastRecovery");
    const routeState = location.state;
    const data = routeState || (sessionData ? JSON.parse(sessionData) : null);

    if (data) {
      setRecovery(data);
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
      // Send feedback to backend
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace_id: recovery.trace_id,
          primary_feedback: feedback,
        }),
      });

      // Track feedback submission
      trackingService.trackFeedbackSubmitted(
        recovery.sessionId,
        recovery.trace_id,
        feedback,
      );

      if (response.ok) {
        setFeedbackSent(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      alert("Error sending feedback: " + error.message);
    }
  };

  if (!recovery) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Recovery Step</h1>
          <p className={styles.subtitle}>Here's what we recommend you try</p>
        </div>

        <div className={styles.card}>
          <div className={styles.badges}>
            <span className={styles.badge}>{recovery.domain}</span>
            <span className={styles.badge}>{recovery.strategy}</span>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Next Step</h3>
            <p className={styles.stepText}>{recovery.next_step}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>When to Stop</h3>
            <p className={styles.descriptionText}>{recovery.stop_condition}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Why This Works</h3>
            <p className={styles.descriptionText}>{recovery.rationale}</p>
          </div>

          {recovery.safety_note && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠️</span>
              <p className={styles.warningText}>{recovery.safety_note}</p>
            </div>
          )}

          {recovery.capacity_minutes && (
            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>✓</span>
              <p className={styles.infoText}>
                This fits within your {recovery.capacity_minutes}-minute window
              </p>
            </div>
          )}
        </div>

        <div className={styles.feedbackSection}>
          <p className={styles.feedbackLabel}>How does this feel?</p>
          <div className={styles.feedbackGrid}>
            <FeedbackButton
              label="Helpful"
              icon={ThumbsUp}
              onClick={() => handleFeedback("helpful")}
              disabled={feedbackSent}
            />
            <FeedbackButton
              label="Too Much"
              icon={AlertCircle}
              onClick={() => handleFeedback("too_much")}
              disabled={feedbackSent}
            />
            <FeedbackButton
              label="Doesn't Fit"
              icon={CheckCircle}
              onClick={() => handleFeedback("doesnt_fit")}
              disabled={feedbackSent}
            />
            <FeedbackButton
              label="I Did It!"
              icon={Star}
              onClick={() => handleFeedback("did_it")}
              disabled={feedbackSent}
            />
          </div>

          {feedbackSent && (
            <div className={styles.successMessage}>
              <span>✓ Thanks for your feedback!</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className={styles.primaryButton}
          disabled={feedbackSent}
        >
          <Home size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function FeedbackButton({ label, icon: Icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.feedbackButton}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Icon size={24} />
      <span>{label}</span>
    </button>
  );
}

export default RecoveryOutput;

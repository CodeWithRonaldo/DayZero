import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { trackingService } from "../trackingService.js";
import styles from "./History.module.css";

function History({ entries }) {
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFeedbackConfig = (feedback) => {
    const configs = {
      helpful: { color: "#10b981", label: "✓ Helpful" },
      too_much: { color: "#f59e0b", label: "Too Much" },
      doesnt_fit: { color: "#ef4444", label: "Doesn't Fit" },
      did_it: { color: "#5b21b6", label: "✓ Did It" },
      started: { color: "#6b7280", label: "Started" },
    };
    return configs[feedback] || { color: "#9ca3af", label: feedback };
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Recovery History</h1>
            <p className={styles.subtitle}>
              {entries.length} recovery steps tracked
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.backButton}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {entries.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No history yet</h3>
            <p className={styles.emptyText}>
              Start creating recovery steps to see them appear here
            </p>
            <button
              onClick={() => navigate("/new")}
              className={styles.primaryButton}
            >
              Create Recovery Step
            </button>
          </div>
        ) : (
          <div className={styles.timeline}>
            {entries.map((entry, idx) => (
              <HistoryEntry
                key={idx}
                entry={entry}
                getFeedbackConfig={getFeedbackConfig}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryEntry({ entry, getFeedbackConfig, formatDate }) {
  const feedback = entry.feedback ? getFeedbackConfig(entry.feedback) : null;

  return (
    <div className={styles.entryCard}>
      <div className={styles.entryHeader}>
        <div className={styles.entryMeta}>
          <h3 className={styles.entryDomain}>{entry.domain}</h3>
          <p className={styles.entryDate}>{formatDate(entry.date)}</p>
        </div>
        {feedback && (
          <span
            className={styles.feedbackBadge}
            style={{
              backgroundColor: feedback.color + "15",
              color: feedback.color,
            }}
          >
            {feedback.label}
          </span>
        )}
      </div>
      <p className={styles.entryStrategy}>{entry.strategy}</p>
      <p className={styles.entryStep}>{entry.next_step}</p>
      {entry.trace_id && (
        <p className={styles.traceId}>
          ID: {entry.trace_id.substring(0, 8)}...
        </p>
      )}
    </div>
  );
}

export default History;

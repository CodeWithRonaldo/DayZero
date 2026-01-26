import { useNavigate } from "react-router-dom";

function History({ entries }) {
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getFeedbackColor = (feedback) => {
    const colors = {
      helpful: "#10b981",
      too_much: "#f59e0b",
      doesnt_fit: "#ef4444",
      did_it: "#8b5cf6",
      started: "#06b6d4",
    };
    return colors[feedback] || "#9ca3af";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Recovery History</h2>

        {entries.length === 0 ? (
          <p style={styles.empty}>No recovery attempts yet. Get started!</p>
        ) : (
          <div style={styles.list}>
            {entries.map((entry, idx) => (
              <div key={idx} style={styles.entry}>
                <div style={styles.entryHeader}>
                  <div style={styles.entryInfo}>
                    <span style={styles.domain}>{entry.domain}</span>
                    <span style={styles.date}>{formatDate(entry.date)}</span>
                  </div>
                  {entry.feedback && (
                    <span
                      style={{
                        ...styles.feedback,
                        backgroundColor: getFeedbackColor(entry.feedback),
                      }}
                    >
                      {entry.feedback.replace("_", " ")}
                    </span>
                  )}
                </div>
                <p style={styles.strategy}>Strategy: {entry.strategy}</p>
                {entry.trace_id && (
                  <small style={styles.traceId}>
                    Trace: {entry.trace_id.substring(0, 8)}...
                  </small>
                )}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate("/")} style={styles.backBtn}>
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
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "24px",
    color: "#1f2937",
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "40px 0",
    fontSize: "1rem",
  },
  list: {
    marginBottom: "24px",
  },
  entry: {
    borderLeft: "4px solid #2563eb",
    backgroundColor: "#f9fafb",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "6px",
  },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  entryInfo: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  domain: {
    fontWeight: "600",
    color: "#1f2937",
  },
  date: {
    fontSize: "0.85rem",
    color: "#9ca3af",
  },
  feedback: {
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  strategy: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: "4px 0",
  },
  traceId: {
    color: "#9ca3af",
    fontSize: "0.75rem",
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

export default History;

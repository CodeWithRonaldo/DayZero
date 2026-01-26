import { useNavigate } from "react-router-dom";
// import "./App.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Recovery Agent</h1>
        <p style={styles.subtitle}>
          Get help restarting a goal after you've already fallen off.
        </p>
        <button
          style={{
            ...styles.button,
            backgroundColor: "#2563eb",
            color: "white",
          }}
          onClick={() => navigate("/form")}
        >
          Get a recovery step
        </button>
        <button
          style={{
            ...styles.button,
            backgroundColor: "#e5e7eb",
            color: "#1f2937",
          }}
          onClick={() => navigate("/history")}
        >
          View history
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
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "16px",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#6b7280",
    marginBottom: "32px",
    lineHeight: "1.6",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};

export default Landing;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InputForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    domain: "Work",
    goal: "",
    time_gap: "1-2 days",
    reason: "Low energy / burnout",
    capacity: "5",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity: parseInt(form.capacity),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Save to session storage and navigate
      sessionStorage.setItem("lastRecovery", JSON.stringify(data));
      navigate("/recovery", { state: data });
    } catch (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>What's holding you back?</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Goal Domain</label>
            <select
              name="domain"
              value={form.domain}
              onChange={handleChange}
              style={styles.input}
            >
              <option>Work / Productivity</option>
              <option>Learning</option>
              <option>Health / Wellness</option>
              <option>Financial</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>What goal did you fall off?</label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="E.g., 'Exercise 3x per week' or 'Read for 20 minutes daily'"
              maxLength={240}
              style={{ ...styles.input, minHeight: "80px" }}
              required
            />
            <small style={styles.counter}>{form.goal.length}/240</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>How long has it been?</label>
            <select
              name="time_gap"
              value={form.time_gap}
              onChange={handleChange}
              style={styles.input}
            >
              <option>1-2 days</option>
              <option>3-7 days</option>
              <option>1-4 weeks</option>
              <option>1+ months</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Why did it break?</label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              style={styles.input}
            >
              <option>Low energy / burnout</option>
              <option>Overwhelmed</option>
              <option>Life event / schedule change</option>
              <option>Lost interest</option>
              <option>Too hard / unclear next step</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              What capacity do you have right now?
            </label>
            <select
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !form.goal.trim()}
            style={{
              ...styles.submitBtn,
              opacity: loading || !form.goal.trim() ? 0.6 : 1,
              cursor: loading || !form.goal.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Finding your recovery step..." : "Get my recovery step"}
          </button>
        </form>

        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back
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
    maxWidth: "600px",
    width: "100%",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "28px",
    color: "#1f2937",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "0.95rem",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    fontFamily: "inherit",
  },
  counter: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    marginTop: "4px",
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    width: "100%",
    marginBottom: "12px",
  },
  backBtn: {
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};

export default InputForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  Check,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Zap,
} from "lucide-react";
import styles from "./Login.module.css";
import { supabase } from "../supabase";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let authResponse;

      if (isSignup) {
        authResponse = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: form.name,
            },
          },
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
      }

      if (authResponse.error) {
        setError(authResponse.error.message);
        setLoading(false);
        return;
      }

      const user = authResponse.data.user;
      const userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || form.name || "User",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        {/* Left side - Branding */}
        <div className={styles.branding}>
          <div className={styles.brandingContent}>
            <div className={styles.logo}>
              <BarChart3 size={48} className={styles.logoIcon} />
            </div>
            <h1 className={styles.brandTitle}>DayZero</h1>
            <p className={styles.brandSubtitle}>
              Get back on track, one actionable step at a time
            </p>
            <div className={styles.features}>
              <Feature icon={Zap} text="Personalized recovery steps" />
              <Feature icon={Check} text="Track your progress" />
              <Feature icon={BarChart3} text="Science-backed strategies" />
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className={styles.formSubtitle}>
                {isSignup
                  ? "Join DayZero to restart your goals"
                  : "Sign in to your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={styles.input}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {isSignup && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={styles.input}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <LogIn size={18} />
                {loading
                  ? "Loading..."
                  : isSignup
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const guestUser = {
                  id: "guest-" + Date.now(),
                  email: "guest@example.com",
                  name: "Guest User",
                };
                localStorage.setItem("user", JSON.stringify(guestUser));
                onLogin(guestUser);
                navigate("/dashboard");
              }}
              className={styles.guestButton}
            >
              <UserPlus size={18} />
              Continue as Guest
            </button>

            <div className={styles.footer}>
              <p className={styles.footerText}>
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                    setForm({ email: "", password: "", name: "" });
                  }}
                  className={styles.toggleLink}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className={styles.featureItem}>
      <Icon size={20} className={styles.featureIcon} />
      <span className={styles.featureText}>{text}</span>
    </div>
  );
}

export default Login;

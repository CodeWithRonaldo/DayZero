import { useNavigate } from "react-router-dom";
import { Target, TrendingUp, Clock, Zap } from "lucide-react";
import styles from "./Landing.module.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>AI-Powered Goal Recovery</div>

        <h1 className={styles.title}>
          Get Back on Track.<br />Stay There.
        </h1>

        <p className={styles.subtitle}>
          Personalized recovery steps powered by AI to help you restart abandoned goals
          and build lasting habits, one step at a time.
        </p>

        <div className={styles.ctaButtons}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate("/form")}
          >
            <Zap size={20} />
            Start Your Recovery
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/history")}
          >
            <TrendingUp size={20} />
            View History
          </button>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Target size={24} />
            </div>
            <h3 className={styles.featureTitle}>Personalized Steps</h3>
            <p className={styles.featureDescription}>
              Get tailored recovery actions based on why you stopped and how much time you have.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3 className={styles.featureTitle}>Time-Boxed Actions</h3>
            <p className={styles.featureDescription}>
              Clear, actionable steps that fit your schedule—no overwhelming commitments.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingUp size={24} />
            </div>
            <h3 className={styles.featureTitle}>Track Progress</h3>
            <p className={styles.featureDescription}>
              Monitor your recovery journey and see your success rate improve over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

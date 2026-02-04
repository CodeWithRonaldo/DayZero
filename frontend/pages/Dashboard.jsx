import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Calendar, Award, Plus, Target, Clock } from "lucide-react";
// import { trackingService } from "../trackingService.js";
import styles from "./Dashboard.module.css";
import { trackingService } from "../trackingService";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    successRate: 0,
  });
  const [recentRecoveries, setRecentRecoveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      const history = trackingService.getRecoveryHistory();
      setRecentRecoveries(history.slice(0, 5));
      const stats = trackingService.getStats();
      setStats(stats);
      setLoading(false);
    };

    loadStats();
  }, [user.id]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back, <strong>{user.name || user.email}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate("/new")}
          className={styles.primaryButton}
        >
          <Plus size={18} />
          New Recovery
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading your stats...</p>
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <StatCard
              icon={TrendingUp}
              label="Total Recoveries"
              value={stats.total || 0}
            />
            <StatCard
              icon={Calendar}
              label="This Week"
              value={stats.thisWeek || 0}
            />
            <StatCard
              icon={Award}
              label="Success Rate"
              value={`${stats.successRate || 0}%`}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.recentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Recoveries</h2>
                <button
                  onClick={() => navigate("/history")}
                  className={styles.viewAllButton}
                >
                  View All →
                </button>
              </div>

              {recentRecoveries.length === 0 ? (
                <div className={styles.emptyState}>
                  <Target size={48} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>No recoveries yet</h3>
                  <p className={styles.emptyText}>
                    Start your first recovery goal to see them here
                  </p>
                  <button
                    onClick={() => navigate("/new")}
                    className={styles.primaryButton}
                  >
                    Create First Recovery
                  </button>
                </div>
              ) : (
                <div className={styles.recoveryList}>
                  {recentRecoveries.map((recovery, idx) => (
                    <RecoveryCard
                      key={idx}
                      recovery={recovery}
                      onSelect={() => navigate("/history")}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className={styles.statCard}>
      <Icon size={32} className={styles.statIcon} />
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function RecoveryCard({ recovery, onSelect }) {
  return (
    <div className={styles.recoveryCard} onClick={onSelect}>
      <div className={styles.recoveryCardHeader}>
        <div>
          <h3 className={styles.recoveryDomain}>{recovery.domain || "Goal"}</h3>
          <p className={styles.recoveryTime}>
            {new Date(recovery.date).toLocaleDateString()}
          </p>
        </div>
        <span className={styles.recoveryStrategy}>
          {recovery.strategy || "Recovery"}
        </span>
      </div>
      <p className={styles.recoveryText}>{recovery.next_step}</p>
      <div className={styles.recoveryFooter}>
        <span
          className={styles.feedbackBadge}
          style={{
            backgroundColor: recovery.feedback ? "#10b981" : "#f3f4f6",
            color: recovery.feedback ? "#ffffff" : "#4b5563",
          }}
        >
          {recovery.feedback ? `✓ ${recovery.feedback}` : "Pending feedback"}
        </span>
      </div>
    </div>
  );
}

export default Dashboard;

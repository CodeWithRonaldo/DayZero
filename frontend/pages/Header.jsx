import { useNavigate } from "react-router-dom";
import { BarChart3, Plus, History, LogOut, Home } from "lucide-react";
import styles from "./Header.module.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    onLogout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and branding */}
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.logoButton}
          >
            <BarChart3 size={28} className={styles.logoIcon} />
            <div>
              <div className={styles.logo}>DayZero</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                Goal Recovery System
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <NavLink
            icon={Home}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <NavLink
            icon={Plus}
            label="New Recovery"
            onClick={() => navigate("/new")}
            variant="primary"
          />
          <NavLink
            icon={History}
            label="History"
            onClick={() => navigate("/history")}
          />
        </nav>

        {/* User menu */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || user?.email}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            title="Sign out"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ icon: Icon, label, onClick, variant = "default" }) {
  const isActive = false;

  return (
    <button
      onClick={onClick}
      className={variant === "primary" ? styles.navLinkPrimary : styles.navLink}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );
}

export default Header;

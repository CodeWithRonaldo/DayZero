import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Plus, History, LogOut, Home, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    onLogout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and branding */}
        <div className={styles.logoSection}>
          <button
            onClick={() => handleNavigate("/dashboard")}
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

        {/* Hamburger menu button for mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <NavLink
            icon={Home}
            label="Dashboard"
            onClick={() => handleNavigate("/dashboard")}
          />
          <NavLink
            icon={Plus}
            label="New Recovery"
            onClick={() => handleNavigate("/new")}
            variant="primary"
          />
          <NavLink
            icon={History}
            label="History"
            onClick={() => handleNavigate("/history")}
          />

          {/* User info and logout in mobile menu */}
          <div className={styles.mobileUserSection}>
            <div className={styles.mobileUserInfo}>
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
        </nav>

        {/* User menu for desktop */}
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

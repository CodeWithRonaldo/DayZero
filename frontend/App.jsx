import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase.js";
import { trackingService } from "./trackingService.js";
import Login from "./pages/Login";
import Header from "./pages/Header";
import Dashboard from "./pages/Dashboard";
import InputForm from "./pages/InputForm";
import RecoveryOutput from "./pages/RecoveryOutput";
import History from "./pages/History";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    // Listen for Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "User",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Set user for tracking service
        trackingService.setUser(userData.id);

        // Load user-specific history
        const userHistoryKey = `recoveryHistory_${userData.id}`;
        const saved = localStorage.getItem(userHistoryKey);
        setSessionHistory(saved ? JSON.parse(saved) : []);
      } else {
        setUser(null);
        setSessionHistory([]);
        localStorage.removeItem("user");

        // Clear tracking service user
        trackingService.clearUser();
      }
      setLoading(false);
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "User",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Set user for tracking service
        trackingService.setUser(userData.id);

        // Load user-specific history
        const userHistoryKey = `recoveryHistory_${userData.id}`;
        const saved = localStorage.getItem(userHistoryKey);
        setSessionHistory(saved ? JSON.parse(saved) : []);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToHistory = useCallback(
    (entry) => {
      if (!user) return;

      setSessionHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 10);
        const userHistoryKey = `recoveryHistory_${user.id}`;
        localStorage.setItem(userHistoryKey, JSON.stringify(updated));
        return updated;
      });
    },
    [user]
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();

    // Clear tracking service user
    trackingService.clearUser();

    // Reset state
    setUser(null);
    setSessionHistory([]);

    // Clear session data from localStorage
    localStorage.removeItem("user");

    // Note: User-specific recovery history and tracking data are kept
    // in localStorage (namespaced by user ID) for when they log back in
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/new" element={<InputForm user={user} />} />
        <Route path="/form" element={<InputForm user={user} />} />
        <Route
          path="/recovery"
          element={<RecoveryOutput user={user} onAddHistory={addToHistory} />}
        />
        <Route
          path="/history"
          element={<History entries={trackingService.getRecoveryHistory()} />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

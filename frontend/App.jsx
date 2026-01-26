import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import InputForm from "./pages/InputForm";
import RecoveryOutput from "./pages/RecoveryOutput";
import History from "./pages/History";
import "./App.css";

function App() {
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("recoveryHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = useCallback((entry) => {
    setSessionHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 10);
      localStorage.setItem("recoveryHistory", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<InputForm />} />
        <Route
          path="/recovery"
          element={<RecoveryOutput onAddHistory={addToHistory} />}
        />
        <Route path="/history" element={<History entries={sessionHistory} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

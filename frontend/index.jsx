import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import process from "process";
window.process = {env: {}}; // Fix for "process is not defined" error in some environments
window.process = process; // Fix for "process is not defined" error in some environments
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

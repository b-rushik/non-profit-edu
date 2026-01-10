import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import ErrorBoundary from "@/ErrorBoundary";

// Global error handlers for easier debugging of white-screen errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error || e.message, e);
    try { localStorage.setItem('lastRuntimeError', JSON.stringify({ msg: e.message || String(e), stack: (e.error && e.error.stack) || null })); } catch (err) {}
  });
  window.addEventListener('unhandledrejection', (ev) => {
    console.error('Unhandled rejection:', ev.reason);
    try { localStorage.setItem('lastRuntimeError', JSON.stringify({ msg: String(ev.reason), stack: ev.reason && ev.reason.stack })); } catch (err) {}
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);


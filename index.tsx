import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Starting application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("FATAL: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Application mounted successfully.");
} catch (error) {
  console.error("FATAL ERROR during rendering:", error);
}

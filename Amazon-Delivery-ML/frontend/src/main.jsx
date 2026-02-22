import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
import { initializeThemeSync } from "./theme/themeManager.js";

function ThemeBootstrap({ children }) {
  useEffect(() => {
    const cleanup = initializeThemeSync();
    return cleanup;
  }, []);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeBootstrap>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeBootstrap>
  </StrictMode>,
);

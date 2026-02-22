import { useEffect, useState } from "react";
import { apiService } from "../api/client";
import {
  applyThemeMode,
  getStoredThemeMode,
  setStoredThemeMode,
} from "../theme/themeManager";

export default function SettingsPage() {
  const [mode, setMode] = useState(getStoredThemeMode());
  const [modelName, setModelName] = useState("RandomForestClassifier");

  useEffect(() => {
    setStoredThemeMode(mode);
    applyThemeMode(mode);
  }, [mode]);

  useEffect(() => {
    apiService
      .aboutModel()
      .then((response) =>
        setModelName(response.data.algorithm || "RandomForestClassifier"),
      )
      .catch(() => setModelName("RandomForestClassifier"));
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <section className="card-base p-5">
        <h1 className="text-slate-900">Settings</h1>
        <p className="mt-2 soft-label">
          Configure dashboard preferences and model selection for presentations.
        </p>
      </section>

      <section className="card-base p-5">
        <label className="block text-sm font-medium text-slate-700">
          Theme Mode
          <select
            className="mt-2 w-full max-w-sm rounded-xl border border-slate-300 px-3 py-2.5"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="corporate">Corporate (Default)</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <p className="mt-4 text-sm text-slate-500">Current mode: {mode}</p>
        <p className="mt-1 text-sm text-slate-500">
          Active model is controlled by backend: {modelName}
        </p>
      </section>
    </div>
  );
}

import { useState } from "react";

export default function SettingsPage() {
  const [mode, setMode] = useState("corporate");
  const [selectedModel, setSelectedModel] = useState("RandomForestClassifier");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
        <p className="mt-2 text-sm text-slate-600">
          Configure dashboard preferences and model selection for presentations.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Theme Mode
          <select
            className="mt-2 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="corporate">Corporate (Default)</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Active Model
          <select
            className="mt-2 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2"
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
          >
            <option value="RandomForestClassifier">
              RandomForestClassifier
            </option>
            <option value="GradientBoostingClassifier">
              GradientBoostingClassifier
            </option>
            <option value="XGBoost">XGBoost</option>
          </select>
        </label>

        <p className="mt-4 text-sm text-slate-500">
          Current mode: {mode} · Current model: {selectedModel}
        </p>
      </section>
    </div>
  );
}

import { useState } from "react";
import { apiService } from "../api/client";

const trafficOptions = ["low", "medium", "high"];
const weatherOptions = ["clear", "rain", "storm"];

const resultColor = {
  "On-Time": "bg-green-100 text-green-800 border-green-200",
  "At Risk": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Delayed: "bg-red-100 text-red-800 border-red-200",
};

export default function LivePredictionPage() {
  const [form, setForm] = useState({
    order_volume: 120,
    warehouse_time: 6,
    shipment_distance: 320,
    traffic_level: "medium",
    weather_indicator: "clear",
    historical_performance: 0.82,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    const numericFields = [
      "order_volume",
      "warehouse_time",
      "shipment_distance",
      "historical_performance",
    ];
    setForm((previous) => ({
      ...previous,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiService.predictLive(form);
      setResult(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 fade-in">
      <form onSubmit={onSubmit} className="card-base p-6">
        <h1 className="text-slate-900">Live Prediction</h1>
        <p className="mt-1 soft-label">
          Enter operational values to predict delivery risk.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Order Volume
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="order_volume"
              type="number"
              value={form.order_volume}
              onChange={onChange}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Warehouse Time
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="warehouse_time"
              type="number"
              value={form.warehouse_time}
              onChange={onChange}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Shipment Distance
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="shipment_distance"
              type="number"
              value={form.shipment_distance}
              onChange={onChange}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Historical Performance
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="historical_performance"
              type="number"
              step="0.01"
              value={form.historical_performance}
              onChange={onChange}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Traffic Level
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="traffic_level"
              value={form.traffic_level}
              onChange={onChange}
            >
              {trafficOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Weather
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
              name="weather_indicator"
              value={form.weather_indicator}
              onChange={onChange}
            >
              {weatherOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button className="primary-btn mt-6" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </form>

      <div className="card-base p-6">
        <h2 className="text-slate-900">Prediction Result</h2>
        {!result ? (
          <p className="mt-4 text-sm text-slate-500">
            Run a prediction to view class and confidence.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <div
              className={`rounded-md border px-4 py-3 text-sm font-semibold ${resultColor[result.predicted_label] || "bg-slate-100 text-slate-800 border-slate-200"}`}
            >
              {result.predicted_label.toUpperCase()}
            </div>
            <p className="text-sm text-slate-700">
              Confidence:{" "}
              <span className="font-semibold">
                {(result.confidence * 100).toFixed(2)}%
              </span>
            </p>
            <div className="space-y-2">
              {Object.entries(result.probabilities).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  {label}: {(value * 100).toFixed(2)}%
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

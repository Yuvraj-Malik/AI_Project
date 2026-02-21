import { useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { apiService } from "../api/client";

const colors = ["#22c55e", "#f59e0b", "#ef4444"];

export default function UploadDataPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiService.uploadData(formData);
      setResult(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const summaryData = result
    ? Object.entries(result.prediction_summary).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Upload Data</h3>
        <p className="mt-1 text-sm text-slate-500">
          Required columns: order_volume, warehouse_time, shipment_distance,
          traffic_level, weather_indicator, historical_performance
        </p>

        <form
          onSubmit={onUpload}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <input
            type="file"
            accept=".csv"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button
            disabled={loading || !file}
            className="rounded-md bg-[#FF9900] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-70"
          >
            {loading ? "Processing..." : "Upload CSV File"}
          </button>
        </form>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </section>

      {result ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Rows</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.rows}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Avg Order Volume</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.basic_stats.avg_order_volume}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Avg Distance</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.basic_stats.avg_shipment_distance}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Prediction Summary
              </h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={summaryData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      label
                    >
                      {summaryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Data Preview
              </h3>
              <div className="mt-3 max-h-72 overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      {result.columns.map((column) => (
                        <th
                          key={column}
                          className="border border-slate-200 bg-slate-50 p-2 text-left"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.preview.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {result.columns.map((column) => (
                          <td
                            key={`${rowIndex}-${column}`}
                            className="border border-slate-200 p-2"
                          >
                            {String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

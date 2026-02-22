import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiService } from "../api/client";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiService.analytics().then((response) => setData(response.data));
  }, []);

  if (!data) {
    return <p className="text-sm text-slate-600">Loading analytics...</p>;
  }

  const confusionData = data.confusion_matrix.labels.flatMap(
    (actualLabel, rowIndex) =>
      data.confusion_matrix.labels.map((predictedLabel, colIndex) => ({
        actual: actualLabel,
        predicted: predictedLabel,
        value: data.confusion_matrix.values[rowIndex][colIndex],
      })),
  );

  const classBalanceRows = [
    {
      stage: "Before SMOTE",
      ...data.class_distribution.before_smote,
    },
    {
      stage: "After SMOTE",
      ...data.class_distribution.after_smote,
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      <section>
        <h1 className="text-slate-900">Analytics</h1>
        <p className="soft-label mt-1">
          Deeper model insights, balance analysis, and correlation trends
        </p>
      </section>

      <section className="card-base p-5">
        <h3 className="text-slate-900">
          Confusion Matrix (Heatmap-style Table)
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-50 p-2">
                  Actual \ Predicted
                </th>
                {data.confusion_matrix.labels.map((label) => (
                  <th
                    key={label}
                    className="border border-slate-200 bg-slate-50 p-2"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.confusion_matrix.labels.map((rowLabel, rowIndex) => (
                <tr key={rowLabel}>
                  <td className="border border-slate-200 p-2 font-medium">
                    {rowLabel}
                  </td>
                  {data.confusion_matrix.values[rowIndex].map(
                    (value, colIndex) => (
                      <td
                        key={`${rowLabel}-${colIndex}`}
                        className="border border-slate-200 p-2 text-center"
                      >
                        {value}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card-base p-5">
          <h3 className="text-slate-900">Feature Importance</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.feature_importance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="feature"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={90}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="importance" fill="#FF9900" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-base p-5">
          <h3 className="text-slate-900">
            Class Distribution Before & After SMOTE
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={classBalanceRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="On-Time" fill="#22c55e" />
                <Bar dataKey="At Risk" fill="#f59e0b" />
                <Bar dataKey="Delayed" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card-base p-5">
          <h3 className="text-slate-900">Processing Time vs Risk</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.processing_vs_risk}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_processing_proxy" fill="#2563eb" />
                <Bar dataKey="avg_distance" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-base p-5">
          <h3 className="text-slate-900">Distance vs Risk Scatter Plot</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="distance_km" name="Distance" />
                <YAxis
                  type="number"
                  dataKey="Complexity_Score"
                  name="Complexity"
                />
                <Tooltip />
                <Scatter
                  data={data.distance_vs_risk.filter(
                    (item) => item.label === "On-Time",
                  )}
                  fill="#22c55e"
                />
                <Scatter
                  data={data.distance_vs_risk.filter(
                    (item) => item.label === "At Risk",
                  )}
                  fill="#f59e0b"
                />
                <Scatter
                  data={data.distance_vs_risk.filter(
                    (item) => item.label === "Delayed",
                  )}
                  fill="#ef4444"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card-base p-5">
        <h3 className="text-slate-900">Confusion Matrix Flattened Data</h3>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          {confusionData.map((cell) => (
            <div
              key={`${cell.actual}-${cell.predicted}`}
              className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
            >
              {cell.actual} → {cell.predicted}: {cell.value}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

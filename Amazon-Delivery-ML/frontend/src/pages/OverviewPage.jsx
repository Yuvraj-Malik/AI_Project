import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiService } from "../api/client";
import KpiCard from "../components/KpiCard";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function OverviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiService.dashboardOverview().then((response) => setData(response.data));
  }, []);

  if (!data) {
    return (
      <p className="text-sm text-slate-600">Loading dashboard overview...</p>
    );
  }

  const pieData = Object.entries(data.risk_distribution).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Total Orders"
          value={data.kpis.total_orders.toLocaleString()}
        />
        <KpiCard label="% On-Time" value={`${data.kpis.on_time_pct}%`} />
        <KpiCard label="% At Risk" value={`${data.kpis.at_risk_pct}%`} />
        <KpiCard label="% Delayed" value={`${data.kpis.delayed_pct}%`} />
        <KpiCard
          label="Avg Processing Time"
          value={data.kpis.avg_processing_time}
        />
        <KpiCard
          label="Avg Shipment Distance"
          value={data.kpis.avg_shipment_distance}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
          <h3 className="text-sm font-semibold text-slate-900">
            Risk Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label
                >
                  {pieData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">
            Delivery Risk Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={data.risk_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="On-Time"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="At Risk"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Delayed"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Feature Impact</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data.feature_impact}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="feature"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="importance" fill="#FF9900" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

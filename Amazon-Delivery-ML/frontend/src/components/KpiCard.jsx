export default function KpiCard({ label, value }) {
  const colorClass = label.includes("On-Time")
    ? "text-green-600"
    : label.includes("Risk")
      ? "text-amber-600"
      : label.includes("Delayed")
        ? "text-red-600"
        : "text-slate-900";

  return (
    <div className="card-base p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

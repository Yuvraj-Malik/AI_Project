import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-sky-700">
            Amazon Supply Chain Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Delivery Delay Risk Dashboard Template
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            React + JavaScript + Tailwind v4 setup complete. Connect your
            existing FastAPI endpoints into this template.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Model Status"
            value="Ready"
            helper="Load from final_model.pkl"
          />
          <StatCard label="API Base" value="Configured" helper={API_BASE} />
          <StatCard
            label="Frontend Stack"
            value="Vite + React"
            helper="JavaScript template"
          />
          <StatCard
            label="Styling"
            value="Tailwind v4"
            helper="Config-less setup"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Single Prediction Module">
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Add your prediction form here and call{" "}
              <span className="font-medium">POST /predict</span>.
            </div>
          </SectionCard>

          <SectionCard title="Batch Prediction Module">
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Add CSV upload flow here and call{" "}
              <span className="font-medium">POST /predict/batch</span>.
            </div>
          </SectionCard>

          <SectionCard title="Model Metrics Module">
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Render charts from{" "}
              <span className="font-medium">GET /metrics</span>.
            </div>
          </SectionCard>

          <SectionCard title="Prediction History Module">
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Build table view from{" "}
              <span className="font-medium">GET /history</span>.
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}

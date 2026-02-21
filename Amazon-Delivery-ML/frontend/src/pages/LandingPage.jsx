import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] to-slate-900 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 py-20 lg:py-28">
        <p className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide text-orange-200">
          Amazon Supply Chain Intelligence
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          AI-Powered Delivery Risk Prediction System
        </h1>
        <p className="mt-5 max-w-2xl text-slate-200">
          Predict On-Time, At Risk, and Delayed delivery outcomes using real
          operational signals and machine learning intelligence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-md bg-[#FF9900] px-5 py-3 font-semibold text-slate-900"
          >
            Launch Dashboard
          </Link>
          <Link
            to="/upload-data"
            className="rounded-md border border-slate-400 px-5 py-3"
          >
            Upload Data
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        {[
          "Automated risk stratification for every shipment",
          "Comparative model analytics for decision confidence",
          "Enterprise-style dashboard and reporting workflow",
        ].map((feature) => (
          <div
            key={feature}
            className="rounded-xl border border-slate-700 bg-white/5 p-5 text-sm text-slate-200"
          >
            {feature}
          </div>
        ))}
      </section>
    </main>
  );
}

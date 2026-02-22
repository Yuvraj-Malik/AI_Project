import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#16223a] to-slate-900 text-white fade-in">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 py-20 lg:py-28">
        <p className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide text-orange-200">
          Amazon Supply Chain Intelligence
        </p>
        <h1 className="mt-6 max-w-3xl leading-tight text-white md:text-5xl">
          AI-Powered Delivery Risk Prediction System
        </h1>
        <p className="mt-5 max-w-2xl text-[1.02rem] text-slate-200">
          Predict On-Time, At Risk, and Delayed delivery outcomes using real
          operational signals and machine learning intelligence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login" className="primary-btn">
            Launch Dashboard
          </Link>
          <Link
            to="/upload-data"
            className="secondary-btn border-slate-300 bg-white"
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
            className="rounded-2xl border border-slate-600 bg-white/8 p-5 text-sm text-slate-100 shadow-sm"
          >
            {feature}
          </div>
        ))}
      </section>
    </main>
  );
}

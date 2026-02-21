import { useEffect, useState } from "react";
import { apiService } from "../api/client";

export default function AboutModelPage() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    apiService.aboutModel().then((response) => setAbout(response.data));
  }, []);

  if (!about) {
    return <p className="text-sm text-slate-600">Loading model details...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">About Model</h3>
        <p className="mt-2 text-sm text-slate-600">{about.name}</p>
        <p className="mt-1 text-sm text-slate-700">
          Algorithm: {about.algorithm}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold text-slate-900">Input Features</h4>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {about.inputs.map((item) => (
              <div
                key={item}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold text-slate-900">Engineered Features</h4>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {about.engineered_features.map((item) => (
              <div
                key={item}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

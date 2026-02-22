import { NavLink } from "react-router-dom";

const links = [
  { label: "Overview", path: "/dashboard", end: true },
  { label: "Live Prediction", path: "/dashboard/live-prediction" },
  { label: "Analytics", path: "/dashboard/analytics" },
  { label: "Model Performance", path: "/dashboard/model-performance" },
  { label: "Upload Data", path: "/upload-data" },
  { label: "Reports", path: "/reports" },
  { label: "About Model", path: "/about-model" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-full border-r border-slate-800 bg-[#0F172A] text-white lg:w-72">
      <div className="border-b border-slate-700 px-6 py-7">
        <p className="text-xs uppercase tracking-widest text-orange-300">
          Amazon AI
        </p>
        <h1 className="mt-2 text-xl font-semibold leading-snug text-white">
          Supply Chain Intelligence
        </h1>
      </div>
      <nav className="space-y-2 px-4 py-5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2.5 text-sm transition ${
                isActive
                  ? "bg-orange-500 font-semibold text-slate-900"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

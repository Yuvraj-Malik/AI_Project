import Sidebar from "./Sidebar";
import { useAuth } from "../../state/AuthContext";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">
              AI Delivery Risk Prediction System
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              Amazon Supply Chain Intelligence
            </h2>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-[#FF9900] px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Logout
          </button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

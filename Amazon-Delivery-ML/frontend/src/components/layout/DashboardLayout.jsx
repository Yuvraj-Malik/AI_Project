import Sidebar from "./Sidebar";
import { useAuth } from "../../state/AuthContext";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 lg:flex fade-in">
      <Sidebar />
      <main className="flex-1">
        <header className="card-base mx-4 mt-4 flex items-center justify-between px-6 py-4 lg:mx-6">
          <div>
            <p className="soft-label">AI Delivery Risk Prediction System</p>
            <h2 className="text-slate-900">Amazon Supply Chain Intelligence</h2>
          </div>
          <button onClick={logout} className="primary-btn text-sm">
            Logout
          </button>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

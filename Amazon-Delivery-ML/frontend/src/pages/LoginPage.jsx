import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../api/client";
import { useAuth } from "../state/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiService.login({ username, password });
      login(response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 fade-in">
      <form
        onSubmit={onSubmit}
        className="card-base no-hover-card w-full max-w-md p-8"
      >
        <p className="text-xs uppercase tracking-wide text-orange-500">
          Secure Access
        </p>
        <h1 className="mt-2 text-3xl text-slate-900">Sign in to Dashboard</h1>
        <label className="mt-5 block text-sm font-medium text-slate-700">
          Username
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="primary-btn no-hover-btn mt-6 w-full disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

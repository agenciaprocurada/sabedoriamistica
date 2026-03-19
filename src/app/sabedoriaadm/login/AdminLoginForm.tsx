"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao autenticar.");
        return;
      }

      router.push("/sabedoriaadm");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4 bg-mystic-card border border-gold-subtle rounded-2xl p-6">
        <div className="space-y-1.5">
          <label className="font-body text-xs text-text-secondary uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-mystic-input border border-gold-subtle rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="admin@exemplo.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-body text-xs text-text-secondary uppercase tracking-wider">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-mystic-input border border-gold-subtle rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="font-body text-xs text-center px-3 py-2 rounded-lg bg-red-950/50 text-red-400 border border-red-500/20">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full font-body text-sm font-semibold bg-gold hover:bg-gold-light disabled:opacity-50 text-mystic-bg px-6 py-3 rounded-full transition-colors"
      >
        {loading ? "Autenticando..." : "Entrar no painel"}
      </button>
    </form>
  );
}

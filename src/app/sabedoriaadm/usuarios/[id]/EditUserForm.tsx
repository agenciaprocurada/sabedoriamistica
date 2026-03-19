"use client";

import { useState } from "react";

export function EditUserForm({
  userId,
  initialName,
  initialEmail,
}: {
  userId: string;
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setToast({ ok: true, msg: "Dados salvos com sucesso." });
      } else {
        const d = await res.json();
        setToast({ ok: false, msg: d.error ?? "Erro ao salvar." });
      }
    } catch {
      setToast({ ok: false, msg: "Erro de conexão." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  const inputClass =
    "w-full bg-mystic-input border border-gold-subtle rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors";

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-body text-xs text-text-muted uppercase tracking-wider">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-body text-xs text-text-muted uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {toast && (
        <p className={`font-body text-xs px-3 py-2 rounded-lg border ${
          toast.ok
            ? "bg-green-950/50 text-green-400 border-green-500/20"
            : "bg-red-950/50 text-red-400 border-red-500/20"
        }`}>
          {toast.msg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="font-body text-sm font-semibold bg-gold hover:bg-gold-light disabled:opacity-50 text-mystic-bg px-6 py-2.5 rounded-full transition-colors"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

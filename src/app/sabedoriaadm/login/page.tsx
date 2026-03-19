import type { Metadata } from "next";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin — Sabedoria Mística",
  robots: "noindex, nofollow",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 border border-gold/40 rounded-full px-4 py-1.5 mb-4">
            <span className="font-body text-xs uppercase tracking-widest text-gold">
              Administração
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Sabedoria Mística
          </h1>
          <p className="font-body text-sm text-text-secondary">
            Acesso restrito — painel interno
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui";

interface Props {
  initialData: {
    name: string;
    email: string;
    cellphone: string;
    tax_id: string;
  };
}

function formatCellphone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
}

function formatTaxId(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1/$2");
}

export function MeusDadosForm({ initialData }: Props) {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const [name, setName] = useState(initialData.name);
  const [cellphone, setCellphone] = useState(
    initialData.cellphone ? formatCellphone(initialData.cellphone) : ""
  );
  const [taxId, setTaxId] = useState(
    initialData.tax_id ? formatTaxId(initialData.tax_id) : ""
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        cellphone,
        tax_id: taxId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("saved");
      if (nextUrl) {
        setTimeout(() => { window.location.href = nextUrl; }, 1200);
      } else {
        setTimeout(() => setStatus("idle"), 3000);
      }
    } else {
      setStatus("error");
      setErrorMsg(data.error ?? "Erro ao salvar.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* E-mail — somente leitura */}
      <div className="space-y-1.5">
        <label className="font-body text-sm text-text-secondary">E-mail</label>
        <div className="font-body w-full rounded-lg px-4 py-3 bg-mystic-input border border-gold-subtle text-text-muted opacity-60 cursor-not-allowed select-none">
          {initialData.email}
        </div>
        <p className="font-body text-xs text-text-muted">
          O e-mail não pode ser alterado.
        </p>
      </div>

      {/* Nome */}
      <Input
        label="Nome completo *"
        placeholder="Seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Telefone */}
      <Input
        label="Telefone (WhatsApp) *"
        placeholder="(11) 99999-9999"
        value={cellphone}
        onChange={(e) => setCellphone(formatCellphone(e.target.value))}
        inputMode="numeric"
        required
      />

      {/* CPF / CNPJ */}
      <div className="space-y-1.5">
        <Input
          label="CPF ou CNPJ *"
          placeholder="000.000.000-00"
          value={taxId}
          onChange={(e) => setTaxId(formatTaxId(e.target.value))}
          inputMode="numeric"
          required
        />
        <p className="font-body text-xs text-text-muted">
          Necessário para emissão de comprovante de pagamento.
        </p>
      </div>

      {/* Feedback */}
      {status === "error" && (
        <p className="font-body text-sm text-red-400">{errorMsg}</p>
      )}
      {status === "saved" && (
        <p className="font-body text-sm text-green-400">Dados salvos com sucesso!</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full font-body font-semibold bg-gold hover:bg-gold-light disabled:opacity-50 text-mystic-bg px-6 py-3.5 rounded-full transition-colors duration-200"
      >
        {status === "saving" ? "Salvando..." : "Salvar dados"}
      </button>
    </form>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MeusDadosForm } from "./MeusDadosForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Dados | Sabedoria Mística",
};

export default async function MeusDadosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/meus-dados");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, cellphone, tax_id")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-lg mx-auto py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-gold">Meus Dados</h1>
        <p className="font-body text-text-secondary text-sm">
          Mantenha seus dados atualizados para pagamentos e comunicações.
        </p>
      </div>

      <MeusDadosForm
        initialData={{
          name: profile?.name ?? "",
          email: profile?.email ?? user.email ?? "",
          cellphone: profile?.cellphone ?? "",
          tax_id: profile?.tax_id ?? "",
        }}
      />
    </div>
  );
}

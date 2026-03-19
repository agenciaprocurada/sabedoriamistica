import { MysticLoader } from "@/components/ui/MysticLoader";

export default function ResultadoLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <MysticLoader text="Carregando interpretação..." />
    </div>
  );
}

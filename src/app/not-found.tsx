import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 text-center px-4">
      <div className="space-y-2">
        <p className="font-body text-6xl text-gold opacity-60">✦</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
          Os astros não encontraram este caminho...
        </h1>
        <p className="font-body text-text-secondary max-w-sm mx-auto">
          A página que você procura não existe ou foi movida para outro plano.
        </p>
      </div>

      <Link
        href="/sonhos"
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold px-8 py-3 rounded-full transition-colors duration-200"
      >
        ✦ Voltar ao Portal
      </Link>
    </div>
  );
}

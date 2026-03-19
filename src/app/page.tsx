import { Button, Card, Badge, MysticLoader } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function Home() {
  return (
    <main className="min-h-screen bg-mystic-bg px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">

        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-bold text-gold">
            Design System — Sabedoria Mística
          </h1>
          <p className="font-body text-text-secondary">Validação dos componentes UI base</p>
        </div>

        {/* Badges */}
        <section className="space-y-3">
          <h2 className="font-display text-xl text-text-primary">Badge</h2>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="solid">Grátis</Badge>
            <Badge variant="outline">Em breve</Badge>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-3">
          <h2 className="font-display text-xl text-text-primary">Button</h2>
          <div className="flex gap-3 flex-wrap items-center">
            <Button variant="primary" size="sm">Pequeno</Button>
            <Button variant="primary" size="md">Médio</Button>
            <Button variant="primary" size="lg">Grande</Button>
            <Button variant="primary" loading>Carregando</Button>
            <Button variant="primary" disabled>Desabilitado</Button>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <Button variant="secondary" size="sm">Secundário SM</Button>
            <Button variant="secondary" size="md">Secundário MD</Button>
            <Button variant="secondary" disabled>Desabilitado</Button>
          </div>
          <Button variant="primary" fullWidth>Largura total</Button>
        </section>

        {/* Cards */}
        <section className="space-y-3">
          <h2 className="font-display text-xl text-text-primary">Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <p className="font-body text-text-secondary">Card simples (sem hover)</p>
            </Card>
            <Card hover>
              <Badge variant="solid" className="mb-3">Grátis</Badge>
              <p className="font-display text-gold font-semibold">Análise de Sonhos</p>
              <p className="font-body text-text-secondary text-sm mt-1">
                Passe o mouse para ver o hover
              </p>
            </Card>
          </div>
        </section>

        {/* Input & Textarea */}
        <section className="space-y-4">
          <h2 className="font-display text-xl text-text-primary">Input / Textarea</h2>
          <Input label="Seu nome" placeholder="Digite seu nome..." />
          <Input placeholder="Sem label..." />
          <Textarea
            label="Descreva seu sonho"
            placeholder="Escreva aqui o seu sonho com o máximo de detalhes..."
            charCount
            maxLength={500}
          />
        </section>

        {/* Loader */}
        <section className="space-y-3">
          <h2 className="font-display text-xl text-text-primary">MysticLoader</h2>
          <Card className="flex items-center justify-center py-12">
            <MysticLoader text="Consultando as estrelas..." />
          </Card>
        </section>

      </div>
    </main>
  );
}

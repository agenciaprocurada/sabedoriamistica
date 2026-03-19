# Sabedoria Mística

Portal de interpretação de sonhos com análise gratuita e completa (paga).

## Stack

- **Next.js 14** (App Router, SSR)
- **Supabase** (auth + banco de dados)
- **Google Gemini** (geração de análises)
- **AbacatePay** (pagamentos PIX)
- **Tailwind CSS**
- **Vercel** (deploy)

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Gemini
GEMINI_API_KEY=AIza...

# AbacatePay
ABACATEPAY_API_KEY=abc_dev_... (dev) | abc_live_... (prod)
```

## Setup local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Importe o repositório no [vercel.com](https://vercel.com)
2. Adicione todas as variáveis de ambiente acima em **Settings → Environment Variables**
3. Framework: **Next.js** (detectado automaticamente)
4. O deploy acontece automaticamente a cada push na branch `master`

## Estrutura principal

```
src/
  app/
    sonhos/                  # Landing page pública
    sonhos/analisar/         # Formulário (requer login)
    sonhos/resultado/[id]/   # Resultado da análise
    sonhos/checkout/[id]/    # Checkout PIX
    sonhos/completo/[id]/    # Análise completa paga
    api/                     # Route handlers (sonhos, pagamentos)
  lib/
    supabase/                # Clientes SSR e client
    gemini/                  # Cliente Gemini
  components/                # UI components
  middleware.ts              # Auth redirects
prompts/sonhos/              # Prompts do Gemini (gratuito e pago)
```

## Banco de dados (Supabase)

Tabelas principais:
- `profiles` — dados do usuário (name, email, cellphone, tax_id)
- `dreams` — sonhos com análise gratuita e paga
- `payments` — histórico de pagamentos PIX

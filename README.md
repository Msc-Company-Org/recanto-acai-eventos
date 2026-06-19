# Recanto do Açaí · Estações — Landing Page de Eventos 🍇

Landing page **premium** do Recanto do Açaí para a linha de **eventos** — estações de açaí e sorvete gourmet servidas na hora por nossa equipe: casamentos, 15 anos, aniversários, batizados, chá revelação e qualquer celebração. Zona Norte do Rio de Janeiro.

- **Produção:** https://recanto-acai-eventos-lp.vercel.app

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **lucide-react** (ícones)
- Deploy: **Vercel**

## Desenvolvimento

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # build de produção
pnpm start    # serve o build de produção
```

## Estrutura

```
app/
  page.tsx           # landing (compõe as seções)
  layout.tsx         # fontes (Lora/Outfit) + metadata/SEO
  api/lead/route.ts  # recebe o lead do formulário de orçamento
  sitemap.ts         # /sitemap.xml
  robots.ts          # /robots.txt
components/           # uma seção por arquivo (Hero, Packages, QuoteForm, ...)
lib/content.ts        # TODA a copy (fonte única de verdade) — edite aqui
lib/utils.ts          # helpers (waLink, brl)
```

## Conteúdo & copy

Toda a copy vive em **`lib/content.ts`**. Os itens marcados com `[CONFIRMAR]` precisam de dados reais antes do go-live:
número de WhatsApp oficial, escopo do pacote (duração / convidados / sabores), lista de sabores, raio de atendimento, formas de pagamento, depoimentos e fotos reais.

## Pacotes

| Pacote | Preço |
|---|---|
| Açaí **ou** Sorvete | R$ 1.490 |
| Açaí **+** Sorvete (combo, mais escolhido) | R$ 1.690 |
| Sabor extra premium | +R$ 350 |
| Sabor extra normal | +R$ 250 |

# Testes & Robustez — Recanto Eventos

Suíte de testes com **Vitest** (ambiente Node) + verificação de tipos + lint. Foco em **lógica pura**:
a lógica de negócio é extraída para módulos testáveis sem DB nem rede; rotas/efeitos colaterais ficam
como cascas finas que chamam esses módulos.

## Comandos

```bash
pnpm test         # roda toda a suíte (vitest run)
pnpm test:watch   # modo watch
pnpm test:cov     # com cobertura (v8)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```

## Convenções
- Testes co-localizados: `lib/<modulo>.test.ts` ao lado do `lib/<modulo>.ts`.
- Ambiente Node por padrão (`vitest.config.ts`). Para algo que precise de `window` (ex.: `tracking.ts`),
  declarar no topo do teste: `// @vitest-environment happy-dom` (instalar `happy-dom` antes).
- Alias `@/` resolvido via `vite-tsconfig-paths` (lê o `tsconfig.json`).

## O que está coberto (lógica pura)
| Módulo | Foco |
|---|---|
| `lib/pricing.ts` | `valorReserva` (sinal 50% / total, fallback de pacote) |
| `lib/leadScore.ts` | `computeScore` (thresholds, NaN, cap 0–100, temperatura) |
| `lib/utils.ts` | `brl` (NaN/Infinity), `cn`, `waLink` |
| `lib/crm-constants.ts` | `stageLabel` / `stageColor` (fallback) |
| `lib/stats.ts` | `computeStats` (divisão por zero, campos null, agregações) |
| `lib/html.ts` | `escapeHtml` (anti-XSS) |
| `lib/stripe.ts` | `verifyStripeSignature` (HMAC, timing-safe), `parseCheckoutCompleted` |
| `lib/checkout.ts` | `parseCheckoutInput`, `safeOrigin` (anti open-redirect), `buildSuccessUrl` |
| `lib/blog.ts` | `parseFrontmatter` (BOM, CRLF, `:` no valor, sem frontmatter) |
| `lib/http.ts` | `safeJson` (JSON malformado → null) |

## Padrão de hardening (como endurecemos)
Rotas e funções com efeito colateral viraram **cascas finas** sobre helpers puros:
- `app/api/checkout` → `lib/checkout.ts` + `lib/http.ts` (valida entrada, origin confiável, JSON seguro).
- `app/api/stripe-webhook` → `lib/stripe.ts` (assinatura + parsing) + **dedup por `stripe_session_id`**.
- `app/api/lead` → `lib/http.ts` (`safeJson`) + coerção segura de campos + retorno consistente.
- `lib/crm.ts` → `lib/stats.ts` (agregação pura) + `try/catch` que devolve defaults (o `/admin` nunca cai).
- `lib/notify.ts` → `lib/html.ts` (`escapeHtml` em todos os campos do e-mail).
- `lib/blog.ts` → `parseFrontmatter` robusto + `try/catch` por arquivo (post corrompido não derruba o blog).

## Como adicionar um teste
1. Se for testar lógica dentro de uma rota/efeito, **extraia a parte pura** para `lib/` primeiro.
2. Crie `lib/<modulo>.test.ts` com `import { describe, it, expect } from "vitest"`.
3. Rode `pnpm test`.

## Migração: coluna `stripe_session_id` (dedup do webhook)
O webhook é **resiliente**: funciona com ou sem a coluna (a deduplicação só ativa quando ela existir;
sem ela, grava o lead normalmente). Para **ativar o dedup**, adicione a coluna no banco (aditivo, não
destrutivo):

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stripe_session_id text;
```

ou via drizzle: `DATABASE_URL=... pnpm drizzle-kit push` (config em `drizzle.config.ts`).

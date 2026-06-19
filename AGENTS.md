# AGENTS.md — recanto-acai-eventos-lp

## Contexto

- **Projeto:** Recanto do Açaí — Landing Page de Eventos (premium)
- **Owner GitHub:** `Msc-Company-Org`
- **Função:** captar leads de eventos (estações de açaí/sorvete servidas na hora) via WhatsApp + formulário
- **Status:** ativo
- **Deploy:** Vercel (Next.js)

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react (ícones; ícones de marca são SVGs próprios em `components/primitives.tsx`)
- pnpm

## Governança padrão

- Alexandria: `00-Agentes/00.31-Template-Governanca-Agentes.md`
- Fluxo: investigar → alterar → testar (`pnpm build`) → documentar → commit/push
- Mudanças pequenas e reversíveis

## Ordem de leitura

1. Instruções do usuário na conversa atual.
2. Este `AGENTS.md`.
3. `README.md`, `lib/content.ts` (toda a copy), `app/page.tsx`, `components/`.
4. Alexandria (série `40.5X` do Recanto) para decisões duráveis.

## Regras para agentes

1. Verificar `git status` antes de editar.
2. **Toda a copy fica em `lib/content.ts`** — editar lá, não espalhar texto nos componentes.
3. Não sobrescrever mudanças humanas não relacionadas.
4. Não registrar tokens, cookies, `.env`, URLs assinadas ou dados sensíveis.
5. Rodar `pnpm build` (deve passar limpo) após alterações de UI antes do deploy.
6. Itens `[CONFIRMAR]` em `content.ts` dependem de dados reais do dono — não inventar como definitivo.
7. Ao finalizar, informar arquivos alterados, validações, riscos e próximo passo.

## Deploy

Deploy via GitHub/Vercel. A branch `master` publica produção; outras branches geram preview.

```bash
pnpm build              # validar antes
git push origin <branch>
```

# AGENTS.md — recanto-acai-eventos-lp

## Contexto

- **Projeto:** Recanto do Açaí — Landing Page de Eventos
- **Owner GitHub:** `Msc-Company-Org`
- **Função:** landing page estática para serviços de carrinhos/buffet de açaí em eventos
- **Status:** ativo
- **Deploy:** Vercel estático

## Governança padrão

Este projeto segue o template oficial de governança de agentes:

- Alexandria: `00-Agentes/00.31-Template-Governanca-Agentes.md`
- Fluxo: investigar → alterar → testar → documentar → commit/push
- Integração: Pi + Antigravity + Manus + GitHub, com mudanças pequenas e reversíveis

## Stack

- HTML5 + CSS3 vanilla
- Google Fonts
- FontAwesome
- Vercel static deploy

## Ordem de leitura

1. Instruções do usuário na conversa atual.
2. Este `AGENTS.md`.
3. `README.md`, `vercel.json`, `index.html`, `css/style.css`.
4. Alexandria para decisões duráveis e padrões de governança.

## Regras para agentes

1. Verificar `git status` antes de editar.
2. Não sobrescrever mudanças humanas não relacionadas.
3. Não registrar tokens, cookies, `.env`, URLs assinadas ou dados sensíveis.
4. Preservar simplicidade: evitar frameworks/build sem necessidade explícita.
5. Validar visualmente/HTTP após alterações de UI ou deploy.
6. Ao finalizar, informar arquivos alterados, validações, riscos e próximo passo.

## Deploy

Deploy preferencial via GitHub/Vercel no branch `master`:

```bash
git push origin master
```

Antes de push, validar que `index.html`, `css/style.css` e `vercel.json` continuam coerentes.

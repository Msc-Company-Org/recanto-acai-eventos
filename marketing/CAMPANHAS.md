# Recanto do Açaí · Estações — Documentação de Marketing & Planejamento de Campanhas

> **Última atualização:** 2026-06-28
> **Responsável:** MSC Company / Moises Costa
> **Site:** https://recanto-eventos.vercel.app

---

## ÍNDICE

1. [Ecossistema de Rastreamento](#1-ecossistema-de-rastreamento)
2. [Google Ads — Planejamento Completo](#2-google-ads--planejamento-completo)
3. [Meta Ads — Planejamento Completo](#3-meta-ads--planejamento-completo)
4. [Copy Aprovada — Banco de Textos](#4-copy-aprovada--banco-de-textos)
5. [Checklist Pré-Campanha](#5-checklist-pré-campanha)
6. [Orçamentos e Metas Sugeridos](#6-orçamentos-e-metas-sugeridos)

---

## 1. ECOSSISTEMA DE RASTREAMENTO

### 1.1 IDs e Ferramentas Instaladas

| Ferramenta | ID | Status | Implementação |
|---|---|---|---|
| Google Tag Manager | GTM-K5DK33L3 | ✅ Ativo | `Analytics.tsx` — `afterInteractive` |
| Google Analytics 4 | G-K3SWZDFF95 | ✅ Ativo | `gtag.js` — `lazyOnload` (não bloqueia LCP) |
| Google Ads | AW-17856564369 | ✅ Ativo | via gtag.js |
| Meta Pixel | 988443594032737 | ✅ Ativo | `Analytics.tsx` — `afterInteractive` |
| Meta Test Code | TEST46087 | ⚠️ Remover após testes | `NEXT_PUBLIC_META_TEST_CODE` na Vercel |

**Nota de performance:** GA4 carrega com `lazyOnload` (depois do `load` do browser) — não compete com o LCP da página. GTM carrega `afterInteractive` (após hidratação React). Meta Pixel `afterInteractive`.

---

### 1.2 Funil de Eventos GA4 Completo

```
Visitante → [selecao_pacote] → [generate_lead] → [qualify_lead] → [begin_checkout] → [purchase]
              R$5               R$10              R$20             R$35              valor real
```

| Evento interno | Evento GA4 enviado | Evento Meta Pixel | Evento GTM dataLayer | Valor |
|---|---|---|---|---|
| SELECAO_PACOTE | `selecao_pacote` | — | `selecao_pacote` | R$ 5 |
| ENVIO_FORMULARIO | `generate_lead` | `Lead` | `generate_lead` | R$ 10 |
| QUALIFY_LEAD | `qualify_lead` | `Lead` | `qualify_lead` | R$ 20 |
| CLOSE_CONVERT_LEAD | `close_convert_lead` | `Lead` | `close_convert_lead` | R$ 25 |
| INICIO_CHECKOUT | `begin_checkout` | `InitiateCheckout` | `begin_checkout` | R$ 35 |
| RESERVA_PAGA | `purchase` | `Purchase` | `purchase` | Valor real |

**Deduplicação:** Implementada via `localStorage` com prefixo `recanto_conv_` — cada conversão dispara uma única vez por sessão.

---

### 1.3 Status das Conversões no Google Ads

| Conversão | Status | Tipo atual | Problema | Solução |
|---|---|---|---|---|
| **Compra** | ⚠️ Requer atenção | Website tag (`send_to` direto) | Google não consegue verificar evento JS dinâmico por crawl estático | Manter — já usa `send_to` direto no `RESERVA_PAGA`. Aguardar 1ª venda para ativar |
| **Enviar formulário de lead** | ✅ Ativa | Website tag | — | Mantendo |
| **Inscrição** | ✅ Ativa | Website tag | — | Avaliar necessidade |
| **Adicionar ao carrinho** | ❌ Configuração incorreta | Website tag estático | Evento `begin_checkout` é dinâmico, crawl do Google não encontra | **DELETAR e recriar como GA4 Import** |
| **Solicitar cotação** | ❌ Configuração incorreta | Website tag estático | Mesmo problema acima | **DELETAR e recriar como GA4 Import** |

#### Ação manual necessária no Google Ads (passo a passo):

1. Acessar **Google Ads → Metas → Conversões**
2. Deletar: "Adicionar ao carrinho" e "Solicitar cotação"
3. Clicar em **+ Nova ação de conversão → Importar → Google Analytics 4**
4. Criar conversão 1: evento `begin_checkout` → nome "Checkout Iniciado" → valor R$ 35
5. Criar conversão 2: evento `qualify_lead` → nome "Lead Qualificado" → valor R$ 20
6. Aguardar 24–48h para sincronização GA4 → Google Ads

---

### 1.4 Conversões Meta Pixel

| Trigger no site | Evento Pixel | Uso recomendado |
|---|---|---|
| Qualquer pageview | `PageView` | Público de retargeting base |
| Formulário de orçamento enviado | `Lead` | Campanha de Leads, audiência retargeting |
| Chat Naiara — lead qualificado | `Lead` | Idem |
| Clique em "Confirmar Reserva" | `InitiateCheckout` | Retargeting abandono de checkout |
| Pagamento aprovado (Stripe webhook) | `Purchase` (com valor real) | Otimização de conversão, Lookalike |

**Audiências disponíveis para criar no Meta:**
- Todos visitantes do site (7/14/30 dias)
- Visitantes `/reserva` (abandono de checkout)
- Evento `Lead` (formulário enviado)
- Evento `Purchase` (compradores reais → base para Lookalike 1-3%)

---

## 2. GOOGLE ADS — PLANEJAMENTO COMPLETO

### 2.1 Configurações Gerais de Conta

| Configuração | Valor recomendado |
|---|---|
| Localização | Rio de Janeiro (cidade) + Niterói + Baixada Fluminense |
| Raio geográfico | 40 km a partir de Guadalupe, RJ |
| Idioma | Português |
| Rede | Somente Rede de Pesquisa (desmarcar Display no início) |
| Rotação de anúncios | Otimizar (Google escolhe melhor RSA) |
| Estratégia de lance inicial | CPC manual (até 50 conversões/mês), depois Maximizar Conversões |
| Lance máximo sugerido CPC | R$ 4,50 – R$ 8,00 |
| Orçamento diário total | R$ 50–R$ 80/dia (dividido entre campanhas) |
| Programação | Seg–Dom, 07h–23h |
| Dispositivos | Todos, com ajuste +20% para mobile |

---

### 2.2 Campanha 1 — Serviço Principal (Maior Prioridade)

**Objetivo:** Capturar quem já sabe o que quer — busca por estação de açaí para eventos.
**Orçamento diário:** R$ 25–R$ 35
**Página de destino:** `https://recanto-eventos.vercel.app/#pacotes`

#### Grupo 1A — Estação de Açaí para Eventos

**Keywords (correspondência de frase e exata):**

```
[estação de açaí para eventos]
[estação de açaí para festa]
"estação de açaí para eventos"
"estação de açaí para festa"
[buffet de açaí para eventos]
"buffet de açaí para festa"
[açaí para eventos rj]
"açaí para eventos rio de janeiro"
[contratar estação de açaí]
"alugar estação de açaí"
[estação de açaí e sorvete para eventos]
"estação de sorvete para eventos"
```

#### Grupo 1B — Buffet de Açaí RJ

```
[buffet de açaí rj]
"buffet açaí rio de janeiro"
[buffet açaí zona norte rj]
"açaí gourmet para eventos rj"
[buffet sobremesa para eventos rj]
"buffet de sobremesa rj"
[açaí premium para festa]
"estação gourmet de açaí"
```

#### Grupo 1C — Açaí para Festa (intenção mais ampla)

```
[açaí para festa]
"açaí para aniversário"
[açaí para celebração]
"servir açaí em festa"
[estação de açaí montada]
"açaí com toppings para festa"
[serviço de açaí para eventos]
"empresa de açaí para eventos"
```

---

### 2.3 Campanha 2 — Por Tipo de Evento

**Objetivo:** Capturar buscas segmentadas por tipo de evento — maior intenção de compra.
**Orçamento diário:** R$ 20–R$ 30
**Página de destino:** `https://recanto-eventos.vercel.app/#orcamento`

#### Grupo 2A — Casamento

```
[açaí para casamento rj]
[buffet açaí casamento]
"estação de açaí para casamento"
"açaí e sorvete no casamento"
[estação de açaí casamento niterói]
"buffet de açaí e sorvete casamento rj"
[serviço de açaí para bodas]
"açaí gourmet casamento"
```

#### Grupo 2B — 15 Anos e Aniversários

```
[açaí para 15 anos]
[estação de açaí festa de 15 anos]
"buffet de açaí 15 anos rj"
[açaí para aniversário rj]
[açaí para festa de aniversário]
"estação de açaí aniversário zona norte"
[sorvete gourmet para festa de 15 anos]
"serviço de açaí para debutante"
```

#### Grupo 2C — Festa Infantil e Chá Revelação

```
[açaí para festa infantil]
[estação de sorvete para festa infantil rj]
"buffet de açaí festa criança"
[açaí para chá revelação]
[estação de açaí chá revelação]
"sorvete gourmet festa infantil rj"
[açaí para batizado]
"açaí para festa de 1 ano"
```

#### Grupo 2D — Corporativo e Formatura

```
[açaí para confraternização rj]
[estação de açaí corporativo rj]
"açaí para evento de empresa rj"
[buffet açaí happy hour corporativo]
"estação de açaí formatura rj"
[açaí para evento universitário]
"buffet de sobremesa confraternização rj"
[açaí fim de ano empresa rj]
```

---

### 2.4 Campanha 3 — Por Região

**Objetivo:** Capturar buscas com intenção geográfica específica — menor concorrência, CPC mais baixo.
**Orçamento diário:** R$ 10–R$ 15
**Página de destino:** `https://recanto-eventos.vercel.app`

#### Grupo 3A — Zona Norte e Subúrbio

```
[estação de açaí zona norte rj]
[açaí para festa guadalupe]
"buffet açaí marechal hermes"
[açaí para evento irajá]
"estação de açaí bangu"
[buffet açaí pavuna]
"açaí para festa campo grande rj"
[açaí para evento subúrbio rio]
```

#### Grupo 3B — Niterói e Grande Niterói

```
[estação de açaí niterói]
[buffet açaí niterói]
"açaí para casamento niterói"
[açaí para evento niterói]
"estação de açaí são gonçalo"
[buffet de açaí icaraí niterói]
"açaí para festa niterói rj"
```

#### Grupo 3C — Baixada Fluminense

```
[açaí para festa nova iguaçu]
[buffet açaí duque de caxias]
"estação de açaí baixada fluminense"
[açaí para evento belford roxo]
"açaí para festa mesquita"
[buffet de açaí nilópolis]
```

---

### 2.5 Keywords Negativas (Lista Completa)

Aplicar em TODAS as campanhas:

```
grátis
gratuito
receita
como fazer
fazer em casa
caseiro
máquina de açaí
comprar açaí
açaí em loja
açaí delivery
delivery de açaí
açaí para beber
açaí na tigela
curso
aula
franquia
emprego
vaga
trabalho
pote de açaí
atacado
distribuidora
semente
planta
árvore
benefícios do açaí
emagrecer
dieta
treino
academia
nutrição
atacarejo
supermercado
mercado
sorveteria
loja
abrir
inaugurar
fornecedor
ingredientes
quanto tem de calorias
proteína
```

---

### 2.6 Copy dos Anúncios RSA

> Cada anúncio RSA pode ter até 15 headlines e 4 descriptions. O Google combina automaticamente as melhores variações. Use todas abaixo — quanto mais variações, melhor o desempenho.

#### RSA 1 — Anúncio Principal (usar em todos os grupos)

**Headlines (15 — máx. 30 caracteres cada):**

```
1.  Estação de Açaí para Eventos      (31 — encurtar: "Açaí Gourmet p/ Eventos RJ")
2.  Buffet de Açaí · 4h de Serviço
3.  15+ Toppings Premium Inclusos
4.  Reserve Online em Minutos
5.  Parcele em 6x Sem Juros no Cartão
6.  100+ Eventos Realizados no RJ
7.  Zona Norte · Sem Taxa de Frete
8.  Equipe Uniformizada Inclusa
9.  Exclusivo: 1 Evento por Data
10. Açaí Cremoso Servido na Hora
11. A partir de R$ 1.490 no Cartão
12. 6x de R$ 248 Sem Juros
13. Sua Data Garantida Online Agora
14. Açaí + Sorvete Gourmet no Combo
15. Casamentos, 15 Anos e Festas RJ
```

**Descriptions (4 — máx. 90 caracteres cada):**

```
1. Estação gourmet completa: açaí cremoso, 15+ toppings e equipe uniformizada por 4h.
2. Reserva 100% online, pagamento via Pix ou Cartão 6x sem juros. Data bloqueada na hora.
3. Atendemos RJ capital (sem frete), Niterói e Baixada. Pacotes a partir de R$ 1.490.
4. Mais de 100 eventos realizados. Só 1 evento por data — exclusividade total para você.
```

#### RSA 2 — Anúncio de Conversão (foco em preço e parcelamento)

**Headlines (15):**

```
1.  Açaí para Festa a partir R$ 1.490
2.  6x de R$ 248 Sem Juros no Cartão
3.  Pague com Pix com Desconto
4.  Buffet Açaí · Preço Fechado
5.  Sem Taxas Ocultas ou Surpresas
6.  Estação Completa: Açaí + Sorvete
7.  Orçamento Online em 30 Segundos
8.  Combo Açaí + Sorvete · R$ 1.690
9.  Mais de 120 Convidados Atendidos
10. Toppings Ilimitados · Nutella Incluso
11. Montagem e Desmontagem Inclusos
12. Logística 100% por Nossa Conta
13. 4 Horas de Atendimento Ativo
14. Simule Seu Orçamento Agora
15. Garanta Sua Data Este Final de Semana
```

**Descriptions (4):**

```
1. Combo Açaí + Sorvete: R$ 1.690 ou 6x de R$ 281 sem juros. Inclui equipe e logística.
2. Monte seu orçamento online: escolha o pacote, data e número de convidados em minutos.
3. 4 horas de atendimento, 15+ toppings premium, equipe treinada. Tudo incluso no preço.
4. Pagamento seguro via Stripe. Pix ou cartão 6x sem juros. Data bloqueada imediatamente.
```

#### RSA 3 — Anúncio de Prova Social (depoimentos e urgência)

**Headlines (15):**

```
1.  Nota 5★ em 100+ Eventos no RJ
2.  "Ponto Alto da Nossa Festa" ★★★★★
3.  Datas Esgotam Rápido — Reserve Já
4.  Atendemos Sábados · Vagas Limitadas
5.  Clientes de Guadalupe a Niterói
6.  O Açaí que Todo Mundo Comentou
7.  Casamentos, 15 Anos, Corporativo
8.  Fotos Lindas Garantidas na Festa
9.  Equipe Profissional · Pontual
10. Sem Preocupação no Dia do Evento
11. Experiência Interativa p/ Convidados
12. Abertura Livre · Convidados Adoram
13. Referência em Eventos no Subúrbio
14. Do Casamento à Confraternização
15. Convidados Se Servem à Vontade
```

**Descriptions (4):**

```
1. "A estação foi o ponto alto da festa — convidados não largaram a mesa a noite inteira."
2. Equipe uniformizada, açaí cremoso e toppings Nutella, Leite Ninho e Ovomaltine.
3. Agendamos 1 evento por data — sua festa recebe atenção 100% da nossa equipe.
4. Reserve online com segurança total. Confirmação imediata por e-mail. Sem burocracia.
```

---

### 2.7 Extensões de Anúncio

#### Sitelinks (adicionar em todas as campanhas)

| Texto do link | Descrição 1 | Descrição 2 | URL |
|---|---|---|---|
| Ver Pacotes e Preços | A partir de R$ 1.490 | 6x sem juros no cartão | /#pacotes |
| Simular Orçamento | Calcule para seu evento | Em menos de 1 minuto | /#orcamento |
| Ver Galeria de Fotos | Eventos reais realizados | Fotos e depoimentos | /#galeria |
| Dúvidas Frequentes | Duração, pagamento e mais | Tudo que você precisa saber | /#faq |
| Blog — Dicas de Eventos | Guias completos gratuitos | Casamento, 15 anos e mais | /blog |

#### Callouts (frases curtas de destaque)

```
✓ 4 Horas de Atendimento Ativo
✓ Reserva 100% Online
✓ Pagamento Seguro via Stripe
✓ Pix com Desconto
✓ 6x Sem Juros no Cartão
✓ Sem Taxa Oculta
✓ Logística Inclusa
✓ 15+ Toppings Premium
✓ Equipe Uniformizada
✓ 1 Evento por Data
✓ Exclusividade Garantida
✓ Zona Norte do RJ
```

#### Structured Snippets

| Cabeçalho | Valores |
|---|---|
| Tipos de eventos | Casamentos, Aniversários, 15 Anos, Corporativo, Formaturas, Festas Infantis |
| Regiões atendidas | Zona Norte RJ, Niterói, Baixada Fluminense, Rio de Janeiro |
| O que está incluso | Açaí Gourmet, Sorvete Premium, Mesa de Toppings, Equipe, Logística |
| Formas de pagamento | Pix, Cartão 6x Sem Juros, Parcelamento |

#### Call Extension

```
Número: (21) 98174-9450
Horário: 08h – 22h (seg–dom)
```

---

## 3. META ADS — PLANEJAMENTO COMPLETO

### 3.1 Estrutura de Funil Recomendada

```
FASE 1 — CONSCIENTIZAÇÃO (Tráfego/Alcance)
→ Público frio, CPM baixo, construir audiência de retargeting
→ Duração: 2–3 semanas antes de avançar

FASE 2 — CONSIDERAÇÃO (Leads/Engajamento)
→ Público frio + retargeting leve, otimizar para Lead
→ Objetivo: formulário de orçamento preenchido

FASE 3 — CONVERSÃO (Purchase/InitiateCheckout)
→ Retargeting quente + Lookalike de compradores
→ Objetivo: Compra (evento Purchase no Pixel)
```

---

### 3.2 Audiências

#### Públicos Frios (Cold — para escala)

**Público Frio 1 — Noivas e Planejamento de Casamento**
```
Localização: Rio de Janeiro + 40km raio
Interesses: Noivado, Planejamento de casamento, Vestidos de noiva, Casamento,
            Salão de festas, Decoração de casamento, Buquê de casamento
Status de relacionamento: Noiva/Noivo
Faixa etária: 22–40 anos
Gênero: Todos
Tamanho estimado: 80k–200k pessoas
```

**Público Frio 2 — Mães e Festas Infantis**
```
Localização: Rio de Janeiro + 40km raio
Interesses: Festas infantis, Aniversários de crianças, Decoração festa infantil,
            Bolo de aniversário, Party planning, Buffet infantil
Faixa etária: 25–45 anos
Gênero: Todos
```

**Público Frio 3 — Organizadores de Eventos e Entretenimento**
```
Localização: Rio de Janeiro + 40km raio
Interesses: Organização de eventos, Planejamento de festas, Buffet, Decoração de eventos,
            Eventos e entretenimento, Party supplies
Comportamento: Engajou com eventos recentemente
```

**Público Frio 4 — Amplo Zona Norte (geográfico)**
```
Localização: Bairros específicos — Guadalupe, Marechal Hermes, Irajá, Pavuna,
             Bangu, Campo Grande, Vila da Penha, Penha, Olaria, Ramos, Colégio,
             Anchieta, Deodoro, Santíssimo
Interesses amplos: festas e eventos, sobremesas, casamento
Faixa etária: 22–55 anos
```

#### Retargeting (Warm)

| Audiência | Janela | Fonte | Prioridade |
|---|---|---|---|
| Todos os visitantes do site | 30 dias | Pixel PageView | Alta |
| Visitaram `/reserva` | 14 dias | Pixel PageView URL | Máxima |
| Evento `Lead` (formulário) | 30 dias | Pixel Lead | Alta |
| Evento `InitiateCheckout` | 14 dias | Pixel InitiateCheckout | Máxima |
| Seguidores Instagram | — | Instagram | Média |
| Engajaram com posts | 60 dias | Instagram/Facebook | Média |

#### Lookalike (escala qualificada)

```
LAL 1% — Baseado em: evento Purchase (compradores reais) — Rio de Janeiro
LAL 2% — Baseado em: evento Lead (leads) — Rio de Janeiro
LAL 3-5% — Para escala maior após 50+ conversões
```

---

### 3.3 Criativos — Direcionamento por Imagem

#### Imagem 1: `acai-cremoso-colher.jpg` — Açaí cremoso na colher (HERO)

**Objetivo:** Conversão / Leads
**Audiência:** Frio geral + retargeting visitantes
**Formato:** Feed 1:1 e Stories 9:16

**Texto principal (3 variações):**
```
VARIAÇÃO A:
Aquele açaí cremoso, sem cristal de gelo, com Nutella e Leite Ninho à vontade — mas servido
na festa dos seus convidados. 🍇

A Estação Gourmet do Recanto do Açaí vai até o seu evento no RJ. Equipe uniformizada,
15+ toppings premium e 4 horas de atendimento.

👉 Simule seu orçamento agora — data bloqueada na hora.

---

VARIAÇÃO B:
Sabe aquele açaí que todo mundo para pra tirar foto?

É assim na estação do Recanto — cremoso, fresquinho e com toppings ilimitados liberados
pra todos os convidados.

Casamento, 15 anos, aniversário, corporativo. 4 horas de serviço, equipe treinada,
reserva online.

Parcele em 6x sem juros 💳

---

VARIAÇÃO C:
Seu evento merecia uma sobremesa à altura. 🏆

Estação de açaí e sorvete gourmet, montada dentro da sua festa, com atendentes
uniformizados servindo na hora por 4 horas.

✅ 15+ toppings premium inclusos
✅ Reserva online segura
✅ A partir de R$ 248/mês (6x sem juros)

→ Garanta sua data agora
```

**Headlines:** `Estação de Açaí no Seu Evento` / `Açaí Gourmet para Festas no RJ` / `Reserve Sua Data Online`
**CTA:** Saiba Mais / Reservar Agora

---

#### Imagem 2: `eventos/festa-tema-rei-leao.jpg` — Festa temática Rei Leão

**Objetivo:** Conscientização + Tráfego
**Audiência:** Mães / festas infantis
**Formato:** Feed + Stories

**Texto principal:**
```
VARIAÇÃO A:
A sobremesa que roubou a cena na festa do Rei Leão! 👑🍇

Estação de açaí e sorvete gourmet do Recanto — perfeita para temas de festa infantil.
Os pequenos amam, os pais adoram e todo mundo tira foto!

📸 Cabe em qualquer temática
🍦 Açaí + Sorvete gourmet
🎉 Para festas infantis em todo o RJ

Simule agora e veja o valor exato para o seu evento →

---

VARIAÇÃO B:
Festinha temática? A estação do Recanto encaixa em qualquer decoração. 🎈

Nossos atendentes chegam, montam e servem açaí e sorvete gourmet com capricho — enquanto
você curte a festa do seu filho sem estresse.

Mais de 100 eventos realizados em todo o Rio de Janeiro.
```

**Headlines:** `Açaí na Festa do Seu Filho` / `Estação Gourmet p/ Festas Infantis` / `Monte o Orçamento Online`
**CTA:** Saiba Mais

---

#### Imagem 3: `estacao/estacao-atendente-salao.jpg` — Atendente no salão

**Objetivo:** Leads / Conversão
**Audiência:** Noivas / planejamento de casamento
**Formato:** Feed

**Texto principal:**
```
VARIAÇÃO A:
Quando a sobremesa do casamento vira o ponto alto da noite. 💍🍇

A equipe do Recanto do Açaí chega uniformizada, monta a estação em 25 minutos
e serve açaí cremoso e sorvete gourmet para todos os seus convidados por 4 horas.

Você só precisa nos dizer onde montar.

✔ Nutella, Leite Ninho, Ovomaltine e mais de 15 toppings
✔ Reserva online com pagamento seguro
✔ 6x sem juros no cartão

---

VARIAÇÃO B:
Sua equipe tem tudo sob controle no dia do casamento. Mas quem cuida da sobremesa?

A gente. 🍦

Estação de açaí e sorvete gourmet do Recanto — atendimento profissional, equipe
uniformizada, zero trabalho para os noivos.

Pacote Combo a partir de 6x de R$ 281 sem juros 💳
```

**Headlines:** `Estação de Açaí no Seu Casamento` / `Equipe Uniformizada · 4h de Serviço` / `Reserve com 6x Sem Juros`
**CTA:** Reservar Agora

---

#### Imagem 4: `produtos/acai-premium-taca.jpg` — Açaí em taça premium

**Objetivo:** Engajamento / Retargeting
**Audiência:** Visitantes do site (retargeting)
**Formato:** Feed + Stories

**Texto principal:**
```
VARIAÇÃO A (retargeting — visitou mas não converteu):
Você visitou nossa página. Sua data ainda está disponível? 📅

As datas de fim de semana no RJ esgotam rápido — especialmente sábados de dezembro,
alta temporada de 15 anos e casamentos.

Simule agora em menos de 1 minuto. Pagamento via Pix ou 6x sem juros.
Data bloqueada imediatamente. →
```

**Headlines:** `Sua Data Ainda Está Disponível?` / `Finalize Sua Reserva Agora` / `Datas Esgotam Rápido no RJ`
**CTA:** Reservar Agora

---

#### Imagem 5: `estacao/estacao-complementos.jpg` — Mesa de toppings

**Objetivo:** Conscientização
**Audiência:** Frio (organizadores de eventos)
**Formato:** Feed + Carrossel (slide 1)

**Texto principal:**
```
15+ toppings premium liberados à vontade para todos os seus convidados. 🍫✨

Nutella original. Leite Ninho. Ovomaltine crocante. Granola. Frutas frescas. Caldas.
Waffer. Paçoca. E muito mais.

Tudo incluso no pacote. Nada cobrado à parte.

Estação de açaí e sorvete gourmet do Recanto do Açaí — Zona Norte do Rio de Janeiro.
Para eventos em todo o RJ.
```

**Headlines:** `15+ Toppings Premium Inclusos` / `Nutella e Leite Ninho na Festa` / `Tudo Incluso no Pacote`
**CTA:** Saiba Mais

---

#### Imagem 6: `eventos/equipe-recanto-evento.jpg` — Equipe em evento

**Objetivo:** Conversão
**Audiência:** Retargeting + LAL compradores
**Formato:** Feed

**Texto principal:**
```
Essa é a equipe do Recanto do Açaí. Uniformizados, treinados e prontos para fazer
da sua festa um evento inesquecível. 🏆

✅ Chegamos com antecedência
✅ Montamos em 25 minutos
✅ Servimos por 4 horas completas
✅ Cuidamos da desmontagem no final

Você não precisa se preocupar com nada.

Reserva online agora → 6x sem juros no cartão.
```

**Headlines:** `Equipe Profissional · 4h no Seu Evento` / `Zero Estresse no Dia da Festa` / `Reserva Online Segura`
**CTA:** Reservar Agora

---

#### Imagem 7: `produtos/creme-flocos.jpg` + Imagem 8: `sorvete-flocos-gourmet.jpg`

**Uso:** Slides 2 e 3 do carrossel / Stories alternados
**Objetivo:** Mostrar a qualidade do produto
**Copy:** Foco no produto, não no preço

---

### 3.4 Carrossel Recomendado (sequência de slides)

| Slide | Imagem | Headline do slide | Texto curto |
|---|---|---|---|
| 1 (capa) | `estacao-complementos.jpg` | 15+ Toppings Premium Inclusos | Mesa completa liberada à vontade |
| 2 | `acai-cremoso-colher.jpg` | Açaí Ultra Cremoso · Sem Cristais | Fórmula premium servida na hora |
| 3 | `creme-flocos.jpg` | Sorvete Gourmet no Combo | Açaí E Sorvete — os dois! |
| 4 | `estacao-atendente-salao.jpg` | Equipe Uniformizada · 4 Horas | Atendentes treinados e dedicados |
| 5 | `equipe-recanto-evento.jpg` | 100+ Eventos Realizados no RJ | Experiência real, resultado garantido |
| CTA final | — | Reserve Sua Data Agora | A partir de 6x de R$ 248 sem juros |

**Texto principal do carrossel:**
```
Da mesa de toppings ao açaí cremoso na colher — a Estação Gourmet do Recanto do Açaí
leva tudo incluso para o seu evento. 🍇

Deslize para ver o que está no pacote →

Casamentos · 15 Anos · Festas Infantis · Corporativo
Zona Norte RJ · Niterói · Baixada Fluminense

Parcele em 6x sem juros 💳 ou pague via Pix com desconto
```

---

### 3.5 Formatos e Especificações Técnicas

| Formato | Dimensão | Uso principal | Imagens recomendadas |
|---|---|---|---|
| Feed quadrado | 1080 × 1080 px | Descoberta, alcance | acai-cremoso-colher, estacao-complementos |
| Feed retrato | 1080 × 1350 px | Maior área visual no feed | equipe-recanto-evento, atendente-salao |
| Stories/Reels | 1080 × 1920 px | Mobile-first, urgência | Composição com texto sobreposto |
| Carrossel | 1080 × 1080 px (cada slide) | Educação e produto | Sequência completa acima |

**Texto seguro para Stories (zona central 1080×1420px):** Manter elementos importantes longe das bordas superior (160px) e inferior (250px).

---

### 3.6 Roteiros de Vídeo para Reels/Stories (15–30 segundos)

> Gravar com celular vertical (9:16), luz natural ou boa iluminação artificial, fundo limpo ou na estação montada.

#### Roteiro 1 — "A montagem" (15s)

```
[0–3s] Timelapse ou corte rápido: caixas chegando, mesa sendo montada
[3–8s] Close na mesa de toppings sendo organizada (lenta, caprichada)
[8–12s] Atendente uniformizado servindo o copo de açaí na colher
[12–15s] Copo finalizado com todos os toppings — zoom out
LEGENDA: "25 minutos de montagem. 4 horas de sorrisos. 🍇 Link na bio."
MÚSICA: Trending no Reels, animada
```

#### Roteiro 2 — "Reação dos convidados" (20–30s)

```
[0–5s] POV de convidado chegando na estação (câmera se aproxima da mesa)
[5–12s] Convidado montando o próprio copo com os toppings (mãos em close)
[12–18s] Reação do convidado provando (sorriso, aprovação)
[18–25s] Fila pequena e animada na estação (prova social visual)
[25–30s] Logo Recanto + "Reserve pelo link na bio"
LEGENDA: "Quando a sobremesa vira o ponto alto da festa 🏆"
```

#### Roteiro 3 — "Antes e depois" (20s)

```
[0–3s] Salão vazio, espaço reservado para estação
[3–8s] Timelapse de montagem rápida
[8–15s] Estação pronta, belíssima, com toppings organizados
[15–18s] Convidados se servindo felizes
[18–20s] Text overlay: "Garanta sua data — link na bio 🍇"
LEGENDA: "Do salão vazio à sobremesa mais elogiada da festa. Em 25 minutos. ✨"
```

---

### 3.7 Configurações de Campanha Meta Ads

#### Campanha de Tráfego/Conscientização (Fase 1)

```
Objetivo: Tráfego (cliques no site) ou Alcance
Orçamento: R$ 20/dia
Duração: 2–3 semanas
Público: Frio (interesses)
Otimização: Cliques no link
Placement: Feed Instagram + Stories (automático Meta)
Pixel: ✅ Instalado (PageView)
URL: https://recanto-eventos.vercel.app
```

#### Campanha de Leads (Fase 2)

```
Objetivo: Leads
Orçamento: R$ 30/dia
Público: Frio + Retargeting visitantes 30 dias
Otimização: Evento Lead (Meta Pixel)
Pixel: ✅ evento Lead configurado
URL: https://recanto-eventos.vercel.app/#orcamento
```

#### Campanha de Conversão (Fase 3)

```
Objetivo: Vendas / Conversões
Orçamento: R$ 40–R$ 60/dia
Público: Retargeting quente + LAL 1-2%
Otimização: Evento Purchase (Meta Pixel) ou InitiateCheckout
Pixel: ✅ evento Purchase configurado com valor real
URL: https://recanto-eventos.vercel.app/reserva
Nota: Ativar apenas com 50+ eventos Purchase/mês para otimização real
```

---

## 4. COPY APROVADA — BANCO DE TEXTOS

> Fonte única de verdade para criar criativos, captions, emails e anúncios.

### 4.1 Hero / Proposta de Valor

**Headline principal:**
> "Estação de Açaí e Sorvete Gourmet para Eventos — Torne seu evento inesquecível"

**Subtítulo:**
> "Açaí cremoso e sorvete gourmet servidos na hora, com 15+ toppings premium liberados à vontade para todos os seus convidados."

**Stats de prova:**
- 4 Horas de evento
- 15+ Toppings Premium à vontade
- Até 6x Sem Juros (Pix ou Cartão)
- 100+ Eventos realizados no RJ

**CTA principal:** "Garantir sua Data"
**CTA secundário:** "Simular orçamento"
**Nota de exclusividade:** "Garantia de atendimento exclusivo: apenas 1 evento próprio atendido por dia 🔒"

---

### 4.2 Pacotes

| Pacote | Preço à vista | Parcelado | Tagline |
|---|---|---|---|
| Açaí ou Sorvete | R$ 1.490 | 6x de R$ 248,33 sem juros | "A escolha clássica da nossa Estação Gourmet" |
| Combo Açaí + Sorvete ⭐ | R$ 1.690 | 6x de R$ 281,67 sem juros | "A Estação Gourmet completa para seu evento" |
| + Sabor extra premium | + R$ 350 | — | "Aquele sabor especial pra impressionar" |
| + Sabor extra normal | + R$ 250 | — | "Mais variedade pra alegrar os convidados" |

**Anchor do Combo:**
> "Por apenas R$ 200 a mais, você leva a Estação Gourmet completa: Açaí E Sorvete. Mais de 70% dos nossos clientes escolhem o combo — a melhor escolha para garantir que 100% dos convidados saiam satisfeitos."

---

### 4.3 Diferenciais (O que está incluso)

```
✅ Açaí & Sorvete Gourmet — fórmula ultra cremosa, livre de cristais de gelo
✅ Mesa de Toppings Premium — 15+ opções incluindo Nutella, Leite Ninho, Ovomaltine
✅ Equipe Especializada — atendentes uniformizados e treinados
✅ Logística Completa — transporte, montagem (~25 min) e desmontagem (~15 min)
✅ 4 Horas de Atendimento Ativo
✅ Pagamento totalmente seguro via Stripe
✅ 1 Evento por Data — exclusividade garantida
✅ Reserva 100% online
```

---

### 4.4 Depoimentos (5 estrelas — reais)

```
⭐⭐⭐⭐⭐ Aline Ferreira — Casamento · Penha
"A estação de açaí foi o ponto alto da festa. Montaram tudo na hora e os convidados
não largaram a mesa a noite inteira. Fizemos a reserva toda pelo site, super simples e prático."

⭐⭐⭐⭐⭐ Carla Mendes — 15 Anos · Guadalupe
"Minha filha ficou encantada e os convidados elogiaram muito. Profissionais demais,
tudo muito organizado e bonito. Valeu cada centavo!"

⭐⭐⭐⭐⭐ Juliana Souza — Festa Infantil · Irajá
"Contratei para o aniversário de 1 ano do meu filho. A equipe chegou no horário,
montou rápido e serviu com muito cuidado. Todos os convidados amaram. Super recomendo!"

⭐⭐⭐⭐⭐ Marina Castro — Chá Revelação · Marechal Hermes
"Achei que ia ser difícil de organizar, mas foi o oposto. Tudo resolvido pelo site,
sem precisar falar com ninguém. No dia, só aproveitei. Incrível!"

⭐⭐⭐⭐⭐ Roberto Lima — Aniversário · Bangu
"Excelente serviço do começo ao fim. Chegaram na hora certa, montaram rápido,
serviram com capricho e ainda desmontaram tudo sem dar trabalho. Nota 10!"

⭐⭐⭐⭐⭐ Fernanda Gomes — Formatura · Vila da Penha
"Fizemos no final de semana e foi um sucesso absoluto. A fila na estação de açaí
não parou. Todo mundo pediu o contato de vocês. Já indiquei pra três amigas!"
```

---

### 4.5 FAQ — Respostas Aprovadas

**P: Como confirmo a disponibilidade da minha data?**
> Basta simular o seu orçamento no nosso formulário. Ao avançar, nosso sistema verifica a agenda em tempo real e permite que você trave o seu dia imediatamente com o pagamento online.

**P: Vocês decoram a mesa?**
> O nosso serviço inclui a estação de açaí/sorvete premium, acompanhamentos liberados e a equipe uniformizada servindo. A decoração da mesa fica por conta da sua equipe de decoração, para combinar perfeitamente com o seu tema.

**P: Quantos convidados o pacote atende?**
> Nossos pacotes base atendem com excelência festas de até 120 convidados. Se o seu evento for maior, você pode simular os convidados adicionais diretamente no formulário de orçamento.

**P: Quantas horas dura o serviço?**
> O atendimento ativo dura 4 horas — tempo mais que suficiente para todos os seus convidados se servirem à vontade. Nossa equipe chega cerca de 25 minutos antes para montar a estação e cuida da desmontagem ao final, em aproximadamente 15 minutos.

**P: Quais as formas de pagamento e é seguro?**
> Sim, é 100% totalmente seguro. Você pode pagar em até 6x sem juros no Cartão de Crédito ou via Pix com aprovação imediata para travar a data.

**P: Atendem qual região?**
> Somos do Rio de Janeiro e atendemos a capital, Baixada Fluminense (taxa de R$ 150) e Niterói (taxa de R$ 250). O frete é calculado de forma clara no fechamento.

**P: O que está incluso no preço?**
> Equipe uniformizada e treinada, estação completa, insumos premium e toppings liberados à vontade por 4 horas de atendimento ativo. Sem taxas ocultas.

---

### 4.6 CTAs Aprovados (usar em anúncios)

```
Primários (conversão):
→ "Reserve Sua Data Agora"
→ "Garantir Minha Data"
→ "Simular Orçamento Grátis"
→ "Ver Pacotes e Preços"

Urgência:
→ "Datas Esgotam — Reserve Agora"
→ "Sua Data Ainda Está Disponível?"
→ "Últimas Datas de [mês] Disponíveis"

Suaves (topo de funil):
→ "Saiba Mais"
→ "Ver Como Funciona"
→ "Ver Galeria de Eventos"
```

---

## 5. CHECKLIST PRÉ-CAMPANHA

### Rastreamento

- [x] GTM instalado (GTM-K5DK33L3) e disparando
- [x] GA4 instalado (G-K3SWZDFF95) com lazyOnload
- [x] Google Ads tag (AW-17856564369) instalada
- [x] Meta Pixel (988443594032737) instalado e verificado
- [x] Evento `generate_lead` disparando no formulário
- [x] Evento `begin_checkout` disparando na página de reserva
- [x] Evento `purchase` disparando após pagamento
- [x] Evento `Lead` Meta Pixel funcionando
- [x] Evento `InitiateCheckout` Meta Pixel funcionando
- [x] Evento `Purchase` Meta Pixel com valor real
- [ ] Conversões Google Ads "Adicionar ao carrinho" e "Solicitar cotação" → **RECRIAR como GA4 Import**
- [ ] Conversão "Compra" Google Ads → aguardar 1ª venda para validar status "Requer atenção"
- [ ] Remover `NEXT_PUBLIC_META_TEST_CODE` da Vercel após testes concluídos

### Criativos

- [ ] Foto `acai-cremoso-colher.jpg` — criativo feed formato 1:1 (arte finalizada)
- [ ] Foto `estacao-complementos.jpg` — slide 1 do carrossel
- [ ] Carrossel completo (5 slides) montado no Canva ou similar
- [ ] Vídeo Roteiro 1 ("a montagem") gravado e editado
- [ ] Vídeo Roteiro 2 ("reação dos convidados") gravado e editado
- [ ] Stories com CTA "Reserve Agora" e link para a landing page

### Google Ads

- [ ] Campanhas 1, 2 e 3 criadas com estrutura de grupos definida acima
- [ ] RSA 1, 2 e 3 criados em cada grupo de anúncio
- [ ] Sitelinks configurados
- [ ] Callouts configurados (todos 12 listados)
- [ ] Structured Snippets configurados
- [ ] Call Extension configurada ((21) 98174-9450)
- [ ] Keywords negativas adicionadas em nível de campanha
- [ ] Localização configurada (Rio de Janeiro + 40km raio)
- [ ] Rastreamento de conversões vinculado ao GA4

### Meta Ads

- [ ] Business Manager configurado com o Pixel vinculado
- [ ] Públicos de interesse criados (4 públicos frios)
- [ ] Audiência de retargeting: todos visitantes 30 dias criada
- [ ] Audiência de retargeting: visitantes `/reserva` 14 dias criada
- [ ] LAL 1% baseado em Purchase criado (mínimo 100 eventos para ativar)
- [ ] Campanha Fase 1 criada (tráfego)
- [ ] Criativos aprovados no Meta Ads Manager

### Página de Destino (Landing Page)

- [x] Velocidade de carregamento otimizada (imagens comprimidas -91%)
- [x] Lazy loading para seções abaixo do fold
- [x] Formulário de orçamento funcional
- [x] Página `/reserva` funcional com Stripe
- [x] Página `/obrigado` com evento Purchase disparando
- [x] FAQ visível com resposta sobre duração (4 horas)
- [x] Prova social (6 depoimentos 5★) visível

---

## 6. ORÇAMENTOS E METAS SUGERIDOS

### 6.1 Orçamento Mensal — Fase Inicial (mês 1–2)

| Canal | Orçamento Diário | Orçamento Mensal | Objetivo |
|---|---|---|---|
| Google Ads — Campanha 1 (Serviço) | R$ 30 | R$ 900 | Leads qualificados |
| Google Ads — Campanha 2 (Tipo de Evento) | R$ 25 | R$ 750 | Leads segmentados |
| Google Ads — Campanha 3 (Região) | R$ 10 | R$ 300 | Tráfego de baixo CPC |
| Meta Ads — Tráfego/Conscientização | R$ 20 | R$ 600 | Construir audiência |
| Meta Ads — Leads | R$ 30 | R$ 900 | Formulários preenchidos |
| **TOTAL** | **R$ 115/dia** | **~R$ 3.450/mês** | — |

### 6.2 Orçamento Mensal — Fase de Escala (mês 3+)

| Canal | Orçamento Diário | Orçamento Mensal |
|---|---|---|
| Google Ads (todas campanhas) | R$ 80 | R$ 2.400 |
| Meta Ads — Tráfego | R$ 20 | R$ 600 |
| Meta Ads — Leads | R$ 40 | R$ 1.200 |
| Meta Ads — Conversão (Retargeting + LAL) | R$ 50 | R$ 1.500 |
| **TOTAL** | **R$ 190/dia** | **~R$ 5.700/mês** |

---

### 6.3 Metas e KPIs

| Métrica | Meta Fase 1 | Meta Fase 2 | Como medir |
|---|---|---|---|
| CTR Google Ads | ≥ 4% | ≥ 6% | Google Ads → Desempenho |
| CPC médio Google | ≤ R$ 6,00 | ≤ R$ 4,50 | Google Ads |
| Taxa de conversão do site | ≥ 2% | ≥ 4% | GA4 — `begin_checkout / sessions` |
| CPL (custo por lead) | ≤ R$ 35 | ≤ R$ 20 | GA4 / Meta Ads Manager |
| Custo por Checkout Iniciado | ≤ R$ 80 | ≤ R$ 50 | Google Ads / Meta |
| Custo por Reserva (CPA) | ≤ R$ 350 | ≤ R$ 200 | Conversão "Compra" |
| ROAS mínimo | 4x | 6x | (Receita / Gasto em Ads) |
| Reservas/mês via Ads | 4–6 | 10–15 | GA4 evento `purchase` |

**Exemplo de ROAS:** 5 reservas × R$ 1.590 (ticket médio) = R$ 7.950 receita / R$ 3.450 gasto = **ROAS 2,3x** no mês 1 (abaixo da meta — normal no início). Meta: 4x+ ao estabilizar.

---

### 6.4 Acompanhamento Semanal (Review toda segunda-feira)

```
GOOGLE ADS:
□ Impressões e CTR por campanha
□ CPC médio vs meta
□ Palavras-chave com maior gasto — pausing se CPC > R$ 10 sem conversão
□ Search terms report — adicionar novas negativas se necessário
□ Qualidade dos anúncios (RSA rating: Poor / Good / Excellent)

META ADS:
□ Alcance e frequência por público (frequência > 3 → renovar criativo)
□ CPM e CTR por criativo
□ Custo por Lead
□ Resultados de retargeting vs cold traffic
□ Criativos exaustos (CTR caindo > 30% semana a semana)

GA4:
□ Sessões totais e por origem (google / cpc / meta / organic)
□ Taxa de engajamento
□ Funil: sessões → selecao_pacote → generate_lead → begin_checkout → purchase
□ Páginas de saída — onde os usuários estão abandonando

AÇÕES:
□ Pausar keywords ou públicos com CPA > 2x da meta
□ Escalar campanhas com ROAS > 4x (+20-30% orçamento por semana)
□ A/B testar novos criativos a cada 2 semanas
```

---

## APÊNDICE — ARQUIVOS DE REFERÊNCIA

| Arquivo | Localização | Conteúdo |
|---|---|---|
| GTM Container | `marketing/gtm-container-recanto.json` | Exportação do contêiner GTM |
| Copywriting | `marketing/copywriting-anuncios.md` | Copy anterior de anúncios |
| Conteúdo do site | `lib/content.ts` | Fonte única de verdade — toda copy da LP |
| Rastreamento | `lib/tracking.ts` | Todos os eventos GA4/Meta/GTM |
| Analytics | `components/Analytics.tsx` | Snippets GTM, GA4, Meta Pixel |
| Blog | `content/blog/` | 7 artigos SEO com link building interno |

---

*Documento gerado em 2026-06-28 — Recanto do Açaí · MSC Company*

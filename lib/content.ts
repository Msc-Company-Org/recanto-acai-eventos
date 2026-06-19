// ============================================================
// Recanto do Açaí · Estações — conteúdo da landing de eventos
// Toda a copy vive aqui (fonte única de verdade).
// TODO(Moisés): revisar os itens marcados com [CONFIRMAR].
// ============================================================

export const site = {
  name: "Recanto do Açaí",
  brandTag: "Estações",
  // [CONFIRMAR] número oficial do Recanto (hoje é o mesmo do Prometheus/MSC).
  whatsapp: "5521981749450",
  whatsappDisplay: "(21) 98174-9450",
  region: "Guadalupe · Marechal Hermes — Zona Norte do Rio de Janeiro",
  // [CONFIRMAR] raio de atendimento + taxa de deslocamento.
  serviceArea: "Atendemos o Rio de Janeiro e região",
  url: "https://eventos.recantodoaçaiestações.com.br",
  instagram: "https://instagram.com/recanto_do_acai_guadalule",
  instagramHandle: "@recanto_do_acai_guadalule",
  tiktok: "https://www.tiktok.com/@recantodoacaiestacoes",
  tiktokHandle: "@recantodoacaiestacoes",
  facebook: "https://facebook.com/recantomarechal",
} as const;

// Pacote base — [CONFIRMAR] todos estes números com o Moisés.
export const baseService = {
  durationHours: 3,
  guests: 50,
  includedFlavors: 2,
  attendants: 1,
} as const;

export const nav = [
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "O que inclui", href: "/#inclui" },
  { label: "Pacotes", href: "/#pacotes" },
  { label: "Dúvidas", href: "/#faq" },
  { label: "Blog", href: "/blog" },
] as const;

export const hero = {
  badge: "Estações Gourmet · Eventos premium no RJ",
  titleLead: "A estação de açaí e sorvete que vira o",
  titleHighlight: "ponto alto da sua festa",
  subtitle:
    "Insumos premium, açaí e sorvete servidos na hora pela nossa equipe — para casamentos, 15 anos, aniversários e qualquer celebração. Você cuida da festa; a gente leva a experiência.",
  ctaPrimary: "Pedir orçamento no WhatsApp",
  ctaSecondary: "Ver pacotes e preços",
  stats: [
    { value: "Na hora", label: "Servido fresquinho" },
    { value: "15+", label: "Acompanhamentos" },
    { value: "Premium", label: "Açaí & sorvete" },
  ],
};

export const eventTypes = {
  title: "Para qualquer celebração",
  subtitle: "Do casamento ao chá revelação — a gente adoça todos os momentos.",
  items: [
    { icon: "Heart", label: "Casamentos" },
    { icon: "Crown", label: "15 anos" },
    { icon: "Cake", label: "Aniversário de 1 ano" },
    { icon: "Baby", label: "Chá revelação" },
    { icon: "PartyPopper", label: "Festa infantil" },
    { icon: "GraduationCap", label: "Formaturas" },
    { icon: "Users", label: "Festa de rua / condomínio" },
    { icon: "Briefcase", label: "Corporativo" },
  ],
};

export const howItWorks = {
  title: "Como funciona",
  subtitle: "Simples assim — em 4 passos.",
  steps: [
    {
      n: "01",
      title: "Escolha o pacote",
      desc: "Açaí, sorvete ou o combo com os dois. Você decide o que combina com a sua festa.",
    },
    {
      n: "02",
      title: "Defina sabores e data",
      desc: "Monte os sabores, escolha a data e reserve com a gente pelo WhatsApp.",
    },
    {
      n: "03",
      title: "A gente leva e serve",
      desc: "Levamos tudo e nossa equipe serve na hora, durante todo o seu evento.",
    },
    {
      n: "04",
      title: "Você só curte",
      desc: "Seus convidados se deliciam e você aproveita a festa sem preocupação.",
    },
  ],
};

export const included = {
  title: "O que está incluso",
  subtitle:
    "Você cuida da decoração do seu jeito. A gente leva o sabor e o serviço completo.",
  items: [
    {
      icon: "IceCream",
      title: "Açaí e/ou sorvete premium",
      desc: "Cremosidade de verdade, sem cristais de gelo — aquele sabor que todo mundo lembra.",
    },
    {
      icon: "Utensils",
      title: "Mesa de acompanhamentos",
      desc: "Mais de 15 itens: frutas, granola, leite em pó, cremes, caldas e crocantes.",
    },
    {
      icon: "UserCheck",
      title: "Equipe uniformizada",
      desc: "Atendente(s) servindo na hora durante todo o evento, com simpatia e capricho.",
    },
    {
      icon: "Truck",
      title: "Logística sob medida",
      desc: "Levamos os insumos e montamos o ponto de serviço. Você só recebe a experiência pronta.",
    },
  ],
  note: "Atendimento de aprox. [CONFIRMAR: 3h] · pensado para [CONFIRMAR: ~50] convidados · [CONFIRMAR: 2] sabores inclusos. Precisa de mais? A gente personaliza.",
};

export const packages = {
  title: "Pacotes & preços",
  subtitle: "Transparência total. Escolha o seu e reserve a data.",
  options: [
    {
      id: "unico",
      name: "Açaí ou Sorvete",
      price: 1490,
      tagline: "Escolha um e encante",
      features: [
        "Açaí premium OU sorvete (você escolhe)",
        "Mesa com +15 acompanhamentos",
        "Equipe uniformizada servindo na hora",
        "Insumos e logística inclusos",
      ],
      highlighted: false,
      cta: "Quero este pacote",
    },
    {
      id: "combo",
      name: "Açaí + Sorvete",
      price: 1690,
      tagline: "O combo que agrada todo mundo",
      badge: "Mais escolhido",
      features: [
        "Açaí premium E sorvete — os dois!",
        "Mesa com +15 acompanhamentos",
        "Equipe uniformizada servindo na hora",
        "Insumos e logística inclusos",
        "Agrada quem ama açaí e quem prefere sorvete",
      ],
      highlighted: true,
      cta: "Quero o combo",
    },
  ],
  anchorTitle: "Por que o combo vale mais a pena?",
  anchor:
    "Por apenas R$ 200 a mais que o pacote único, você leva açaí E sorvete. É a escolha mais inteligente — e a preferida dos nossos clientes.",
  addons: {
    title: "Quer turbinar a mesa?",
    items: [
      { name: "Sabor extra premium", price: 350, desc: "Aquele sabor especial pra impressionar." },
      { name: "Sabor extra normal", price: 250, desc: "Mais variedade pra alegrar os convidados." },
    ],
  },
};

export const flavors = {
  // [CONFIRMAR] lista real de acompanhamentos/sabores com o Moisés.
  title: "Mais de 15 acompanhamentos liberados",
  subtitle: "Ingredientes frescos e marcas que todo mundo ama.",
  groups: [
    { icon: "Apple", title: "Frutas frescas", items: ["Morango", "Banana", "Uva sem semente", "Kiwi"] },
    {
      icon: "Cookie",
      title: "Crocantes & pós",
      items: ["Granola", "Leite em pó", "Ovomaltine crocante", "Castanha", "Paçoca", "Confetes"],
    },
    {
      icon: "Candy",
      title: "Caldas & cremes",
      items: ["Leite condensado", "Creme de ninho", "Creme de avelã", "Calda de morango", "Chocolate"],
    },
  ],
};

export const differentials = {
  title: "Por que o Recanto do Açaí?",
  subtitle: "Nossa missão é fazer a sua mesa ser inesquecível.",
  items: [
    {
      icon: "Award",
      title: "Açaí & sorvete premium",
      desc: "Fórmula cremosa, sem cristais de gelo. Sabor que impressiona do primeiro ao último convidado.",
    },
    {
      icon: "Sparkles",
      title: "Servido na hora",
      desc: "Nada de potinhos prontos: nossa equipe monta cada porção na frente do seu convidado.",
    },
    {
      icon: "HandHeart",
      title: "Sem dor de cabeça",
      desc: "Levamos, servimos e cuidamos de tudo. Você só escolhe a decoração e aproveita a festa.",
    },
  ],
};

export const testimonials = {
  // [CONFIRMAR] substituir por depoimentos e fotos reais de eventos.
  title: "Quem provou, recomenda",
  subtitle: "Histórias de festas que ficaram ainda mais doces.",
  items: [
    {
      name: "Aniversário da Helena",
      event: "1 aninho · Marechal Hermes",
      text: "A estação foi o sucesso da festa! Todo mundo elogiou o açaí e o atendimento impecável.",
    },
    {
      name: "Casamento Ana & Léo",
      event: "Casamento · Zona Norte RJ",
      text: "Servido na hora, cremoso demais. Nossos convidados não pararam de voltar na mesa.",
    },
    {
      name: "15 anos da Bia",
      event: "Debutante · Guadalupe",
      text: "O combo de açaí e sorvete foi a melhor escolha. Profissionais e pontuais. Recomendo!",
    },
  ],
};

export const faq = {
  title: "Perguntas frequentes",
  items: [
    {
      q: "Qual a antecedência para reservar?",
      a: "Quanto antes, melhor — as datas mais concorridas esgotam rápido. Fale com a gente no WhatsApp e confirmamos a disponibilidade da sua data na hora.",
    },
    {
      q: "Vocês decoram a mesa?",
      a: "O nosso serviço é o açaí/sorvete premium + acompanhamentos servidos pela nossa equipe. A decoração da mesa fica por sua conta (ou da sua decoradora), do jeitinho que você imaginou.",
    },
    {
      q: "Quantos convidados o pacote atende?",
      a: "O pacote base é pensado para [CONFIRMAR: cerca de 50] convidados. Tem mais gente? A gente monta um orçamento sob medida pra você.",
    },
    {
      q: "Quais as formas de pagamento?",
      a: "Trabalhamos com as principais formas de pagamento, e a reserva da data é confirmada com um sinal. Combinamos todos os detalhes no WhatsApp.",
    },
    {
      q: "Atendem qual região?",
      a: "Somos da Zona Norte do Rio (Guadalupe / Marechal Hermes) e atendemos a cidade e região. Confirme a cobertura para o seu endereço no WhatsApp.",
    },
    {
      q: "O que está incluso no preço?",
      a: "Insumos premium, acompanhamentos, equipe uniformizada servindo na hora e toda a logística. Sem surpresas.",
    },
  ],
};

export const finalCta = {
  title: "Vamos adoçar o seu evento?",
  subtitle:
    "Conte a data e o tipo da sua festa. Em minutos preparamos seu orçamento, sem compromisso.",
  cta: "Pedir orçamento no WhatsApp",
};

export const footer = {
  tagline: "Estações de açaí e sorvete gourmet para eventos.",
  group: "Uma marca do grupo MSC Company.",
};

/** Mensagem padrão pré-preenchida do WhatsApp (CTA genérico). */
export const waDefaultMessage =
  "Olá, Recanto! 🍇 Vi a página de eventos e quero um orçamento. Pode me ajudar?";

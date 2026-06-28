// ============================================================
// Recanto do Açaí · Estações — conteúdo da landing de eventos
// Toda a copy vive aqui (fonte única de verdade).
// ============================================================

export const site = {
  name: "Recanto do Açaí",
  brandTag: "Estações",
  whatsapp: "5521981749450",
  whatsappDisplay: "(21) 98174-9450",
  region: "Guadalupe · Marechal Hermes — Zona Norte do Rio de Janeiro",
  serviceArea: "Atendemos o Rio de Janeiro e região",
  url: "https://eventos.xn--recantodoaaiestaes-hvbg80a.com.br",
  instagram: "https://www.instagram.com/recanto_do_acai_guadalule/",
  instagramHandle: "@recanto_do_acai_guadalule",
  tiktok: "https://www.tiktok.com/@recantodoacaiestacoes",
  tiktokHandle: "@recantodoacaiestacoes",
  facebook: "https://facebook.com/recantomarechal",
} as const;

export const baseService = {
  durationHours: 4,
  guests: 120,
  includedFlavors: 2,
  attendants: 1,
} as const;

export const nav = [
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "O que inclui", href: "/#inclui" },
  { label: "Galeria", href: "/#galeria" },
  { label: "Pacotes", href: "/#pacotes" },
  { label: "Orçamento", href: "/#orcamento" },
  { label: "Dúvidas", href: "/#faq" },
  { label: "Blog", href: "/blog" },
];

export const hero = {
  badge: "Estação Gourmet · Mais de 100 Eventos no Rio de Janeiro",
  titleLead: "Estação de Açaí e Sorvete Gourmet para Eventos —",
  titleHighlight: "Torne seu evento inesquecível",
  subtitle:
    "Açaí cremoso e sorvete gourmet servidos na hora, com 15+ toppings premium liberados à vontade para todos os seus convidados.\n\nSelecione a data e simule o valor para o seu número de convidados direto no calendário abaixo.",
  ctaPrimary: "Garantir sua Data",
  ctaSecondary: "Simular orçamento",
  ctaNote: "Garantia de atendimento exclusivo: apenas 1 evento próprio atendido por dia 🔒",
  stats: [
    { value: "4 Horas", label: "de evento" },
    { value: "À vontade", label: "15+ Toppings Premium" },
    { value: "Até 6x", label: "Sem Juros · Pix ou Cartão" },
    { value: "100+ Eventos", label: "no Rio de Janeiro" },
  ],
};

export const eventTypes = {
  title: "Para qualquer celebração",
  subtitle: "Do casamento ao aniversário de 1 ano — reserve a estação perfeita para o seu dia.",
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
  title: "Reserva em 4 passos simples",
  subtitle: "Tudo online direto na página, sem necessidade de chat ou burocracia.",
  steps: [
    {
      n: "01",
      title: "Escolha seu Menu",
      desc: "Selecione entre o pacote simples de Açaí ou Sorvete Gourmet, ou o nosso mais pedido Combo duplo para agradar a todos os convidados.",
    },
    {
      n: "02",
      title: "Simule Adicionais",
      desc: "Caso tenha mais de 120 convidados, configure os adicionais de tamanho diretamente no nosso formulário de orçamento.",
    },
    {
      n: "03",
      title: "Confirme o Pagamento",
      desc: "Pague de forma totalmente segura via Pix ou Cartão de Crédito (até 6x sem juros) para bloquear a data na nossa agenda oficial na hora.",
    },
    {
      n: "04",
      title: "Aproveite a Festa",
      desc: "Nossa Equipe Especializada chega com antecedência, monta a estação em cerca de 25 minutos e serve açaí e sorvete gourmet à vontade durante as 4 Horas de Evento. Você só aproveita!",
    },
  ],
};

export const included = {
  title: "Estação Gourmet · Estrutura e serviço inclusos",
  subtitle:
    "A Estação Gourmet do Recanto vai até você: montagem, Equipe Especializada e insumos premium no pacote. Você só escolhe onde a estação será montada.",
  items: [
    {
      icon: "IceCream",
      img: "/images/produtos/creme-flocos.jpg",
      title: "Açaí & Sorvete Gourmet",
      desc: "Fórmula ultra cremosa, livre de cristais de gelo e feita com insumos selecionados de alta qualidade — a base da nossa Estação Gourmet.",
    },
    {
      icon: "Utensils",
      img: "/images/estacao/estacao-complementos.jpg",
      title: "Mesa de Toppings Premium",
      desc: "Acompanhamentos liberados à vontade, com frutas cortadas no dia e marcas líderes de mercado para uma experiência premium.",
    },
    {
      icon: "UserCheck",
      img: "/images/eventos/equipe-recanto-evento.jpg",
      title: "Equipe Especializada",
      desc: "Atendentes uniformizados e treinados para servir a sua Estação Gourmet com simpatia, agilidade e total capricho.",
    },
    {
      icon: "Truck",
      img: "/images/estacao/estacao-atendente-salao.jpg",
      title: "Logística Sob Medida",
      desc: "Transporte, montagem e desmontagem da Estação Gourmet rápidos e silenciosos. Zero trabalho para o anfitrião.",
    },
  ],
  note: "4 Horas de Evento · pensado para até 120 convidados base · 2 sabores inclusos. Precisa de mais? A gente personaliza pra você.",
};

export const packages = {
  title: "Opções de Pacotes — Estação Gourmet",
  subtitle: "Garanta a exclusividade da sua data com pagamento online, totalmente seguro e imediato. Atendemos apenas 1 evento por data na agenda.",
  scarcity: "⚡ Reserva imediata — sua data bloqueada na hora",
  options: [
    {
      id: "unico",
      name: "Açaí ou Sorvete",
      price: 1490,
      tagline: "A escolha clássica da nossa Estação Gourmet",
      features: [
        "Estação Gourmet de Açaí premium OU Sorvete (você escolhe)",
        "Mesa de Toppings Premium liberada à vontade",
        "Equipe Especializada uniformizada servindo na hora",
        "Insumos e logística inclusos",
      ],
      highlighted: false,
      cta: "Quero este pacote",
    },
    {
      id: "combo",
      name: "Açaí + Sorvete",
      price: 1690,
      tagline: "A Estação Gourmet completa para seu evento",
      badge: "Mais escolhido",
      features: [
        "Estação Gourmet de Açaí premium E Sorvete — os dois!",
        "Mesa de Toppings Premium liberada à vontade",
        "Equipe Especializada uniformizada servindo na hora",
        "Insumos e logística inclusos",
        "Agrada quem ama açaí e quem prefere creme gourmet",
      ],
      highlighted: true,
      cta: "Quero o combo",
    },
  ],
  anchorTitle: "Por que o combo vale mais a pena?",
  anchor:
    "Por um investimento de apenas R$ 200 a mais, você leva a Estação Gourmet completa: Açaí E Sorvete. Mais de 70% dos nossos clientes escolhem o combo — a melhor escolha para garantir que 100% dos convidados saiam satisfeitos.",
  addons: {
    title: "Quer turbinar a Estação Gourmet?",
    items: [
      { name: "Sabor extra premium", price: 350, desc: "Aquele sabor especial pra impressionar." },
      { name: "Sabor extra normal", price: 250, desc: "Mais variedade pra alegrar os convidados." },
    ],
  },
};

export const flavors = {
  title: "Sabores e Acompanhamentos",
  subtitle: "Sabores de Açaí e Sorvetes Gourmet, acompanhados de toppings ilimitados.",
  groups: [
    {
      icon: "IceCream",
      title: "Sabores de Açaí & Sorvete",
      items: [
        "Açaí Tradicional",
        "Açaí de Morango",
        "Açaí de Banana",
        "Sorvete de Flocos",
        "Sorvete de Creme",
        "Sorvete de Morango",
        "Sorvete de Chocolate",
        "Sorvete de Baunilha",
        "Sorvete Napolitano",
      ],
    },
    {
      icon: "Cookie",
      title: "Crocantes & Granulados",
      items: ["Granola", "Ovomaltine Crocante", "Paçoca", "Amendoim Moido", "Granulado de Chocolate", "Leite em Pó"],
    },
    {
      icon: "Candy",
      title: "Doces & Caldas",
      items: ["Nutella", "Leite Ninho", "Confetes de Chocolate", "Jujuba", "Leite Condensado", "Calda de Morango", "Calda de Chocolate"],
    },
  ],
};

export const differentials = {
  title: "Por que escolher a Estação Gourmet do Recanto?",
  subtitle: "O cuidado que faz o convidado voltar na mesa o evento inteiro — qualidade indiscutível do primeiro ao último convidado.",
  items: [
    {
      icon: "Award",
      img: "/images/produtos/acai-cremoso-colher.jpg",
      title: "Qualidade Indiscutível",
      desc: "Fórmula premium ultra cremosa, livre de cristais de gelo. Sabor marcante e qualidade indiscutível do primeiro ao último convidado.",
    },
    {
      icon: "Sparkles",
      img: "/images/estacao/estacao-atendente-salao.jpg",
      title: "Montado na Hora",
      desc: "Sem potes prontos ou congelados: nossa Equipe Especializada monta cada taça de forma personalizada na frente do convidado.",
    },
    {
      icon: "HandHeart",
      img: "/images/eventos/festa-tema-rei-leao.jpg",
      title: "Tranquilidade Total",
      desc: "Nós transportamos, montamos, servimos e cuidamos da limpeza do espaço. Você só curte a sua comemoração.",
    },
  ],
};

export const trajetoria = {
  title: "Mais de 100 Eventos no Rio de Janeiro",
  subtitle:
    "Da Zona Norte à Zona Oeste, da Baixada a Niterói — a nossa Estação Gourmet já fez parte de casamentos, 15 anos, festas infantis e eventos corporativos por todo o Rio. A sua é a próxima.",
  regioes: [
    "Zona Norte · Guadalupe",
    "Zona Norte · Marechal Hermes",
    "Zona Oeste · Barra & Recreio",
    "Zona Norte · Madureira & Irajá",
    "Zona Norte · Pavuna & Penha",
    "Baixada Fluminense",
    "Niterói",
  ],
  cta: "Garantir sua Data",
};

export const gallery = {
  title: "A experiência Recanto, ao vivo",
  subtitle:
    "Fotos reais dos nossos eventos — da estação montada ao açaí cremoso servido na hora.",
  items: [
    {
      src: "/images/produtos/acai-cremoso-colher.jpg",
      alt: "Açaí cremoso premium servido com colher de sorvete",
      caption: "Açaí cremoso, na hora",
    },
    {
      src: "/images/estacao/estacao-atendente-salao.jpg",
      alt: "Estação de açaí montada com atendente uniformizada no salão de festas",
      caption: "Sua estação montada",
    },
    {
      src: "/images/estacao/estacao-complementos.jpg",
      alt: "Mesa de acompanhamentos liberados do Recanto do Açaí",
      caption: "Mesa liberada",
    },
    {
      src: "/images/produtos/creme-flocos.jpg",
      alt: "Creme premium com flocos servido nas estações do Recanto",
      caption: "Cremes premium",
    },
    {
      src: "/images/eventos/equipe-recanto-evento.jpg",
      alt: "Equipe uniformizada do Recanto do Açaí em um evento",
      caption: "Equipe uniformizada",
    },
    {
      src: "/images/eventos/festa-tema-rei-leao.jpg",
      alt: "Estação de açaí em festa infantil temática",
      caption: "Festas inesquecíveis",
    },
  ],
};

export const testimonials = {
  title: "Quem provou, recomenda",
  subtitle: "Histórias de festas que ficaram ainda mais doces.",
  items: [
    {
      name: "Marina & Rafael",
      event: "Casamento · Vila da Penha",
      text: "A estação de açaí foi o ponto alto da festa. Montaram tudo na hora e os convidados não largaram a mesa a noite inteira. Fizemos a reserva toda pelo site, super simples e prático.",
    },
    {
      name: "Patrícia Gomes",
      event: "15 anos da Júlia · Guadalupe",
      text: "Fechei o combo de açaí e sorvete direto pelo site e foi a melhor decisão. Equipe pontual, uniformizada e super atenciosa. Minha filha e as amigas amaram cada detalhe.",
    },
    {
      name: "Camila Andrade",
      event: "1 aninho do Theo · Marechal Hermes",
      text: "Açaí cremoso de verdade, sem aquele gelo. As crianças e os adultos adoraram montar do jeito deles. Reservei online em 2 minutos. Recomendo de olhos fechados!",
    },
    {
      name: "Letícia & Bruno",
      event: "Chá revelação · Pavuna",
      text: "Atendimento nota 10. Alinhamos os detalhes finais depois da reserva confirmada e no dia chegaram cedo pra montar. A mesa de acompanhamentos liberada foi um sucesso.",
    },
    {
      name: "Anderson Lima",
      event: "Confraternização da empresa · Irajá",
      text: "Contratamos para o evento de fim de ano. O pagamento integral via Pix (aprovação imediata) e parcelado no cartão gerou muita segurança no financeiro. Qualidade excelente.",
    },
    {
      name: "Fernanda Rocha",
      event: "Aniversário de 30 anos · Madureira",
      text: "Já é a segunda vez que contrato. Cremosidade absurda, atendimento caprichado e zero preocupação. A reserva online garante que não perdemos a data.",
    },
  ],
};

export const faq = {
  title: "Perguntas frequentes",
  items: [
    {
      q: "Como confirmo a disponibilidade da minha data?",
      a: "Basta simular o seu orçamento no nosso formulário. Ao avançar, nosso sistema verifica a agenda em tempo real e permite que você trave o seu dia imediatamente com o pagamento online.",
    },
    {
      q: "Vocês decoram a mesa?",
      a: "O nosso serviço inclui a estação de açaí/sorvete premium, acompanhamentos liberados e a equipe uniformizada servindo. A decoração da mesa fica por conta da sua equipe de decoração, para combinar perfeitamente com o seu tema.",
    },
    {
      q: "Quantos convidados o pacote atende?",
      a: "Nossos pacotes base atendem com excelência festas de até 120 convidados. Se o seu evento for maior, você pode simular os convidados adicionais diretamente no formulário de orçamento.",
    },
    {
      q: "Quantas horas dura o serviço?",
      a: "O atendimento ativo dura 4 horas — tempo mais que suficiente para todos os seus convidados se servirem à vontade. Nossa equipe chega cerca de 25 minutos antes para montar a estação e cuida da desmontagem ao final, em aproximadamente 15 minutos.",
    },
    {
      q: "Quais as formas de pagamento e é seguro?",
      a: "Sim, é 100% totalmente seguro. Você pode pagar em até 6x sem juros no Cartão de Crédito ou via Pix com aprovação imediata para travar a data.",
    },
    {
      q: "Atendem qual região?",
      a: "Somos do Rio de Janeiro e atendemos a capital, Baixada Fluminense (taxa de R$ 150) e Niterói (taxa de R$ 250). O frete é calculado de forma clara no fechamento.",
    },
    {
      q: "O que está incluso no preço?",
      a: "Equipe uniformizada e treinada, estação completa, insumos premium e toppings liberados à vontade por 4 horas de atendimento ativo. Sem taxas ocultas.",
    },
  ],
};

export const finalCta = {
  title: "Sua data ainda está livre?",
  subtitle:
    "Garanta sua reserva com pagamento online totalmente seguro — parcele em até 6x sem juros no cartão ou pague via Pix. Data bloqueada na hora na nossa agenda, sem burocracia ou filas. Atendemos apenas 1 evento por data para manter a qualidade gourmet exclusiva.",
  cta: "Reserve seu Evento",
};

export const footer = {
  tagline: "Estações de açaí e sorvete gourmet para eventos no Rio de Janeiro.",
  group: "Uma marca do grupo MSC Company.",
};

// Galeria de vídeos — adicione IDs do YouTube aqui quando disponíveis.
// Formato: { videoId: "ID_DO_YOUTUBE", title: "Título do vídeo" }
// Exemplo de ID: o URL youtube.com/watch?v=XXXX → videoId é "XXXX"
export const videoGallery: { videoId: string; title: string }[] = [
  // { videoId: "SEU_ID_AQUI", title: "Estação de açaí em casamento no RJ" },
];

export const waDefaultMessage =
  "Olá, Recanto! 🍇 Quero falar com o suporte sobre meu evento.";

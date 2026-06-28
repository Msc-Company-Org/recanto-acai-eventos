import { tool } from "ai";
import { z } from "zod";
import { PRECOS, valorReserva } from "@/lib/pricing";
import { baseService, packages } from "@/lib/content";

/**
 * Tools comerciais da Naiara (agente de eventos do Recanto).
 * Os valores vêm de lib/pricing + lib/content — os MESMOS do formulário e do
 * checkout — para o agente nunca divergir do preço oficial. Stateless: o
 * histórico da conversa carrega o estado (o AI SDK reenvia as mensagens).
 */
const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const addonPremium =
  packages.addons.items.find((a) => a.name.toLowerCase().includes("premium"))?.price ?? 350;
const addonNormal =
  packages.addons.items.find((a) => a.name.toLowerCase().includes("normal"))?.price ?? 250;

export const naiaraTools = {
  listarPacotes: tool({
    description:
      "Lista os pacotes (Único e Combo) com preço e o que inclui, a base do serviço e os add-ons de sabor. Use quando o cliente perguntar valores ou o que está incluso.",
    inputSchema: z.object({}),
    execute: async () => ({
      base: `Atendimento de ~${baseService.durationHours}h para ~${baseService.guests} convidados, ${baseService.includedFlavors} sabores inclusos, ${baseService.attendants} atendente.`,
      pacotes: packages.options.map((p) => ({
        id: p.id,
        nome: p.name,
        preco: brl(p.price),
        destaque: Boolean(p.badge),
        inclui: p.features,
      })),
      addons: packages.addons.items.map((a) => ({ nome: a.name, preco: brl(a.price) })),
      reserva: "A data se garante com pagamento integral online na hora (Pix ou Cartão em até 6x sem juros). Atendimento de 4 horas.",
    }),
  }),

  calcularOrcamento: tool({
    description:
      "Calcula o total para um pacote, opcionalmente com sabores extras. Use depois que o cliente escolher o pacote.",
    inputSchema: z.object({
      pacote: z.enum(["unico", "combo"]).describe("unico = Açaí ou Sorvete; combo = Açaí + Sorvete"),
      saboresExtraPremium: z.number().int().min(0).default(0),
      saboresExtraNormal: z.number().int().min(0).default(0),
    }),
    execute: async ({ pacote, saboresExtraPremium, saboresExtraNormal }) => {
      const total =
        (PRECOS[pacote] ?? PRECOS.combo) +
        saboresExtraPremium * addonPremium +
        saboresExtraNormal * addonNormal;
      const sinal = Math.round(total / 2);
      return {
        pacote,
        total: brl(total),
        sinal: brl(sinal),
        observacao: "O sinal de 50% garante a data; o restante é acertado na entrega.",
      };
    },
  }),

  consultarDisponibilidade: tool({
    description:
      "Verifica de forma preliminar a disponibilidade de uma data. Use quando o cliente informar a data desejada. Seja honesta: a confirmação real se dá com o sinal.",
    inputSchema: z.object({
      data: z.string().describe("Data do evento (DD/MM/AAAA ou AAAA-MM-DD)"),
    }),
    execute: async ({ data }) => ({
      data,
      status: "a_confirmar",
      mensagem: `Atendemos 1 evento por data e as melhores saem primeiro. A forma de garantir ${data} é com o sinal de 50%.`,
    }),
  }),

  reservarData: tool({
    description:
      "Registra a intenção de reserva (nome, WhatsApp, data, pacote) e orienta a finalizar com o sinal. Use após confirmar pacote, data, nome e WhatsApp com o cliente.",
    inputSchema: z.object({
      nome: z.string().describe("Nome do cliente"),
      whatsapp: z.string().describe("WhatsApp com DDD"),
      data: z.string().describe("Data do evento"),
      pacote: z.enum(["unico", "combo"]),
    }),
    execute: async ({ nome, whatsapp, data, pacote }) => {
      const codigo = "REC-" + Math.floor(100000 + Math.random() * 900000);
      const sinal = brl(valorReserva(pacote, "sinal"));
      return {
        status: "interesse_registrado",
        codigo,
        cliente: nome,
        whatsapp,
        mensagem: `Interesse registrado (cód. ${codigo}). Para confirmar ${data}, é só finalizar o sinal de ${sinal} pela reserva online ou pelo WhatsApp.`,
      };
    },
  }),

  chamarHumano: tool({
    description:
      "Encaminha para um consultor humano. Use se o cliente pedir, se o evento for grande/fora do padrão (corporativo complexo, muitos convidados) ou precisar de negociação especial.",
    inputSchema: z.object({ motivo: z.string().describe("Motivo do encaminhamento") }),
    execute: async ({ motivo }) => ({
      status: "humano_acionado",
      mensagem: `Vou chamar um consultor do Recanto pra te atender (${motivo}). Em instantes te respondem por aqui ou no WhatsApp. 💜`,
    }),
  }),
};

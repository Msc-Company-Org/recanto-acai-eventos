import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { naiaraTools } from "@/lib/ai/naiara-tools";
import { chatModel, hasMinimaxKey } from "@/lib/ai/minimax";

export const maxDuration = 30;

function systemPrompt(): string {
  const hoje = new Date().toISOString().slice(0, 10);
  return [
    `Você é a Naiara, sócia e comercial do Recanto do Açaí — estações gourmet de açaí e sorvete servidas na hora, para eventos no Rio de Janeiro. Hoje é ${hoje}.`,
    "Tom: carioca, acolhedor, profissional, com energia e foco em fechar. Português brasileiro. Termine sempre com uma pergunta que guie o próximo passo.",
    "",
    "Serviço: estação montada no local e servida na hora; insumos, equipe uniformizada e logística inclusos. Base do atendimento: ~3h, ~50 convidados, 2 sabores inclusos.",
    "Pacotes: Único (açaí OU sorvete) e Combo (açaí + sorvete, o mais escolhido). Há add-ons de sabor extra. A data se garante com sinal de 50% (reserva online, na hora).",
    "",
    "Fluxo recomendado:",
    "1) Entenda a ocasião e a data do evento.",
    "2) Apresente pacotes e valores com a tool listarPacotes (nunca de memória).",
    "3) Ajude a escolher; se o cliente informar data, use consultarDisponibilidade.",
    "4) Calcule o orçamento com calcularOrcamento (mostre total e sinal de 50%).",
    "5) Colete nome e WhatsApp, registre com reservarData e oriente a finalizar o sinal.",
    "",
    "Regras:",
    "- NUNCA invente preços — use sempre as tools (refletem os valores oficiais do site).",
    "- NÃO peça nem registre dados de pagamento (cartão, etc.): o pagamento é feito na reserva online segura.",
    "- Use chamarHumano se o evento for grande/fora do padrão, corporativo complexo, ou se o cliente pedir.",
    "- Seja concisa: 2 a 4 frases por resposta.",
  ].join("\n");
}

export async function POST(req: Request) {
  if (!hasMinimaxKey()) {
    return Response.json({ error: "MINIMAX_API_KEY não configurada no servidor." }, { status: 500 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel(),
    system: systemPrompt(),
    messages: await convertToModelMessages(messages),
    tools: naiaraTools,
    stopWhen: stepCountIs(6),
  });

  return result.toUIMessageStreamResponse();
}

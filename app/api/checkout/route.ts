import { NextResponse } from "next/server";
import { valorReserva } from "@/lib/pricing";
import { parseCheckoutInput, buildSuccessUrl, safeOrigin } from "@/lib/checkout";
import { safeJson } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    if (!rateLimit(clientKey(req, "checkout"), 20, 60_000).ok) {
      return NextResponse.json({ error: "muitas requisições, tente em instantes" }, { status: 429 });
    }
    const input = await safeJson(req);
    if (input === null) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const { pacote, modo, extraPremium, extraNormal, frete } = parseCheckoutInput(input);

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "pagamento indisponível" }, { status: 500 });

    const origin = req.headers.get("origin");
    const o = safeOrigin(origin);

    // Cálculo exato de valores em Reais (R$)
    const precoBase = pacote === "combo" ? 1690 : 1490;
    const valorAdicionais = (extraPremium * 350) + (extraNormal * 250);
    const totalContratacao = precoBase + valorAdicionais + frete;
    const valorCobrado = modo === "sinal" ? totalContratacao / 2 : totalContratacao;

    // Detalhes do Produto
    const nomeProduto = pacote === "combo"
      ? "Estação Gourmet - Combo (Açaí + Sorvete)"
      : "Estação Gourmet - Pacote Único (Açaí ou Sorvete)";

    const descricaoCobrança = modo === "sinal"
      ? `Sinal de 50% para garantir a exclusividade da sua data na agenda do Recanto do Açaí. Saldo restante de ${modo === "sinal" ? (totalContratacao / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'} a pagar no dia do evento.`
      : `Pagamento integral para a Estação Gourmet do Recanto do Açaí para 120 convidados.`;

    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("success_url", buildSuccessUrl(origin, { valor: valorCobrado, pacote, modo }));
    body.set("cancel_url", `${o}/#pacotes`);
    
    // Injeção dinâmica de Produto + Imagem no Stripe Checkout
    body.set("line_items[0][price_data][currency]", "brl");
    body.set("line_items[0][price_data][unit_amount]", Math.round(valorCobrado * 100).toString());
    body.set("line_items[0][price_data][product_data][name]", nomeProduto);
    body.set("line_items[0][price_data][product_data][description]", descricaoCobrança);
    body.set("line_items[0][price_data][product_data][images][0]", `${o}/images/produtos/acai-cremoso-colher.jpg`);
    body.set("line_items[0][quantity]", "1");

    body.set("phone_number_collection[enabled]", "true");
    body.set("metadata[pacote]", pacote);
    body.set("metadata[modo]", modo);
    body.set("metadata[origem]", "site-checkout");

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await r.json();
    if (!r.ok || !data?.url) {
      console.error("[checkout] stripe:", data?.error?.message || data);
      return NextResponse.json({ error: "falha ao iniciar o pagamento" }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch (e) {
    console.error("[checkout] erro:", e);
    return NextResponse.json({ error: "erro" }, { status: 400 });
  }
}

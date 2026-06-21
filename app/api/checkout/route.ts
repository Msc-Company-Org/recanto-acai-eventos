import { NextResponse } from "next/server";
import { valorReserva } from "@/lib/pricing";
import { parseCheckoutInput, buildSuccessUrl, safeOrigin } from "@/lib/checkout";
import { safeJson } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rateLimit";

// Price IDs do catálogo Stripe (criados via API; não são segredos).
const PRICES: Record<string, Record<string, string>> = {
  unico: { total: "price_1Tk6BbIglSfdwnhTkM0fEGEN", sinal: "price_1Tk6BcIglSfdwnhTZeh6KxsI" },
  combo: { total: "price_1Tk6BeIglSfdwnhT85BxtYMM", sinal: "price_1Tk6BeIglSfdwnhTnsNy6nic" },
};

export async function POST(req: Request) {
  try {
    if (!rateLimit(clientKey(req, "checkout"), 20, 60_000).ok) {
      return NextResponse.json({ error: "muitas requisições, tente em instantes" }, { status: 429 });
    }
    const input = await safeJson(req);
    if (input === null) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const { pacote, modo } = parseCheckoutInput(input);
    const price = PRICES[pacote][modo];

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "pagamento indisponível" }, { status: 500 });

    const origin = req.headers.get("origin");
    const valor = valorReserva(pacote, modo);
    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("success_url", buildSuccessUrl(origin, { valor, pacote, modo }));
    body.set("cancel_url", `${safeOrigin(origin)}/#pacotes`);
    body.set("line_items[0][price]", price);
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

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";

// Webhook do Stripe: confirma pagamento (site OU Artemis) e grava o lead como "ganho" no CRM.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Verificação de assinatura (HMAC-SHA256, esquema do Stripe)
  const parts: Record<string, string> = {};
  for (const kv of sig.split(",")) {
    const [k, v] = kv.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest("hex");
  if (!secret || !parts.v1 || expected !== parts.v1) {
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = (event.data?.object || {}) as Record<string, unknown>;
    const md = (s.metadata || {}) as Record<string, string>;
    const cd = (s.customer_details || {}) as Record<string, string>;
    const source = md.origem === "whatsapp" ? "whatsapp" : "site-checkout";
    const pkg = md.pacote === "unico" ? "unico" : "combo";
    const valor = Math.round((Number(s.amount_total) || 0) / 100);
    const row = {
      name: cd.name || "",
      whatsapp: cd.phone || "",
      package: pkg,
      estimatedValue: valor,
      source,
      score: 100,
      temperature: "quente",
      stage: "ganho",
      message: `Pagamento ${md.modo || ""} confirmado via ${source}.`,
    };
    try {
      if (hasDb()) {
        const db = getDb();
        const [ins] = await db.insert(leads).values(row).returning();
        await db.insert(leadActivities).values({
          leadId: ins.id,
          type: "pagamento",
          content: `💰 Pagamento confirmado: R$ ${valor} (${md.modo || "-"} · ${source}).`,
          author: "stripe",
        });
      } else {
        console.log("[stripe-webhook] pago (sem DB):", valor, md);
      }
    } catch (e) {
      console.error("[stripe-webhook] erro ao gravar:", e);
    }
  }

  return NextResponse.json({ received: true });
}

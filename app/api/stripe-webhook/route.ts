import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";
import { verifyStripeSignature, parseCheckoutCompleted } from "@/lib/stripe";

// Webhook do Stripe: confirma pagamento (site OU Artemis) e grava o lead como "ganho" no CRM.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!verifyStripeSignature(raw, sig, secret)) {
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  let event: unknown;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const paid = parseCheckoutCompleted(event);
  if (paid) {
    const row = {
      name: paid.name,
      whatsapp: paid.whatsapp,
      package: paid.package,
      estimatedValue: paid.amount,
      source: paid.source,
      score: 100,
      temperature: "quente",
      stage: "ganho",
      message: `Pagamento ${paid.modo || ""} confirmado via ${paid.source}.`,
      stripeSessionId: paid.sessionId || null,
    };
    try {
      if (hasDb()) {
        const db = getDb();
        // Idempotência: ignora se já gravamos este checkout (replay do webhook).
        if (paid.sessionId) {
          const [existing] = await db
            .select()
            .from(leads)
            .where(eq(leads.stripeSessionId, paid.sessionId))
            .limit(1);
          if (existing) return NextResponse.json({ received: true, duplicate: true });
        }
        const [ins] = await db.insert(leads).values(row).returning();
        await db.insert(leadActivities).values({
          leadId: ins.id,
          type: "pagamento",
          content: `💰 Pagamento confirmado: R$ ${paid.amount} (${paid.modo || "-"} · ${paid.source}).`,
          author: "stripe",
        });
      } else {
        console.log("[stripe-webhook] pago (sem DB):", paid.amount, paid.sessionId);
      }
    } catch (e) {
      console.error("[stripe-webhook] erro ao gravar:", e);
    }
  }

  return NextResponse.json({ received: true });
}

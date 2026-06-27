import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities, type Lead } from "@/lib/schema";
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
    // Campos base (sempre presentes no schema). stripeSessionId é adicionado quando a coluna existir.
    const base = {
      name: paid.name,
      whatsapp: paid.whatsapp,
      package: paid.package,
      estimatedValue: paid.amount,
      source: paid.source,
      score: 100,
      temperature: "quente",
      stage: "ganho",
      message: `Pagamento ${paid.modo || ""} confirmado via ${paid.source}.`,
    };
    try {
      if (hasDb()) {
        const db = getDb();
        // Idempotência (best-effort): ignora replay se a coluna stripe_session_id existir.
        if (paid.sessionId) {
          try {
            const [existing] = await db
              .select()
              .from(leads)
              .where(eq(leads.stripeSessionId, paid.sessionId))
              .limit(1);
            if (existing) return NextResponse.json({ received: true, duplicate: true });
          } catch (e) {
            console.warn("[stripe-webhook] dedup indisponível (coluna ausente?):", (e as Error).message);
          }
        }
        // Insert resiliente: tenta com stripeSessionId; se a coluna não existir, grava sem ele.
        let ins: Lead;
        try {
          [ins] = await db.insert(leads).values({ ...base, stripeSessionId: paid.sessionId || null }).returning();
        } catch {
          [ins] = await db.insert(leads).values(base).returning();
        }
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

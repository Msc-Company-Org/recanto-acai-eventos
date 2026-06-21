import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";
import { computeScore } from "@/lib/leadScore";
import { notifyNewLead } from "@/lib/notify";
import { safeJson } from "@/lib/http";
import { parseLead } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rateLimit";

// Recebe o lead do formulário de orçamento da landing.
export async function POST(req: Request) {
  try {
    if (!rateLimit(clientKey(req, "lead"), 10, 60_000).ok) {
      return NextResponse.json({ ok: false, error: "muitas requisições" }, { status: 429 });
    }

    const body = await safeJson(req);
    if (body === null) {
      return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
    }
    const v = parseLead(body);

    const { score, temperature } = computeScore({
      eventType: v.tipo || undefined,
      package: v.pacote,
      guests: v.convidados,
      eventDate: v.data,
      whatsapp: v.whatsapp || undefined,
      name: v.nome || undefined,
      extraPremium: v.extraPremium,
      extraNormal: v.extraNormal,
      source: v.source || undefined,
    });

    const row = {
      name: v.nome,
      whatsapp: v.whatsapp,
      eventType: v.tipo,
      eventDate: v.data,
      guests: v.convidados,
      package: v.pacote,
      extraPremium: v.extraPremium,
      extraNormal: v.extraNormal,
      estimatedValue: v.total,
      source: v.source === "whatsapp" ? "whatsapp" : "site",
      score,
      temperature,
      stage: "novo",
    };

    if (hasDb()) {
      const db = getDb();
      const [inserted] = await db.insert(leads).values(row).returning();
      await db.insert(leadActivities).values({
        leadId: inserted.id,
        type: "criado",
        content: `Lead recebido (${row.source}, score ${score}, ${temperature}).`,
        author: "sistema",
      });
      await notifyNewLead(row);
      return NextResponse.json({ ok: true, id: inserted.id, score, temperature, persisted: true });
    }

    console.log("[lead] (sem DB) novo lead:", JSON.stringify(row));
    return NextResponse.json({ ok: true, score, temperature, persisted: false });
  } catch (e) {
    console.error("[lead] erro:", e);
    return NextResponse.json({ ok: false, error: "erro ao processar" }, { status: 400 });
  }
}

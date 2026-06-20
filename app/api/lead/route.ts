import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";
import { computeScore } from "@/lib/leadScore";
import { notifyNewLead } from "@/lib/notify";
import { safeJson } from "@/lib/http";

const str = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown): number => Number(v) || 0;

// Recebe o lead do formulário de orçamento da landing.
export async function POST(req: Request) {
  try {
    const data = await safeJson<Record<string, unknown>>(req);
    if (data === null) {
      return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
    }

    const g = data.convidados != null ? parseInt(String(data.convidados), 10) : NaN;
    const guests = Number.isFinite(g) ? g : null;
    const pkg = data.pacote === "unico" ? "unico" : "combo";

    const { score, temperature } = computeScore({
      eventType: str(data.tipo),
      package: pkg,
      guests,
      eventDate: str(data.data) ?? null,
      whatsapp: str(data.whatsapp),
      name: str(data.nome),
      extraPremium: num(data.extraPremium),
      extraNormal: num(data.extraNormal),
      source: str(data.source),
    });

    const row = {
      name: str(data.nome) ?? "",
      whatsapp: str(data.whatsapp) ?? "",
      eventType: str(data.tipo) ?? "",
      eventDate: str(data.data) ?? null,
      guests,
      package: pkg,
      extraPremium: num(data.extraPremium),
      extraNormal: num(data.extraNormal),
      estimatedValue: num(data.total),
      source: str(data.source) === "whatsapp" ? "whatsapp" : "site",
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

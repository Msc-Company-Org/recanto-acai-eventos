import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";
import { computeScore } from "@/lib/leadScore";
import { notifyNewLead } from "@/lib/notify";

// Recebe o lead do formulário de orçamento da landing.
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const guests = data.convidados ? parseInt(String(data.convidados), 10) : null;
    const pkg = data.pacote === "unico" ? "unico" : "combo";

    const { score, temperature } = computeScore({
      eventType: data.tipo,
      package: pkg,
      guests,
      eventDate: data.data || null,
      whatsapp: data.whatsapp,
      name: data.nome,
      extraPremium: Number(data.extraPremium) || 0,
      extraNormal: Number(data.extraNormal) || 0,
    });

    const row = {
      name: data.nome || "",
      whatsapp: data.whatsapp || "",
      eventType: data.tipo || "",
      eventDate: data.data || null,
      guests,
      package: pkg,
      extraPremium: Number(data.extraPremium) || 0,
      extraNormal: Number(data.extraNormal) || 0,
      estimatedValue: Number(data.total) || 0,
      source: "site",
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
        content: `Lead recebido pelo site (score ${score}, ${temperature}).`,
        author: "sistema",
      });
      await notifyNewLead(row);
      return NextResponse.json({ ok: true, id: inserted.id, score, temperature });
    }

    console.log("[lead] (sem DB) novo lead:", JSON.stringify(row));
    return NextResponse.json({ ok: true, score, temperature, persisted: false });
  } catch (e) {
    console.error("[lead] erro:", e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

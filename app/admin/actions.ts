"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, leadActivities } from "@/lib/schema";
import { computeScore } from "@/lib/leadScore";
import { ADMIN_USER, ADMIN_PASS, createSession, destroySession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const user = String(formData.get("user") || "");
  const pass = String(formData.get("pass") || "");
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    await createSession();
    redirect("/admin");
  }
  redirect("/admin/login?erro=1");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function moveStageAction(formData: FormData) {
  const id = String(formData.get("id"));
  const stage = String(formData.get("stage"));
  if (!id || !stage) return;
  const db = getDb();
  await db.update(leads).set({ stage, updatedAt: new Date() }).where(eq(leads.id, id));
  await db.insert(leadActivities).values({
    leadId: id,
    type: "mudanca_estagio",
    content: `Movido para "${stage}".`,
    author: "admin",
  });
  revalidatePath("/admin/funil");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addNoteAction(formData: FormData) {
  const id = String(formData.get("id"));
  const content = String(formData.get("content") || "").trim();
  if (!id || !content) return;
  const db = getDb();
  await db.insert(leadActivities).values({
    leadId: id,
    type: "nota",
    content,
    author: "admin",
  });
  revalidatePath(`/admin/leads/${id}`);
}

export async function createManualLeadAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const eventType = String(formData.get("eventType") || "").trim();
  const source = String(formData.get("source") || "manual").trim();
  const pkg = String(formData.get("package") || "combo");
  if (!name && !whatsapp) {
    redirect("/admin/leads?erro=1");
  }
  const { score, temperature } = computeScore({ eventType, package: pkg, whatsapp, name });
  const db = getDb();
  const [inserted] = await db
    .insert(leads)
    .values({ name, whatsapp, eventType, package: pkg, source, score, temperature, stage: "novo" })
    .returning();
  await db.insert(leadActivities).values({
    leadId: inserted.id,
    type: "criado",
    content: `Lead criado manualmente (origem: ${source}).`,
    author: "admin",
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect(`/admin/leads/${inserted.id}`);
}

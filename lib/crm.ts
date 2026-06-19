import "server-only";
import { getDb } from "./db";
import { leads, leadActivities } from "./schema";
import { STAGE_IDS } from "./crm-constants";
import { desc, eq, and, ilike, type SQL } from "drizzle-orm";

export async function listLeads(filter?: {
  stage?: string;
  temperature?: string;
  q?: string;
}) {
  const db = getDb();
  const conds: SQL[] = [];
  if (filter?.stage) conds.push(eq(leads.stage, filter.stage));
  if (filter?.temperature) conds.push(eq(leads.temperature, filter.temperature));
  if (filter?.q) conds.push(ilike(leads.name, `%${filter.q}%`));
  const where = conds.length ? and(...conds) : undefined;
  return db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(500);
}

export async function getLead(id: string) {
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  return lead;
}

export async function getActivities(leadId: string) {
  const db = getDb();
  return db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, leadId))
    .orderBy(desc(leadActivities.createdAt));
}

export async function allLeads() {
  const db = getDb();
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
}

export async function dashboardStats() {
  const db = getDb();
  const all = await db.select().from(leads);
  const total = all.length;
  const byStage: Record<string, number> = {};
  STAGE_IDS.forEach((s) => (byStage[s] = 0));
  const byTemp: Record<string, number> = { quente: 0, morno: 0, frio: 0 };
  let pipelineValue = 0;
  let scoreSum = 0;
  let won = 0;
  let lost = 0;

  for (const l of all) {
    byStage[l.stage] = (byStage[l.stage] || 0) + 1;
    byTemp[l.temperature] = (byTemp[l.temperature] || 0) + 1;
    scoreSum += l.score;
    if (l.stage === "ganho") won += 1;
    else if (l.stage === "perdido") lost += 1;
    else pipelineValue += l.estimatedValue;
  }

  const avgScore = total ? Math.round(scoreSum / total) : 0;
  const closed = won + lost;
  const conversion = closed ? Math.round((won / closed) * 100) : 0;
  const recent = all
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);

  return { total, byStage, byTemp, pipelineValue, avgScore, conversion, won, lost, recent };
}

import "server-only";
import { getDb } from "./db";
import { leads, leadActivities } from "./schema";
import { computeStats } from "./stats";
import { desc, eq, and, ilike, type SQL } from "drizzle-orm";

export async function listLeads(filter?: {
  stage?: string;
  temperature?: string;
  q?: string;
}) {
  try {
    const db = getDb();
    const conds: SQL[] = [];
    if (filter?.stage) conds.push(eq(leads.stage, filter.stage));
    if (filter?.temperature) conds.push(eq(leads.temperature, filter.temperature));
    if (filter?.q) conds.push(ilike(leads.name, `%${filter.q}%`));
    const where = conds.length ? and(...conds) : undefined;
    return await db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(500);
  } catch (e) {
    console.error("[crm] listLeads:", e);
    return [];
  }
}

export async function getLead(id: string) {
  try {
    const db = getDb();
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  } catch (e) {
    console.error("[crm] getLead:", e);
    return undefined;
  }
}

export async function getActivities(leadId: string) {
  try {
    const db = getDb();
    return await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt));
  } catch (e) {
    console.error("[crm] getActivities:", e);
    return [];
  }
}

export async function allLeads() {
  try {
    const db = getDb();
    return await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
  } catch (e) {
    console.error("[crm] allLeads:", e);
    return [];
  }
}

export async function dashboardStats() {
  try {
    const db = getDb();
    const all = await db.select().from(leads);
    return computeStats(all);
  } catch (e) {
    console.error("[crm] dashboardStats:", e);
    return computeStats([]);
  }
}

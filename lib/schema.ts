import { pgTable, uuid, text, integer, timestamp, date } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  name: text("name").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  eventType: text("event_type").notNull().default(""),
  eventDate: date("event_date"),
  guests: integer("guests"),
  package: text("package").notNull().default("combo"),
  extraPremium: integer("extra_premium").notNull().default(0),
  extraNormal: integer("extra_normal").notNull().default(0),
  estimatedValue: integer("estimated_value").notNull().default(0),
  message: text("message"),
  source: text("source").notNull().default("site"),
  score: integer("score").notNull().default(0),
  temperature: text("temperature").notNull().default("frio"),
  stage: text("stage").notNull().default("novo"),
  notes: text("notes"),
});

export const leadActivities = pgTable("lead_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  type: text("type").notNull().default("nota"),
  content: text("content").notNull().default(""),
  author: text("author").notNull().default("sistema"),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;

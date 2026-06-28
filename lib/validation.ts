import { z } from "zod";

const pkg = z.enum(["unico", "combo"]);
const modo = z.enum(["sinal", "total"]);

export const CheckoutSchema = z.object({
  pacote: pkg.catch("combo"),
  modo: modo.catch("total"),
  extraPremium: z.coerce.number().int().min(0).max(50).catch(0),
  extraNormal: z.coerce.number().int().min(0).max(50).catch(0),
  frete: z.coerce.number().min(0).max(10000).catch(0),
});
export type CheckoutInput = z.infer<typeof CheckoutSchema>;

/** Entrada do formulário de lead — coerção + limites, tolerante a campos ausentes/ruins. */
export const LeadSchema = z.object({
  nome: z.string().trim().max(120).catch(""),
  whatsapp: z.string().trim().max(40).catch(""),
  tipo: z.string().trim().max(80).catch(""),
  data: z.string().trim().max(40).nullable().catch(null),
  convidados: z.coerce.number().int().min(0).max(100000).nullable().catch(null),
  pacote: pkg.catch("combo"),
  extraPremium: z.coerce.number().int().min(0).max(50).catch(0),
  extraNormal: z.coerce.number().int().min(0).max(50).catch(0),
  total: z.coerce.number().min(0).max(10000000).catch(0),
  source: z.string().trim().max(40).catch(""),
  utmSource: z.string().trim().max(120).catch(""),
  utmMedium: z.string().trim().max(120).catch(""),
  utmCampaign: z.string().trim().max(200).catch(""),
  utmContent: z.string().trim().max(200).catch(""),
  gclid: z.string().trim().max(200).catch(""),
});
export type LeadInput = z.infer<typeof LeadSchema>;

/** Valida o corpo do lead; se vier algo totalmente fora do formato, usa só os defaults. */
export function parseLead(body: unknown): LeadInput {
  const r = LeadSchema.safeParse(body);
  return r.success ? r.data : LeadSchema.parse({});
}

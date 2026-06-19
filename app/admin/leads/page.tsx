import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DbWarning } from "@/components/DbWarning";
import { hasDb } from "@/lib/db";
import { listLeads } from "@/lib/crm";
import { STAGES, stageLabel, TEMPERATURES } from "@/lib/crm-constants";
import { eventTypes } from "@/lib/content";
import { brl } from "@/lib/utils";
import { createManualLeadAction } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "rounded-lg bg-bg/60 border border-line px-3 py-2 text-sm text-ink outline-none focus:border-primary";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; temperature?: string; q?: string }>;
}) {
  if (!hasDb()) {
    return (
      <AdminShell active="leads">
        <DbWarning />
      </AdminShell>
    );
  }

  const sp = await searchParams;
  const rows = await listLeads({ stage: sp.stage, temperature: sp.temperature, q: sp.q });

  return (
    <AdminShell active="leads">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">
          Leads <span className="text-muted text-base">({rows.length})</span>
        </h1>
        <form className="flex gap-2 flex-wrap">
          <input name="q" defaultValue={sp.q} placeholder="Buscar nome..." className={field} />
          <select name="stage" defaultValue={sp.stage || ""} className={field}>
            <option value="">Todos estágios</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <select name="temperature" defaultValue={sp.temperature || ""} className={field}>
            <option value="">Toda temperatura</option>
            {Object.entries(TEMPERATURES).map(([k, t]) => (
              <option key={k} value={k}>
                {t.label}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-primary/20 text-gold px-4 py-2 text-sm">Filtrar</button>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-muted border-b border-line">
              <th className="p-3">Nome</th>
              <th className="p-3">Evento</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Score</th>
              <th className="p-3">Estágio</th>
              <th className="p-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-b border-line/50 hover:bg-primary/5">
                <td className="p-3">
                  <Link href={`/admin/leads/${l.id}`} className="text-ink font-medium hover:text-gold">
                    {l.name || "Sem nome"}
                  </Link>
                </td>
                <td className="p-3 text-muted">{l.eventType || "—"}</td>
                <td className="p-3 text-muted">{l.whatsapp || "—"}</td>
                <td className="p-3" style={{ color: TEMPERATURES[l.temperature]?.color }}>
                  {TEMPERATURES[l.temperature]?.emoji} {l.score}
                </td>
                <td className="p-3 text-muted">{stageLabel(l.stage)}</td>
                <td className="p-3 text-gold">{brl(l.estimatedValue)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details className="glass rounded-2xl p-6 mt-6">
        <summary className="cursor-pointer font-semibold text-white">+ Adicionar lead manual</summary>
        <form action={createManualLeadAction} className="grid sm:grid-cols-2 gap-3 mt-4">
          <input name="name" placeholder="Nome" className={field} />
          <input name="whatsapp" placeholder="WhatsApp" className={field} />
          <select name="eventType" className={field}>
            {eventTypes.items.map((o) => (
              <option key={o.label} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
          <select name="source" className={field}>
            <option value="manual">Manual</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="indicacao">Indicação</option>
          </select>
          <select name="package" className={field}>
            <option value="combo">Combo (Açaí + Sorvete)</option>
            <option value="unico">Açaí ou Sorvete</option>
          </select>
          <button className="rounded-full bg-gold text-bg font-semibold py-2 hover:bg-gold-soft transition-colors">
            Criar lead
          </button>
        </form>
      </details>
    </AdminShell>
  );
}

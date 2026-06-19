import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DbWarning } from "@/components/DbWarning";
import { hasDb } from "@/lib/db";
import { allLeads } from "@/lib/crm";
import { STAGES } from "@/lib/crm-constants";
import { brl } from "@/lib/utils";
import { moveStageAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function FunilPage() {
  if (!hasDb()) {
    return (
      <AdminShell active="funil">
        <DbWarning />
      </AdminShell>
    );
  }

  const rows = await allLeads();

  return (
    <AdminShell active="funil">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Funil de Vendas</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((st) => {
          const col = rows.filter((l) => l.stage === st.id);
          const total = col.reduce((acc, l) => acc + l.estimatedValue, 0);
          return (
            <div key={st.id} className="min-w-[270px] w-[270px] shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: st.color }} />
                  {st.label}
                </span>
                <span className="text-muted text-sm">{col.length}</span>
              </div>
              <div className="text-xs text-muted mb-3">{brl(total)}</div>
              <div className="space-y-3">
                {col.map((l) => (
                  <div key={l.id} className="glass rounded-xl p-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="text-ink font-medium text-sm hover:text-gold"
                    >
                      {l.name || "Sem nome"}
                    </Link>
                    <div className="text-xs text-muted mt-0.5">
                      {l.eventType || "—"} · {brl(l.estimatedValue)}
                    </div>
                    <div className="text-xs text-gold mt-1">score {l.score}</div>
                    <form action={moveStageAction} className="mt-2 flex gap-1">
                      <input type="hidden" name="id" value={l.id} />
                      <select
                        name="stage"
                        defaultValue={l.stage}
                        className="flex-1 text-xs rounded bg-bg/60 border border-line px-2 py-1 text-ink outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <button className="text-xs rounded bg-primary/20 text-gold px-2 py-1">→</button>
                    </form>
                  </div>
                ))}
                {col.length === 0 && (
                  <div className="text-xs text-muted text-center py-6 border border-dashed border-line rounded-xl">
                    vazio
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DbWarning } from "@/components/DbWarning";
import { hasDb } from "@/lib/db";
import { dashboardStats } from "@/lib/crm";
import { STAGES, stageLabel, TEMPERATURES } from "@/lib/crm-constants";
import { brl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasDb()) {
    return (
      <AdminShell active="dashboard">
        <DbWarning />
      </AdminShell>
    );
  }

  const s = await dashboardStats();
  const cards = [
    { label: "Total de leads", value: String(s.total) },
    { label: "Score médio", value: String(s.avgScore) },
    { label: "Pipeline em aberto", value: brl(s.pipelineValue) },
    { label: "Conversão", value: `${s.conversion}%` },
  ];

  return (
    <AdminShell active="dashboard">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <div className="text-muted text-sm">{c.label}</div>
            <div className="font-display text-3xl font-bold text-gold mt-1">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Funil</h2>
          <div className="space-y-3">
            {STAGES.map((st) => {
              const n = s.byStage[st.id] || 0;
              const pct = s.total ? Math.round((n / s.total) * 100) : 0;
              return (
                <div key={st.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">{st.label}</span>
                    <span className="text-ink">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: st.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Por temperatura</h2>
          <div className="flex gap-3 mb-6">
            {Object.entries(TEMPERATURES).map(([k, t]) => (
              <div key={k} className="flex-1 rounded-xl p-4 text-center" style={{ background: `${t.color}22` }}>
                <div className="text-2xl">{t.emoji}</div>
                <div className="font-display text-xl font-bold text-white">{s.byTemp[k] || 0}</div>
                <div className="text-xs text-muted">{t.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">✅ {s.won} ganhos · ❌ {s.lost} perdidos</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-white">Leads recentes</h2>
          <Link href="/admin/leads" className="text-sm text-gold">
            ver todos →
          </Link>
        </div>
        {s.recent.length === 0 ? (
          <p className="text-muted text-sm">Nenhum lead ainda. Os pedidos do site aparecem aqui.</p>
        ) : (
          <div className="divide-y divide-line">
            {s.recent.map((l) => (
              <Link
                key={l.id}
                href={`/admin/leads/${l.id}`}
                className="flex items-center justify-between py-3 hover:opacity-80"
              >
                <div>
                  <div className="text-ink font-medium">
                    {l.name || "Sem nome"} <span className="text-muted text-sm">· {l.eventType || "—"}</span>
                  </div>
                  <div className="text-xs text-muted">
                    {l.whatsapp || "—"} · {stageLabel(l.stage)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gold font-bold">{l.score}</div>
                  <div className="text-xs text-muted">{brl(l.estimatedValue)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

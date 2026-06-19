import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { DbWarning } from "@/components/DbWarning";
import { hasDb } from "@/lib/db";
import { getLead, getActivities } from "@/lib/crm";
import { STAGES, stageLabel, TEMPERATURES } from "@/lib/crm-constants";
import { brl } from "@/lib/utils";
import { moveStageAction, addNoteAction } from "../../actions";

export const dynamic = "force-dynamic";

const field =
  "rounded-lg bg-bg/60 border border-line px-3 py-2 text-sm text-ink outline-none focus:border-primary";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDb()) {
    return (
      <AdminShell active="leads">
        <DbWarning />
      </AdminShell>
    );
  }
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();
  const activities = await getActivities(id);
  const temp = TEMPERATURES[lead.temperature];
  const waNumber = lead.whatsapp.replace(/\D/g, "");

  const info: [string, string][] = [
    ["Evento", lead.eventType || "—"],
    ["Data", lead.eventDate || "—"],
    ["Convidados", lead.guests ? String(lead.guests) : "—"],
    ["Pacote", lead.package === "combo" ? "Açaí + Sorvete" : "Açaí ou Sorvete"],
    ["Sabores extra", `${lead.extraPremium} premium · ${lead.extraNormal} normal`],
    ["Estimativa", brl(lead.estimatedValue)],
    ["Origem", lead.source],
  ];

  return (
    <AdminShell active="leads">
      <Link href="/admin/leads" className="text-sm text-muted hover:text-gold">
        ← voltar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{lead.name || "Sem nome"}</h1>
          <p className="text-muted text-sm mt-1">
            <span style={{ color: temp?.color }}>{temp?.emoji} {temp?.label} · score {lead.score}</span>{" "}
            · {stageLabel(lead.stage)}
          </p>
        </div>
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-whats text-white font-semibold px-5 py-2.5 text-sm hover:bg-whats-dark transition-colors"
          >
            Responder no WhatsApp
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3">Dados</h2>
            <table className="w-full text-sm">
              <tbody>
                {info.map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-1.5 text-muted">{k}</td>
                    <td className="py-1.5 text-ink text-right">{v}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1.5 text-muted">WhatsApp</td>
                  <td className="py-1.5 text-ink text-right">{lead.whatsapp || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3">Estágio</h2>
            <form action={moveStageAction} className="flex gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <select name="stage" defaultValue={lead.stage} className={`${field} flex-1`}>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button className="rounded-lg bg-primary/20 text-gold px-4 text-sm">Salvar</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3">Anotar</h2>
            <form action={addNoteAction} className="flex gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <input name="content" placeholder="Adicionar nota / registro de contato..." className={`${field} flex-1`} />
              <button className="rounded-lg bg-gold text-bg font-semibold px-4 text-sm hover:bg-gold-soft transition-colors">
                Adicionar
              </button>
            </form>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Histórico</h2>
            <div className="space-y-4">
              {activities.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-ink text-sm">{a.content}</p>
                    <p className="text-xs text-muted">
                      {a.author} · {new Date(a.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && <p className="text-muted text-sm">Sem registros ainda.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

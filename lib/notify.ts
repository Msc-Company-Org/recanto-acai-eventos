import { Resend } from "resend";
import { brl } from "./utils";
import { escapeHtml } from "./html";

type LeadEmail = {
  name: string;
  whatsapp: string;
  eventType: string;
  eventDate?: string | null;
  guests?: number | null;
  package: string;
  estimatedValue: number;
  score: number;
  temperature: string;
};

/**
 * Notifica por e-mail (Resend) a cada lead novo.
 * Se RESEND_API_KEY / LEAD_NOTIFY_EMAIL não estiverem setados, apenas loga (mock).
 */
export async function notifyNewLead(lead: LeadEmail): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (!key || !to) {
    console.log("[notify] Resend não configurado — lead:", lead.name, lead.whatsapp, `score ${lead.score}`);
    return { sent: false };
  }

  try {
    const resend = new Resend(key);
    const from = process.env.RESEND_FROM || "Recanto Eventos <onboarding@resend.dev>";
    const linha = (k: string, v: string) =>
      `<tr><td style="padding:4px 12px;color:#777">${escapeHtml(k)}</td><td style="padding:4px 12px;font-weight:600">${escapeHtml(v)}</td></tr>`;
    await resend.emails.send({
      from,
      to,
      subject: `🍇 Novo lead ${lead.temperature.toUpperCase()} (${lead.score}) — ${lead.name || "sem nome"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px">
          <h2 style="color:#8327ec">Novo pedido de orçamento 🍇</h2>
          <table style="border-collapse:collapse;font-size:14px">
            ${linha("Nome", lead.name || "—")}
            ${linha("WhatsApp", lead.whatsapp || "—")}
            ${linha("Evento", lead.eventType || "—")}
            ${linha("Data", lead.eventDate || "—")}
            ${linha("Convidados", lead.guests ? String(lead.guests) : "—")}
            ${linha("Pacote", lead.package === "combo" ? "Açaí + Sorvete" : "Açaí ou Sorvete")}
            ${linha("Estimativa", brl(lead.estimatedValue))}
            ${linha("Score", `${lead.score} (${lead.temperature})`)}
          </table>
          <p style="margin-top:16px"><a href="https://wa.me/${String(lead.whatsapp || "").replace(/\D/g, "")}" style="background:#25d366;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Responder no WhatsApp</a></p>
        </div>`,
    });
    return { sent: true };
  } catch (e) {
    console.error("[notify] erro Resend:", e);
    return { sent: false };
  }
}

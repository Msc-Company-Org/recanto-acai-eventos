import { NextResponse } from "next/server";

// Recebe o lead do formulário de orçamento.
// Hoje apenas registra (o lead PRINCIPAL chega pelo WhatsApp, via wa.me no submit).
// TODO(Moisés): plugar destino real do lead — e-mail (Resend), Google Sheets ou
// Telegram — para não depender só do WhatsApp. Ver pendência #8 no plano.
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("[lead] novo pedido de orçamento:", JSON.stringify(data));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

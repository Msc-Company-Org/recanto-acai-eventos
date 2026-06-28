"use client";

import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { track, EVENTS } from "@/lib/tracking";

export function LeadPopup() {
  const [show, setShow] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tipo, setTipo] = useState("aniversário");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já converteu ou fechou o popup anteriormente
    const dismissed = localStorage.getItem("recanto_lead_popup_dismissed");
    if (dismissed === "true") return;

    // 1. Mostrar após 45 segundos (após o usuário ter tempo de ver os pacotes)
    const timer = setTimeout(() => {
      setShow(true);
    }, 45000);

    // 2. Mostrar em intenção de saída (Mouse saindo do topo da página)
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 5) {
        setShow(true);
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function handleClose() {
    setShow(false);
    localStorage.setItem("recanto_lead_popup_dismissed", "true");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          whatsapp,
          tipo,
          source: "site-popup",
        }),
      });

      if (response.ok) {
        setSuccess(true);
        track(EVENTS.ENVIO_FORMULARIO, {
          nome,
          tipo,
          source: "site-popup",
        });
        // Lead qualificado via popup (tem nome + whatsapp + tipo de evento)
        track(EVENTS.QUALIFY_LEAD, {
          nome,
          tipo,
          source: "site-popup",
        });
        localStorage.setItem("recanto_lead_popup_dismissed", "true");
        // Fechar após 3 segundos
        setTimeout(() => setShow(false), 3000);
      } else {
        alert("Ocorreu um erro. Tente novamente no WhatsApp!");
      }
    } catch {
      alert("Erro ao enviar dados. Tente novamente!");
    }
    setLoading(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e9ddf6] bg-[#fdfaff] p-8 shadow-2xl animate-scale-up">
        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#a690c2] hover:text-[#7c1fd6] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {!success ? (
          <>
            {/* Cabeçalho de Oferta */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold animate-bounce">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2a1140] mt-4 leading-tight">
                Garanta <span className="text-[#7c1fd6]">1 Sabor Premium Extra</span> totalmente de graça!
              </h3>
              <p className="text-sm text-[#70548b] mt-3 leading-relaxed">
                Sua data ainda aparece como disponível. Deixa seu contato e travamos pra você antes que alguém reserve — e você ainda ganha um sabor premium extra de cortesia!
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="popup-name" className="block text-xs font-bold text-[#70548b] uppercase tracking-wider mb-1.5">
                  Seu Nome
                </label>
                <input
                  id="popup-name"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Vanessa Rocha"
                  className="w-full rounded-2xl border border-[#e9ddf6] bg-white px-4 py-3 text-sm text-[#2a1140] outline-none placeholder:text-[#a690c2] focus:border-[#7c1fd6]"
                />
              </div>

              <div>
                <label htmlFor="popup-whatsapp" className="block text-xs font-bold text-[#70548b] uppercase tracking-wider mb-1.5">
                  Seu WhatsApp
                </label>
                <input
                  id="popup-whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: (21) 98174-9450"
                  className="w-full rounded-2xl border border-[#e9ddf6] bg-white px-4 py-3 text-sm text-[#2a1140] outline-none placeholder:text-[#a690c2] focus:border-[#7c1fd6]"
                />
              </div>

              <div>
                <label htmlFor="popup-tipo" className="block text-xs font-bold text-[#70548b] uppercase tracking-wider mb-1.5">
                  Tipo de Celebração
                </label>
                <select
                  id="popup-tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full rounded-2xl border border-[#e9ddf6] bg-white px-4 py-3 text-sm text-[#2a1140] outline-none focus:border-[#7c1fd6]"
                >
                  <option value="casamento">Casamento</option>
                  <option value="aniversário">Aniversário</option>
                  <option value="15 anos">15 Anos</option>
                  <option value="festa infantil">Festa Infantil</option>
                  <option value="chá revelação">Chá Revelação</option>
                  <option value="corporativo">Corporativo / Empresa</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gold text-bg font-bold py-4 text-base hover:bg-gold-soft shadow-gold transition-colors disabled:opacity-60 cta-attention mt-2"
              >
                {loading ? "Garantindo brinde..." : "Garantir Sabor Extra Grátis 🎁"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <span className="text-5xl">🎉</span>
            <h3 className="font-display text-2xl font-bold text-[#7c1fd6] mt-4">
              Brinde Reservado com Sucesso!
            </h3>
            <p className="text-sm text-[#70548b] mt-3 leading-relaxed">
              Obrigado, {nome}! O seu sabor premium extra de cortesia foi vinculado ao seu telefone. Finalize o seu orçamento na página ou converse com a gente no chat da Naiara! 💜
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

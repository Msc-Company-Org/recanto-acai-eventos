"use client";

import { useState } from "react";
import { nav, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";

/** Ícones inline (sem depender da versão do lucide). */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6" aria-hidden="true">
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

/** Menu de navegação mobile (hambúrguer + painel). Visível só abaixo de md. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink hover:bg-primary/10 transition-colors"
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-20 z-40 bg-black/20"
          />
          <div className="fixed inset-x-0 top-20 z-40 border-b border-primary/15 bg-bg/95 backdrop-blur-md shadow-lg">
            <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-col">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base text-ink/90 border-b border-primary/5 hover:text-gold transition-colors"
                >
                  {n.label}
                </a>
              ))}
              <WhatsAppCTA
                message={waDefaultMessage}
                variant="primary"
                cta="mobile-menu"
                className="mt-4 w-full"
              >
                <WhatsappIcon className="w-4 h-4" /> Falar no WhatsApp
              </WhatsAppCTA>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

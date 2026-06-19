import Image from "next/image";
import { nav, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-primary/15 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2 min-w-0">
          <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-primary/10 shrink-0">
            <Image
              src="/brand/logo-recanto-acai-icone.jpg"
              alt="Recanto do Açaí"
              fill
              sizes="36px"
              className="object-contain p-0.5"
            />
          </span>
          <span className="font-display text-base sm:text-xl font-bold truncate">
            <span className="text-primary">Recanto</span> do Açaí
            <span className="ml-2 align-middle text-[10px] font-sans font-extrabold tracking-[0.2em] bg-primary text-white px-1.5 py-0.5 rounded hidden sm:inline-block">
              EVENTOS
            </span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-gold transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <WhatsAppCTA message={waDefaultMessage} variant="primary" cta="header" className="!px-4 !py-2.5 text-sm shrink-0">
          <WhatsappIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Falar conosco</span>
          <span className="sm:hidden">WhatsApp</span>
        </WhatsAppCTA>
      </div>
    </header>
  );
}

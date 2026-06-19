import { nav, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-primary/15 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="font-display text-lg sm:text-xl font-bold whitespace-nowrap">
          <span className="text-gold">Recanto</span> do Açaí
          <span className="ml-2 align-middle text-[10px] font-sans font-extrabold tracking-[0.2em] bg-primary text-white px-1.5 py-0.5 rounded">
            EVENTOS
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-gold transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <WhatsAppCTA message={waDefaultMessage} variant="primary" className="!px-5 !py-2.5 text-sm">
          <WhatsappIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Falar conosco</span>
          <span className="sm:hidden">WhatsApp</span>
        </WhatsAppCTA>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function BlogStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 450);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="glass-strong border-t border-gold/20 px-4 py-3 flex items-center gap-3 safe-area-pb">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ink truncate">Recanto do Açaí · Estações</p>
          <p className="text-xs text-muted truncate">6x sem juros · Pagamento seguro</p>
        </div>
        <Link
          href="/reserva"
          className="shrink-0 rounded-full bg-gold text-bg font-bold px-5 py-2.5 text-sm hover:bg-gold-soft shadow-gold transition-colors"
        >
          Reserve Agora
        </Link>
      </div>
    </div>
  );
}

import { site, footer, nav } from "@/lib/content";
import { MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon, TiktokIcon } from "./primitives";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft py-14">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-xl font-bold">
            <span className="text-gold">Recanto</span> do Açaí
          </div>
          <p className="text-muted text-sm mt-3">{footer.tagline}</p>
          <p className="text-muted text-sm mt-4 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" /> {site.region}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-gold transition-colors">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Redes sociais</h4>
          <div className="flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-gold transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={site.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-gold transition-colors"
            >
              <TiktokIcon className="w-5 h-5" />
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-gold transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
          <p className="text-muted text-sm mt-4">{site.whatsappDisplay}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 mt-10 pt-6 border-t border-line text-xs text-muted flex flex-col sm:flex-row justify-between gap-2">
        <span>© 2026 Recanto do Açaí. Todos os direitos reservados.</span>
        <span>{footer.group}</span>
      </div>
    </footer>
  );
}

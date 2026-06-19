import { packages } from "@/lib/content";
import { SectionTitle, WhatsAppCTA, WhatsappIcon } from "./primitives";
import { brl } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

export function Packages() {
  return (
    <section id="pacotes" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Pacotes" title={packages.title} subtitle={packages.subtitle} />

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
          {packages.options.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-8 flex flex-col ${
                pkg.highlighted ? "glass-strong border-gold/50 shadow-gold" : "glass"
              }`}
            >
              {"badge" in pkg && pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ {pkg.badge}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-ink">{pkg.name}</h3>
              <p className="text-gold text-sm font-semibold mt-1">{pkg.tagline}</p>
              <div className="mt-5 mb-6">
                <span className="font-display text-4xl font-bold text-ink">{brl(pkg.price)}</span>
              </div>
              <ul className="space-y-3 grow">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <Check className="w-4 h-4 text-whats shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <WhatsAppCTA
                message={`Olá, Recanto! 🍇 Tenho interesse no pacote ${pkg.name} (${brl(pkg.price)}) para o meu evento. Pode me passar os detalhes?`}
                variant={pkg.highlighted ? "gold" : "primary"}
                className="mt-7 w-full"
              >
                <WhatsappIcon className="w-4 h-4" /> {pkg.cta}
              </WhatsAppCTA>
            </div>
          ))}
        </div>

        {/* Âncora do combo */}
        <div className="glass rounded-2xl p-6 mt-8 max-w-4xl mx-auto text-center">
          <h4 className="font-display text-lg font-bold text-gold">{packages.anchorTitle}</h4>
          <p className="text-muted mt-2">{packages.anchor}</p>
        </div>

        {/* Add-ons */}
        <div className="mt-10 max-w-4xl mx-auto">
          <h4 className="font-display text-xl font-bold text-ink text-center mb-5">
            {packages.addons.title}
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {packages.addons.items.map((a) => (
              <div
                key={a.name}
                className="glass rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <div className="font-semibold text-ink">{a.name}</div>
                    <div className="text-xs text-muted">{a.desc}</div>
                  </div>
                </div>
                <span className="font-display font-bold text-gold whitespace-nowrap">
                  + {brl(a.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

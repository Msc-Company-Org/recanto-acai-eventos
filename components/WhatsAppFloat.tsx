import { waDefaultMessage } from "@/lib/content";
import { waLink } from "@/lib/utils";
import { WhatsappIcon } from "./primitives";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(waDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-whats text-white flex items-center justify-center shadow-glow hover:bg-whats-dark hover:scale-105 transition-all"
    >
      <WhatsappIcon className="w-7 h-7" />
    </a>
  );
}

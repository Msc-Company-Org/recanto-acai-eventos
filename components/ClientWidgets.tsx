"use client";

import dynamic from "next/dynamic";

// Carregados apenas no cliente, sem SSR — não bloqueiam o primeiro render
export const NaiaraChat  = dynamic(() => import("./NaiaraChat").then(m => ({ default: m.NaiaraChat })),  { ssr: false });
export const LeadPopup   = dynamic(() => import("./LeadPopup").then(m => ({ default: m.LeadPopup })),    { ssr: false });
export const ScrollReveal= dynamic(() => import("./ScrollReveal").then(m => ({ default: m.ScrollReveal })),{ ssr: false });

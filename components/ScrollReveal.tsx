"use client";

import { useEffect } from "react";

/**
 * Revela cada seção com fade-in-up quando ela entra na viewport.
 * Progressive enhancement: só ativa via JS (adiciona `js-anim` ao <html>);
 * sem JS ou com "reduzir movimento", tudo aparece normal.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("js-anim");

    const sections = Array.from(document.querySelectorAll("main > section"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}

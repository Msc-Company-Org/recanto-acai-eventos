import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SectionTitle } from "@/components/primitives";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Recanto do Açaí · Estações",
  description:
    "Dicas e ideias para ter uma estação de açaí e sorvete gourmet no seu evento no Rio de Janeiro.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 min-h-screen bg-radial-glow">
        <div className="mx-auto max-w-4xl px-6">
          <SectionTitle title="Blog" subtitle="Ideias e dicas para adoçar o seu evento." />
          <div className="mt-12 space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block glass rounded-2xl p-6 hover:border-gold/40 transition-all"
              >
                {post.category && (
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {post.category}
                  </span>
                )}
                <h2 className="font-display text-xl font-bold text-white mt-1">{post.title}</h2>
                <p className="text-muted text-sm mt-2">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-gold text-sm mt-3">
                  Ler mais <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

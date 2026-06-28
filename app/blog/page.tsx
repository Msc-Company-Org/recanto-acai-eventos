import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/primitives";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog · Dicas para Estação de Açaí em Eventos no RJ | Recanto do Açaí",
  description:
    "Guias, preços e dicas para contratar uma estação de açaí e sorvete gourmet para casamentos, festas infantis e eventos no Rio de Janeiro.",
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
                className="block glass rounded-2xl overflow-hidden card-3d"
              >
                {post.cover && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 720px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-display text-xl font-bold text-ink mt-1">{post.title}</h2>
                  <p className="text-muted text-sm mt-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-gold text-sm mt-3">
                    Ler mais <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

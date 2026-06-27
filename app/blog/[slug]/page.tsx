import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WhatsAppCTA, WhatsappIcon } from "@/components/primitives";
import { site, waDefaultMessage } from "@/lib/content";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: `${post.title} — Recanto do Açaí`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await marked.parse(post.content);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.cover ? `${site.url}${post.cover}` : undefined,
    author: { "@type": "Organization", name: "Recanto do Açaí" },
    publisher: { "@type": "Organization", name: "Recanto do Açaí" },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Header />
      <main className="pt-32 pb-20 min-h-screen">
        <article className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-muted hover:text-gold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao blog
          </Link>
          {post.category && (
            <span className="block text-gold text-sm font-semibold uppercase tracking-wider mt-6">
              {post.category}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2 leading-tight">
            {post.title}
          </h1>
          <div className="divider-gold mt-6" />
          {post.cover && (
            <div className="relative w-full aspect-[16/9] mt-8 overflow-hidden rounded-2xl glass shadow-glow">
              <Image
                src={post.cover}
                alt={post.coverAlt || post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          {post.audio && (
            <div className="mt-8 glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-display font-bold text-ink shrink-0">🎧 Ouça este artigo</span>
              <audio controls preload="none" src={post.audio} className="w-full">
                Seu navegador não suporta áudio.
              </audio>
            </div>
          )}
          <div
            className="prose-recanto mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-12 glass-strong rounded-2xl p-7 text-center">
            <p className="font-display text-xl text-ink mb-4">
              Vamos adoçar o seu evento?
            </p>
            <WhatsAppCTA message={waDefaultMessage} variant="gold">
              <WhatsappIcon /> Pedir orçamento no WhatsApp
            </WhatsAppCTA>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

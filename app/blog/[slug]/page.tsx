import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WhatsAppCTA, WhatsappIcon } from "@/components/primitives";
import { waDefaultMessage } from "@/lib/content";
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
  return { title: `${post.title} — Recanto do Açaí`, description: post.description };
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

  return (
    <>
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
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
            {post.title}
          </h1>
          <div className="divider-gold mt-6" />
          <div
            className="prose-recanto mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-12 glass-strong rounded-2xl p-7 text-center">
            <p className="font-display text-xl text-white mb-4">
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

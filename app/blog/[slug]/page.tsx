import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCta } from "@/components/BlogCta";
import { VideoGallery } from "@/components/VideoGallery";
import { BlogImageGallery, BlogStickyBar } from "@/components/BlogClientWidgets";
import { site } from "@/lib/content";
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

  // Split at ~60% for mid-article CTA
  const mid = Math.floor(post.content.length * 0.60);
  const splitAt = post.content.indexOf("\n\n", mid);
  const firstHalf = post.content.slice(0, splitAt !== -1 ? splitAt : mid);
  const secondHalf = post.content.slice(splitAt !== -1 ? splitAt : mid);

  const [htmlFirst, htmlSecond] = await Promise.all([
    marked.parse(firstHalf),
    marked.parse(secondHalf),
  ]);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    keywords: post.keywords,
    datePublished: post.date,
    image: post.cover ? `${site.url}${post.cover}` : undefined,
    author: { "@type": "Organization", name: "Recanto do Açaí" },
    publisher: { "@type": "Organization", name: "Recanto do Açaí" },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${site.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      <main className="pt-32 pb-28 min-h-screen">
        <article className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Navegação">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-muted hover:text-gold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao blog
            </Link>
          </nav>

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

          {/* Primeira metade do artigo */}
          <div
            className="prose-recanto mt-8"
            dangerouslySetInnerHTML={{ __html: htmlFirst }}
          />

          {/* CTA inline no meio do artigo */}
          <BlogCta variant="inline" />

          {/* Segunda metade do artigo */}
          <div
            className="prose-recanto"
            dangerouslySetInnerHTML={{ __html: htmlSecond }}
          />

          {/* Galeria de vídeos do post (se houver) */}
          {post.videos && post.videos.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-6">Vídeos do evento</h2>
              <VideoGallery videos={post.videos} />
            </div>
          )}

          {/* CTA final */}
          <BlogCta variant="end" />
        </article>

        {/* Galeria de imagens */}
        <section className="mx-auto max-w-5xl px-6 mt-16">
          <h2 className="font-display text-2xl font-bold text-ink mb-6 text-center">
            Veja como fica na prática
          </h2>
          <BlogImageGallery />
          <p className="text-center text-muted text-sm mt-4">
            Clique em qualquer foto para ampliar · {" "}
            <Link href="/#galeria" className="text-gold hover:underline">
              Ver mais fotos na página principal
            </Link>
          </p>
        </section>
      </main>
      <Footer />
      <BlogStickyBar />
    </>
  );
}

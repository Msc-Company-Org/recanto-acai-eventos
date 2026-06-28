import fs from "node:fs";
import path from "node:path";
import type { VideoItem } from "@/components/VideoGallery";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  excerpt?: string;
  readingTime?: string;
  cover?: string;
  coverAlt?: string;
  keywords?: string;
  audio?: string;
  videos?: VideoItem[];
  content: string;
};

export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // remove BOM, se presente
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, content: m[2] };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const posts: Post[] = [];
  for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = parseFrontmatter(raw);
      posts.push({
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? file,
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category,
        excerpt: data.excerpt ?? data.description,
        readingTime: data.readingTime,
        cover: data.cover,
        coverAlt: data.coverAlt,
        keywords: data.keywords,
        audio: data.audio,
        videos: data.videos
          ? data.videos.split(",").map(v => {
              const pipe = v.indexOf("|");
              return pipe === -1
                ? { videoId: v.trim(), title: "Vídeo Recanto do Açaí" }
                : { videoId: v.slice(0, pipe).trim(), title: v.slice(pipe + 1).trim() };
            })
          : undefined,
        content,
      });
    } catch (e) {
      console.error(`[blog] falha ao ler "${file}":`, e);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

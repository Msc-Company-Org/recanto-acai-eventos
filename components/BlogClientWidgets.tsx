"use client";

import dynamic from "next/dynamic";

export const BlogImageGallery = dynamic(
  () => import("./BlogImageGallery").then(m => ({ default: m.BlogImageGallery })),
  { ssr: false }
);

export const BlogStickyBar = dynamic(
  () => import("./BlogStickyBar").then(m => ({ default: m.BlogStickyBar })),
  { ssr: false }
);

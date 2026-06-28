import { YoutubeEmbed } from "./YoutubeEmbed";
import { SectionTitle } from "./primitives";

export interface VideoItem {
  videoId: string;
  title: string;
}

interface Props {
  videos: VideoItem[];
  asSection?: boolean;
}

export function VideoGallery({ videos, asSection = false }: Props) {
  if (!videos.length) return null;

  const grid = (
    <div className={`grid gap-6 ${videos.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-2"} ${videos.length >= 3 ? "lg:grid-cols-3" : ""}`}>
      {videos.map(v => (
        <YoutubeEmbed key={v.videoId} videoId={v.videoId} title={v.title} />
      ))}
    </div>
  );

  if (!asSection) return grid;

  return (
    <section id="videos" className="py-14 md:py-28 bg-bg">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Vídeos"
          title="Veja como é na prática"
          subtitle="Momentos reais dos nossos atendimentos — açaí cremoso, equipe dedicada e muita alegria."
        />
        <div className="mt-10">{grid}</div>
      </div>
    </section>
  );
}

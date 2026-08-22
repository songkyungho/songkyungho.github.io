import type { Metadata } from "next";
import { PageIntro } from "../components";
import media from "../data/media.json";
import MediaArchive from "./MediaArchive";

export const metadata: Metadata = { title: "미디어 | 송경호", description: "AI 안전과 정치에 관한 인터뷰, 방송과 언론 보도" };

function dateKey(item: { year: string | null; month: number | null; day: number | null }) {
  return Number(item.year ?? 0) * 372 + Number(item.month ?? 0) * 31 + Number(item.day ?? 0);
}

const sortedMedia = [...media].sort((a, b) => dateKey(b) - dateKey(a));

export default function MediaPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="MEDIA" title="미디어" />
      <MediaArchive media={sortedMedia} />
    </main>
  );
}

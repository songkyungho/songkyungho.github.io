import type { Metadata } from "next";
import { PageIntro } from "../components";
import media from "../data/media.json";
import writingArchive from "../data/writing-archive.json";
import MediaArchive from "./MediaArchive";
import PressList from "./PressList";

export const metadata: Metadata = { title: "미디어 | 송경호", description: "AI 안전과 정치에 관한 인터뷰, 방송과 언론 보도" };

function dateKey(item: { year: string | null; month: number | string | null; day: number | string | null }) {
  return Number(item.year ?? 0) * 372 + Number(item.month ?? 0) * 31 + Number(item.day ?? 0);
}

const sortedMedia = [...media].sort((a, b) => dateKey(b) - dateKey(a));

const press = writingArchive
  .filter((item) => item.section === "보도")
  .map(({ slug, title, publication, year, month, day, sourceUrl }) => ({ slug, title, publication, year, month, day, sourceUrl }))
  .sort((a, b) => dateKey(b) - dateKey(a));

export default function MediaPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="MEDIA" title="미디어" />
      <MediaArchive media={sortedMedia} />
      <PressList press={press} />
    </main>
  );
}

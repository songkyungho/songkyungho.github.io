import type { Metadata } from "next";
import { PageIntro } from "../components";
import archive from "../data/writing-archive.json";
import { translations } from "../translations/registry";
import WritingArchive from "./WritingArchive";
import WritingPhotos from "./WritingPhotos";

export const metadata: Metadata = { title: "글 | 송경호", description: "AI 정치, 민주주의, 인권과 동아시아에 관한 칼럼·기고·에세이" };

export default function WritingPage() {
  const summaries = archive
    .filter((item) => item.section !== "보도")
    .map(({ slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note }) => ({
      slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note,
    }));
  // 블로그는 개인 노트와 번역 두 갈래. 번역은 /translations에 따로 두고 목록에만 섞는다(가장 최근이라 맨 앞).
  const translated = translations.map((doc) => {
    const [year, month, day] = doc.translated.split("-");
    return {
      slug: doc.slug, title: doc.title, publication: "번역", issue: null, year, month: String(Number(month)), day: String(Number(day)),
      section: "블로그", kind: "translation", sourceUrl: null, migrationStatus: "상세 페이지 완료", note: null,
      href: `/translations/${doc.slug}`,
    };
  });
  return (
    <main className="inner-page">
      <PageIntro eyebrow="WRITING" title="글" />
      <WritingPhotos />
      <WritingArchive archive={[...translated, ...summaries]} />
    </main>
  );
}

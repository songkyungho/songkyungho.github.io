import type { Metadata } from "next";
import { PageIntro } from "../components";
import archive from "../data/writing-archive.json";
import { listTitle, translations } from "../translations/registry";
import WritingArchive from "./WritingArchive";
import WritingPhotos from "./WritingPhotos";

export const metadata: Metadata = { title: "글 | 송경호", description: "AI 정치, 민주주의, 인권과 동아시아에 관한 칼럼·기고·에세이" };

export default function WritingPage() {
  const summaries = archive
    .filter((item) => item.section !== "보도")
    .map(({ slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note }) => ({
      slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note,
    }));
  // 번역은 '번역' 카테고리로 따로 둔다. 본문은 /translations에 있고 목록에만 섞는다.
  const translated = translations.map((doc) => {
    const [year, month, day] = doc.translated.split("-");
    return {
      slug: doc.slug, title: listTitle(doc), publication: "번역", issue: null, year, month: String(Number(month)), day: String(Number(day)),
      section: "번역", kind: "translation", sourceUrl: null, migrationStatus: "상세 페이지 완료", note: null,
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

import type { Metadata } from "next";
import { PageIntro } from "../components";
import archive from "../data/writing-archive.json";
import officialKorean from "../data/official-korean.json";
import { dotDate, listTitle, translations } from "../translations/registry";
import WritingArchive from "./WritingArchive";
import WritingPhotos from "./WritingPhotos";

export const metadata: Metadata = { title: "글 | 송경호", description: "AI 정치, 민주주의, 인권과 동아시아에 관한 칼럼·기고·에세이" };

export default function WritingPage() {
  const summaries = archive
    .filter((item) => item.section !== "보도")
    .map(({ slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note }) => ({
      slug, title, publication, issue, year, month, day, section, kind, sourceUrl, migrationStatus, note,
    }));
  // 번역은 '번역' 카테고리로 따로 둔다. 본문은 /translations에 있고 목록에만 섞는다. 매체 자리에는 원문 발행 기관을 쓴다.
  const translated = translations.map((doc) => {
    const [year, month, day] = doc.translated.split("-");
    return {
      key: doc.published,
      slug: doc.slug, title: listTitle(doc), publication: doc.publisher, issue: null, year, month: String(Number(month)), day: String(Number(day)),
      section: "번역", kind: "translation", sourceUrl: null, migrationStatus: "상세 페이지 완료", note: null,
      href: `/translations/${doc.slug}`,
    };
  });
  // 원문 기관이 직접 낸 공식 한국어판: 번역하지 않고 한국어판으로 바로 잇는다(↗). 번역 탭에 발간일 순으로 섞는다.
  const official = officialKorean.map((item) => {
    const [year, month, day] = item.published.split("-");
    return {
      key: item.published,
      slug: item.slug, title: `${item.title} (${dotDate(item.published)})`, publication: `${item.publisher} 공식 한국어판`, issue: null,
      year, month: String(Number(month)), day: String(Number(day)),
      section: "번역", kind: "official-korean", sourceUrl: item.url, migrationStatus: "공식 한국어판", note: null,
    };
  });
  const translationRows = [...translated, ...official].sort((a, b) => b.key.localeCompare(a.key));
  return (
    <main className="inner-page">
      <PageIntro eyebrow="WRITING" title="글" />
      <WritingPhotos />
      <WritingArchive archive={[...translationRows, ...summaries]} />
    </main>
  );
}

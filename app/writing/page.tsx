import type { Metadata } from "next";
import { PageIntro } from "../components";
import archive from "../data/writing-archive.json";
import WritingArchive from "./WritingArchive";

export const metadata: Metadata = { title: "글 | 송경호", description: "AI 정치, 민주주의, 인권과 동아시아에 관한 칼럼·기고·에세이" };

export default function WritingPage() {
  const summaries = archive.map(({ slug, title, publication, issue, year, section, kind }) => ({ slug, title, publication, issue, year, section, kind }));
  return <main className="inner-page"><PageIntro eyebrow="WRITING" title="글" /><WritingArchive archive={summaries} /></main>;
}

import type { Metadata } from "next";
import { PageIntro } from "../components";
import BookShelf from "./BookShelf";
import ResearchArchive from "./ResearchArchive";

export const metadata: Metadata = { title: "연구 | 송경호", description: "AI 안전, 거버넌스, 정치이론과 개념사에 관한 논문·보고서·저서" };

export default function ResearchPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="RESEARCH" title="연구" />
      <BookShelf />
      <ResearchArchive />
    </main>
  );
}

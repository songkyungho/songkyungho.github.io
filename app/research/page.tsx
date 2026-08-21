import type { Metadata } from "next";
import { PageIntro } from "../components";
import BookShelf from "./BookShelf";
import ResearchArchive from "./ResearchArchive";

export const metadata: Metadata = { title: "연구 | 송경호", description: "AI 안전, 거버넌스, 정치이론과 개념사에 관한 논문·보고서·저서" };

export default function ResearchPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="RESEARCH" title="연구" description="논문, 보고서, 저서와 학위논문을 연도와 유형별로 살펴볼 수 있습니다. 공식 영문 제목이 있는 연구는 원문과 함께 표시합니다." />
      <BookShelf />
      <ResearchArchive />
    </main>
  );
}

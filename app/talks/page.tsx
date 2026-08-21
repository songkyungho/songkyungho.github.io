import type { Metadata } from "next";
import { PageIntro } from "../components";
import TalksArchive from "./TalksArchive";
import TalksPhotos from "./TalksPhotos";

export const metadata: Metadata = { title: "발표와 강연 | 송경호", description: "국제·국내 학술발표, 정책 토론과 대중 강연 기록" };

export default function TalksPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="TALKS & PRESENTATIONS" title="발표와 강연" />
      <TalksPhotos />
      <TalksArchive />
    </main>
  );
}

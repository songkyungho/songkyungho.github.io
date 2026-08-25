import type { Metadata } from "next";
import { PageIntro } from "../components";
import SoundCloudTracks from "./SoundCloudTracks";

export const metadata: Metadata = {
  title: "아트 | 송경호",
  description: "송경호의 음악과 이미지 작업",
};

export default function ArtPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="ART" title="음악과 이미지" />
      <SoundCloudTracks />
      <section className="art-image-section" aria-labelledby="art-image-heading">
        <div className="about-section-title">
          <p className="eyebrow">IMAGE</p>
          <h2 id="art-image-heading">이미지</h2>
        </div>
      </section>
    </main>
  );
}

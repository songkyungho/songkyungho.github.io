const photos = [
  { src: "/images/talks/talk-symposium-2025.png", alt: "2025 AI 연구기관 성과공유 심포지엄 발표" },
  { src: "/images/talks/talk-conference-room.jpeg", alt: "국제 컨퍼런스 발표" },
  { src: "/images/talks/talk-warfilmfest-2025.jpeg", alt: "제3회 전쟁과여성영화제 포럼 패널" },
  { src: "/images/talks/talk-seoul-forum-2025.jpeg", alt: "2025 인공지능 안전 서울포럼 패널" },
  { src: "/images/talks/talk-icml-panel.jpeg", alt: "ICML 2026 패널 토론" },
  { src: "/images/talks/talk-ai-safety-workshop.jpeg", alt: "AI Safety Workshop 참석자 단체사진" },
  { src: "/images/talks/talk-agu24-poster.jpg", alt: "AGU24 포스터 발표" },
  { src: "/images/talks/talk-llm-political-questions.jpg", alt: "How Do LLM Respond to Political Questions? 발표" },
  { src: "/images/talks/talk-visit-llnl.jpeg", alt: "Lawrence Livermore National Laboratory 방문" },
  { src: "/images/talks/talk-visit-delegation.jpeg", alt: "해외 기관 대표단 면담" },
  { src: "/images/talks/talk-roundtable.jpg", alt: "좌담회" },
  { src: "/images/talks/talk-yonghwa-2024-lecture.jpg", alt: "2024 이세계 헌법 특강" },
  { src: "/images/talks/talk-yonghwa-2024-b.jpg", alt: "용화여자고등학교 특강" },
  { src: "/images/talks/talk-bk21-award.jpg", alt: "4단계 BK21사업 우수 참여인력 표창 시상식" },
];

export default function TalksPhotos() {
  const track = [...photos, ...photos];
  return (
    <div className="slideshow-viewport" aria-label="발표와 강연 사진">
      <div className="slideshow-track talk-photos" style={{ animationDuration: `${photos.length * 4}s` }}>
        {track.map((photo, i) => (
          <img alt={photo.alt} key={`${photo.src}-${i}`} src={photo.src} />
        ))}
      </div>
    </div>
  );
}

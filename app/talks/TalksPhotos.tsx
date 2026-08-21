const photos = [
  { src: "/images/talks/talk-symposium-2025.png", alt: "2025 AI 연구기관 성과공유 심포지엄 발표" },
  { src: "/images/talks/talk-conference-room.jpeg", alt: "국제 컨퍼런스 발표" },
  { src: "/images/talks/talk-panel-warfilmfest.jpeg", alt: "제3회 전쟁과여성영화제 패널 발표" },
];

export default function TalksPhotos() {
  return (
    <section className="talk-photos" aria-label="발표와 강연 사진">
      {photos.map((photo) => (
        <img alt={photo.alt} key={photo.src} src={photo.src} />
      ))}
    </section>
  );
}

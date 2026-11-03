// 미디어 출연 사진. 발표 페이지(TalksPhotos)와 같은 슬라이드쇼이며, 새 사진은 맨 앞에 더한다.
const photos = [
  { src: "/images/media/sbs-newshunters-2026-09.jpg", alt: "SBS 뉴스헌터스 출연 (2026. 9.)" },
  { src: "/images/media/joongang-interview-2025.jpg", alt: "중앙일보 영상 인터뷰 (2025. 9.)" },
];

export default function MediaPhotos() {
  if (photos.length === 0) return null;
  // 사진이 적을 때도 띠가 화면을 채우도록 최소 열 장까지 되풀이한 뒤, 이어 붙여 끊김 없이 돈다
  const base = Array.from({ length: Math.ceil(10 / photos.length) }, () => photos).flat();
  const track = [...base, ...base];
  return (
    <div className="slideshow-viewport" aria-label="미디어 출연 사진">
      <div className="slideshow-track media-photos" style={{ animationDuration: `${base.length * 4}s` }}>
        {track.map((photo, i) => (
          <img alt={photo.alt} key={`${photo.src}-${i}`} src={photo.src} />
        ))}
      </div>
    </div>
  );
}

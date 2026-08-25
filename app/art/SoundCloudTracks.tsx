"use client";

import { useState } from "react";

const tracks = [
  { title: "Country Walk", date: "2013.06.08", genre: "Electronic", url: "https://soundcloud.com/songpanda/20130608-1" },
  { title: "75 BPM", date: "2012.02.15", genre: "Midtempo", url: "https://soundcloud.com/songpanda/75-bpm" },
  { title: "City Life", date: "2012.02.14", genre: "Electronic", url: "https://soundcloud.com/songpanda/city-life" },
  { title: "Darkside", date: "2012.02.02", genre: "Alternative", url: "https://soundcloud.com/songpanda/darkside" },
  { title: "Smog", date: "2012.01.28", genre: "Electronic", url: "https://soundcloud.com/songpanda/smog" },
  { title: "Discharged", date: "2011.12.30", genre: "Electronic", url: "https://soundcloud.com/songpanda/discharged" },
] as const;

function playerUrl(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    color: "#286b9c",
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export default function SoundCloudTracks() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  return (
    <section className="archive-block art-sound-section" aria-labelledby="art-sound-heading">
      <div className="archive-tools art-section-tools">
        <div>
          <p className="eyebrow">SOUND</p>
          <h2 id="art-sound-heading">음악({tracks.length})</h2>
        </div>
        <a href="https://soundcloud.com/songpanda/tracks" target="_blank" rel="noopener noreferrer">SoundCloud ↗</a>
      </div>
      <div className="art-track-list">
        {tracks.map((track) => {
          const isActive = activeUrl === track.url;
          return (
            <article className={`art-track${isActive ? " active" : ""}`} key={track.url}>
              <div className="art-track-summary">
                <button
                  type="button"
                  className="art-play-button"
                  aria-label={`${track.title} ${isActive ? "정지" : "재생"}`}
                  aria-expanded={isActive}
                  onClick={() => setActiveUrl(isActive ? null : track.url)}
                >
                  <span aria-hidden="true">{isActive ? "■" : "▶"}</span>
                </button>
                <time>{track.date}</time>
                <div>
                  <span className="type-chip">{track.genre}</span>
                  <h3>{track.title}</h3>
                </div>
                <a href={track.url} target="_blank" rel="noopener noreferrer" aria-label={`${track.title} SoundCloud에서 열기`}>↗</a>
              </div>
              {isActive && (
                <div className="art-player">
                  <iframe
                    title={`${track.title} — SoundCloud 플레이어`}
                    width="100%"
                    height="120"
                    scrolling="no"
                    frameBorder="0"
                    allow="autoplay"
                    loading="lazy"
                    src={playerUrl(track.url)}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

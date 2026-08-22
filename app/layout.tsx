import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components";

export const metadata: Metadata = {
  title: "송경호 | Kyungho David Song",
  description: "정치학자 송경호의 연구, 논문, 발표, 칼럼과 미디어 활동을 모은 개인 연구 아카이브입니다.",
  openGraph: {
    title: "송경호 | Kyungho David Song",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "송경호 | Kyungho David Song",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
  },
};

// vinext's App Router client runtime hijacks every same-origin <a> click for
// RSC soft-navigation, then throws inside its own handler in this static
// export — killing navigation entirely. This capture-phase listener runs
// before that handler (DOM capture always precedes bubble, regardless of
// attach order) and stops it, leaving the browser's native anchor navigation.
const disableBrokenClientRouting = `
document.addEventListener("click", function (e) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var el = e.target;
  while (el && el.tagName !== "A") el = el.parentElement;
  if (!el || !el.getAttribute("href") || el.getAttribute("href").charAt(0) === "#") return;
  if (el.target && el.target !== "_self") return;
  e.stopImmediatePropagation();
}, true);
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <script dangerouslySetInnerHTML={{ __html: disableBrokenClientRouting }} />
        <SiteHeader />{children}<SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components";
import { SITE_URL } from "../site.config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "송경호 | Kyungho David Song",
  description: "정치학자 송경호의 연구, 논문, 발표, 칼럼과 미디어 활동을 모은 개인 연구 아카이브입니다.",
  icons: {
    // 탭 아이콘. 정의는 ~/Code/ai-safety-common/aisafety_common/favicon.py("home"), 파일은 scripts/make_favicon.py가 만든다
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "송경호 | Kyungho David Song",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
    type: "website",
    locale: "ko_KR",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "송경호 | Kyungho David Song",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />{children}<SiteFooter />
      </body>
    </html>
  );
}

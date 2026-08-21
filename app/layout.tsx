import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components";

export const metadata: Metadata = {
  title: "송경호 | AI 안전·거버넌스·정치이론",
  description: "정치학자 송경호의 연구, 논문, 발표, 칼럼과 미디어 활동을 모은 개인 연구 아카이브입니다.",
  openGraph: {
    title: "송경호 | AI 안전·거버넌스·정치이론",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "송경호 | AI 안전·거버넌스·정치이론",
    description: "정치학자 송경호의 논문, 정책보고서, 발표와 글을 모은 개인 연구 아카이브입니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}

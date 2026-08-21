# 송경호 · Kyungho David Song

정치학자 송경호의 연구, 논문, 발표, 칼럼과 미디어 활동을 모은 개인 연구 아카이브입니다.

- 현재 사이트: <https://songkyungho.github.io/>
- 언어: 한국어 중심, 공식 영문 제목·초록 병기
- 글 아카이브: 이슈브리프, 칼럼, 에세이 90편

## 구성

- `/about` 소개
- `/research` 연구와 논문
- `/talks` 발표
- `/writing` 이슈브리프·칼럼·에세이
- `/media` 방송·영상 인터뷰·프로젝트

## 로컬 실행

Node.js 22.13 이상과 pnpm이 필요합니다.

```bash
pnpm install
pnpm dev
```

배포용 빌드는 다음 명령으로 확인합니다.

```bash
pnpm build
```

## 배포

`main`에 push하면 [GitHub Actions](.github/workflows/deploy-pages.yml)가 `vinext build`로
정적 파일(`output: "export"`)을 만들어 GitHub Pages에 자동 배포합니다.

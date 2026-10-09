# 송경호 · Kyungho David Song

정치학자 송경호의 연구, 논문, 발표, 칼럼과 미디어 활동을 모은 개인 연구 아카이브입니다.

- 현재 사이트: <https://songkyungho.github.io/>
- 언어: 한국어 중심, 공식 영문 제목·초록 병기
- 글 아카이브: 이슈브리프·칼럼·에세이·블로그 127편 (상세 페이지 86편). 보도 29편을 포함하면 156편

## 구성

- `/about` CV
- `/research` 연구와 논문
- `/talks` 발표
- `/writing` 이슈브리프·칼럼·에세이·블로그
- `/media` 방송·영상 인터뷰·프로젝트
- `/art` 음악·이미지 작업
- `/site` 이 사이트 소개
- `/updates` 사이트 업데이트 로그

## 로컬 실행

Node.js 22.13 이상과 pnpm이 필요합니다. 프레임워크는 Next.js(정적 내보내기, `output: "export"`)입니다.

```bash
pnpm install
pnpm dev
```

배포용 정적 빌드(`out/`)와 렌더링 테스트는 다음 명령으로 확인합니다.

```bash
pnpm test   # = pnpm build + node --test tests/rendered-html.test.mjs
```

## 배포

`main`에 push하면 [GitHub Actions](.github/workflows/deploy-pages.yml)가 `pnpm test`(= `next build`
정적 내보내기 + 렌더링 테스트)를 실행하고, 생성된 `out/` 폴더를 GitHub Pages에 자동 배포합니다.
테스트가 실패하면 배포하지 않습니다.

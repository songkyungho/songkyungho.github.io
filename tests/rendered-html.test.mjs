import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// `pnpm build`가 만든 서버 번들로 홈(/)을 렌더링한다.
async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("server-renders the home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>송경호 \| Kyungho David Song<\/title>/);
  assert.match(html, /인공지능안전연구소 선임연구원/);
  assert.match(html, /FEATURED/);
  // 스타터 템플릿 흔적이 남지 않았는지
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("renders the AI safety site banners from projects.json", async () => {
  const projects = JSON.parse(
    await readFile(new URL("../app/data/projects.json", import.meta.url), "utf8"),
  );
  const html = await (await render()).text();

  assert.match(html, /<ul class="project-links">/);
  for (const link of projects.links) {
    assert.match(html, new RegExp(escapeRegExp(link.title)), `banner title: ${link.title}`);
    assert.match(html, new RegExp(escapeRegExp(link.description)), `banner description: ${link.title}`);
    assert.match(html, new RegExp(`href="${escapeRegExp(link.url)}"`), `banner url: ${link.title}`);
  }

  // 앞 두 배너(다이제스트·라이브러리)는 기본 크기, 나머지는 compact로 한 줄에 둔다.
  const list = html.match(/<ul class="project-links">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const fullCount = (list.match(/<li>/g) ?? []).length;
  const compactCount = (list.match(/<li class="compact">/g) ?? []).length;
  assert.equal(fullCount, 2);
  assert.equal(compactCount, projects.links.length - 2);
});

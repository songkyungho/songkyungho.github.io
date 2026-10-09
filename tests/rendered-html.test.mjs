import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// `pnpm build`(next build, output: "export")가 out/에 쓴 정적 HTML을 읽는다.
async function render(path = "/") {
  const file = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
  return readFile(new URL(`../out/${file}`, import.meta.url), "utf8");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// React가 HTML에 쓰는 방식대로 이스케이프한다.
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

test("exports the home page", async () => {
  const html = await render();
  assert.match(html, /^<!DOCTYPE html>/i);
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
  const html = await render();

  assert.match(html, /<ul class="project-links">/);
  for (const link of projects.links) {
    assert.match(html, new RegExp(escapeRegExp(escapeHtml(link.title))), `banner title: ${link.title}`);
    assert.match(html, new RegExp(escapeRegExp(escapeHtml(link.description))), `banner description: ${link.title}`);
    assert.match(html, new RegExp(`href="${escapeRegExp(escapeHtml(link.url))}"`), `banner url: ${link.title}`);
  }

  // 앞 두 배너(다이제스트·라이브러리)는 기본 크기, 나머지는 compact로 한 줄에 둔다.
  const list = html.match(/<ul class="project-links">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const fullCount = (list.match(/<li>/g) ?? []).length;
  const compactCount = (list.match(/<li class="compact">/g) ?? []).length;
  assert.equal(fullCount, 2);
  assert.equal(compactCount, projects.links.length - 2);
});

test("exports every writing archive entry as a flat .html page", async () => {
  const archive = JSON.parse(
    await readFile(new URL("../app/data/writing-archive.json", import.meta.url), "utf8"),
  );
  for (const item of archive) {
    const html = await render(`/writing/archive/${item.slug}`);
    assert.match(html, new RegExp(`<h1>${escapeRegExp(escapeHtml(item.title))}</h1>`), `archive page: ${item.slug}`);
  }
});

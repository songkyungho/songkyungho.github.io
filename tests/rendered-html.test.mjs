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

test("exports each translation with the disclaimer and every source block paired", async () => {
  const { readdir } = await import("node:fs/promises");
  const dir = new URL("../app/data/translations/", import.meta.url);
  const writing = await render("/writing");
  for (const file of await readdir(dir)) {
    const doc = JSON.parse(await readFile(new URL(file, dir), "utf8"));
    assert.match(writing, new RegExp(`href="/translations/${escapeRegExp(doc.slug)}"`), `writing (blog) link: ${doc.slug}`);
    const html = await render(`/translations/${doc.slug}`);
    assert.match(html, new RegExp(`<h1>${escapeRegExp(escapeHtml(doc.title))}</h1>`), `title: ${doc.slug}`);
    assert.match(html, /LLM 자동번역 · 비공식 참고용/, `disclaimer: ${doc.slug}`);
    assert.match(html, new RegExp(`href="${escapeRegExp(escapeHtml(doc.source_url))}"`), `source link: ${doc.slug}`);
    assert.equal((html.match(/class="tr-row /g) ?? []).length, doc.blocks.length, `paired rows: ${doc.slug}`);
    // 강조 표시가 모두 제자리를 찾아 렌더링됐는지 (번역문을 고쳐 표시 문구가 사라지면 여기서 걸린다)
    const marks = doc.blocks.flatMap((block) => block.marks ?? []);
    assert.equal((html.match(/<mark class="tr-safety">/g) ?? []).length, marks.filter((m) => m.k === "safety").length, `safety marks: ${doc.slug}`);
    assert.equal((html.match(/<strong class="tr-key">/g) ?? []).length, marks.filter((m) => m.k === "key").length, `key marks: ${doc.slug}`);
    // 번역문에 영어 원문이 그대로 남았거나(모델이 앞부분을 되풀이) 모델의 작업 흔적이 섞이지 않았는지
    for (const [n, block] of doc.blocks.entries()) {
      if (!["p", "li"].includes(block.type)) continue;
      for (const part of block.ko.split("\n\n")) {
        const latin = (part.match(/[A-Za-z]/g) ?? []).length;
        const hangul = (part.match(/[가-힣]/g) ?? []).length;
        const words = part.trim().split(/\s+/).length;
        assert.ok(!(words >= 8 && latin > 3 * hangul), `untranslated English in block ${n}: ${doc.slug}`);
        assert.ok(!/다시 쓴다|다시 쓰겠다|번역하면 다음과 같다/.test(part), `model note left in block ${n}: ${doc.slug}`);
      }
    }
    // 표는 번역·원문 두 칸 모두 표로 렌더링되는지
    const tables = doc.blocks.filter((block) => block.type === "table").length;
    assert.equal((html.match(/<table class="tr-table"/g) ?? []).length, tables * 2, `tables: ${doc.slug}`);
    // 상호 참조가 모두 링크로 렌더링되고, 가리키는 제목이 페이지에 있는지
    const refs = doc.blocks.flatMap((block) => block.refs ?? []);
    assert.equal((html.match(/<a class="tr-ref" href="#s\d+">/g) ?? []).length, refs.length, `cross-refs: ${doc.slug}`);
    for (const ref of refs) assert.match(html, new RegExp(`id="${ref.to}"`), `cross-ref target ${ref.to}: ${doc.slug}`);
  }
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

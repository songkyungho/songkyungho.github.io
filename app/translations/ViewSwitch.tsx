"use client";

import { useEffect, useSyncExternalStore } from "react";

const VIEWS = [
  ["ko", "번역"],
  ["both", "원문 대조"],
  ["en", "원문"],
] as const;
type View = (typeof VIEWS)[number][0];
const STORAGE_KEY = "translation-view";
const EVENT = "translation-view-change";

// 선택은 이 브라우저의 localStorage에만 기억한다. 막혀 있으면(사생활 보호 창 등) 기본값 "번역"으로 보인다.
function readView(): View {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ko" || saved === "both" || saved === "en") return saved;
  } catch {
    // 저장소를 못 쓰면 기본값
  }
  return "ko";
}

function writeView(view: View) {
  try {
    localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // 기억하지 못해도 이번 화면에는 적용된다
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: view }));
}

let current: View | null = null;
function subscribe(onChange: () => void) {
  const handler = (event: Event) => {
    current = (event as CustomEvent<View>).detail;
    onChange();
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

// 본문(#tr-body)의 data-view만 바꾸고, 무엇을 보일지는 CSS가 정한다.
export function ViewSwitch() {
  const view = useSyncExternalStore(subscribe, () => current ?? readView(), () => "ko" as View);

  useEffect(() => {
    document.getElementById("tr-body")?.setAttribute("data-view", view);
  }, [view]);

  return (
    <div className="tr-switch" role="radiogroup" aria-label="보기 방식">
      {VIEWS.map(([value, label]) => (
        <button aria-checked={view === value} key={value} onClick={() => writeView(value)} role="radio" type="button">
          {label}
        </button>
      ))}
    </div>
  );
}

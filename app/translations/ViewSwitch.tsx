"use client";

import { useEffect, useSyncExternalStore } from "react";

const VIEWS = [
  ["ko", "번역"],
  ["both", "원문 대조"],
  ["en", "원문"],
] as const;
type View = (typeof VIEWS)[number][0];
type Marks = "on" | "off";

// 선택은 이 브라우저의 localStorage에만 기억한다. 막혀 있으면(사생활 보호 창 등) 기본값으로 보인다.
function createPref<T extends string>(storageKey: string, allowed: readonly T[], fallback: T) {
  const event = `${storageKey}-change`;
  let current: T | null = null;
  const read = (): T => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && (allowed as readonly string[]).includes(saved)) return saved as T;
    } catch {
      // 저장소를 못 쓰면 기본값
    }
    return fallback;
  };
  return {
    subscribe(onChange: () => void) {
      const handler = (e: Event) => {
        current = (e as CustomEvent<T>).detail;
        onChange();
      };
      window.addEventListener(event, handler);
      return () => window.removeEventListener(event, handler);
    },
    get: () => current ?? read(),
    server: () => fallback,
    set(value: T) {
      try {
        localStorage.setItem(storageKey, value);
      } catch {
        // 기억하지 못해도 이번 화면에는 적용된다
      }
      window.dispatchEvent(new CustomEvent(event, { detail: value }));
    },
  };
}

const viewPref = createPref<View>("translation-view", ["ko", "both", "en"], "ko");
const marksPref = createPref<Marks>("translation-marks", ["on", "off"], "on");

// 본문(#tr-body)의 data-view·data-marks만 바꾸고, 무엇을 어떻게 보일지는 CSS가 정한다.
export function ViewSwitch({ hasMarks }: { hasMarks: boolean }) {
  const view = useSyncExternalStore(viewPref.subscribe, viewPref.get, viewPref.server);
  const marks = useSyncExternalStore(marksPref.subscribe, marksPref.get, marksPref.server);

  useEffect(() => {
    const body = document.getElementById("tr-body");
    body?.setAttribute("data-view", view);
    body?.setAttribute("data-marks", marks);
  }, [view, marks]);

  return (
    <>
      <div className="tr-switch" role="radiogroup" aria-label="보기 방식">
        {VIEWS.map(([value, label]) => (
          <button aria-checked={view === value} key={value} onClick={() => viewPref.set(value)} role="radio" type="button">
            {label}
          </button>
        ))}
      </div>
      {hasMarks && (
        <div className="tr-legend">
          <button aria-pressed={marks === "on"} className="tr-marks-toggle" onClick={() => marksPref.set(marks === "on" ? "off" : "on")} type="button">
            강조 {marks === "on" ? "켜짐" : "꺼짐"}
          </button>
          <p><span className="tr-safety">형광 밑줄</span> AI 안전 관련 서술</p>
          <p><span className="tr-key">굵게</span> 항목의 핵심 결론</p>
          <p className="tr-legend-note">강조는 번역자가 LLM으로 표시한 것으로 원문에는 없습니다. 번역문에만 있습니다.</p>
        </div>
      )}
    </>
  );
}

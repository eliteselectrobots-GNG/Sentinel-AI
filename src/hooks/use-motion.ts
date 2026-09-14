import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Marks every `.reveal` element inside the returned ref as `.is-visible`
 * once it scrolls into view. Re-runs after renders so dynamically added
 * sections (e.g. a first scan landing) are picked up too.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    if (targets.length === 0) return;
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
  return ref;
}

/**
 * Animates a number from its previous value to the new one with an ease-out
 * count. Starts at the final value so SSR hydration always matches, and only
 * animates when the value changes while mounted.
 */
export function useCountUp(target: number, duration = 800): string {
  const [display, setDisplay] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    if (prefersReducedMotion() || typeof requestAnimationFrame === "undefined") {
      shownRef.current = target;
      setDisplay(target);
      return;
    }
    const from = shownRef.current;
    if (from === target) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      shownRef.current = value;
      setDisplay(value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return String(display);
}

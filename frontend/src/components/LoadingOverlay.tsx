import { useEffect, useState } from "react";

const STATUS_LINES = [
  "Opening the guide",
  "Loading checkout options",
  "Preparing comparisons",
  "Setting the scene",
] as const;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LoadingOverlay() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      setProgress(100);
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setProgress(Math.round(92 * (1 - Math.exp(-elapsed / 2.2))));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const totalCharacters = STATUS_LINES.reduce((total, line) => total + line.length, 0);
  const revealed = reduced
    ? totalCharacters
    : Math.min(totalCharacters, Math.floor((progress / 92) * totalCharacters));
  let remaining = revealed;
  let activeIndex = STATUS_LINES.length - 1;
  const lines = STATUS_LINES.map((line, index) => {
    const count = Math.max(0, Math.min(line.length, remaining));
    remaining -= count;
    if (count < line.length && activeIndex === STATUS_LINES.length - 1) activeIndex = index;
    return line.slice(0, count);
  });

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading the checkout guide</span>
      <div className="loading-overlay-grid" aria-hidden="true">
        <ul className="loading-overlay-status">
          {STATUS_LINES.map((line, index) => (
            <li
              key={line}
              className={index === activeIndex ? "is-active" : undefined}
            >
              {lines[index] || "\u00a0"}
            </li>
          ))}
        </ul>
        <p className="loading-overlay-percent">
          ( {String(progress).padStart(2, "0")}% )
        </p>
        <p className="loading-overlay-message">
          Choose your
          <br />
          checkout
        </p>
      </div>
    </div>
  );
}

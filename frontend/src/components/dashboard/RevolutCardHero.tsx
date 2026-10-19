import { useEffect, useRef, type ReactNode } from "react";

const POINTER_EASE = 0.1;
const SCROLL_EASE = 0.2;
const SETTLE = 0.0005;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function CardChip() {
  return (
    <svg className="rv-card-chip" viewBox="0 0 46 34" aria-hidden="true">
      <defs>
        <linearGradient id="rv-chip-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e6bf" />
          <stop offset="0.45" stopColor="#c7a564" />
          <stop offset="1" stopColor="#efdcab" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="45" height="33" rx="6" fill="url(#rv-chip-gold)" />
      <g fill="none" stroke="rgba(70, 50, 20, 0.45)" strokeWidth="1">
        <path d="M0.5 11.5h13M0.5 22.5h13M32.5 11.5h13M32.5 22.5h13" />
        <rect x="13.5" y="6.5" width="19" height="21" rx="4" />
        <path d="M23 0.5v6M23 27.5v6" />
      </g>
    </svg>
  );
}

function Contactless() {
  return (
    <svg className="rv-card-contactless" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8.5 9.2a4.2 4.2 0 0 1 0 5.6" />
        <path d="M11.8 6.6a8 8 0 0 1 0 10.8" />
        <path d="M15.1 4a11.8 11.8 0 0 1 0 16" />
      </g>
    </svg>
  );
}

function RevolutCard({ variant }: { variant: "front" | "back" }) {
  return (
    <div className={`rv-card rv-card-${variant}`}>
      <span className="rv-card-brush" />
      <span className="rv-card-sheen" />
      <span className="rv-card-wordmark">Revolut</span>
      {variant === "front" && (
        <>
          <CardChip />
          <Contactless />
          <span className="rv-card-number">•••• 4821</span>
          <span className="rv-card-tier">Metal</span>
        </>
      )}
    </div>
  );
}

export function RevolutCardHero({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = { rx: 0, ry: 0, p: 0 };
    const current = { rx: 0, ry: 0, p: 0 };
    let frame = 0;

    const write = () => {
      hero.style.setProperty("--rx", current.rx.toFixed(4));
      hero.style.setProperty("--ry", current.ry.toFixed(4));
      hero.style.setProperty("--p", current.p.toFixed(4));
    };

    const tick = () => {
      current.rx += (target.rx - current.rx) * POINTER_EASE;
      current.ry += (target.ry - current.ry) * POINTER_EASE;
      current.p += (target.p - current.p) * SCROLL_EASE;
      write();

      const moving =
        Math.abs(target.rx - current.rx) > SETTLE ||
        Math.abs(target.ry - current.ry) > SETTLE ||
        Math.abs(target.p - current.p) > SETTLE;
      frame = moving ? window.requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const readScroll = () => {
      const rect = hero.getBoundingClientRect();
      const next = clamp(-rect.top / (rect.height * 0.85));
      if (Math.abs(next - target.p) < SETTLE && Math.abs(next - current.p) < SETTLE) return;
      target.p = next;
      kick();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.rx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      target.ry = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      kick();
    };

    const onPointerLeave = () => {
      target.rx = 0;
      target.ry = 0;
      kick();
    };

    readScroll();
    current.p = target.p;
    write();

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    if (finePointer) {
      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} id="dashboard-home" className="card-hero">
      <div className="card-hero-atmosphere" aria-hidden="true">
        <span className="card-hero-glow card-hero-glow-a" />
        <span className="card-hero-glow card-hero-glow-b" />
        <span className="card-hero-horizon" />
      </div>

      <div className="page-container card-hero-layout">
        <div className="card-hero-copy">{children}</div>

        <div className="card-stage" aria-hidden="true">
          <span className="card-stage-shadow" />
          <div className="card-arrive">
            <div className="card-rig">
              <RevolutCard variant="back" />
              <RevolutCard variant="front" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

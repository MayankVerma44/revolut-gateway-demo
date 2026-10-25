import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

const VIDEO_SRC = "/assets/revolut-pay.mp4";
const POINTER_EASE = 0.08;
const SCROLL_EASE = 0.12;
const SETTLE = 0.0008;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function RevolutCardHero({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const attach = () => {
      if (video.getAttribute("src")) return;
      video.preload = "metadata";
      video.setAttribute("fetchpriority", "low");
      video.src = VIDEO_SRC;
      if (!reduced) video.play().catch(() => {});
    };

    const idle = window.requestIdleCallback(attach, { timeout: 900 });

    const onVisibility = () => {
      if (!video.getAttribute("src") || reduced) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.cancelIdleCallback(idle);
      };
    }

    const target = { mx: 0, my: 0, scroll: 0 };
    const current = { mx: 0, my: 0, scroll: 0 };
    let frame = 0;

    const write = () => {
      stage.style.setProperty("--mx", current.mx.toFixed(4));
      stage.style.setProperty("--my", current.my.toFixed(4));
      stage.style.setProperty("--scroll", current.scroll.toFixed(4));
    };

    const tick = () => {
      current.mx += (target.mx - current.mx) * POINTER_EASE;
      current.my += (target.my - current.my) * POINTER_EASE;
      current.scroll += (target.scroll - current.scroll) * SCROLL_EASE;
      write();
      const moving =
        Math.abs(target.mx - current.mx) > SETTLE ||
        Math.abs(target.my - current.my) > SETTLE ||
        Math.abs(target.scroll - current.scroll) > SETTLE;
      frame = moving ? window.requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const readScroll = () => {
      const next = clamp(window.scrollY / (window.innerHeight * 1.15));
      if (Math.abs(next - target.scroll) < SETTLE && Math.abs(next - current.scroll) < SETTLE) return;
      target.scroll = next;
      kick();
    };

    const onPointer = (event: PointerEvent) => {
      target.mx = clamp(event.clientX / window.innerWidth - 0.5, -0.5, 0.5) * 2;
      target.my = clamp(event.clientY / window.innerHeight - 0.5, -0.5, 0.5) * 2;
      kick();
    };

    const onLeave = () => {
      target.mx = 0;
      target.my = 0;
      kick();
    };

    readScroll();
    current.scroll = target.scroll;
    write();

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    if (fine) {
      window.addEventListener("pointermove", onPointer);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.cancelIdleCallback(idle);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {createPortal(
        <div className="landing-video-bg" aria-hidden="true">
          <div ref={stageRef} className="landing-video-stage">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          </div>
        </div>,
        document.body,
      )}
      <section id="dashboard-home" className="card-hero">
        <div className="card-hero-atmosphere" aria-hidden="true">
          <span className="card-hero-glow card-hero-glow-a" />
          <span className="card-hero-glow card-hero-glow-b" />
          <span className="card-hero-horizon" />
        </div>

        <div className="page-container card-hero-layout">
          <div className="card-hero-copy">{children}</div>
        </div>
      </section>
    </>
  );
}

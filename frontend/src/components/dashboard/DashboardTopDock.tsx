import { useEffect, useRef } from "react";
import { AnimatedTopDock } from "@designcodeio/threeui/components/AnimatedTopDock";
import "@designcodeio/threeui/style.css";

const DESTINATIONS = [
  { label: "Home", target: "dashboard-home" },
  { label: "Overview", target: "dashboard-overview" },
  { label: "Compare", target: "dashboard-comparison" },
  { label: "Decision", target: "dashboard-decision" },
  { label: "Takeaways", target: "dashboard-takeaways" },
  { label: "Demos", target: "dashboard-demos" },
] as const;

export function DashboardTopDock() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const buttons = Array.from(
      host.querySelectorAll<HTMLButtonElement>("[data-dock-item]"),
    );

    const syncActive = () => {
      let activeIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      DESTINATIONS.forEach((destination, index) => {
        const section = document.getElementById(destination.target);
        if (!section) return;
        const distance = Math.abs(section.getBoundingClientRect().top - 150);
        if (distance < closestDistance) {
          activeIndex = index;
          closestDistance = distance;
        }
      });
      buttons.forEach((button, index) => {
        button.setAttribute("aria-pressed", String(index === activeIndex));
      });
    };

    const cleanups = buttons.map((button, index) => {
      const destination = DESTINATIONS[index];
      if (!destination) return () => {};

      button.setAttribute("aria-label", destination.label);
      button.dataset.dashboardTarget = destination.target;

      if (index > 0) {
        const label = button.lastElementChild;
        if (label) label.textContent = destination.label.toUpperCase();
      }

      const navigate = () => {
        const section = document.getElementById(destination.target);
        if (!section) return;
        section.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      };

      button.addEventListener("click", navigate);
      return () => button.removeEventListener("click", navigate);
    });

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActive();
      });
    };

    syncActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.dispatchEvent(new Event("resize"));
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={hostRef} className="dashboard-top-dock">
      <AnimatedTopDock
        variant="sable"
        proximity={122}
        spring={0.19}
        damping={0.7}
        widthGrowth={17}
        heightGrowth={16}
        drop={3.5}
      />
    </div>
  );
}

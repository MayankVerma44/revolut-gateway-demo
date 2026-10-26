import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HOSTED_CHECKOUT_OVERVIEW,
  REVOLUT_CHECKOUT_OVERVIEW,
  SERVER_TO_SERVER_OVERVIEW,
  SUBSCRIPTION_APIS_OVERVIEW,
} from "../../constants/comparisonOverview";
import { OVERVIEW_TILES, type OverviewTile } from "../../constants/overviewTiles";
import { IndividualSDKPanel } from "./IndividualSDKPanel";
import { PluginsPanel } from "./PluginsPanel";
import { SolutionOverviewPanel } from "./SolutionOverviewPanel";

const EXPAND_MS = 1600;
const SCRIM_MS = 1100;
const CLOSE_MS = 680;
const CLOSE_SCRIM_MS = 420;
const CLOSE_DELAY_MS = 80;
const EXPAND_EASE = "cubic-bezier(0.33, 0, 0.2, 1)";
const CLOSE_EASE = "cubic-bezier(0.4, 0, 1, 1)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function TileBody({ id }: { id: OverviewTile["id"] }) {
  if (id === "embedded") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{ title: "Embedded Checkout", ...REVOLUT_CHECKOUT_OVERVIEW }}
      />
    );
  }
  if (id === "hosted") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{
          title: "Redirect Checkout/Hosted Payment Page",
          bestSuitedFor: HOSTED_CHECKOUT_OVERVIEW.bestSuitedFor,
          merchantExperience: HOSTED_CHECKOUT_OVERVIEW.merchantExperience,
          whyChoose: HOSTED_CHECKOUT_OVERVIEW.whyChoose,
        }}
      />
    );
  }
  if (id === "individual-sdks") {
    return <IndividualSDKPanel as="div" className="overview-inline-panel" />;
  }
  if (id === "plugins") {
    return <PluginsPanel as="div" className="overview-inline-panel" />;
  }
  if (id === "subscription-apis") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{ title: "Subscription APIs", ...SUBSCRIPTION_APIS_OVERVIEW }}
      />
    );
  }
  return (
    <SolutionOverviewPanel
      as="div"
      className="overview-inline-panel"
      data={{ title: "Server-to-Server Integration", ...SERVER_TO_SERVER_OVERVIEW }}
    />
  );
}

function pointInRect(x: number, y: number, rect: DOMRect | undefined, pad = 0) {
  return !!rect && x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}

export function FloatingOverview() {
  const [activeId, setActiveId] = useState<OverviewTile["id"] | null>(null);
  const cells = useRef(new Map<OverviewTile["id"], HTMLDivElement>());
  const cardRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);
  const switchingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const leftDuringOpenRef = useRef(false);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const cancelScheduledClose = () => {
    if (closeTimerRef.current == null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const activeTile = OVERVIEW_TILES.find((tile) => tile.id === activeId) ?? null;

  const finishClose = () => {
    closingRef.current = false;
    motionRef.current = null;
    setActiveId(null);
  };

  const beginClose = () => {
    cancelScheduledClose();
    const id = activeIdRef.current;
    const card = cardRef.current;
    const cell = id ? cells.current.get(id) : null;
    if (!id || closingRef.current) return;
    if (!card || !cell || prefersReducedMotion()) {
      finishClose();
      return;
    }

    const host = card.parentElement?.getBoundingClientRect();
    const from = card.getBoundingClientRect();
    const to = cell.getBoundingClientRect();
    const originX = host ? host.left + host.width / 2 : window.innerWidth / 2;
    const originY = host ? host.top + host.height / 2 : window.innerHeight / 2;
    const baseWidth = card.offsetWidth || 1;
    const baseHeight = card.offsetHeight || 1;
    const pose = (rect: DOMRect) => {
      const dx = rect.left + rect.width / 2 - originX;
      const dy = rect.top + rect.height / 2 - originY;
      const sx = rect.width / baseWidth;
      const sy = rect.height / baseHeight;
      return `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    };

    card.getAnimations().forEach((animation) => animation.cancel());
    closingRef.current = true;
    const animation = card.animate([{ transform: pose(from) }, { transform: pose(to) }], {
      duration: CLOSE_MS,
      easing: CLOSE_EASE,
      fill: "both",
    });
    motionRef.current = animation;
    scrimRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_SCRIM_MS,
      easing: "ease-in",
      fill: "both",
    });
    animation.onfinish = () => {
      if (!closingRef.current) return;
      finishClose();
    };
  };

  const scheduleClose = () => {
    if (!activeIdRef.current || closingRef.current || closeTimerRef.current != null) return;
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      beginClose();
    }, CLOSE_DELAY_MS);
  };

  const resumeOpen = () => {
    cancelScheduledClose();
    const animation = motionRef.current;
    if (!closingRef.current || !animation) return;
    closingRef.current = false;
    animation.onfinish = null;
    animation.reverse();
    const scrim = scrimRef.current;
    const opacity = scrim ? getComputedStyle(scrim).opacity : "1";
    scrim?.getAnimations().forEach((entry) => entry.cancel());
    scrim?.animate([{ opacity }, { opacity: 1 }], {
      duration: SCRIM_MS,
      fill: "both",
    });
  };

  const openTile = (id: OverviewTile["id"]) => {
    cancelScheduledClose();
    leftDuringOpenRef.current = false;
    if (id === activeIdRef.current) {
      resumeOpen();
      return;
    }
    closingRef.current = false;
    if (motionRef.current) motionRef.current.onfinish = null;
    switchingRef.current = activeIdRef.current != null;
    setActiveId(id);
  };

  useLayoutEffect(() => {
    const card = cardRef.current;
    const cell = activeId ? cells.current.get(activeId) : null;
    if (!card || !cell || !activeId) return;
    if (prefersReducedMotion()) {
      motionRef.current = null;
      return;
    }

    if (switchingRef.current) {
      card.scrollTop = 0;
      scrimRef.current?.getAnimations().forEach((animation) => animation.cancel());
      if (scrimRef.current) scrimRef.current.style.opacity = "1";
      return;
    }

    const from = cell.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sx = to.width > 0 ? from.width / to.width : 1;
    const sy = to.height > 0 ? from.height / to.height : 1;
    const animation = card.animate(
      [
        { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transform: "translate(-50%, -50%) scale(1, 1)" },
      ],
      { duration: EXPAND_MS, easing: EXPAND_EASE, fill: "both" },
    );
    motionRef.current = animation;
    animation.onfinish = () => {
      if (closingRef.current || !leftDuringOpenRef.current) return;
      scheduleClose();
    };
    scrimRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: SCRIM_MS,
      easing: "ease-out",
      fill: "both",
    });

    return () => {
      animation.cancel();
      if (motionRef.current === animation) motionRef.current = null;
    };
  }, [activeId]);

  useEffect(() => {
    switchingRef.current = false;
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;

    const onMove = (event: PointerEvent) => {
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      if (!cardRef.current) return;
      const card = cardRef.current.getBoundingClientRect();
      const overCard = pointInRect(event.clientX, event.clientY, card);
      if (overCard) {
        leftDuringOpenRef.current = false;
        cancelScheduledClose();
        resumeOpen();
        return;
      }
      const opening = motionRef.current?.playState === "running" && !closingRef.current;
      if (opening) {
        leftDuringOpenRef.current = true;
        return;
      }
      if (closingRef.current) return;
      scheduleClose();
    };
    const onScroll = () => {
      cancelScheduledClose();
      if (!closingRef.current) beginClose();
    };
    const onLeaveWindow = () => {
      cancelScheduledClose();
      if (!closingRef.current) beginClose();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      cancelScheduledClose();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [activeId]);

  return (
    <div className="overview-stage">
      <div className="overview-grid">
        {OVERVIEW_TILES.map((tile) => (
          <div
            key={tile.id}
            className="overview-cell"
            ref={(node) => {
              if (node) cells.current.set(tile.id, node);
              else cells.current.delete(tile.id);
            }}
            onClick={() => openTile(tile.id)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              openTile(tile.id);
            }}
            role="button"
            tabIndex={0}
          >
            <article className={`overview-tile overview-tile-${tile.accent}`}>
              <TileBody id={tile.id} />
            </article>
          </div>
        ))}
      </div>
      {activeTile
        ? createPortal(
            <div className="overview-expand">
              <div className="overview-expand-scrim" ref={scrimRef} />
              <article
                ref={cardRef}
                className={`overview-expand-card overview-tile-${activeTile.accent}`}
                aria-hidden="true"
              >
                <TileBody id={activeTile.id} />
              </article>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HOSTED_CHECKOUT_OVERVIEW,
  REVOLUT_CHECKOUT_OVERVIEW,
  SEPA_DIRECT_DEBIT_OVERVIEW,
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
  if (id === "sepa-direct-debit") {
    return (
      <SolutionOverviewPanel
        as="div"
        className="overview-inline-panel"
        data={{ title: "SEPA Direct Debit", ...SEPA_DIRECT_DEBIT_OVERVIEW }}
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

export function FloatingOverview() {
  const [activeId, setActiveId] = useState<OverviewTile["id"] | null>(null);
  const cells = useRef(new Map<OverviewTile["id"], HTMLDivElement>());
  const cardRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<Animation | null>(null);
  const closingRef = useRef(false);
  const switchingRef = useRef(false);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const activeTile = OVERVIEW_TILES.find((tile) => tile.id === activeId) ?? null;

  const finishClose = () => {
    closingRef.current = false;
    motionRef.current = null;
    setActiveId(null);
  };

  const beginClose = () => {
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

  const openTile = (id: OverviewTile["id"]) => {
    if (id === activeIdRef.current) {
      if (closingRef.current) return;
      beginClose();
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

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (cardRef.current?.contains(target)) return;
      for (const cell of cells.current.values()) {
        if (cell.contains(target)) return;
      }
      if (!closingRef.current) beginClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !closingRef.current) beginClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
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
            aria-pressed={activeId === tile.id}
            aria-expanded={activeId === tile.id}
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
                onClick={() => {
                  if (!closingRef.current) beginClose();
                }}
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

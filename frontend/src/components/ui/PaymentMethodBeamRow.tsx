import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface BeamMethod {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

interface Spoke {
  d: string;
  delay: number;
}

interface Orbit {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface LocalBox {
  x: number;
  y: number;
  radius: number;
}

function localBox(rect: DOMRect, origin: DOMRect, scaleX: number, scaleY: number): LocalBox {
  return {
    x: (rect.left - origin.left + rect.width / 2) / scaleX,
    y: (rect.top - origin.top + rect.height / 2) / scaleY,
    radius: rect.width / scaleX / 2,
  };
}

function spokePath(hub: LocalBox, node: LocalBox): string {
  const dx = node.x - hub.x;
  const dy = node.y - hub.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const hubRadius = hub.radius + 6;
  const nodeRadius = node.radius + 6;
  return `M ${hub.x + ux * hubRadius} ${hub.y + uy * hubRadius} L ${node.x - ux * nodeRadius} ${node.y - uy * nodeRadius}`;
}

export function PaymentMethodBeamRow({ methods }: { methods: readonly BeamMethod[] }) {
  const gradientId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [spokes, setSpokes] = useState<Spoke[]>([]);
  const [orbit, setOrbit] = useState<Orbit | null>(null);
  const [viewBox, setViewBox] = useState("0 0 0 0");

  useLayoutEffect(() => {
    const container = containerRef.current;
    const hub = hubRef.current;
    if (!container || !hub) return;

    const measure = () => {
      const layoutWidth = container.offsetWidth;
      const layoutHeight = container.offsetHeight;
      if (!layoutWidth || !layoutHeight) return;

      const origin = container.getBoundingClientRect();
      const scaleX = origin.width / layoutWidth || 1;
      const scaleY = origin.height / layoutHeight || 1;
      const hubBox = localBox(hub.getBoundingClientRect(), origin, scaleX, scaleY);
      const nodes = nodeRefs.current.filter((node): node is HTMLSpanElement => node !== null);
      const next = nodes.flatMap((node, index) => {
        const box = localBox(node.getBoundingClientRect(), origin, scaleX, scaleY);
        if (box.radius === 0) return [];
        return [{ d: spokePath(hubBox, box), delay: index * 0.55 }];
      });
      const reach = nodes.reduce((max, node) => {
        const box = localBox(node.getBoundingClientRect(), origin, scaleX, scaleY);
        return Math.max(max, Math.hypot(box.x - hubBox.x, box.y - hubBox.y));
      }, 0);

      setViewBox(`0 0 ${layoutWidth} ${layoutHeight}`);
      setSpokes(next);
      setOrbit({
        cx: hubBox.x,
        cy: hubBox.y,
        rx: reach,
        ry: reach,
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(hub);
    nodeRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [methods]);

  return (
    <div className="payment-hub" ref={containerRef}>
      <svg className="payment-hub-svg" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="40%" stopColor="#f8fbff" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {orbit ? <ellipse className="payment-hub-orbit" cx={orbit.cx} cy={orbit.cy} rx={orbit.rx} ry={orbit.ry} /> : null}
        {spokes.map((spoke) => (
          <g key={spoke.d}>
            <path className="payment-hub-track" d={spoke.d} />
            <path
              className="payment-hub-pulse"
              d={spoke.d}
              stroke={`url(#${gradientId})`}
              style={{ animationDelay: `${spoke.delay}s` }}
            />
          </g>
        ))}
      </svg>

      <div className="payment-hub-core" ref={hubRef}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="8" y="14" width="32" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 24h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="32" cy="24" r="2.4" fill="currentColor" />
        </svg>
      </div>

      {methods.map((method, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / methods.length;
        return (
          <a
            key={method.id}
            className="payment-hub-node"
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              left: `calc(50% + cos(${angle}rad) * var(--hub-radius))`,
              top: `calc(50% + sin(${angle}rad) * var(--hub-radius))`,
            }}
          >
            <span
              className="payment-hub-disc"
              ref={(node) => {
                nodeRefs.current[index] = node;
              }}
            >
              {method.icon ?? <span className="payment-hub-fallback">Bank</span>}
            </span>
            <span className="payment-hub-label">{method.label}</span>
          </a>
        );
      })}
    </div>
  );
}

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

function spokePath(hub: DOMRect, node: DOMRect, origin: DOMRect): string {
  const hubX = hub.left - origin.left + hub.width / 2;
  const hubY = hub.top - origin.top + hub.height / 2;
  const nodeX = node.left - origin.left + node.width / 2;
  const nodeY = node.top - origin.top + node.height / 2;
  const dx = nodeX - hubX;
  const dy = nodeY - hubY;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const hubRadius = hub.width / 2 + 6;
  const nodeRadius = node.width / 2 + 6;
  return `M ${hubX + ux * hubRadius} ${hubY + uy * hubRadius} L ${nodeX - ux * nodeRadius} ${nodeY - uy * nodeRadius}`;
}

export function PaymentMethodBeamRow({ methods }: { methods: readonly BeamMethod[] }) {
  const gradientId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [spokes, setSpokes] = useState<Spoke[]>([]);
  const [orbit, setOrbit] = useState<Orbit | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const hub = hubRef.current;
    if (!container || !hub) return;

    const measure = () => {
      const origin = container.getBoundingClientRect();
      const hubRect = hub.getBoundingClientRect();
      const nodes = nodeRefs.current.filter((node): node is HTMLSpanElement => node !== null);
      const next = nodes.flatMap((node, index) => {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0) return [];
        return [{ d: spokePath(hubRect, rect, origin), delay: index * 0.55 }];
      });
      const hubX = hubRect.left - origin.left + hubRect.width / 2;
      const hubY = hubRect.top - origin.top + hubRect.height / 2;
      const reach = nodes.reduce(
        (max, node) => {
          const rect = node.getBoundingClientRect();
          return Math.max(max, Math.hypot(rect.left + rect.width / 2 - hubRect.left - hubRect.width / 2, rect.top + rect.height / 2 - hubRect.top - hubRect.height / 2));
        },
        0,
      );
      setSpokes(next);
      setOrbit({
        cx: hubX,
        cy: hubY,
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
      <svg className="payment-hub-svg" aria-hidden="true">
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

import type { IntegrationType } from "@demo/shared";

export function SolutionIcon({
  integration,
  className = "h-12 w-12",
}: {
  integration: IntegrationType;
  className?: string;
}) {
  if (integration === "revolut_checkout") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect
          x="6"
          y="10"
          width="36"
          height="28"
          rx="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <rect x="10" y="18" width="28" height="4" rx="2" fill="currentColor" opacity="0.35" />
        <rect x="10" y="26" width="16" height="4" rx="2" fill="currentColor" opacity="0.55" />
        <circle cx="34" cy="28" r="4" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect
        x="8"
        y="12"
        width="22"
        height="24"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M30 20h10v8H30z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        rx="4"
      />
      <path
        d="M34 24h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M36 22l4 2-4 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

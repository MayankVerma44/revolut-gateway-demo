export function HeadphonesArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 520"
      className={className}
      role="img"
      aria-label="Revolut Demo Wireless Headphones"
    >
      <defs>
        <linearGradient id="shell" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b3f4a" />
          <stop offset="100%" stopColor="#1a1d24" />
        </linearGradient>
        <linearGradient id="pad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="640" height="520" rx="40" fill="url(#bg)" />
      <ellipse cx="320" cy="430" rx="170" ry="22" fill="rgba(99,102,241,0.15)" />
      <path
        d="M160 250c0-120 70-190 160-190s160 70 160 190"
        fill="none"
        stroke="url(#shell)"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <rect x="132" y="220" width="86" height="150" rx="32" fill="url(#shell)" />
      <rect x="422" y="220" width="86" height="150" rx="32" fill="url(#shell)" />
      <rect x="146" y="236" width="58" height="118" rx="24" fill="url(#pad)" />
      <rect x="436" y="236" width="58" height="118" rx="24" fill="url(#pad)" />
      <circle cx="175" cy="295" r="10" fill="#818cf8" />
      <path d="M250 88h140" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

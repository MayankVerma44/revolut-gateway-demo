export function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" aria-hidden="true" className="payment-mark">
      <text
        x="0"
        y="13"
        fill="#1a1f71"
        fontFamily="var(--font-display), sans-serif"
        fontSize="14"
        fontWeight="800"
        fontStyle="italic"
        letterSpacing="-0.04em"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardMark() {
  return (
    <svg viewBox="0 0 28 18" aria-hidden="true" className="payment-mark payment-mark-wide">
      <circle cx="10" cy="9" r="7" fill="#eb001b" />
      <circle cx="18" cy="9" r="7" fill="#f79e1b" />
      <path d="M14 3.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#ff5f00" />
    </svg>
  );
}

export function AmexMark() {
  return (
    <svg viewBox="0 0 36 16" aria-hidden="true" className="payment-mark">
      <rect width="36" height="16" rx="2" fill="#2e77bc" />
      <text
        x="18"
        y="11.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="var(--font-display), sans-serif"
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.04em"
      >
        AMEX
      </text>
    </svg>
  );
}

export function CardBrandMarks() {
  return (
    <span className="payment-card-marks" aria-hidden="true">
      <VisaMark />
      <MastercardMark />
      <AmexMark />
    </span>
  );
}

export function AppleMark() {
  return (
    <svg viewBox="20 28 36 38" aria-hidden="true" className="payment-mark payment-mark-apple">
      <path
        fill="currentColor"
        d="M45.1862,35.64053c1.41724-1.77266,2.37897-4.15282,2.12532-6.58506c-2.07464,0.10316-4.60634,1.36871-6.07207,3.14276c-1.31607,1.5192-2.4809,3.99902-2.17723,6.3293C41.39111,38.72954,43.71785,37.36345,45.1862,35.64053"
      />
      <path
        fill="currentColor"
        d="M47.28506,38.98252c-3.38211-0.20146-6.25773,1.91951-7.87286,1.91951c-1.61602,0-4.08931-1.81799-6.76438-1.76899c-3.48177,0.05114-6.71245,2.01976-8.4793,5.15079c-3.63411,6.2636-0.95904,15.55471,2.57494,20.65606c1.71618,2.5238,3.78447,5.30269,6.50976,5.20287c2.57494-0.10104,3.58421-1.66732,6.71416-1.66732c3.12765,0,4.03679,1.66732,6.76252,1.61681c2.82665-0.05054,4.59381-2.52506,6.30997-5.05132c1.96878-2.877,2.77473-5.65498,2.82542-5.80748c-0.0507-0.05051-5.45058-2.12204-5.50065-8.33358c-0.05098-5.20101,4.23951-7.6749,4.44144-7.82832C52.3832,39.4881,48.5975,39.08404,47.28506,38.98252"
      />
    </svg>
  );
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="payment-mark payment-mark-google">
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.9 10.7A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.2.3-1.7V5H.9a9 9 0 0 0 0 8l3-2.3z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" />
    </svg>
  );
}

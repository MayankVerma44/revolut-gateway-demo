import type { ReactNode } from "react";

export function PaymentMethodButton({
  label,
  icon,
  href,
  external = true,
  variant = "method",
  className = "",
}: {
  label: string;
  icon?: ReactNode;
  href: string;
  external?: boolean;
  variant?: "method" | "subscription";
  className?: string;
}) {
  return (
    <a
      className={`payment-method-button payment-method-button-${variant} ${className}`.trim()}
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {icon ? <span className="payment-method-icon">{icon}</span> : null}
      <span>{label}</span>
    </a>
  );
}

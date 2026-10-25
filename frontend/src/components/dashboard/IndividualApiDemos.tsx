import type { ReactNode } from "react";
import { INDIVIDUAL_API_DEMOS, SUBSCRIPTION_API_DEMO } from "../../constants/paymentMethodDemos";
import { PaymentMethodButton } from "../ui/PaymentMethodButton";

function DemoIcon({ children }: { children: ReactNode }) {
  return (
    <div className="icon-well shrink-0 text-teal">
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        {children}
      </svg>
    </div>
  );
}

function DemoCard({
  badge,
  title,
  description,
  points,
  icon,
  action,
}: {
  badge: string;
  title: string;
  description: string;
  points: readonly string[];
  icon: ReactNode;
  action: ReactNode;
}) {
  return (
    <article className="solution-card group h-full">
      <div className="flex items-center justify-between gap-4">
        {icon}
        <span className="badge ml-auto min-w-0 max-w-[16rem] justify-center px-3 py-1.5 text-center leading-snug whitespace-normal text-balance">
          {badge}
        </span>
      </div>
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-balance">{title}</h3>
      <p className="mt-3 text-ink-soft text-sm leading-relaxed">{description}</p>
      <ul className="mt-5 space-y-2">
        {points.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">{action}</div>
    </article>
  );
}

export function IndividualApiDemoCard() {
  return (
    <DemoCard
      badge="Individual APIs Demo"
      title="Individual APIs"
      description="Launch a sandbox demo for one payment method, without mounting a full checkout."
      points={[
        "Card Popup, Revolut Pay, Apple Pay, Google Pay, and Pay by Bank",
        "Each method opens its own sandbox demo",
        "Same payment marks used across the row",
        "The main dashboard stays open in this tab",
      ]}
      icon={
        <DemoIcon>
          <rect x="7" y="14" width="34" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 25h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="32" cy="25" r="3" fill="currentColor" opacity="0.8" />
        </DemoIcon>
      }
      action={
        <div className="payment-method-row mt-0">
          {INDIVIDUAL_API_DEMOS.map((method) => (
            <PaymentMethodButton
              key={method.id}
              label={method.label}
              icon={method.icon}
              href={method.href}
            />
          ))}
        </div>
      }
    />
  );
}

export function SubscriptionApiDemoCard() {
  return (
    <DemoCard
      badge="Subscription APIs Demo"
      title="Subscription APIs"
      description="Walk through plan selection, the first payment, and automatic renewals."
      points={[
        "Customer chooses a subscription plan",
        "First payment saves the payment method",
        "Revolut charges each later billing cycle",
        "Opens the subscription flow in a new tab",
      ]}
      icon={
        <DemoIcon>
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M24 16v8l5 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </DemoIcon>
      }
      action={
        <a
          className="btn-primary w-full"
          href={SUBSCRIPTION_API_DEMO.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Launch Demo
        </a>
      }
    />
  );
}

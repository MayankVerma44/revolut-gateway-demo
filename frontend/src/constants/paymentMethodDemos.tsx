import type { ReactNode } from "react";
import { RevolutWordmark } from "../components/RevolutWordmark";
import { AppleMark, CardBrandMarks, GoogleMark } from "../components/ui/paymentMarks";

const SANDBOX_DEMO_BASE = "https://merchant.test-revolut.com";

export function sandboxPaymentDemoUrl(method: string, mode: "sandbox" | "dev" = "sandbox") {
  return `${SANDBOX_DEMO_BASE}/${method}?mode=${mode}`;
}

export interface PaymentMethodDemo {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

export const INDIVIDUAL_API_DEMOS: readonly PaymentMethodDemo[] = [
  {
    id: "card-popup",
    label: "Card Popup",
    href: sandboxPaymentDemoUrl("card-popup"),
    icon: <CardBrandMarks />,
  },
  {
    id: "revolut-pay",
    label: "Revolut Pay",
    href: sandboxPaymentDemoUrl("revolut-pay"),
    icon: <RevolutWordmark className="payment-revolut-mark" />,
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    href: sandboxPaymentDemoUrl("payment-request", "dev"),
    icon: <AppleMark />,
  },
  {
    id: "google-pay",
    label: "Google Pay",
    href: sandboxPaymentDemoUrl("payment-request"),
    icon: <GoogleMark />,
  },
  {
    id: "pay-by-bank",
    label: "Pay by Bank",
    href: sandboxPaymentDemoUrl("pay-by-bank", "dev"),
  },
];

export const SUBSCRIPTION_API_DEMO: PaymentMethodDemo = {
  id: "subscription-apis",
  label: "Subscription APIs",
  href: "https://revolut-subscriptions.vercel.app/flow",
};

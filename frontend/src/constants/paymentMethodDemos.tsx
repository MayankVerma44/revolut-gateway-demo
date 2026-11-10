import type { ReactNode } from "react";
import { RevolutWordmark } from "../components/RevolutWordmark";
import { AppleMark, BankMark, CardBrandMarks, GoogleMark, SepaDirectDebitMark } from "../components/ui/paymentMarks";

const SANDBOX_DEMO_BASE = "https://merchant.test-revolut.com";

export function sandboxPaymentDemoUrl(method: string, mode: "sandbox" | "dev" = "sandbox") {
  return `${SANDBOX_DEMO_BASE}/${method}?mode=${mode}`;
}

export interface PaymentMethodDemo {
  id: string;
  label: string;
  href: string;
  hrefs?: readonly string[];
  icon?: ReactNode;
}

export const INDIVIDUAL_API_DEMOS: readonly PaymentMethodDemo[] = [
  {
    id: "card-popup",
    label: "Card Field / Pop-Up",
    href: sandboxPaymentDemoUrl("card-popup"),
    hrefs: [sandboxPaymentDemoUrl("card-popup"), sandboxPaymentDemoUrl("card-field")],
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
    icon: <BankMark />,
  },
  {
    id: "sepa-direct-debit",
    label: "SEPA Direct Debit",
    href: `${SANDBOX_DEMO_BASE}/sepa-direct-debit?mode=prod`,
    icon: <SepaDirectDebitMark />,
  },
];

export const SUBSCRIPTION_API_DEMO: PaymentMethodDemo = {
  id: "subscription-apis",
  label: "Subscription APIs",
  href: "https://revolut-subscriptions.vercel.app/flow",
};

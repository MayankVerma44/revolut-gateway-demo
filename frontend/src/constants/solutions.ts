import type { IntegrationType } from "@demo/shared";

export interface SolutionMeta {
  id: IntegrationType;
  name: string;
  demoLabel: string;
  description: string;
  characteristics: string[];
  comparison: {
    checkoutExperience: string;
    redirectRequired: string;
    integrationType: string;
    customisation: string;
    paymentMethods: string;
    mobileExperience: string;
    bestSuitedFor: string;
  };
}

export const SOLUTIONS: SolutionMeta[] = [
  {
    id: "revolut_checkout",
    name: "Embedded Checkout",
    demoLabel: "Embedded Checkout Demo",
    description:
      "Embedded Checkout experience using the Embedded Checkout Web SDK. The customer stays on your site while Revolut handles payment methods in-page.",
    characteristics: [
      "Widget embedded on merchant page",
      "Server-side order token via secret key",
      "Embedded Checkout Web SDK",
      "Ideal for seamless on-brand checkout",
    ],
    comparison: {
      checkoutExperience: "Embedded widget on merchant site",
      redirectRequired: "No (customer stays on page)",
      integrationType: "Web SDK + Merchant API",
      customisation: "High — matches merchant UI",
      paymentMethods: "Cards, Revolut Pay, wallets*",
      mobileExperience: "Responsive embedded widget",
      bestSuitedFor: "Merchants who want checkout on their own domain",
    },
  },
  {
    id: "hosted_checkout",
    name: "Hosted payment page/redirect Checkout",
    demoLabel: "Hosted payment page/redirect Checkout Demo",
    description:
      "Redirect-based checkout where the customer completes payment on a Revolut-hosted checkout page, then returns to your success URL.",
    characteristics: [
      "Browser redirect to Revolut",
      "checkout_url from Merchant API",
      "Minimal frontend integration",
      "Fastest path to accept payments",
    ],
    comparison: {
      checkoutExperience: "Redirect to Revolut-hosted page",
      redirectRequired: "Yes — leaves merchant origin",
      integrationType: "Merchant API + redirect",
      customisation: "Limited — Revolut-hosted UI",
      paymentMethods: "Full Revolut payment methods",
      mobileExperience: "Optimised hosted mobile flow",
      bestSuitedFor: "Merchants prioritising speed-to-market",
    },
  },
];

export function getSolution(id: IntegrationType): SolutionMeta {
  const solution = SOLUTIONS.find((s) => s.id === id);
  if (!solution) throw new Error(`Unknown solution: ${id}`);
  return solution;
}

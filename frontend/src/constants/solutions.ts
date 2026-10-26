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
      "Widget embedded on your page",
      "Server-side order token via secret key",
      "Embedded Checkout Web SDK",
      "A seamless checkout that matches your brand",
    ],
    comparison: {
      checkoutExperience: "Embedded widget on your site",
      redirectRequired: "No (customer stays on page)",
      integrationType: "Web SDK + Merchant API",
      customisation: "High — matches your UI",
      paymentMethods: "Cards, Revolut Pay, wallets*",
      mobileExperience: "Responsive embedded widget",
      bestSuitedFor: "You want checkout on your own domain",
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
      redirectRequired: "Yes — leaves your site",
      integrationType: "Merchant API + redirect",
      customisation: "Limited — Revolut-hosted UI",
      paymentMethods: "Full Revolut payment methods",
      mobileExperience: "Optimised hosted mobile flow",
      bestSuitedFor: "You want to go live quickly",
    },
  },
];

export function getSolution(id: IntegrationType): SolutionMeta {
  const solution = SOLUTIONS.find((s) => s.id === id);
  if (!solution) throw new Error(`Unknown solution: ${id}`);
  return solution;
}

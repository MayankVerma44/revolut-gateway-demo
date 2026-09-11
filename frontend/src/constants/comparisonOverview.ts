export const TECHNICAL_COMPARISON = [
  { feature: "Customer stays on merchant site", revolutCheckout: "Yes", hostedCheckout: "No" },
  { feature: "Embedded checkout", revolutCheckout: "Yes", hostedCheckout: "No" },
  { feature: "Hosted by Revolut", revolutCheckout: "No", hostedCheckout: "Yes" },
  { feature: "Cards & alternative methods", revolutCheckout: "Yes", hostedCheckout: "Yes" },
  {
    feature: "Appearance customisation",
    revolutCheckout: "Full (5/5)",
    hostedCheckout: "Limited (3/5)",
  },
  {
    feature: "Dashboard configuration",
    revolutCheckout: "Yes",
    hostedCheckout: "Branding only",
  },
  { feature: "Integration effort", revolutCheckout: "Medium", hostedCheckout: "Low" },
  { feature: "Best for Revolut-only acquiring", revolutCheckout: "Yes", hostedCheckout: "Yes" },
  { feature: "Best for multi-acquirer setups", revolutCheckout: "No", hostedCheckout: "Yes" },
] as const;

export const REVOLUT_CHECKOUT_OVERVIEW = {
  bestSuitedFor: [
    "Merchants using Revolut as primary online payment provider",
    "Existing ecommerce checkouts requiring embedded UI",
    "Maximum branding & conversion priorities",
    "Fully embedded payment experience",
  ],
  merchantExperience: ["Cart", "Embedded Checkout", "Payment Complete"],
  whyChoose: [
    "Customers never leave your website",
    "Dashboard-driven configuration",
    "Extensive appearance customisation",
    "Add new payment methods without code changes",
  ],
  decisionCriteria: [
    "Uses Revolut as the primary payment provider",
    "Already has an ecommerce checkout system",
    "Wants customers to remain on their website",
    "Prioritises high conversion and custom branding",
    "Wants maximum checkout customisation control",
  ],
};

export const HOSTED_CHECKOUT_OVERVIEW = {
  subtitle: "Payment Links API",
  bestSuitedFor: [
    "Multi-acquirer environments",
    "Payment Links / remote sales",
    "Invoices & B2B payments",
    "Fast implementations / low-code",
  ],
  merchantExperience: [
    "Cart",
    "Redirect",
    "Revolut Hosted Checkout",
    "Return to Merchant",
  ],
  whyChoose: [
    "Fastest implementation time",
    "Minimal frontend development needed",
    "Secure Revolut-hosted payment page",
    "Easy to distribute via email, SMS or QR code",
  ],
  decisionCriteria: [
    "Uses multiple payment providers",
    "Needs payment links",
    "Wants the fastest and low-effort implementation",
    "Doesn't want to build or maintain payment UI",
    "Needs a secure hosted checkout for payments",
  ],
};

export const KEY_TAKEAWAYS = {
  revolutCheckout:
    "Choose Revolut Checkout when you want a fully embedded, highly customisable payment experience that keeps customers on your website and maximises conversion.",
  hostedCheckout:
    "Choose Hosted Checkout (Payment Links API) when you need a fast, low-maintenance integration for payment links, invoicing, or remote payments, while leveraging Revolut's secure hosted payment experience.",
};

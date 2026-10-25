export const COMPARISON_COLUMNS = [
  {
    id: "embedded",
    name: "Embedded Checkout",
    description: "All-in-one responsive form mounted directly in your code",
  },
  {
    id: "hosted",
    name: "Hosted payment page/redirect Checkout",
    description: "Full-page redirect hosted securely on Revolut rails",
  },
  {
    id: "individual-sdks",
    name: "Individual SDKs",
    description: "Mount standalone express buttons freely on your site",
  },
  {
    id: "plugins",
    name: "Platform plugins",
    description: "Pre-built plugins for Shopify, Woo-Commerce, and more",
  },
] as const;

export const TECHNICAL_COMPARISON = [
  {
    label: "Integration and setup",
    rows: [
      { feature: "Development Effort", values: ["Flexible code", "Low code", "Pro code", "No code"] },
      { feature: "Setup Timeline", values: ["Day+", "Hours", "Week+", "Minutes"] },
      {
        feature: "Technical Stack",
        values: ["Single unified SDK", "Simple redirect script", "Modular frontend SDKs", "No-code setup"],
      },
      {
        feature: "PCI Compliance Load",
        values: ["Handled by Revolut", "Handled by Revolut", "Handled by Revolut", "Handled by Revolut"],
      },
    ],
  },
  {
    label: "Checkout experience",
    rows: [
      {
        feature: "Domain Retention",
        values: [
          "Stays on your website",
          "Redirects to checkout.revolut.com",
          "Stays on your website",
          "Stays on your platform",
        ],
      },
      {
        feature: "Design Flexibility",
        values: ["Fully custom styling", "Presets via Revolut Business", "Fully custom styling", "Native to platform"],
      },
    ],
  },
  {
    label: "Feature comparison",
    rows: [
      { feature: "Customer stays on merchant site", values: ["Yes", "No", "Yes", "Yes"] },
      { feature: "Embedded Checkout", values: ["Yes", "No", "Individual placements", "—"] },
      { feature: "Hosted by Revolut", values: ["No", "Yes", "No", "—"] },
      { feature: "Cards & alternative methods", values: ["Yes", "Yes", "Yes", "—"] },
      {
        feature: "Appearance customisation",
        values: ["Full (5/5)", "Limited (3/5)", "Merchant Controlled", "Native to platform"],
      },
      { feature: "Dashboard configuration", values: ["Yes", "Branding only", "No", "—"] },
      { feature: "Integration effort", values: ["Medium", "Low", "High", "No code"] },
      { feature: "Best for Revolut-only acquiring", values: ["Yes", "N/A", "Yes", "—"] },
      { feature: "Best for multi-acquirer setups", values: ["No", "Yes", "Yes", "—"] },
    ],
  },
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
    "Hosted payment page/redirect Checkout",
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
    "Needs a secure Hosted payment page/redirect Checkout for payments",
  ],
};

export const SUBSCRIPTION_APIS_OVERVIEW = {
  bestSuitedFor: [
    "Recurring billing for memberships and SaaS",
    "Fixed, per-seat, usage-based, or trial pricing",
    "Merchants who want Revolut to run the billing cycle",
    "A first payment that also saves the payment method",
  ],
  merchantExperience: ["Choose a plan", "First payment", "Automatic renewals"],
  whyChoose: [
    "Plans, variations, and billing phases configured via API",
    "Customer authorises once and the payment method is saved",
    "Revolut charges each cycle and retries failed payments",
    "Webhooks for subscription state changes",
  ],
};

export const SERVER_TO_SERVER_OVERVIEW = {
  bestSuitedFor: [
    "Platforms that own the payment flow on their backend",
    "Saved payment methods and merchant-initiated charges",
    "Payment methods that do not need a checkout widget",
    "Partner or in-person systems calling the Merchant API",
  ],
  merchantExperience: ["Create order", "Submit payment", "Webhook result"],
  whyChoose: [
    "Secret key stays on your server",
    "Orders, payments, captures, and refunds via the Merchant API",
    "No Revolut checkout UI where the method allows it",
    "Final status comes from webhooks, not the browser",
  ],
};

export const KEY_TAKEAWAYS = {
  revolutCheckout:
    "Choose Embedded Checkout when you want a fully embedded, highly customisable payment experience that keeps customers on your website and maximises conversion.",
  hostedCheckout:
    "Choose Hosted payment page/redirect Checkout (Payment Links API) when you need a fast, low-maintenance integration for payment links, invoicing, or remote payments, while leveraging Revolut's secure hosted payment experience.",
};

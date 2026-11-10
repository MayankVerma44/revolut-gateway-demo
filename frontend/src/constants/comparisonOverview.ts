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
      { feature: "Development Effort", values: ["Low code", "Low code", "Pro code", "Low code"] },
      { feature: "Setup Timeline", values: ["Day+", "Hours", "Week+", "Same Day/ Day+"] },
      {
        feature: "Technical Stack",
        values: ["Single unified SDK", "Simple redirect script", "Modular frontend SDKs", "Low-code setup"],
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
      { feature: "Customer stays on your site", values: ["Yes", "No", "Yes", "Yes"] },
      { feature: "Embedded Checkout", values: ["Yes", "No", "Individual placements", "Individual Placements"] },
      { feature: "Hosted by Revolut", values: ["Yes", "Yes", "Yes", "No"] },
      { feature: "Cards & alternative methods", values: ["Yes", "Yes", "Yes", "Yes"] },
      {
        feature: "Appearance customisation",
        values: ["Full (5/5)", "Branding & Cover only", "Controlled by you", "Limited"],
      },
      { feature: "Dashboard configuration", values: ["Yes", "Branding only", "No", "No"] },
      { feature: "Integration effort", values: ["Medium", "Low", "High", "Very Low"] },
      { feature: "Best for Revolut-only acquiring", values: ["Yes", "Yes", "Yes", "Yes"] },
      { feature: "Best for multi-acquirer setups", values: ["No", "Yes", "Yes", "Yes"] },
    ],
  },
] as const;

export const REVOLUT_CHECKOUT_OVERVIEW = {
  bestSuitedFor: [
    "You use Revolut as your primary online payment provider",
    "You already have an ecommerce checkout and need an embedded UI",
    "You prioritise branding and conversion",
    "You want a fully embedded payment experience",
  ],
  merchantExperience: ["Cart", "Embedded Checkout", "Payment Complete"],
  whyChoose: [
    "Your customers never leave your website",
    "You configure checkout from the dashboard",
    "You can customise the appearance extensively",
    "You can add payment methods without code changes",
  ],
  decisionCriteria: [
    "You use Revolut as your primary payment provider",
    "You already have an ecommerce checkout",
    "You want customers to stay on your website",
    "You prioritise conversion and your own branding",
    "You want full control over checkout customisation",
  ],
};

export const HOSTED_CHECKOUT_OVERVIEW = {
  bestSuitedFor: [
    "You work with more than one acquirer",
    "You sell with payment links or remote checkout",
    "You send invoices or take B2B payments",
    "You want a fast, low-code implementation",
  ],
  merchantExperience: [
    "Checkout",
    "Redirect",
    "Hosted payment page/redirect Checkout",
    "Return to your site",
  ],
  whyChoose: [
    "You get the fastest implementation",
    "You need very little frontend development",
    "Your customers pay on a secure Revolut-hosted page",
    "You can share a link by email, SMS, or QR code",
  ],
  decisionCriteria: [
    "You use more than one payment provider",
    "You need payment links",
    "You want the fastest, lowest-effort implementation",
    "You don't want to build or maintain a payment UI",
    "You need a secure hosted payment page",
  ],
};

export const SUBSCRIPTION_APIS_OVERVIEW = {
  subtitle: "Billing & subscriptions",
  bestSuitedFor: [
    "You sell SaaS, memberships, or premium content",
    "You offer subscription boxes, instalments, or retainers",
    "You charge fixed, per-seat, usage-based, or trial pricing",
    "You want a custom sign-up flow, or a hosted payment link",
  ],
  merchantExperience: ["Create plans", "Checkout sign-up", "Automatic charges", "Webhooks"],
  whyChoose: [
    "You run checkout on your website or app",
    "You create plans and dynamic pricing through the API",
    "You report metered usage through each billing period",
    "You manage payment methods, plan changes, and cancellations through the API",
    "You use webhooks to update access, email, and your CRM",
    "You connect billing to your existing systems",
  ],
  decisionCriteria: [
    "You bill customers on a schedule",
    "You sell SaaS, memberships, boxes, instalments, or retainers",
    "You need fixed, per-seat, usage-based, or trial pricing",
    "You want a custom sign-up flow or a hosted payment link",
    "You want each renewal charged automatically",
  ],
};

export const SERVER_TO_SERVER_OVERVIEW = {
  summary:
    "Integrate directly with our APIs to handle card payments. You handle PCI-sensitive card data, so you need to meet specific compliance requirements.",
  bestSuitedLabel: "Requirements",
  bestSuitedFor: [
    "You must be PCI compliant.",
    "You must provide a PCI Attestation of Compliance (AOC) issued by a certified Qualified Security Assessor (QSA).",
    "Your PCI AOC must be based on the PCI DSS SAQ-D form.",
    "You collect card details directly through your own checkout form and have access to the card details.",
  ],
  whyChooseLabel: "Why choose Server-to-Server",
  whyChoose: [
    "You integrate directly with the APIs",
    "You keep the checkout form on your site",
    "You collect the card details and keep access to them",
  ],
  paymentMethods: ["Cards", "Revolut Pay"],
  decisionCriteria: [
    "You want to integrate directly with the APIs",
    "You can meet PCI DSS, including a QSA-issued AOC based on SAQ-D",
    "You collect card details in your own checkout",
  ],
};

export const SEPA_DIRECT_DEBIT_OVERVIEW = {
  subtitle: "EUR bank debits",
  summary:
    "Accept SEPA Direct Debit Core payments from a customer's personal or business EUR account. They authorise a mandate once, and you collect later payments on a schedule.",
  bestSuitedFor: [
    "You collect subscriptions or other recurring payments in euro",
    "Your customers pay from a bank account in the SEPA region, except Portugal and Ireland",
    "You want a bank debit instead of a card payment",
    "You send the pre-debit notifications and store the mandate yourself",
  ],
  merchantExperience: ["Checkout widget", "IBAN and consent", "Order created", "Payment submitted"],
  whyChoose: [
    "Customers authorise a mandate once, then you collect without asking them to pay again",
    "Direct debit fees are lower than card payments",
    "Bank accounts do not expire, so fewer recurring payments fail",
    "Funds settle in your merchant account within 24 hours",
    "You pay only for a successfully processed transaction, with no monthly fee",
  ],
};

export const INDIVIDUAL_SDK_DECISION = [
  "You need standalone payment buttons",
  "You want customers to stay on your website",
  "You want to place each payment method yourself",
  "You need support for CIT/MIT payments",
] as const;

export const PLUGINS_DECISION = [
  "You already use a supported ecommerce platform",
  "You want Revolut without building a custom checkout",
  "You prefer a plugin to a from-scratch integration",
  "You want a faster setup than a custom build",
] as const;

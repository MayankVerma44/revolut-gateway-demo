export const PRODUCT = {
  id: "revolut-demo-wireless-headphones",
  name: "Revolut Demo Wireless Headphones",
  description:
    "Over-ear wireless headphones with adaptive noise cancellation, 40-hour battery life, and a demonstration SKU used only in this merchant sandbox.",
  priceMinor: 9900,
  currency: "GBP" as const,
  shippingMinor: 0,
} as const;

export type Currency = "GBP";

export type IntegrationType = "revolut_checkout" | "hosted_checkout";

export type PaymentStatus =
  | "created"
  | "pending"
  | "processing"
  | "authorised"
  | "completed"
  | "failed"
  | "cancelled";

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  postcode: string;
  addressLine1: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitAmountMinor: number;
}

export interface PublicOrder {
  id: string;
  product: OrderLine;
  quantity: number;
  amountMinor: number;
  currency: Currency;
  customer: CustomerDetails;
  integration: IntegrationType;
  revolutOrderId?: string;
  revolutOrderToken?: string;
  checkoutUrl?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PublicConfig {
  demoMode: boolean;
  revolutMode: "sandbox" | "prod";
  revolutPublicKey: string | null;
  appBaseUrl: string;
  /** True when DEMO_MODE is off and both Revolut keys are configured on the server. */
  sandboxReady: boolean;
  /** Hosted checkout redirect_url cannot use localhost in live Revolut API mode. */
  hostedCheckoutAvailable: boolean;
}

export interface CreateOrderRequest {
  quantity: number;
  customer: CustomerDetails;
  integration: IntegrationType;
}

export interface CreateOrderResponse {
  order: PublicOrder;
}

export interface EmbeddedCreateOrderResponse {
  orderId: string;
  token: string;
}

export interface HostedCreateOrderResponse {
  orderId: string;
  token: string;
  checkoutUrl: string;
}

export interface OrderStatusResponse {
  order: PublicOrder;
  verifiedServerSide: true;
}

export function formatGbp(amountMinor: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountMinor / 100);
}

export function computeOrderAmountMinor(quantity: number): number {
  return PRODUCT.priceMinor * quantity + PRODUCT.shippingMinor;
}

export const TERMINAL_SUCCESS_STATUSES: PaymentStatus[] = [
  "completed",
  "authorised",
];

export const TERMINAL_FAILURE_STATUSES: PaymentStatus[] = [
  "failed",
  "cancelled",
];

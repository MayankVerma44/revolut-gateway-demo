import type {
  CustomerDetails,
  IntegrationType,
  PaymentStatus,
} from "@demo/shared";

export interface StoredOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitAmountMinor: number;
  amountMinor: number;
  currency: "GBP";
  customer: CustomerDetails;
  integration: IntegrationType;
  revolutOrderId?: string;
  revolutOrderToken?: string;
  checkoutUrl?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEventRecord {
  id: string;
  receivedAt: string;
  eventType: string;
  revolutOrderId?: string;
  localOrderId?: string;
  signatureValid: boolean | null;
  payload: unknown;
}

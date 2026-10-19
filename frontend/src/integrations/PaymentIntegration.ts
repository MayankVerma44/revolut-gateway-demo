import type { IntegrationType } from "@demo/shared";

export interface PaymentContext {
  localOrderId?: string;
  email: string;
  target?: HTMLElement;
  /** Creates the merchant order once, when Embedded Checkout asks for a token. */
  ensureLocalOrder?: () => Promise<string>;
  onPaymentError?: (message: string) => void;
  onPaymentCancel?: () => void;
}

export interface PaymentIntegration {
  readonly kind: IntegrationType;
  readonly label: string;
  start(context: PaymentContext): Promise<void>;
  destroy(): void;
}

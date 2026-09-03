import type { IntegrationType } from "@demo/shared";

export interface PaymentContext {
  localOrderId: string;
  email: string;
  target?: HTMLElement;
}

export interface PaymentIntegration {
  readonly kind: IntegrationType;
  readonly label: string;
  start(context: PaymentContext): Promise<void>;
  destroy(): void;
}

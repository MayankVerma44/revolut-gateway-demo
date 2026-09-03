import type { PublicConfig } from "@demo/shared";
import { api } from "../api";
import type { PaymentContext, PaymentIntegration } from "./PaymentIntegration";

export class HostedCheckoutIntegration implements PaymentIntegration {
  readonly kind = "hosted_checkout" as const;
  readonly label = "Hosted Checkout";

  constructor(_config: PublicConfig) {}

  async start(context: PaymentContext): Promise<void> {
    const result = await api.createHosted(context.localOrderId);
    window.location.assign(result.checkoutUrl);
  }

  destroy(): void {}
}
